"""
Response Parser for AI Legal Courtroom Simulator
Robust JSON parsing from Gemini and Groq/Llama responses
"""

import json
import re
from typing import Dict, Any, Optional


def parse_json_response(text: str) -> Dict[str, Any]:
    """
    Extract and parse JSON from AI response.
    Handles markdown code blocks, unescaped newlines, and other common issues.
    
    Args:
        text: Raw response text from AI
        
    Returns:
        Parsed JSON dictionary or error dict
    """
    if not text or not text.strip():
        return create_error_dict("Empty response received")
    
    cleaned_text = text.strip()
    
    # Strategy 1: Try to extract from markdown code block first
    json_str = _extract_from_code_block(cleaned_text)
    
    # Strategy 2: Extract the outermost JSON object using brace matching
    if json_str is None:
        json_str = _extract_json_object(cleaned_text)
    
    # Strategy 3: Try the whole text
    if json_str is None:
        json_str = cleaned_text
    
    # Attempt parsing with progressive fixing
    parsed = _parse_with_fixes(json_str)
    
    if parsed is not None:
        return validate_json_structure(parsed)
    
    # Final fallback: try to extract scores using regex
    fallback = _regex_extract_scores(cleaned_text)
    if fallback:
        return validate_json_structure(fallback)
    
    return create_error_dict("Could not parse JSON from response", text)


def _extract_from_code_block(text: str) -> Optional[str]:
    """Extract JSON from markdown code blocks like ```json ... ```"""
    patterns = [
        r'```json\s*\n?(.*?)\n?\s*```',
        r'```\s*\n?(.*?)\n?\s*```',
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return None


def _extract_json_object(text: str) -> Optional[str]:
    """Extract the outermost JSON object by matching braces."""
    start = text.find('{')
    if start == -1:
        return None
    
    depth = 0
    in_string = False
    escape_next = False
    end = start
    
    for i in range(start, len(text)):
        char = text[i]
        
        if escape_next:
            escape_next = False
            continue
        
        if char == '\\':
            escape_next = True
            continue
        
        if char == '"' and not escape_next:
            in_string = not in_string
            continue
        
        if in_string:
            continue
        
        if char == '{':
            depth += 1
        elif char == '}':
            depth -= 1
            if depth == 0:
                end = i
                break
    
    if depth == 0:
        return text[start:end + 1]
    return None


def _parse_with_fixes(json_str: str) -> Optional[Dict]:
    """Try parsing JSON with progressive fixes for common LLM output issues."""
    
    # Attempt 1: Parse as-is
    result = _try_parse(json_str)
    if result is not None:
        return result
    
    # Attempt 2: Escape newlines inside string values
    fixed = _escape_newlines_in_strings(json_str)
    result = _try_parse(fixed)
    if result is not None:
        return result
    
    # Attempt 3: Remove trailing commas and fix common issues
    fixed = _fix_common_issues(json_str)
    fixed = _escape_newlines_in_strings(fixed)
    result = _try_parse(fixed)
    if result is not None:
        return result
    
    # Attempt 4: Aggressive cleanup — collapse to single line
    fixed = _aggressive_cleanup(json_str)
    result = _try_parse(fixed)
    if result is not None:
        return result
    
    return None


def _try_parse(json_str: str) -> Optional[Dict]:
    """Try to parse a JSON string, return None on failure."""
    try:
        parsed = json.loads(json_str)
        if isinstance(parsed, dict):
            return parsed
    except (json.JSONDecodeError, ValueError):
        pass
    return None


def _escape_newlines_in_strings(json_str: str) -> str:
    """
    Replace literal newlines inside JSON string values with \\n.
    This is the #1 issue with LLM-generated JSON.
    """
    result = []
    in_string = False
    escape_next = False
    
    for char in json_str:
        if escape_next:
            result.append(char)
            escape_next = False
            continue
        
        if char == '\\':
            result.append(char)
            escape_next = True
            continue
        
        if char == '"':
            in_string = not in_string
            result.append(char)
            continue
        
        if in_string and char == '\n':
            result.append('\\n')
            continue
        
        if in_string and char == '\r':
            result.append('\\r')
            continue
        
        if in_string and char == '\t':
            result.append('\\t')
            continue
        
        result.append(char)
    
    return ''.join(result)


def _fix_common_issues(json_str: str) -> str:
    """Fix common JSON issues from LLM outputs."""
    s = json_str.strip()
    
    # Remove trailing commas before } or ]
    s = re.sub(r',(\s*[}\]])', r'\1', s)
    
    # Remove single-line comments
    s = re.sub(r'//[^\n]*', '', s)
    
    # Remove multi-line comments
    s = re.sub(r'/\*.*?\*/', '', s, flags=re.DOTALL)
    
    return s


def _aggressive_cleanup(json_str: str) -> str:
    """Last resort: aggressively clean the JSON string."""
    # Replace all whitespace sequences (including newlines) with single space
    s = re.sub(r'\s+', ' ', json_str)
    # Remove trailing commas
    s = re.sub(r',\s*([}\]])', r'\1', s)
    return s.strip()


def _regex_extract_scores(text: str) -> Optional[Dict]:
    """
    Last-resort fallback: extract scores from text using regex patterns.
    Catches cases where JSON is completely malformed but scores are present.
    """
    score_patterns = {
        'legal_accuracy_score': r'"legal_accuracy_score"\s*:\s*(\d+(?:\.\d+)?)',
        'reasoning_score': r'"reasoning_score"\s*:\s*(\d+(?:\.\d+)?)',
        'evidence_score': r'"evidence_score"\s*:\s*(\d+(?:\.\d+)?)',
        'overall_score': r'"overall_score"\s*:\s*(\d+(?:\.\d+)?)',
    }
    
    scores = {}
    for key, pattern in score_patterns.items():
        match = re.search(pattern, text)
        if match:
            scores[key] = float(match.group(1))
    
    if len(scores) >= 3:  # Need at least 3 scores to be useful
        # Try to extract feedback
        feedback_match = re.search(r'"feedback"\s*:\s*"((?:[^"\\]|\\.)*)"', text, re.DOTALL)
        scores['feedback'] = feedback_match.group(1) if feedback_match else "Evaluation completed."
        
        # Try to extract lists
        for list_field in ['correct_sections', 'incorrect_sections', 'suggestions']:
            list_match = re.search(rf'"{list_field}"\s*:\s*(\[[^\]]*\])', text)
            if list_match:
                try:
                    scores[list_field] = json.loads(list_match.group(1))
                except json.JSONDecodeError:
                    scores[list_field] = []
            else:
                scores[list_field] = []
        
        return scores
    
    return None


def validate_json_structure(parsed: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate and normalize JSON structure for evaluation responses.
    """
    if not isinstance(parsed, dict):
        return create_error_dict("Response is not a JSON object", str(parsed))
    
    # Normalize common field names
    field_mappings = {
        'legal_accuracy': 'legal_accuracy_score',
        'accuracy_score': 'legal_accuracy_score',
        'reasoning_score': 'reasoning_score',
        'evidence_score': 'evidence_score',
        'overall': 'overall_score',
        'total_score': 'overall_score',
        'feedback': 'feedback',
        'comments': 'feedback',
        'correct_sections': 'correct_sections',
        'right_sections': 'correct_sections',
        'incorrect_sections': 'incorrect_sections',
        'wrong_sections': 'incorrect_sections',
        'suggestions': 'suggestions',
        'recommendations': 'suggestions'
    }
    
    normalized = {}
    for key, value in parsed.items():
        normalized_key = field_mappings.get(key, key)
        normalized[normalized_key] = value
    
    # Ensure required fields exist with defaults
    required_fields = [
        'legal_accuracy_score', 'reasoning_score', 'evidence_score',
        'overall_score', 'feedback', 'correct_sections',
        'incorrect_sections', 'suggestions'
    ]
    
    for field in required_fields:
        if field not in normalized:
            if field.endswith('_score'):
                normalized[field] = 0.0
            elif field in ['correct_sections', 'incorrect_sections', 'suggestions']:
                normalized[field] = []
            else:
                normalized[field] = ""
    
    # Validate and clamp score ranges
    score_fields = ['legal_accuracy_score', 'reasoning_score', 'evidence_score', 'overall_score']
    for field in score_fields:
        if field in normalized:
            try:
                score = float(normalized[field])
                normalized[field] = max(0.0, min(100.0, score))
            except (ValueError, TypeError):
                normalized[field] = 0.0
    
    # Ensure list fields are lists
    list_fields = ['correct_sections', 'incorrect_sections', 'suggestions']
    for field in list_fields:
        if field in normalized:
            if isinstance(normalized[field], str):
                normalized[field] = [item.strip() for item in normalized[field].split(',') if item.strip()]
            elif not isinstance(normalized[field], list):
                normalized[field] = [str(normalized[field])]
    
    return normalized


def create_error_dict(error_message: str, raw_response: str = "") -> Dict[str, Any]:
    """Create standardized error dictionary."""
    return {
        "error": True,
        "error_message": error_message,
        "raw_response": raw_response[:500] if raw_response else "",
        "legal_accuracy_score": 0.0,
        "reasoning_score": 0.0,
        "evidence_score": 0.0,
        "overall_score": 0.0,
        "feedback": f"Unable to parse evaluation: {error_message}",
        "correct_sections": [],
        "incorrect_sections": [],
        "suggestions": ["Please try again with a clearer argument"]
    }


def extract_text_from_response(response: str) -> str:
    """Extract clean text from AI response (removing markdown, code blocks, etc.)"""
    response = re.sub(r'```.*?```', '', response, flags=re.DOTALL)
    response = re.sub(r'^#+\s*', '', response, flags=re.MULTILINE)
    response = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', response)
    response = re.sub(r'\*\*([^*]+)\*\*', r'\1', response)
    response = re.sub(r'\*([^*]+)\*', r'\1', response)
    response = re.sub(r'\n\s*\n', '\n\n', response)
    return response.strip()


def is_valid_evaluation(evaluation: Dict[str, Any]) -> bool:
    """Check if evaluation dictionary is valid and complete."""
    required_fields = [
        'legal_accuracy_score', 'reasoning_score',
        'evidence_score', 'overall_score', 'feedback'
    ]
    
    for field in required_fields:
        if field not in evaluation:
            return False
    
    score_fields = ['legal_accuracy_score', 'reasoning_score', 'evidence_score', 'overall_score']
    for field in score_fields:
        try:
            score = float(evaluation[field])
            if not (0 <= score <= 100):
                return False
        except (ValueError, TypeError):
            return False
    
    return True

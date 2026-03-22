"""
Scoring Service for AI Legal Courtroom Simulator
Handles multi-factor scoring and performance evaluation
"""

from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum


class PerformanceTier(str, Enum):
    """Performance tier classifications"""
    SENIOR_COUNSEL = "Senior Counsel"
    COMPETENT_ADVOCATE = "Competent Advocate"
    JUNIOR_ADVOCATE = "Junior Advocate"
    LAW_STUDENT = "Law Student"


@dataclass
class ScoreBreakdown:
    """Individual score components"""
    legal_accuracy: float
    reasoning: float
    evidence: float
    overall: float


@dataclass
class PerformanceMetrics:
    """Comprehensive performance metrics"""
    total_arguments: int
    average_score: float
    best_score: float
    worst_score: float
    improvement_trend: str
    consistency_score: float
    performance_tier: PerformanceTier


class ScoringService:
    """
    Multi-factor scoring system for legal argument evaluation
    """
    
    # Scoring weights (must sum to 1.0)
    WEIGHTS = {
        "legal_accuracy": 0.40,
        "reasoning": 0.35,
        "evidence": 0.25
    }
    
    # Performance tier thresholds
    TIER_THRESHOLDS = {
        PerformanceTier.SENIOR_COUNSEL: 85.0,
        PerformanceTier.COMPETENT_ADVOCATE: 70.0,
        PerformanceTier.JUNIOR_ADVOCATE: 55.0,
        PerformanceTier.LAW_STUDENT: 0.0
    }
    
    @staticmethod
    def calculate_score(evaluation: Dict) -> float:
        """
        Calculate weighted overall score from evaluation
        
        Args:
            evaluation: Evaluation dictionary with component scores
            
        Returns:
            Weighted overall score (0-100)
        """
        try:
            # Extract component scores
            legal_accuracy = float(evaluation.get("legal_accuracy_score", 0))
            reasoning = float(evaluation.get("reasoning_score", 0))
            evidence = float(evaluation.get("evidence_score", 0))
            
            # Calculate weighted score
            weighted_score = (
                legal_accuracy * ScoringService.WEIGHTS["legal_accuracy"] +
                reasoning * ScoringService.WEIGHTS["reasoning"] +
                evidence * ScoringService.WEIGHTS["evidence"]
            )
            
            # Round to 2 decimal places
            return round(weighted_score, 2)
            
        except (ValueError, TypeError) as e:
            print(f"Score calculation error: {e}")
            return 0.0
    
    @staticmethod
    def get_performance_tier(score: float) -> PerformanceTier:
        """
        Determine performance tier based on score
        
        Args:
            score: Overall score (0-100)
            
        Returns:
            Performance tier enum
        """
        for tier, threshold in ScoringService.TIER_THRESHOLDS.items():
            if score >= threshold:
                return tier
        return PerformanceTier.LAW_STUDENT
    
    @staticmethod
    def get_score_breakdown(evaluation: Dict) -> ScoreBreakdown:
        """
        Extract and validate score breakdown
        
        Args:
            evaluation: Evaluation dictionary
            
        Returns:
            ScoreBreakdown dataclass
        """
        try:
            legal_accuracy = float(evaluation.get("legal_accuracy_score", 0))
            reasoning = float(evaluation.get("reasoning_score", 0))
            evidence = float(evaluation.get("evidence_score", 0))
            overall = float(evaluation.get("overall_score", ScoringService.calculate_score(evaluation)))
            
            # Clamp scores to valid range
            legal_accuracy = max(0, min(100, legal_accuracy))
            reasoning = max(0, min(100, reasoning))
            evidence = max(0, min(100, evidence))
            overall = max(0, min(100, overall))
            
            return ScoreBreakdown(
                legal_accuracy=legal_accuracy,
                reasoning=reasoning,
                evidence=evidence,
                overall=overall
            )
            
        except (ValueError, TypeError) as e:
            print(f"Score breakdown error: {e}")
            return ScoreBreakdown(0, 0, 0, 0)
    
    @staticmethod
    def analyze_performance(evaluations: List[Dict]) -> PerformanceMetrics:
        """
        Analyze performance across multiple evaluations
        
        Args:
            evaluations: List of evaluation dictionaries
            
        Returns:
            PerformanceMetrics dataclass
        """
        if not evaluations:
            return PerformanceMetrics(
                total_arguments=0,
                average_score=0.0,
                best_score=0.0,
                worst_score=0.0,
                improvement_trend="No data",
                consistency_score=0.0,
                performance_tier=PerformanceTier.LAW_STUDENT
            )
        
        # Calculate individual scores
        scores = [ScoringService.calculate_score(eval_) for eval_ in evaluations]
        
        # Basic statistics
        total_arguments = len(evaluations)
        average_score = sum(scores) / len(scores)
        best_score = max(scores)
        worst_score = min(scores)
        
        # Calculate improvement trend
        improvement_trend = ScoringService._calculate_improvement_trend(scores)
        
        # Calculate consistency (standard deviation)
        consistency_score = ScoringService._calculate_consistency_score(scores)
        
        # Determine performance tier
        performance_tier = ScoringService.get_performance_tier(average_score)
        
        return PerformanceMetrics(
            total_arguments=total_arguments,
            average_score=round(average_score, 2),
            best_score=round(best_score, 2),
            worst_score=round(worst_score, 2),
            improvement_trend=improvement_trend,
            consistency_score=round(consistency_score, 2),
            performance_tier=performance_tier
        )
    
    @staticmethod
    def _calculate_improvement_trend(scores: List[float]) -> str:
        """
        Calculate improvement trend from score series
        
        Args:
            scores: List of scores in chronological order
            
        Returns:
            Trend description string
        """
        if len(scores) < 2:
            return "Insufficient data"
        
        # Compare first half to second half
        mid_point = len(scores) // 2
        first_half_avg = sum(scores[:mid_point]) / mid_point if mid_point > 0 else scores[0]
        second_half_avg = sum(scores[mid_point:]) / (len(scores) - mid_point) if len(scores) > mid_point else scores[-1]
        
        difference = second_half_avg - first_half_avg
        
        if difference > 5:
            return "Improving"
        elif difference < -5:
            return "Declining"
        else:
            return "Stable"
    
    @staticmethod
    def _calculate_consistency_score(scores: List[float]) -> float:
        """
        Calculate consistency score based on score variance
        
        Args:
            scores: List of scores
            
        Returns:
            Consistency score (0-100, higher is more consistent)
        """
        if len(scores) < 2:
            return 100.0
        
        # Calculate standard deviation
        mean = sum(scores) / len(scores)
        variance = sum((score - mean) ** 2 for score in scores) / len(scores)
        std_dev = variance ** 0.5
        
        # Convert to consistency score (lower std_dev = higher consistency)
        # Max std_dev of 50 gives 0 consistency, std_dev of 0 gives 100 consistency
        consistency = max(0, 100 - (std_dev * 2))
        
        return round(consistency, 2)
    
    @staticmethod
    def get_improvement_suggestions(evaluations: List[Dict]) -> List[str]:
        """
        Generate personalized improvement suggestions based on performance
        
        Args:
            evaluations: List of evaluation dictionaries
            
        Returns:
            List of improvement suggestions
        """
        if not evaluations:
            return ["Start submitting arguments to get personalized feedback"]
        
        # Analyze recent performance (last 3 evaluations)
        recent_evals = evaluations[-3:] if len(evaluations) >= 3 else evaluations
        
        # Calculate average component scores
        avg_legal = sum(eval_.get("legal_accuracy_score", 0) for eval_ in recent_evals) / len(recent_evals)
        avg_reasoning = sum(eval_.get("reasoning_score", 0) for eval_ in recent_evals) / len(recent_evals)
        avg_evidence = sum(eval_.get("evidence_score", 0) for eval_ in recent_evals) / len(recent_evals)
        
        suggestions = []
        
        # Legal accuracy suggestions
        if avg_legal < 60:
            suggestions.append("Focus on studying specific IPC sections related to your case type")
            suggestions.append("Practice citing exact section numbers with subsections")
            suggestions.append("Review landmark cases to understand proper legal application")
        elif avg_legal < 80:
            suggestions.append("Work on precision in legal citation and application")
        
        # Reasoning suggestions
        if avg_reasoning < 60:
            suggestions.append("Practice structuring arguments: premise → reasoning → conclusion")
            suggestions.append("Study logical fallacies to avoid weak reasoning patterns")
            suggestions.append("Analyze case judgments to understand proper reasoning flow")
        elif avg_reasoning < 80:
            suggestions.append("Enhance logical flow and argument coherence")
        
        # Evidence suggestions
        if avg_evidence < 60:
            suggestions.append("Study Indian Evidence Act provisions for proper evidence handling")
            suggestions.append("Practice connecting evidence to legal elements systematically")
            suggestions.append("Learn to distinguish between admissible and inadmissible evidence")
        elif avg_evidence < 80:
            suggestions.append("Improve evidence-law integration in arguments")
        
        # General suggestions based on performance trend
        performance = ScoringService.analyze_performance(evaluations)
        if performance.improvement_trend == "Declining":
            suggestions.append("Take a break and review fundamentals before continuing")
        elif performance.improvement_trend == "Improving":
            suggestions.append("Great progress! Focus on maintaining consistency")
        
        # Consistency suggestions
        if performance.consistency_score < 60:
            suggestions.append("Work on consistency in argument quality and structure")
        
        return suggestions[:6]  # Limit to 6 suggestions
    
    @staticmethod
    def validate_evaluation(evaluation: Dict) -> bool:
        """
        Validate evaluation dictionary structure and values
        
        Args:
            evaluation: Evaluation dictionary
            
        Returns:
            True if valid, False otherwise
        """
        required_fields = ["legal_accuracy_score", "reasoning_score", "evidence_score"]
        
        # Check required fields
        for field in required_fields:
            if field not in evaluation:
                return False
            try:
                score = float(evaluation[field])
                if not (0 <= score <= 100):
                    return False
            except (ValueError, TypeError):
                return False
        
        return True
    
    @staticmethod
    def get_scoring_info() -> Dict:
        """
        Get information about scoring system
        
        Returns:
            Scoring system information
        """
        return {
            "weights": ScoringService.WEIGHTS,
            "tier_thresholds": {tier.value: threshold for tier, threshold in ScoringService.TIER_THRESHOLDS.items()},
            "score_components": {
                "legal_accuracy": "Correct application of legal provisions and citations",
                "reasoning": "Logical structure, coherence, and argument flow",
                "evidence": "Proper evidence handling and integration with law"
            },
            "performance_tiers": {
                tier.value: f"Score >= {threshold}" 
                for tier, threshold in ScoringService.TIER_THRESHOLDS.items()
            }
        }


# Example usage
if __name__ == "__main__":
    # Sample evaluations
    sample_evaluations = [
        {
            "legal_accuracy_score": 85,
            "reasoning_score": 90,
            "evidence_score": 80,
            "overall_score": 85.5,
            "feedback": "Good legal accuracy and reasoning",
            "correct_sections": ["300", "302"],
            "incorrect_sections": [],
            "suggestions": ["Add more evidence"]
        },
        {
            "legal_accuracy_score": 75,
            "reasoning_score": 80,
            "evidence_score": 70,
            "overall_score": 75.0,
            "feedback": "Needs improvement in evidence application",
            "correct_sections": ["300"],
            "incorrect_sections": [{"section": "304", "reason": "Wrong context"}],
            "suggestions": ["Study evidence rules"]
        },
        {
            "legal_accuracy_score": 90,
            "reasoning_score": 85,
            "evidence_score": 88,
            "overall_score": 87.5,
            "feedback": "Excellent performance",
            "correct_sections": ["300", "302", "304"],
            "incorrect_sections": [],
            "suggestions": ["Maintain this level"]
        }
    ]
    
    # Test scoring service
    print("Testing Scoring Service:")
    
    for i, eval_ in enumerate(sample_evaluations, 1):
        score = ScoringService.calculate_score(eval_)
        tier = ScoringService.get_performance_tier(score)
        breakdown = ScoringService.get_score_breakdown(eval_)
        
        print(f"\nEvaluation {i}:")
        print(f"Score: {score}")
        print(f"Tier: {tier.value}")
        print(f"Breakdown: {breakdown}")
    
    # Test performance analysis
    performance = ScoringService.analyze_performance(sample_evaluations)
    print(f"\nPerformance Analysis:")
    print(f"Average Score: {performance.average_score}")
    print(f"Trend: {performance.improvement_trend}")
    print(f"Consistency: {performance.consistency_score}")
    
    # Test improvement suggestions
    suggestions = ScoringService.get_improvement_suggestions(sample_evaluations)
    print(f"\nImprovement Suggestions:")
    for suggestion in suggestions:
        print(f"- {suggestion}")

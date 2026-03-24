"""
Judge Agent for AI Legal Courtroom Simulator
Evaluates user arguments using Gemini + RAG system
"""

from typing import List, Dict, Optional
from app.ai_system.agents.base_agent import BaseAgent
from app.ai_system.prompts.judge_prompts import (
    JUDGE_SYSTEM_PROMPT,
    JUDGE_EVALUATION_TEMPLATE,
    JUDGE_PHASE_PROMPTS,
    JUDGE_FEEDBACK_TEMPLATES
)
from app.ai_system.rag.retriever import RAGRetriever
from app.ai_system.utils.response_parser import parse_json_response


class JudgeAgent(BaseAgent):
    """
    AI Judge that evaluates legal arguments using RAG-retrieved legal provisions
    """
    
    def __init__(self, api_key: str = None, rag_retriever: RAGRetriever = None, model_name: str = "gemini-2.0-flash", provider: str = "gemini"):
        """
        Initialize Judge Agent
        
        Args:
            api_key: AI provider API key
            rag_retriever: RAG system instance
            model_name: Model name
            provider: 'gemini' or 'groq'
        """
        super().__init__(api_key, model_name, provider)
        self.rag_retriever = rag_retriever
    
    def evaluate_argument(
        self,
        user_argument: str,
        cited_sections: List[str],
        case_facts: Dict,
        phase: str = "argument"
    ) -> Dict:
        """
        Evaluate user's legal argument
        
        Args:
            user_argument: User's argument text
            cited_sections: List of cited legal sections
            case_facts: Case facts dictionary
            phase: Current courtroom phase
            
        Returns:
            Evaluation dictionary with scores and feedback
        """
        try:
            # 1. Retrieve relevant laws via RAG
            retrieved_laws = self._retrieve_relevant_laws(user_argument, cited_sections)
            
            # 2. Build evaluation prompt
            evaluation_prompt = self._build_evaluation_prompt(
                user_argument, cited_sections, case_facts, retrieved_laws, phase
            )
            
            # 3. Get phase-specific instructions
            phase_instructions = JUDGE_PHASE_PROMPTS.get(phase, "")
            system_prompt = JUDGE_SYSTEM_PROMPT + "\n\n" + phase_instructions
            
            # 4. Generate evaluation using Gemini
            evaluation = self._generate_structured_response(
                prompt=evaluation_prompt,
                system_prompt=system_prompt,
                expected_format="json"
            )
            
            # 5. Validate and enhance evaluation
            evaluation = self._validate_evaluation(evaluation, retrieved_laws)
            
            return evaluation
            
        except Exception as e:
            print(f"Error evaluating argument: {e}")
            return self._get_fallback_evaluation()
    
    def _retrieve_relevant_laws(self, user_argument: str, cited_sections: List[str]) -> List[Dict]:
        """
        Retrieve relevant legal provisions using RAG
        
        Args:
            user_argument: User's argument text
            cited_sections: List of cited sections
            
        Returns:
            List of retrieved legal documents
        """
        try:
            if self.rag_retriever:
                # Build query from argument and cited sections
                query = user_argument
                if cited_sections:
                    query += " " + " ".join(cited_sections)
                
                # Retrieve relevant laws
                results = self.rag_retriever.retrieve(query, top_k=8)
                return results
            else:
                return []
        except Exception as e:
            print(f"Error retrieving laws: {e}")
            return []
    
    def _build_evaluation_prompt(
        self,
        user_argument: str,
        cited_sections: List[str],
        case_facts: Dict,
        retrieved_laws: List[Dict],
        phase: str
    ) -> str:
        """
        Build the evaluation prompt for the judge
        
        Args:
            user_argument: User's argument text
            cited_sections: List of cited sections
            case_facts: Case facts dictionary
            retrieved_laws: Retrieved legal provisions
            phase: Current courtroom phase
            
        Returns:
            Formatted evaluation prompt
        """
        # Format retrieved laws
        laws_text = ""
        if retrieved_laws:
            for i, law in enumerate(retrieved_laws, 1):
                section_info = f"Section {law['metadata'].get('section_number', 'N/A')}" if law['metadata'].get('section_number') else "Provision"
                act_info = law['metadata'].get('doc_type', 'Unknown Act')
                laws_text += f"\n{i}. {act_info} - {section_info}\n{law['content']}\n"
        else:
            laws_text = "\nNo specific legal provisions retrieved. Evaluate based on general legal principles."
        
        # Format cited sections
        cited_text = ", ".join(cited_sections) if cited_sections else "None"
        
        # Build prompt using template
        prompt = JUDGE_EVALUATION_TEMPLATE.format(
            retrieved_laws=laws_text,
            case_facts=str(case_facts),
            user_argument=user_argument,
            cited_sections=cited_text
        )
        
        # Add phase-specific instructions
        if phase in JUDGE_PHASE_PROMPTS:
            prompt += f"\n\nPHASE-SPECIFIC FOCUS:\n{JUDGE_PHASE_PROMPTS[phase]}"
        
        return prompt
    
    def _validate_evaluation(self, evaluation: Dict, retrieved_laws: List[Dict]) -> Dict:
        """
        Validate and enhance the evaluation
        
        Args:
            evaluation: Raw evaluation from Gemini
            retrieved_laws: Retrieved legal provisions
            
        Returns:
            Validated and enhanced evaluation
        """
        # Ensure required fields exist
        required_fields = [
            "legal_accuracy_score", "reasoning_score", "evidence_score",
            "overall_score", "feedback", "correct_sections", "incorrect_sections", "suggestions"
        ]
        
        for field in required_fields:
            if field not in evaluation:
                evaluation[field] = [] if field.endswith("s") else 0
        
        # Validate score ranges
        score_fields = ["legal_accuracy_score", "reasoning_score", "evidence_score", "overall_score"]
        for field in score_fields:
            evaluation[field] = max(0, min(100, float(evaluation[field])))
        
        # Ensure lists are actually lists
        list_fields = ["correct_sections", "incorrect_sections", "suggestions"]
        for field in list_fields:
            if not isinstance(evaluation[field], list):
                evaluation[field] = [evaluation[field]] if evaluation[field] else []
        
        # Enhance feedback with templates
        evaluation = self._enhance_feedback(evaluation)
        
        return evaluation
    
    def _enhance_feedback(self, evaluation: Dict) -> Dict:
        """
        Enhance feedback with predefined templates
        
        Args:
            evaluation: Evaluation dictionary
            
        Returns:
            Enhanced evaluation
        """
        # Get scores
        legal_score = evaluation["legal_accuracy_score"]
        reasoning_score = evaluation["reasoning_score"]
        evidence_score = evaluation["evidence_score"]
        
        # Add score-specific feedback
        enhanced_feedback = []
        
        # Legal accuracy feedback
        if legal_score >= 90:
            enhanced_feedback.append(JUDGE_FEEDBACK_TEMPLATES["legal_accuracy"]["excellent"])
        elif legal_score >= 75:
            enhanced_feedback.append(JUDGE_FEEDBACK_TEMPLATES["legal_accuracy"]["good"])
        elif legal_score >= 60:
            enhanced_feedback.append(JUDGE_FEEDBACK_TEMPLATES["legal_accuracy"]["needs_improvement"])
        else:
            enhanced_feedback.append(JUDGE_FEEDBACK_TEMPLATES["legal_accuracy"]["poor"])
        
        # Reasoning feedback
        if reasoning_score >= 90:
            enhanced_feedback.append(JUDGE_FEEDBACK_TEMPLATES["reasoning"]["excellent"])
        elif reasoning_score >= 75:
            enhanced_feedback.append(JUDGE_FEEDBACK_TEMPLATES["reasoning"]["good"])
        elif reasoning_score >= 60:
            enhanced_feedback.append(JUDGE_FEEDBACK_TEMPLATES["reasoning"]["needs_improvement"])
        else:
            enhanced_feedback.append(JUDGE_FEEDBACK_TEMPLATES["reasoning"]["poor"])
        
        # Evidence feedback
        if evidence_score >= 90:
            enhanced_feedback.append(JUDGE_FEEDBACK_TEMPLATES["evidence"]["excellent"])
        elif evidence_score >= 75:
            enhanced_feedback.append(JUDGE_FEEDBACK_TEMPLATES["evidence"]["good"])
        elif evidence_score >= 60:
            enhanced_feedback.append(JUDGE_FEEDBACK_TEMPLATES["evidence"]["needs_improvement"])
        else:
            enhanced_feedback.append(JUDGE_FEEDBACK_TEMPLATES["evidence"]["poor"])
        
        # Combine with existing feedback
        if evaluation["feedback"]:
            enhanced_feedback.append("\n\nDetailed Analysis:")
            enhanced_feedback.append(evaluation["feedback"])
        
        evaluation["feedback"] = "\n\n".join(enhanced_feedback)
        
        return evaluation
    
    def _get_fallback_evaluation(self) -> Dict:
        """
        Get fallback evaluation when AI fails
        
        Returns:
            Default evaluation dictionary
        """
        return {
            "legal_accuracy_score": 50,
            "reasoning_score": 50,
            "evidence_score": 50,
            "overall_score": 50,
            "feedback": "Unable to provide detailed evaluation due to technical issues. Please try again.",
            "correct_sections": [],
            "incorrect_sections": [],
            "suggestions": ["Please ensure your argument is clear and well-structured"]
        }
    
    def generate_response(self, context: str, **kwargs) -> dict:
        """
        Implementation of abstract method from BaseAgent
        
        Args:
            context: Context for generating response
            **kwargs: Additional parameters
            
        Returns:
            Response dictionary
        """
        # Extract parameters from kwargs
        user_argument = kwargs.get("user_argument", "")
        cited_sections = kwargs.get("cited_sections", [])
        case_facts = kwargs.get("case_facts", {})
        phase = kwargs.get("phase", "argument")
        
        return self.evaluate_argument(user_argument, cited_sections, case_facts, phase)
    
    def get_judge_info(self) -> Dict:
        """
        Get information about the judge agent
        
        Returns:
            Judge agent information
        """
        info = self.get_model_info()
        info.update({
            "agent_type": "Judge",
            "capabilities": [
                "Legal argument evaluation",
                "Section citation verification",
                "Logical reasoning assessment",
                "Evidence application analysis",
                "Performance scoring"
            ],
            "evaluation_criteria": {
                "legal_accuracy": 40,
                "reasoning": 35,
                "evidence": 25
            }
        })
        return info


# Example usage
if __name__ == "__main__":
    # This would require actual API keys and RAG setup
    # from app.ai_system.rag.retriever import RAGRetriever
    
    # Initialize RAG retriever
    # rag = RAGRetriever(api_key="your_gemini_api_key")
    
    # Initialize judge agent
    # judge = JudgeAgent(api_key="your_gemini_api_key", rag_retriever=rag)
    
    # Sample evaluation
    sample_case_facts = {
        "case_id": "STATE_V_RAMESH",
        "charges": ["Murder under IPC Section 302"],
        "facts": "Death due to injury, dispute over property"
    }
    
    # evaluation = judge.evaluate_argument(
    #     user_argument="The accused should be convicted under Section 302 as there is clear evidence of intent to cause death.",
    #     cited_sections=["302", "300"],
    #     case_facts=sample_case_facts,
    #     phase="argument"
    # )
    
    # print(f"Evaluation: {evaluation}")
    print("Judge agent class defined. Initialize with API keys and RAG system to use.")

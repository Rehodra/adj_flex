"""
Opponent Agent for AI Legal Courtroom Simulator
Generates counter-arguments using Gemini + RAG system
"""

from typing import List, Dict, Optional
from app.ai_system.agents.base_agent import BaseAgent
from app.ai_system.prompts.opponent_prompts import (
    OPPONENT_SYSTEM_PROMPT,
    OPPONENT_ARGUMENT_TEMPLATE,
    OPPONENT_STRATEGY_PROMPTS,
    OPPONENT_PHASE_STRATEGIES,
    OPPONENT_RESPONSE_TEMPLATES,
    OPPONENT_PERSONALITY_TRAITS
)
from app.ai_system.rag.retriever import RAGRetriever
import random


class OpponentAgent(BaseAgent):
    """
    AI Opponent Lawyer that generates counter-arguments using RAG-retrieved legal provisions
    """
    
    def __init__(self, api_key: str = None, rag_retriever: RAGRetriever = None, model_name: str = "gemini-2.0-flash"):
        """
        Initialize Opponent Agent
        
        Args:
            api_key: Google Gemini API key
            rag_retriever: RAG system instance
            model_name: Gemini model name
        """
        super().__init__(api_key, model_name)
        self.rag_retriever = rag_retriever
        self.current_personality = "experienced"  # Can be changed for variety
        self.current_strategy = "methodical"  # Can be changed based on case
    
    def generate_counter_argument(
        self,
        user_argument: str,
        case_facts: Dict,
        position: str = "prosecution",
        phase: str = "argument",
        strategy: str = None
    ) -> str:
        """
        Generate counter-argument to user's position
        
        Args:
            user_argument: User's argument text
            case_facts: Case facts dictionary
            position: "prosecution" or "defense"
            phase: Current courtroom phase
            strategy: Optional strategy override
            
        Returns:
            Generated counter-argument text
        """
        try:
            # 1. Retrieve relevant laws via RAG
            retrieved_laws = self._retrieve_relevant_laws(user_argument, position)
            
            # 2. Build counter-argument prompt
            counter_prompt = self._build_counter_prompt(
                user_argument, case_facts, retrieved_laws, position, phase, strategy
            )
            
            # 3. Generate response using Gemini
            response = self._generate_response(
                prompt=counter_prompt,
                system_prompt=self._build_system_prompt(position, strategy),
                max_tokens=1500,
                temperature=0.8  # Slightly higher creativity for arguments
            )
            
            # 4. Post-process and validate response
            counter_argument = self._post_process_response(response, position)
            
            return counter_argument
            
        except Exception as e:
            print(f"Error generating counter-argument: {e}")
            return self._get_fallback_counter_argument(user_argument, position)
    
    def _retrieve_relevant_laws(self, user_argument: str, position: str) -> List[Dict]:
        """
        Retrieve relevant legal provisions for counter-argument
        
        Args:
            user_argument: User's argument text
            position: "prosecution" or "defense"
            
        Returns:
            List of retrieved legal documents
        """
        try:
            if self.rag_retriever:
                # Build query for counter-argument
                query = f"{position} counter argument: {user_argument}"
                
                # Retrieve relevant laws
                results = self.rag_retriever.retrieve(query, top_k=6)
                return results
            else:
                return []
        except Exception as e:
            print(f"Error retrieving laws for counter-argument: {e}")
            return []
    
    def _build_counter_prompt(
        self,
        user_argument: str,
        case_facts: Dict,
        retrieved_laws: List[Dict],
        position: str,
        phase: str,
        strategy: str = None
    ) -> str:
        """
        Build the counter-argument prompt
        
        Args:
            user_argument: User's argument text
            case_facts: Case facts dictionary
            retrieved_laws: Retrieved legal provisions
            position: "prosecution" or "defense"
            phase: Current courtroom phase
            strategy: Strategy override
            
        Returns:
            Formatted counter-argument prompt
        """
        # Format retrieved laws
        laws_text = ""
        if retrieved_laws:
            for i, law in enumerate(retrieved_laws, 1):
                section_info = f"Section {law['metadata'].get('section_number', 'N/A')}" if law['metadata'].get('section_number') else "Provision"
                act_info = law['metadata'].get('doc_type', 'Unknown Act')
                laws_text += f"\n{i}. {act_info} - {section_info}\n{law['content']}\n"
        else:
            laws_text = "\nNo specific legal provisions available. Use general legal principles."
        
        # Build main prompt using template
        prompt = OPPONENT_ARGUMENT_TEMPLATE.format(
            retrieved_laws=laws_text,
            case_facts=str(case_facts),
            user_argument=user_argument,
            position=position
        )
        
        # Add phase-specific strategy
        if phase in OPPONENT_PHASE_STRATEGIES:
            phase_strategy = OPPONENT_PHASE_STRATEGIES[phase].get(position, "")
            prompt += f"\n\nPHASE STRATEGY:\n{phase_strategy}"
        
        # Add personality-specific instructions
        personality = OPPONENT_PERSONALITY_TRAITS.get(self.current_personality, {})
        if personality:
            prompt += f"\n\nPERSONALITY STYLE:\n- Style: {personality.get('style', '')}\n- Approach: {personality.get('strategy', '')}"
        
        # Add strategy-specific instructions
        if strategy or self.current_strategy:
            strategy_key = strategy or self.current_strategy
            if position in OPPONENT_STRATEGY_PROMPTS and strategy_key in OPPONENT_STRATEGY_PROMPTS[position]:
                strategy_prompt = OPPONENT_STRATEGY_PROMPTS[position][strategy_key]
                prompt += f"\n\nSTRATEGY INSTRUCTIONS:\n{strategy_prompt}"
        
        return prompt
    
    def _build_system_prompt(self, position: str, strategy: str = None) -> str:
        """
        Build system prompt with position and strategy context
        
        Args:
            position: "prosecution" or "defense"
            strategy: Strategy type
            
        Returns:
            Enhanced system prompt
        """
        system_prompt = OPPONENT_SYSTEM_PROMPT
        
        # Add position context
        system_prompt += f"\n\nYou are acting as {position} counsel."
        
        # Add strategy context
        if strategy:
            system_prompt += f"\n\nYour current strategy: {strategy}."
        
        return system_prompt
    
    def _post_process_response(self, response: str, position: str) -> str:
        """
        Post-process and validate the generated response
        
        Args:
            response: Raw response from Gemini
            position: "prosecution" or "defense"
            
        Returns:
            Processed counter-argument
        """
        # Clean up response
        response = response.strip()
        
        # Remove any JSON formatting or markdown
        if response.startswith("```"):
            response = response.split("\n", 1)[-1]
        if response.endswith("```"):
            response = response.rsplit("\n", 1)[0]
        
        # Ensure appropriate length (200-300 words)
        words = response.split()
        if len(words) > 300:
            # Truncate to last complete sentence within limit
            truncated = " ".join(words[:280])
            # Find last sentence end
            last_period = truncated.rfind(".")
            if last_period > len(truncated) * 0.8:  # Don't cut too early
                response = truncated[:last_period + 1]
            else:
                response = truncated + "..."
        
        elif len(words) < 150:
            # Response is too short, add encouragement for more detail
            response += "\n\nFurthermore, the legal precedent and statutory provisions clearly support this position."
        
        # Ensure courtroom-appropriate language
        response = response.replace("I think", "It is submitted that")
        response = response.replace("I believe", "It is contended that")
        response = response.replace("you're wrong", "the learned counsel's position is untenable")
        
        return response
    
    def _get_fallback_counter_argument(self, user_argument: str, position: str) -> str:
        """
        Get fallback counter-argument when AI fails
        
        Args:
            user_argument: User's argument text
            position: "prosecution" or "defense"
            
        Returns:
            Default counter-argument
        """
        if position == "prosecution":
            return """Your Honor, the learned counsel's argument fails to establish the essential elements of the offense. The prosecution maintains that the evidence, when properly construed, demonstrates the accused's culpability beyond reasonable doubt. The legal provisions cited by the defense are inapplicable to the facts of this case."""
        else:
            return """Your Honor, the prosecution's case suffers from critical evidentiary gaps. The alleged facts do not satisfy the statutory requirements for conviction. The defense submits that reasonable doubt exists as to the material elements of the offense, and therefore acquittal is the only proper outcome."""
    
    def set_personality(self, personality: str) -> None:
        """
        Set the opponent's personality type
        
        Args:
            personality: Personality type from OPPONENT_PERSONALITY_TRAITS
        """
        if personality in OPPONENT_PERSONALITY_TRAITS:
            self.current_personality = personality
        else:
            print(f"Unknown personality: {personality}. Using default.")
    
    def set_strategy(self, strategy: str) -> None:
        """
        Set the opponent's strategy type
        
        Args:
            strategy: Strategy type
        """
        self.current_strategy = strategy
    
    def randomize_personality(self) -> None:
        """Randomly select a personality for variety"""
        personalities = list(OPPONENT_PERSONALITY_TRAITS.keys())
        self.current_personality = random.choice(personalities)
    
    def get_opponent_info(self) -> Dict:
        """
        Get information about the opponent agent
        
        Returns:
            Opponent agent information
        """
        info = self.get_model_info()
        info.update({
            "agent_type": "Opponent Lawyer",
            "current_personality": self.current_personality,
            "current_strategy": self.current_strategy,
            "available_personalities": list(OPPONENT_PERSONALITY_TRAITS.keys()),
            "capabilities": [
                "Counter-argument generation",
                "Legal strategy adaptation",
                "Personality-based responses",
                "Phase-specific tactics",
                "Evidence challenge formulation"
            ]
        })
        return info
    
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
        user_argument = kwargs.get("user_argument", context)
        case_facts = kwargs.get("case_facts", {})
        position = kwargs.get("position", "prosecution")
        phase = kwargs.get("phase", "argument")
        strategy = kwargs.get("strategy")
        
        counter_argument = self.generate_counter_argument(
            user_argument, case_facts, position, phase, strategy
        )
        
        return {
            "counter_argument": counter_argument,
            "position": position,
            "personality": self.current_personality,
            "strategy": self.current_strategy
        }


# Example usage
if __name__ == "__main__":
    # This would require actual API keys and RAG setup
    # from app.ai_system.rag.retriever import RAGRetriever
    
    # Initialize RAG retriever
    # rag = RAGRetriever(api_key="your_gemini_api_key")
    
    # Initialize opponent agent
    # opponent = OpponentAgent(api_key="your_gemini_api_key", rag_retriever=rag)
    
    # Sample counter-argument generation
    sample_case_facts = {
        "case_id": "STATE_V_RAMESH",
        "charges": ["Murder under IPC Section 302"],
        "facts": "Death due to injury, dispute over property"
    }
    
    # counter_arg = opponent.generate_counter_argument(
    #     user_argument="The accused should be convicted under Section 302 as there is clear evidence of intent to cause death.",
    #     case_facts=sample_case_facts,
    #     position="defense",
    #     phase="argument"
    # )
    
    # print(f"Counter-argument: {counter_arg}")
    print("Opponent agent class defined. Initialize with API keys and RAG system to use.")

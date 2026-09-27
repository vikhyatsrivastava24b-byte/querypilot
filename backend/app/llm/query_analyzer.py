import json
from .config import client as groq_client
MODEL_NAME = "llama-3.1-8b-instant"

SYSTEM_PROMPT = """You are QueryPilot, a specialized AI Query Intelligence Platform.
Your task is to analyze a vague user query, understand their underlying intent, identify missing context, and generate a structured research plan.

You MUST respond with a valid JSON object matching the following schema EXACTLY.
Do not wrap it in markdown block (like ```json), just output the raw JSON.

{
  "understanding": {
    "intent": "String describing the intent (e.g. Product Evaluation, Technical Debugging)",
    "topic": "String describing the core topic",
    "budget": "Extracted budget/constraints if any, else null",
    "purpose": "A 1-sentence summary of what they are actually trying to figure out"
  },
  "missing_information": [
    "A list of 3-4 specific questions that clarify the need (e.g. What type of programming?)"
  ],
  "improved_query": "A highly specific, detailed search query that includes the implied context.",
  "research_plan": [
    "A list of 4-6 actionable, sequential steps to research this topic thoroughly."
  ]
}
"""

async def analyze_query(query: str) -> dict:
    """Analyzes a vague query and returns the structured JSON response."""
    
    try:
        response = groq_client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Analyze this query:\n\n{query}"}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        # Parse the JSON response
        content = response.choices[0].message.content
        return json.loads(content)
        
    except Exception as e:
        print(f"Error analyzing query: {e}")
        # Fallback response so the app doesn't crash completely
        return {
            "understanding": {
                "intent": "Unknown",
                "topic": query,
                "budget": None,
                "purpose": "Could not analyze intent due to an error."
            },
            "missing_information": ["What specific details can you provide?"],
            "improved_query": query,
            "research_plan": ["Search for general information", "Review results"]
        }

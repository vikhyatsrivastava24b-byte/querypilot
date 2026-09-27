from fastapi import APIRouter, HTTPException
from ..llm.query_analyzer import analyze_query, synthesize_research
from ..search.engine import execute_web_search
from .schemas import ResearchAnalyzeRequest, QueryAnalysisResponse, ExecuteSearchRequest, ExecuteSearchResponse, SynthesizeRequest, SynthesizeResponse

router = APIRouter()

@router.post("/analyze", response_model=QueryAnalysisResponse)
async def analyze_research_query(request: ResearchAnalyzeRequest):
    """
    Takes a vague user query and returns a structured AI analysis containing
    intent, missing information, an improved query, and a research plan.
    """
    try:
        # Call the Groq LLM logic
        analysis_data = await analyze_query(request.query)
        
        # Ensure it matches the Pydantic schema
        return QueryAnalysisResponse(**analysis_data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze query: {str(e)}")

@router.post("/execute", response_model=ExecuteSearchResponse)
async def execute_research(request: ExecuteSearchRequest):
    """
    Executes the research plan using live web search.
    """
    try:
        sources = execute_web_search(request.query, max_results=6)
        return ExecuteSearchResponse(sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to execute search: {str(e)}")

@router.post("/synthesize", response_model=SynthesizeResponse)
async def synthesize_brief(request: SynthesizeRequest):
    try:
        md = await synthesize_research(
            query=request.query,
            plan_steps=request.plan_steps,
            sources=[s.dict() for s in request.sources]
        )
        return SynthesizeResponse(brief_markdown=md)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to synthesize: {str(e)}")


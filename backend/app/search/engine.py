import json
from duckduckgo_search import DDGS

def get_source_type(url: str) -> str:
    """Heuristic to determine source type."""
    url_lower = url.lower()
    if 'reddit.com' in url_lower or 'quora.com' in url_lower or 'stackexchange' in url_lower or 'stackoverflow' in url_lower:
        return 'Community'
    elif 'github.com' in url_lower or '.edu' in url_lower or '.gov' in url_lower:
        return 'Official/Academic'
    elif 'nytimes.com' in url_lower or 'bbc.co' in url_lower or 'news' in url_lower:
        return 'News'
    elif 'youtube.com' in url_lower:
        return 'Video'
    return 'Web Article'

def get_domain(url: str) -> str:
    try:
        from urllib.parse import urlparse
        domain = urlparse(url).netloc
        return domain.replace('www.', '')
    except:
        return url

def execute_web_search(query: str, max_results: int = 5) -> list:
    """Uses DuckDuckGo to perform a web search."""
    sources = []
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=max_results))
            for r in results:
                sources.append({
                    "title": r.get("title", ""),
                    "url": r.get("href", ""),
                    "domain": get_domain(r.get("href", "")),
                    "snippet": r.get("body", ""),
                    "type": get_source_type(r.get("href", ""))
                })
    except Exception as e:
        print(f"Search failed: {e}")
        # Fallback to a mock response if DDG blocks us
        sources = [
            {"title": f"Search result for {query}", "url": "https://example.com", "domain": "example.com", "snippet": "Search could not complete live.", "type": "Mock"}
        ]
        
    return sources


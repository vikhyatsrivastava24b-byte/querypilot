from fastapi import FastAPI

app = FastAPI(title="QueryPilot API")


@app.get("/")
def root():
    return {"message": "QueryPilot API is running"}
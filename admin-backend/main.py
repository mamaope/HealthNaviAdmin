import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.admin import router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api", tags=["Admin"])

@app.get("/")
async def root():
    return {"message": "HealthNaviAdmin Backend"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8083)
    # Run backend with: uvicorn main:app --reload --host 0.0.0.0 --port 8083

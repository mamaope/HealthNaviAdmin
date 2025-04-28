import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.admin import router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api", tags=["Admin"])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8083)
    # Run backend with: uvicorn app.main:app --reload --host 0.0.0.0 --port 8083

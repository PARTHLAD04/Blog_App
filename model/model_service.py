from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

pipe = pipeline(
    "text-generation",
    model="LiquidAI/LFM2.5-1.2B-Instruct",
    device_map="auto",
    dtype="auto"
)

class TripRequest(BaseModel):
    destination: str
    days: int
    budget: str          # low / medium / high
    month: str | None = None
    travelers: str | None = None

class BlogRequest(BaseModel):
    prompt: str

SYSTEM_PROMPT = """
You are a professional blog writer.
Write clear, SEO-friendly, well-structured content.
Use headings and conclusion.
"""

@app.post("/generate-blog")
def generate_blog(req: BlogRequest):

    final_prompt = f"""
{SYSTEM_PROMPT}

User Request:
{req.prompt}

Blog Content:
"""

    output = pipe(
        final_prompt,
        max_new_tokens=700,
        temperature=0.7,
        top_p=0.9,
        do_sample=True
    )

    return {
        "content": output[0]["generated_text"].replace(final_prompt, "").strip()
    }
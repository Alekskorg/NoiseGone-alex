from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import shutil
from utils.audio import separate_audio

TEMP_DIR = Path("temp_uploads")
OUTPUT_DIR = Path("static/output")
TEMP_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.post("/separate")
async def separate_endpoint(file: UploadFile = File(...)):
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Invalid file type.")

    temp_file_path = None
    try:
        temp_file_path = TEMP_DIR / file.filename
        with temp_file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        separated_files = separate_audio(temp_file_path, OUTPUT_DIR)

        base_url = "http://localhost:8000" # Заменить на публичный URL
        vocal_url = f"{base_url}/static/output/{separated_files.get('vocals')}"
        instrumental_url = f"{base_url}/static/output/{separated_files.get('instrumental')}"
        
        return {
            "vocalUrl": vocal_url,
            "instrumentalUrl": instrumental_url
        }
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")
    finally:
        if temp_file_path and temp_file_path.exists():
            temp_file_path.unlink()

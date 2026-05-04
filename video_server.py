"""
video_server.py — HTTP-сервер для генерации видео через CogVideoX-2b
Запуск: python video_server.py
Порт: 8765
"""

import os
import uuid
import time
import logging
import threading
from flask import Flask, request, jsonify
import torch
from diffusers import CogVideoXPipeline
from diffusers.utils import export_to_video

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

app = Flask(__name__)

API_KEY = os.environ.get("VIDEO_API_KEY", "change-me-secret")
OUTPUT_DIR = os.environ.get("OUTPUT_DIR", "/tmp/videos")
os.makedirs(OUTPUT_DIR, exist_ok=True)

log.info("Загружаю модель CogVideoX-2b (CPU)...")
pipe = CogVideoXPipeline.from_pretrained(
    "THUDM/CogVideoX-2b",
    torch_dtype=torch.float32,
)
pipe.enable_model_cpu_offload()
pipe.vae.enable_tiling()
pipe.vae.enable_slicing()
log.info("Модель загружена")

jobs: dict[str, dict] = {}
lock = threading.Lock()


def require_api_key(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        key = request.headers.get("X-API-Key") or request.args.get("api_key")
        if key != API_KEY:
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated


def generate_job(job_id: str, prompt: str, num_frames: int, fps: int, guidance_scale: float, num_steps: int):
    try:
        with lock:
            jobs[job_id]["status"] = "processing"

        log.info(f"[{job_id}] Генерирую: {prompt[:60]}")
        start = time.time()

        video = pipe(
            prompt=prompt,
            num_frames=num_frames,
            guidance_scale=guidance_scale,
            num_inference_steps=num_steps,
        ).frames[0]

        output_path = os.path.join(OUTPUT_DIR, f"{job_id}.mp4")
        export_to_video(video, output_path, fps=fps)

        elapsed = round(time.time() - start, 1)
        log.info(f"[{job_id}] Готово за {elapsed}с -> {output_path}")

        with lock:
            jobs[job_id].update({
                "status": "done",
                "file": output_path,
                "url": f"/video/{job_id}",
                "elapsed_sec": elapsed,
            })

    except Exception as e:
        log.error(f"[{job_id}] Ошибка: {e}")
        with lock:
            jobs[job_id].update({"status": "error", "error": str(e)})


@app.route("/generate", methods=["POST"])
@require_api_key
def generate():
    data = request.get_json(force=True) or {}
    prompt = data.get("prompt", "").strip()
    if not prompt:
        return jsonify({"error": "prompt обязателен"}), 400

    num_frames = int(data.get("num_frames", 49))
    fps = int(data.get("fps", 8))
    guidance_scale = float(data.get("guidance_scale", 6.0))
    num_steps = int(data.get("num_steps", 50))

    job_id = str(uuid.uuid4())[:8]
    with lock:
        jobs[job_id] = {"status": "queued", "prompt": prompt, "created_at": time.time()}

    thread = threading.Thread(
        target=generate_job,
        args=(job_id, prompt, num_frames, fps, guidance_scale, num_steps),
        daemon=True,
    )
    thread.start()

    return jsonify({"job_id": job_id, "status": "queued"})


@app.route("/status/<job_id>", methods=["GET"])
@require_api_key
def status(job_id: str):
    job = jobs.get(job_id)
    if not job:
        return jsonify({"error": "Задача не найдена"}), 404
    return jsonify({"job_id": job_id, **job})


@app.route("/video/<job_id>", methods=["GET"])
@require_api_key
def download(job_id: str):
    from flask import send_file
    job = jobs.get(job_id)
    if not job or job["status"] != "done":
        return jsonify({"error": "Видео не готово"}), 404
    return send_file(job["file"], mimetype="video/mp4", as_attachment=True, download_name=f"{job_id}.mp4")


@app.route("/jobs", methods=["GET"])
@require_api_key
def list_jobs():
    with lock:
        result = {jid: {k: v for k, v in j.items() if k != "file"} for jid, j in jobs.items()}
    return jsonify(result)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "jobs": len(jobs)})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8765))
    log.info(f"Сервер запущен на порту {port}")
    app.run(host="0.0.0.0", port=port, threaded=True)

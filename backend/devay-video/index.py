import json
import os
import urllib.request

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
}

def handler(event: dict, context) -> dict:
    """Запуск генерации видео через CogVideoX на VPS. Возвращает job_id для последующей проверки статуса."""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    raw_body = event.get('body') or '{}'
    body = json.loads(raw_body) if isinstance(raw_body, str) else raw_body
    prompt = body.get('prompt', '').strip()
    num_frames = int(body.get('num_frames', 49))
    fps = int(body.get('fps', 8))
    guidance_scale = float(body.get('guidance_scale', 6.0))
    num_steps = int(body.get('num_steps', 50))

    if not prompt:
        return {
            'statusCode': 400,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'prompt is required'})
        }

    vps_url = os.environ['VPS_VIDEO_URL']
    api_key = os.environ['VIDEO_API_KEY']

    payload = json.dumps({
        'prompt': prompt,
        'num_frames': num_frames,
        'fps': fps,
        'guidance_scale': guidance_scale,
        'num_steps': num_steps,
    }).encode('utf-8')

    req = urllib.request.Request(
        f'{vps_url}/generate',
        data=payload,
        headers={
            'Content-Type': 'application/json',
            'X-API-Key': api_key,
        },
        method='POST'
    )

    with urllib.request.urlopen(req, timeout=30) as resp:
        result = json.loads(resp.read().decode('utf-8'))

    return {
        'statusCode': 200,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps({
            'job_id': result.get('job_id'),
            'status': result.get('status', 'queued'),
        })
    }
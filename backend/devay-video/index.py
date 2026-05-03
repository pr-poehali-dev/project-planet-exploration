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
    """Генерация видео через Wan2.1-T2V на VPS (CPU-режим, таймаут 30 мин)"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    prompt = body.get('prompt', '').strip()
    num_frames = body.get('num_frames', 49)
    fps = body.get('fps', 8)

    if not prompt:
        return {
            'statusCode': 400,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'prompt is required'})
        }

    vps_url = os.environ['VPS_VIDEO_URL']

    payload = json.dumps({
        'prompt': prompt,
        'num_frames': num_frames,
        'fps': fps
    }).encode('utf-8')

    req = urllib.request.Request(
        f'{vps_url}/generate',
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )

    with urllib.request.urlopen(req, timeout=1800) as resp:
        result = json.loads(resp.read().decode('utf-8'))

    return {
        'statusCode': 200,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps({
            'video_base64': result.get('video_base64', ''),
            'prompt': prompt
        })
    }

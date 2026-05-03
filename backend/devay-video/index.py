import json
import os
import urllib.request
import urllib.error
import time

FAL_API_URL = "https://queue.fal.run/fal-ai/wan/v2/1.3b/text-to-video"

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
}

def fal_request(url, data=None, method='GET'):
    api_key = os.environ['FAL_API_KEY']
    headers = {
        'Authorization': f'Key {api_key}',
        'Content-Type': 'application/json'
    }
    payload = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=payload, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode('utf-8'))

def handler(event: dict, context) -> dict:
    """Генерация видео через FAL.ai Wan2.1-T2V (очередь + polling)"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    prompt = body.get('prompt', '').strip()

    if not prompt:
        return {
            'statusCode': 400,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'prompt is required'})
        }

    submit = fal_request(FAL_API_URL, data={
        'prompt': prompt,
        'num_frames': 49,
        'frames_per_second': 8,
        'resolution': '480p',
        'num_inference_steps': 30
    }, method='POST')

    request_id = submit.get('request_id')
    if not request_id:
        raise ValueError(f"FAL did not return request_id: {submit}")

    status_url = f"https://queue.fal.run/fal-ai/wan/v2/1.3b/text-to-video/requests/{request_id}/status"
    result_url = f"https://queue.fal.run/fal-ai/wan/v2/1.3b/text-to-video/requests/{request_id}"

    for _ in range(60):
        time.sleep(5)
        status = fal_request(status_url)
        st = status.get('status')
        if st == 'COMPLETED':
            break
        if st == 'FAILED':
            raise RuntimeError(f"FAL generation failed: {status.get('error')}")

    result = fal_request(result_url)
    video_url = result.get('video', {}).get('url') or (result.get('videos') or [{}])[0].get('url', '')

    if not video_url:
        raise ValueError(f"No video URL in FAL response: {result}")

    video_req = urllib.request.Request(video_url)
    with urllib.request.urlopen(video_req, timeout=60) as vresp:
        import base64
        video_b64 = base64.b64encode(vresp.read()).decode('utf-8')

    return {
        'statusCode': 200,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps({'video_base64': video_b64, 'prompt': prompt})
    }

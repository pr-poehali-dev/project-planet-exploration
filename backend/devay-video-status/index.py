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
    """Проверка статуса задачи генерации видео на VPS. job_id передаётся как query-параметр."""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    job_id = params.get('job_id', '').strip()

    if not job_id:
        return {
            'statusCode': 400,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'job_id is required'})
        }

    vps_url = os.environ.get('VPS_VIDEO_URL', 'http://84.54.31.44:8765')
    api_key = os.environ['VIDEO_API_KEY']

    req = urllib.request.Request(
        f'{vps_url}/status/{job_id}',
        headers={'X-API-Key': api_key},
        method='GET'
    )

    with urllib.request.urlopen(req, timeout=15) as resp:
        result = json.loads(resp.read().decode('utf-8'))

    status = result.get('status', 'unknown')
    response_body = {
        'job_id': job_id,
        'status': status,
        'elapsed_sec': result.get('elapsed_sec'),
    }

    if status == 'done':
        video_url = f"{vps_url}/video/{job_id}?api_key={api_key}"
        response_body['video_url'] = video_url

    if status == 'error':
        response_body['error'] = result.get('error', 'unknown error')

    return {
        'statusCode': 200,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(response_body)
    }
import json
import os
import urllib.request

def handler(event: dict, context) -> dict:
    """Транскрибация аудио через Whisper large-v3 на VPS"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    audio_base64 = body.get('audio_base64', '')
    language = body.get('language', None)

    if not audio_base64:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'audio_base64 is required'})
        }

    vps_url = os.environ['VPS_AUDIO_URL']

    payload_data = {'audio_base64': audio_base64}
    if language:
        payload_data['language'] = language

    payload = json.dumps(payload_data).encode('utf-8')

    req = urllib.request.Request(
        f'{vps_url}/transcribe',
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )

    with urllib.request.urlopen(req, timeout=120) as resp:
        result = json.loads(resp.read().decode('utf-8'))

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'text': result.get('text', ''),
            'language': result.get('language', ''),
            'segments': result.get('segments', [])
        }, ensure_ascii=False)
    }
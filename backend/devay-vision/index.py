import json
import os
import urllib.request
import base64

def handler(event: dict, context) -> dict:
    """Генерация изображений через Playground v2.5 на VPS"""

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
    prompt = body.get('prompt', '')
    width = body.get('width', 1024)
    height = body.get('height', 1024)
    steps = body.get('steps', 25)

    if not prompt:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'prompt is required'})
        }

    vps_url = os.environ['VPS_VISION_URL']

    payload = json.dumps({
        'prompt': prompt,
        'width': width,
        'height': height,
        'steps': steps
    }).encode('utf-8')

    req = urllib.request.Request(
        f'{vps_url}/generate',
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
            'image_base64': result.get('image_base64', ''),
            'prompt': prompt
        })
    }
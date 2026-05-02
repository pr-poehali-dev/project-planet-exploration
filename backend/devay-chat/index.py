import json
import os
import urllib.request

def handler(event: dict, context) -> dict:
    """Обработчик чата DevayAI — проксирует запросы к Ollama на VPS (v4)"""

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

    body = json.loads(event.get('body', '{}'))
    messages = body.get('messages', [])
    model = body.get('model', 'qwen2.5:7b')

    ollama_url = os.environ['OLLAMA_URL']

    payload = json.dumps({
        'model': model,
        'messages': messages,
        'stream': False
    }).encode('utf-8')

    req = urllib.request.Request(
        f'{ollama_url}/api/chat',
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )

    with urllib.request.urlopen(req, timeout=85) as resp:
        result = json.loads(resp.read().decode('utf-8'))

    reply = result.get('message', {}).get('content', '')

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'reply': reply, 'model': model})
    }
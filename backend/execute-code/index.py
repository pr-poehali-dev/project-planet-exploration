import json
import os
import subprocess
import tempfile
import sys


def handler(event: dict, context) -> dict:
    """Выполняет Python-код в изолированном процессе и возвращает stdout/stderr"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body', '{}'))
    code = body.get('code', '')

    if not code.strip():
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Код не передан'})
        }

    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(code)
        tmp_path = f.name

    try:
        result = subprocess.run(
            [sys.executable, tmp_path],
            capture_output=True,
            text=True,
            timeout=30
        )
        stdout = result.stdout
        stderr = result.stderr
        returncode = result.returncode
    except subprocess.TimeoutExpired:
        stdout = ''
        stderr = 'Ошибка: превышен лимит времени выполнения (30 секунд)'
        returncode = 1
    finally:
        os.unlink(tmp_path)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'stdout': stdout,
            'stderr': stderr,
            'returncode': returncode
        }, ensure_ascii=False)
    }

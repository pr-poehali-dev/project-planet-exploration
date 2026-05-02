import json
import hashlib
import os

USERS = {
    "test@test": hashlib.sha256("test@test".encode()).hexdigest()
}

SESSION_TOKEN = hashlib.sha256(b"devay-secret-session-2026").hexdigest()

def handler(event: dict, context) -> dict:
    """Авторизация пользователей DevayAI"""

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
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')

    if not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Введите email и пароль'})
        }

    password_hash = hashlib.sha256(password.encode()).hexdigest()

    if USERS.get(email) != password_hash:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный email или пароль'})
        }

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'token': SESSION_TOKEN, 'email': email})
    }

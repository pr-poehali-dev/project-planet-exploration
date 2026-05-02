import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет заявку с сайта devay.ru на почту support@devay.ru"""

    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    email = body.get("email", "").strip()
    company = body.get("company", "").strip()
    message = body.get("message", "").strip()
    product = body.get("product", "devay.ru").strip()

    if not name or not email:
        return {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "name and email are required"}),
        }

    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    to_email = "support@devay.ru"
    from_email = "support@devay.ru"

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #1a1a1a;">
      <h2 style="color: #00ffd1; border-bottom: 2px solid #00ffd1; padding-bottom: 8px;">
        Новая заявка с devay.ru
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr><td style="padding: 8px 0; color: #666; width: 120px;">Продукт:</td>
            <td style="padding: 8px 0; font-weight: bold;">{product}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Имя:</td>
            <td style="padding: 8px 0;">{name}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:{email}" style="color: #00ffd1;">{email}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Компания:</td>
            <td style="padding: 8px 0;">{company or "—"}</td></tr>
      </table>
      {"<h3 style='margin-top: 20px;'>Комментарий:</h3><p style='background: #f5f5f5; padding: 12px; border-radius: 8px;'>" + message + "</p>" if message else ""}
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Новая заявка: {product} от {name}"
    msg["From"] = from_email
    msg["To"] = to_email
    msg["Reply-To"] = email

    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.yandex.ru", 465, timeout=10) as server:
            server.login(from_email, smtp_password)
            server.sendmail(from_email, to_email, msg.as_string())
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": str(e)}),
        }

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"ok": True}),
    }

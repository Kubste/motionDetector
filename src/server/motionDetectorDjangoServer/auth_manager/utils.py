from decouple import config
import smtplib, ssl
from email.mime.text import MIMEText

def send_email_code(email, code):

    EMAIL_BODY = f"""Your code to change password: {code}"""

    context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL(config('EMAIL_SERVER'), int(config('EMAIL_PORT')), context=context) as server:
            server.login(config('EMAIL'), config('PASSWORD'))

            msg = MIMEText(EMAIL_BODY, "plain")
            # msg['Subject'] = config('EMAIL_SUBJECT')
            msg['Subject'] = "Password change code"
            msg['From'] = config('EMAIL')
            msg['To'] = email
            server.sendmail(config('EMAIL'), email, msg.as_string())

    except Exception as e:
        print(f"Error: {e}", flush=True)
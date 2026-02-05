import requests

BASE = 'http://127.0.0.1:8000/api'
session = requests.Session()

# Get CSRF token
r = session.get(BASE + '/auth/csrf/')
print('GET /auth/csrf/ status:', r.status_code)
print('Response body:', r.text)

# Extract token
try:
    token = r.json().get('csrfToken')
except Exception as e:
    token = None
print('CSRF token:', token)

# Prepare login
headers = {'Content-Type': 'application/json'}
if token:
    headers['X-CSRFToken'] = token

payload = {'username': 'admin', 'password': 'admin123'}

r2 = session.post(BASE + '/auth/login/', json=payload, headers=headers)
print('\nPOST /auth/login/ status:', r2.status_code)
print('Response headers:', r2.headers)
print('Response body:', r2.text)

# Also show cookies
print('\nCookies after login attempt:')
for k, v in session.cookies.items():
    print(k, v)

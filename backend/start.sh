#!/bin/bash

echo "🚀 Starting Backend Setup..."

# Run migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Start Gunicorn with PORT environment variable support
PORT=${PORT:-8000}
exec gunicorn spicehub.wsgi:application --bind 0.0.0.0:$PORT --workers 3 --timeout 120

FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project
COPY . /app/

# Make start script executable
RUN chmod +x /app/start.sh || true

# Collect static files
RUN python manage.py collectstatic --noinput || true

# Run migrations (optional, can be done separately)
# RUN python manage.py migrate

EXPOSE 8000

# Use start script that supports PORT environment variable
CMD ["/bin/bash", "-c", "python manage.py migrate --noinput && gunicorn spicehub.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 3 --timeout 120"]

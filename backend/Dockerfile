# Base Image
FROM python:3.13-slim

# Working Directory
WORKDIR /app

# Copy requirements first
COPY requirements.txt .

# Install Python packages and gunicorn
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy entire backend
COPY . .

# Expose Flask Port
EXPOSE 5000

# Start Gunicorn server (production ready)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:create_app()"]
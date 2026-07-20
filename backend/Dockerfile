# Base Image
FROM python:3.13-slim

# Working Directory
WORKDIR /app

# Copy requirements first
COPY requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy entire backend
COPY . .

# Expose Flask Port
EXPOSE 5000

# Start Flask
CMD ["python", "app.py"]
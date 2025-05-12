#!/bin/bash

# Exit on any error
set -e

echo "Starting deployment at $(date)"

# Pull the latest changes
echo "Pulling latest changes..."
git pull

# Pull the latest frontend image
echo "Pulling latest frontend image..."
docker pull richkitibwa/healthnavi-admin-frontend:latest

# Build and start the production containers
echo "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

echo "Building containers..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

# Verify containers are running
echo "Verifying deployment..."
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "Deployment successful! Containers are running."
    echo "Container status:"
    docker ps
else
    echo "Error: Some containers are not running. Check logs with: docker-compose -f docker-compose.prod.yml logs"
    exit 1
fi

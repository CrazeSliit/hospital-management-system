#!/bin/bash

# Build script for Netlify deployment
echo "Starting build process..."

# Install dependencies
npm ci

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Build the Next.js application
echo "Building Next.js application..."
npm run build

echo "Build completed successfully!"

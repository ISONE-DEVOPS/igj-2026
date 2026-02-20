FROM node:16-bullseye-slim

WORKDIR /app

# Install dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (AdonisJS 4 needs some dev deps for boot)
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Create minimal .env for AdonisJS boot (actual values come from Cloud Run env vars)
RUN echo "APP_KEY=placeholder" > .env

# Expose port
EXPOSE 3333

# Start server
CMD ["node", "server.js"]

# Use slim version of Node.js 20
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install dependencies required for Prisma (OpenSSL, etc.)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies (ensure 'express' etc. are installed)
RUN npm install

# Copy rest of the code
COPY . .

# Generate Prisma Client (after schema is available)
RUN npx prisma generate

# Expose app port
EXPOSE 5000

# Start the app using NODE_OPTIONS for ESM module resolution
CMD ["node", "--experimental-specifier-resolution=node", "server.js"]

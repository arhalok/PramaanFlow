FROM node:20-alpine

WORKDIR /app

# Install dependencies first for efficient caching
COPY package.json ./
RUN npm install

# Copy application code
COPY . .

# Expose Next.js server port
EXPOSE 3000
ENV PORT=3000

# Start development server with hot-reload
CMD ["npm", "run", "dev"]

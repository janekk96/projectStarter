# frontend/Dockerfile
FROM node:22

WORKDIR /app

COPY package.json .

RUN npm install --omit=optional --silent

RUN npm install @rollup/rollup-linux-arm64-gnu

COPY . .

EXPOSE 5173

# Generate config.js from environment variables and start the dev server
CMD ["sh", "-c", "chmod +x ./generate-config.sh && ./generate-config.sh && npm run dev -- --host 0.0.0.0"]
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./

# Clear npm cache and remove any existing node_modules and package-lock
RUN rm -rf node_modules package-lock.json || true && npm cache clean --force

# Install dependencies with platform-specific flags
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

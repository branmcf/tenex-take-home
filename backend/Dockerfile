FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

# Ensure dev dependencies are installed even if NODE_ENV=production.
RUN npm ci --include=dev

COPY tsconfig.json ./

# This repo doesn't use a `src/` directory; TypeScript lives in these folders.
COPY index.ts ./index.ts
COPY app ./app
COPY errors ./errors
COPY lib ./lib
COPY middleware ./middleware
COPY server ./server
COPY migrations ./migrations
COPY scripts ./scripts
COPY types ./types
COPY utils ./utils
COPY codegen.ts ./codegen.ts

# Copy public assets (HTML files, favicon, etc.) for the build step
COPY public ./public

RUN npm run build

EXPOSE 3026

CMD ["sh", "-c", "npm run migrate:up && npm run start"]

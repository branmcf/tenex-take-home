FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY tsconfig.json ./

# This repo doesn't use a `src/` directory; TypeScript lives in these folders.
COPY index.ts ./index.ts
COPY app ./app
COPY errors ./errors
COPY lib ./lib
COPY middleware ./middleware
COPY server ./server
COPY migrations ./migrations
COPY types ./types
COPY utils ./utils
COPY codegen.ts ./codegen.ts

# `npm run build` expects a `public/` directory to exist (it copies it into dist/)
RUN mkdir -p public

RUN npm run build

EXPOSE 3000

# Use `tsx` (via `npm run start`) so our extensionless/directory-style imports work in ESM.
CMD ["npm", "run", "start"]

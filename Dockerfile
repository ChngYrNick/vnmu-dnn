FROM node:22.14.0-slim AS dev
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:22.14.0-slim AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22.14.0-slim
WORKDIR /usr/src/app
RUN adduser --system --group app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY --from=build /usr/src/app/dist ./dist
RUN mkdir -p ./data ./uploads ./static_out && chown -R app:app ./data ./uploads ./static_out
USER app
EXPOSE 3000
CMD ["sh", "-c", "cp -r dist/public/* static_out/ && node src/main.js"]

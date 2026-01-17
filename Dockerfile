FROM node:22.14.0-slim AS dev
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:22.14.0-slim AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:22.14.0-slim
WORKDIR /usr/src/app
RUN adduser --system --group app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
COPY --from=build /usr/src/app/dist ./dist
RUN mkdir -p ./data ./uploads && chown app:app ./data ./uploads
USER app
EXPOSE 3000
CMD ["npm", "start"]

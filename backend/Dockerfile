FROM node:18-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM node:18-slim AS prod

RUN useradd -m -r nodeusr

WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force


COPY --from=build /app/dist ./dist


ENV NODE_ENV=production \
    PORT=5000
EXPOSE 5000

USER nodeusr

CMD ["npm", "run", "start:prod"]

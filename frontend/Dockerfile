FROM node:18-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM node:18-slim AS prod

RUN useradd -m -r nodeusr
WORKDIR /app

RUN npm install -g serve && npm cache clean --force

COPY --from=build /app/dist ./dist

USER nodeusr
ENV PORT=3000
EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]

FROM node:18-buster-slim AS builder

WORKDIR /app
COPY package.json package-lock.json ./
COPY public/ public/
COPY src/ src/
RUN npm ci
RUN npm run build

FROM nginx:1.23.2-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
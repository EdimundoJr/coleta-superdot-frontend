# -- BUILDING --
FROM node:18-alpine AS builder

RUN mkdir /app
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# -- SERVING --
FROM nginx:stable-alpine AS runner
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
# -- BUILDING --
FROM node:20-alpine AS builder

RUN mkdir /app
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build --force

# -- SERVING --
FROM nginx:stable-alpine AS runner
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
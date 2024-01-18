# Build stage
FROM node:20 AS build

WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .
RUN npm run build
RUN ls -la /app/dist

# Runtime stage
FROM nginx:stable-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
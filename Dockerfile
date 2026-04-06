# Bước 1: Build Angular application (Node.js)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Bước 2: Chạy Nginx Server để phục vụ giao diện tĩnh
FROM nginx:alpine
# Copy cấu hình Nginx SPA Routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy thư mục build của Angular (tuỳ thuộc vào phiên bản Angular 17+ thì output có dạng /browser)
# Tên project trong angular.json là 'clothes-ui'
COPY --from=build /app/dist/clothes-ui/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

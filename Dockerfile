# Sử dụng Node.js image
FROM node:18-alpine

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Chạy ứng dụng React ở chế độ production
RUN npm run build

# Sử dụng một web server nhỏ gọn để chạy ứng dụng
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Expose cổng 3000
EXPOSE 3000

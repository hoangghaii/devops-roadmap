# Docker Compose

## 1. Cấu Trúc File `docker-compose.yml`

Khái niệm          Mô tả
version            Phiên bản cú pháp Compose.
services           Định nghĩa các Container (vd: api, mongo).
volumes            Định nghĩa các Volume để lưu trữ dữ liệu bền vững.
networks           Định nghĩa các mạng riêng cho các service giao tiếp.

```yml
# docker-compose.yml
version: '3.8'  # Phiên bản
services:       # Nơi khai báo các container
  web:
    image: nginx
  db:
    image: postgres
volumes:        # Nơi khai báo volumes dùng chung
  db-data:
networks:       # Nơi khai báo networks
  app-net:
```

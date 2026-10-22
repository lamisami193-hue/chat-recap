FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /usr/share/nginx/html/index.html
ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf", "-g", "daemon off;"]

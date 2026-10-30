FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the whole static site (every language, legal page, guide, icon and 404.html).
# Files that must not be shipped are listed in .dockerignore.
COPY . /usr/share/nginx/html/

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf", "-g", "daemon off;"]

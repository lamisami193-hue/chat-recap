FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the complete static site, including every language and legal page.
COPY index.html sitemap.xml robots.txt favicon.svg /usr/share/nginx/html/
COPY about/ /usr/share/nginx/html/about/
COPY privacy/ /usr/share/nginx/html/privacy/
COPY terms/ /usr/share/nginx/html/terms/
COPY ar/ /usr/share/nginx/html/ar/
COPY es/ /usr/share/nginx/html/es/
COPY fr/ /usr/share/nginx/html/fr/
COPY pt/ /usr/share/nginx/html/pt/

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf", "-g", "daemon off;"]

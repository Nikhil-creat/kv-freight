FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html style.css app.js /usr/share/nginx/html/
EXPOSE 8080
HEALTHCHECK CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1

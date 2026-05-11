FROM nginx:1.27-alpine

COPY ./index.html /usr/share/nginx/html/

COPY ./js /usr/share/nginx/html/js
COPY ./styles /usr/share/nginx/html/styles
COPY ./img /usr/share/nginx/html/img
COPY ./fonts /usr/share/nginx/html/fonts

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
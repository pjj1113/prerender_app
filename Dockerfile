FROM harbor.aukid.net/base/nginx:1.16.1

RUN mkdir -p /var/www/html
WORKDIR /var/www/html
ADD dist/ ./
ADD nginx.template /etc/nginx/conf.d
RUN echo "Asia/Shanghai" > /etc/timezone
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
ENV TZ='Asia/Shanghai'
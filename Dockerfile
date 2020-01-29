FROM node:11.12.0-stretch

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    nano

COPY bootstrap.sh /bootstrap.sh
RUN chmod a+x /bootstrap.sh

WORKDIR /usr/src/app

VOLUME ["/usr/src/app"]

EXPOSE 80

ENTRYPOINT ["/bootstrap.sh"]
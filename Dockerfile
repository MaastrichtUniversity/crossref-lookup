FROM node:7.4.0

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    nano

COPY bootstrap.sh /bootstrap.sh
RUN chmod a+x /bootstrap.sh

WORKDIR /usr/src/app

VOLUME ["/usr/src/app"]

EXPOSE 80

CMD /bootstrap.sh
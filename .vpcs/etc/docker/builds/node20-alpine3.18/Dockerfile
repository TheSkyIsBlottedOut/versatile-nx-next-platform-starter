FROM alpine:3.18 as build-dev
ENV NODE_VERSION 20.12.2
WORKDIR /var/groupon
COPY . .
RUN source .envrc  && vpcs install docker-node
COPY docker-entrypoint.sh .vpcs/bin
CMD [ "/bin/bash" ]
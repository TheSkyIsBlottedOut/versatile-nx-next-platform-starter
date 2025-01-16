FROM alpine:3.19 AS build-dev
ENV NODE_VERSION 22.6.0
WORKDIR /app
COPY . .
COPY .envrc .envrc
COPY .vpcs/ .vpcs/
ENV PATH "$PATH:/app/.vpcs/bin"
RUN .vpcs/deploy/docker-init.sh
ENTRYPOINT  "run.sh"; "/bin/bash"
CMD [ "vpcs", "serve" ]
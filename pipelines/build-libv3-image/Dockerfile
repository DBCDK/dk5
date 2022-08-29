ARG BASEIMAGE=docker-dbc.artifacts.dbccloud.dk/dbc-java11:latest
# ---- Base Node ----
FROM  $BASEIMAGE AS build

# Install curl, marcunicode, dump_v3, marctool, unicode library packages
RUN apt-install \
    curl \
    unzip

# fetch rrdump
RUN curl -sL http://mavenrepo.dbc.dk/content/repositories/releases/dk/dbc/rawrepo-dump-tool/1.0.7/rawrepo-dump-tool-1.0.7.jar -o rrdump.jar && unzip -op rrdump.jar rrdump.sh | bash -s -- --install

RUN pwd && ls -la /root/.rrdump && ls -la /root/.rrdump/bin && chmod 777 /root/.rrdump/bin/* && chmod 777 /root/.rrdump/archive/*

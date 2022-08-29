ARG BASEIMAGE=docker-dbc.artifacts.dbccloud.dk/dbc-jessie:latest
# ---- Base Node ----
FROM  $BASEIMAGE AS build

# Install curl, marcunicode, dump_v3, marctool, unicode library packages
RUN apt-install \
    curl \
    marcunicode-dbc-2013-5 \
    bifappl-dbc-2013-5 \
    marctool-dbc-2013-5 \
    libicu-dev \
    unzip \
    jessie-backports \
    openjdk-8-jdk

# fetch rrdump
RUN curl -sL http://mavenrepo.dbc.dk/content/repositories/releases/dk/dbc/rawrepo-dump-tool/1.0.7/rawrepo-dump-tool-1.0.7.jar -o rrdump.jar && unzip -op rrdump.jar rrdump.sh | bash -s -- --install


ARG BASEIMAGE=docker-dbc.artifacts.dbccloud.dk/dbc-jessie:latest
# ---- Base Node ----
FROM  $BASEIMAGE AS build

# Install marcunicode, dump_v3, marctool, unicode library packages
RUN apt-install \
    curl \
    marcunicode-dbc-2013-5 \
    bifappl-dbc-2013-5 \
    marctool-dbc-2013-5 \
    libicu-dev

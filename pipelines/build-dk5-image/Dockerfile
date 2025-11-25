
ARG NODE_BASEIMAGE=docker-dbc.artifacts.dbccloud.dk/dbc-node:latest
# ---- Build Stage (internal latest) ----
FROM $NODE_BASEIMAGE AS build
ENV NODE_OPTIONS=--openssl-legacy-provider
WORKDIR /home/node/app
COPY . .
COPY .babelrc .

ENV CI=true

RUN set -eux; \
    echo "Base image resolved to: $NODE_BASEIMAGE"; \
    echo "Node version in build stage:"; node -v | tee NODE_VERSION; \
    npm set progress=false && npm config set depth 0 && \
    npm install --omit=dev --legacy-peer-deps && \
    mkdir prod_build && \
    cp -R --preserve=links node_modules prod_build/node_modules && \
    npm install --legacy-peer-deps && \
    npm run build

FROM node:20.14-alpine3.21 AS release
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV BABEL_CACHE_PATH=~/app/babel.cache.json
WORKDIR /home/node/app

# Upgrade to the latest patch version and update system packages to reduce vulnerabilities
RUN apk update && \
    apk upgrade --available && \
    rm -rf /var/cache/apk/*
COPY --chown=node:node --from=build /home/node/app/checkElasticsearch.sh .
COPY --chown=node:node --from=build /home/node/app/package.json .
COPY --chown=node:node --from=build /home/node/app/.babelrc .
COPY --chown=node:node --from=build /home/node/app/prod_build ./
COPY --chown=node:node --from=build /home/node/app/public ./public
COPY --chown=node:node --from=build /home/node/app/src ./src
COPY --chown=node:node --from=build /home/node/app/static ./static
COPY --chown=node:node --from=build /home/node/app/NODE_VERSION ./NODE_VERSION
EXPOSE 3000 3001
CMD ["node", "-r", "@babel/register", "src/main.js"]

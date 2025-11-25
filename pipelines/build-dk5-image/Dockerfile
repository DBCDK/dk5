
ARG NODE_BASEIMAGE=docker-dbc.artifacts.dbccloud.dk/dbc-node:latest
# ---- Base Node ----
FROM node:20.14 AS build
ENV UV_THREADPOOL_SIZE=1
RUN apt-get update || true
RUN apt-get install -y --no-install-recommends gnupg
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 6ED0E7B82643E131 78DBA3BC47EF2265 F8D2585B8783D481 54404762BBB6E853 BDE6D2B9216EC7A8 || true
RUN apt-get update
RUN apt-get install -y libc6 libgcc1 libstdc++6 python3 make g++
RUN rm -rf /var/lib/apt/lists/*
ENV NODE_OPTIONS=--openssl-legacy-provider
WORKDIR /home/node/app
COPY . .
COPY .babelrc .

ENV CI=true

RUN npm set progress=false && npm config set depth 0 && \
    npm install --omit=dev --legacy-peer-deps && \
    mkdir prod_build && \
    cp -R --preserve=links node_modules prod_build/node_modules && \
    npm install --legacy-peer-deps && \
    npm run build
    
FROM node:20-alpine AS release
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
EXPOSE 3000 3001
CMD ["node", "-r", "@babel/register", "src/main.js"]

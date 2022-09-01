ARG BASEIMAGE=docker-dbc.artifacts.dbccloud.dk/dbc-node:12
# ---- Base Node ----
FROM  $BASEIMAGE AS build
# set working directory
WORKDIR /home/node/app
## copy project file
COPY . .
COPY .babelrc .

ENV CI=true

# install node packages
RUN npm set progress=false && npm config set depth 0 && \
    npm install --only=production && \
    mkdir prod_build && \
    cp -R --preserve=links node_modules prod_build/node_modules && \
    npm install && \
    npm run build

# ---- Release ----
FROM $BASEIMAGE AS release
ENV  BABEL_CACHE_PATH=~/app/babel.cache.json
WORKDIR /home/node/app
COPY --chown=node:node --from=build /home/node/app/checkElasticsearch.sh .
COPY --chown=node:node --from=build /home/node/app/package.json .
COPY --chown=node:node --from=build /home/node/app/.babelrc .
COPY --chown=node:node --from=build /home/node/app/prod_build ./
COPY --chown=node:node --from=build /home/node/app/public ./public
COPY --chown=node:node --from=build /home/node/app/src ./src
COPY --chown=node:node --from=build /home/node/app/static ./static
# Install environment
RUN apt-install \
    procps \
    default-jre \
    unzip \
    apt-transport-https
# Install elasticsearch
RUN echo "deb https://artifacts.elastic.co/packages/5.x/apt stable main" | tee /etc/apt/sources.list.d/elastic-5.x.list && \
    apt-install \
    elasticsearch
EXPOSE 3000 3001
CMD node src/main.js
#CMD service elasticsearch start && \
#    ./checkElasticsearch.sh && \
#    node src/main.js

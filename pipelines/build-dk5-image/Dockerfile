FROM node:10 AS build
WORKDIR /home/node/app
COPY . .
COPY .babelrc .

ENV CI=true

RUN npm set progress=false && npm config set depth 0 && \
    npm install --only=production && \
    mkdir prod_build && \
    cp -R --preserve=links node_modules prod_build/node_modules && \
    npm install && \
    npm run build

FROM node:10 AS release
ENV BABEL_CACHE_PATH=~/app/babel.cache.json
WORKDIR /home/node/app
COPY --chown=node:node --from=build /home/node/app/checkElasticsearch.sh .
COPY --chown=node:node --from=build /home/node/app/package.json .
COPY --chown=node:node --from=build /home/node/app/.babelrc .
COPY --chown=node:node --from=build /home/node/app/prod_build ./
COPY --chown=node:node --from=build /home/node/app/public ./public
COPY --chown=node:node --from=build /home/node/app/src ./src
COPY --chown=node:node --from=build /home/node/app/static ./static
EXPOSE 3000 3001
CMD ["node", "-r", "@babel/register", "src/main.js"]

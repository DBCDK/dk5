# Moved to seperate job ...
ARG BASEIMAGE=docker-fbiscrum.artifacts.dbccloud.dk/dk5:latest
# ---- Base Node ----
FROM  $BASEIMAGE AS build
## retrieve data from artifactory
RUN curl -O https://artifactory.dbccloud.dk/artifactory/docker-fbiscrum/dk5-data/elastic_bulk_load.json
## Load data into elasticsearch
RUN service elasticsearch start && \
    ./checkElasticsearch.sh && \
    curl 'http://localhost:9200' && \
    curl -XDELETE 'localhost:9200/*' -H 'Content-Type: application/json' && \
    curl -XPUT 'localhost:9200/systematic' -H 'Content-Type: application/json' -d '{ "mappings":{ "dk5":{ "properties":{ "parent":{ "enabled":"false" } } } }, "settings": { "number_of_shards": 1 } }' && \
    curl -XPUT 'localhost:9200/register' -H 'Content-Type: application/json' -d '{ "settings":{ "analysis":{ "char_filter":{ "dk5":{ "type":"mapping", "mappings":[":=>kolon"] } }, "analyzer":{ "default":{ "type":"custom", "char_filter":["dk5"], "tokenizer":"standard", "filter":["lowercase"] } } }, "number_of_shards": 1 } }' && \
    curl -XPOST 'localhost:9200/_bulk?refresh=wait_for' -H 'Content-Type: application/json' --data-binary '@elastic_bulk_load.json' && \
    curl -XPUT 'localhost:9200/*/_settings' -H 'Content-Type: application/json' -d '{ "index": { "max_result_window": 50000 } }' && \
    service elasticsearch stop

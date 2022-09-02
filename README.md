# tanterne

[![Build Status](https://travis-ci.org/DBCDK/tanterne.svg?branch=master)](https://travis-ci.org/DBCDK/tanterne)
[![Greenkeeper badge](https://badges.greenkeeper.io/DBCDK/tanterne.svg)](https://greenkeeper.io/)
[![dependencies Status](https://david-dm.org/DBCDK/tanterne/status.svg)](https://david-dm.org/DBCDK/tanterne)
[![devDependencies Status](https://david-dm.org/DBCDK/tanterne/dev-status.svg)](https://david-dm.org/DBCDK/tanterne?type=dev)

## Releases
Releases are found at GitHub [/releases](https://github.com/DBCDK/tanterne/releases). Each containing a link to the changelog for the given release. A consolidated changelog for all releases is found at [CHANGELOG.md](https://github.com/DBCDK/tanterne/blob/master/CHANGELOG.md) in the project root.    
The changelog is made with [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator) and can be created with the command `github_changelog_generator -u DBCDK -p tanterne` -- you may need a valid GitHub token to run the command.

## Installation
### Elastic Search
Download Elastic Search, like: https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.6.1.tar.gz

Install and start it

### Get data
Records are dumped from cisterne with rrdump like:

`rrdump -m EXPANDED -f ISO -a 190007 -e UTF-8 -u http://rawrepo-record-service.cisterne.svc.cloud.dbc.dk -o dk5_total_iso2709`

### rrdump
* https://github.com/DBCDK/rawrepo-dump-tool

### Convert
* `iso2709ToElasticLoad -i dk5_total.iso2709 -o elastic_bulk_load.json`

Filter only one dk5 group like (for test purposes)
* `iso2709ToElasticLoad -f 13 -i dk5_total.iso2709 -o elastic_bulk_load.json`

### Load Elastic Search
* `curl -XDELETE 'localhost:9200/*' -H 'Content-Type: application/json'`
* `curl -XPUT 'localhost:9200/systematic' -H 'Content-Type: application/json' -d '{
  "mappings":{
    "dk5":{
      "properties":{
        "parent":{
          "enabled":"false"
        }
      }
    }
  },
  "settings": {
    "number_of_shards": 1
  }
}'`
* `curl -XPUT 'localhost:9200/register' -H 'Content-Type: application/json' -d '{
  "settings":{
    "analysis":{
      "char_filter":{
        "dk5":{
          "type":"mapping",
          "mappings":[":=>kolon"]
        }
      },
      "analyzer":{
        "default":{
          "type":"custom",
          "char_filter":["dk5"],
          "tokenizer":"standard",
          "filter":["lowercase"]
        }
      }
    },
    "number_of_shards": 1
  }
}'`
* `curl -XPOST 'localhost:9200/_bulk?refresh=wait_for' -H 'Content-Type: application/json' --data-binary '@elastic_bulk_load.json'`
* `curl -XPUT 'localhost:9200/*/_settings' -H 'Content-Type: application/json' -d '{
  "index": {
    "max_result_window": 50000
  }
}'`
 
## Development
After cloning the repository, run `npm install` to install dependencies. Copy test.env to env.env and set the environment variables (see below) to you need/liking. The application is started with `npm run dev`, which include [nodemon](https://www.npmjs.com/package/nodemon) in order to restart the application, when the code is changed.

When started, the application will spawn two versions of the user interface: pro and non-pro. The pro version contains a more advanced featureset targeted professional users, while the non-pro version is targeted endusers on the libraries and therefore exposes a more limited and focussed featureset.
The two versions will be available on the ports specified as environment variables. See [Environment variables](https://github.com/DBCDK/tanterne#environment-variables) for more info.

## Build and deploy
In pipelines buildjobs for the dk5 image, and build, dump and convert dk5-data is found.

Deploy jobs is found in DBC gitlab: dk5-deploy

Dataload for staging and prod is found in DBC gitlab: dk5-dataload

## Environment variables

The variables are specified at the form `name : internal config object`. References in the log from the startup, will use the internal config object.

- `APP_NAME` : `app.name`  
Default: `no name`

- `ELASTIC_HOST` : `elastic.host`  
host and port, like localhost:9200

- `ELASTIC_LOG` : `elastic.log`  
Set Elastic Search log level (trace, warning, error). default: error, warning

- `LOG_LEVEL` : `log.level`  
Specifies the log level used by the application. Defaults to `INFO`
Log level constants supported:: `OFF` (0), `ERROR` (1), `WARN` (2), `WARNING` (2), `INFO` (3), `DEBUG` (4), `TRACE` (5)

- `NEWRELIC_LICENSE_KEY` : not validated  
When given a valid license key the applicaion will report to New Relic and idetify itself as `Tanterne - DK5`. The given value in `NEWRELIC_LICENSE_KEY` is not not validated but if an invalid license key is given, the New Relic deamon wont start which happens silenty. 

- `NODE_ENV` : `app.env`  
When run in production the `NODE_ENV` should be set to `production`: `NODE_ENV=production`

- `PORT` : `app.port`  
Specifies the port to expose the application.

- `PRO_PORT` : `pro.port`  
Specifies the port to expose the pro-version of the application.
 
- `PRETTY_LOG` : `log.pretty`  
Set to `1` (`PRETTY_LOG=1`) for pretty printed log statements. Any other setting, will result in one-line log statements.

# Documentation
## Endpoints

- `/api/hierarchy/?q=india`

- `/api/list/?q=61.643,13.12`

- `/api/search/?q=india&limit=1&offset=0`

- `/api/suggest/?q=india`

# Architecture 
See [architecture.jpg](docs/architecture.jpg)

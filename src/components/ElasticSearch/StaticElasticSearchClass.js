import {ElasticClient} from './ElasticSearchClass';

const suggestions = require('./__mocks__/suggest.mock.json');
const searchResults = require('./__mocks__/search.mock.json');
const hierarchy = require('./__mocks__/hierarchy.mock.json');

export class StaticElasticClient extends ElasticClient {
  elasticPing() {
    return Promise.resolve(true);
  }

  elasticSearch(pars) {
    let res = [];
    if (pars && pars.query.indexOf('nothing') < 0) {
      res = searchResults;
    }

    return Promise.resolve(res);
  }

  elasticHierarchy(q) {
    let res = hierarchy;
    if (q === '0') {
      res = {}
    }

    return Promise.resolve(res);
  }

  elasticSuggest(q) {
    let res = {prefix: [], spell: []};
    if (q.indexOf('nothing') < 0) {
      res = suggestions;
    }

    return Promise.resolve(suggestions);
  }
}

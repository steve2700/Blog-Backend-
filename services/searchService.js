// services/searchService.js
const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({ node: 'http://localhost:9200' }); // Update with your Elasticsearch endpoint

module.exports = esClient;


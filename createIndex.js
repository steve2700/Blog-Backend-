// createIndex.js
const esClient = require('./services/searchService');

esClient.indices.create({
  index: 'posts',
  body: {
    mappings: {
      properties: {
        title: { type: 'text' },
        content: { type: 'text' },
        tags: { type: 'text' },
        // Add other fields as needed
      },
    },
  },
})
  .then(response => console.log('Index created:', response))
  .catch(error => console.error('Error creating index:', error));


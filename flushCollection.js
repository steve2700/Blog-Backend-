const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://nyaruwatastewart27:gogochuchu27@cluster0.dp11hk1.mongodb.net/?retryWrites=true&w=majority';

async function flushCollection() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('test');
    const collection = database.collection('users');

    // Delete all documents in the collection
    const result = await collection.deleteMany({});

    console.log(`${result.deletedCount} documents deleted from the collection.`);
  } finally {
    await client.close();
  }
}

flushCollection().catch(console.error);


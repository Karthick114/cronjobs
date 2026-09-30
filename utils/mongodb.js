const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';

const client = new MongoClient(uri);

async function getMongoDB() {
    await client.connect();

    return client.db('Thinktime');
}

async function closeMongoDB() {
    await client.close();
}

module.exports = {
    getMongoDB,
    closeMongoDB
};
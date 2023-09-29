const { MongoClient } = require('mongodb');

let dbconnection;

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect('mongodb://127.0.0.1:27017/login')
            .then((client) => {
                dbconnection = client.db();
                console.log('Connected to MongoDB');
                return cb();
            })
            .catch((err) => {
                console.error('Error connecting to MongoDB:', err);
                return cb(err);
            });
    },
    getDb: () => dbconnection,
};

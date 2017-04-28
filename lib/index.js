// dependencies
const cacheManager = require('cache-manager');
const mongoose = require('mongoose');

// Mongodb
const dbConfig = require('./config/database');

mongoose.connect(dbConfig.url, dbConfig.options).then(
    () => { return console.log('MongoDB is Ready'); },
    err => {
        return console.log(err);
    }
);

// Models
const Page = require('./models/page');

module.exports = {
    init: () => {
        this.cache = cacheManager.caching({
            store: mongooseCache
        });
    },

    beforePhantomRequest: (req, res, next) => {
        if(req.method !== 'GET') {
            return next();
        }

        this.cache.get(req.url, (err, result) => {
            if (!err && result) {
                res.send(200, result);
            } else {
                next();
            }
        });
    },

    afterPhantomRequest: (req, res, next) => {
        this.cache.set(req.url, req.prerender.documentHTML);
        next();
    }
};

const mongooseCache = {
    get: (url, callback) => {

        Page.findOne({ url : url }, (err, result) => {
                var content = result ? result.content : null;
                callback(err, content);
            });
    },
    set: (url, content, callback) => {

        Page.findOneAndUpdate(
                { url: url } //query
                , { $set: { url: url, content: content }, $setOnInsert: { creationDate: new Date() }} //document
                , { upsert: true, new: true } //option: insert if not exist and return updated
                , (err, result) => {               
                    if(err) console.log(err);
            });
    }
};



var CrossRef = require('crossref');
var http = require('http');
var Router = require('node-router');
const NodeCache = require( "node-cache" );


var router = Router();
const cache = new NodeCache();

router.push('GET', '/works', works);
router.push('GET', '/stats', stats);
router.push(errorHandler);

process.on('SIGINT', function() {
    process.exit();
});

var server = http.createServer(router).listen(80);

function works(req, res, next) {
    var doi = req.path.replace("/works/", "");

    if ( doi === "" ) {
        next()
    }

    if ( val === undefined ) {
        CrossRef.work(doi, function(err, i) {
            cache.set(req.query.doi, i, ttlJitter());
            res.send(i);
        });
    } else {
        res.send(val)
    }
}

function stats(req, res, next) {
    console.log(cache.getStats());
    res.end()
}

function errorHandler(err, req, res, next) {
    res.send(err);
}

function ttlJitter() {
    // https://en.wikipedia.org/wiki/Thundering_herd_problem
    // Between 10 and 18 days
    return 60 * 60 * 24 * ( 10 + Math.floor(Math.random() * 8) + 1 )
}
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

    if ( doi === undefined || doi === "" ) {
        next()
    }

    var val = cache.get(doi);

    if ( val === undefined ) {
        CrossRef.work(doi, function(err, obj) {

            if ( err != null ) {
                console.warn("Could not retrieve work from CrossRef. Error: " + err.message);
                res.send(obj);
                return 1
            }

            if ( obj == null ){
                console.warn("Could not retrieve work from CrossRef. Unknown error.");
                res.send(obj);
                return 1
            }

            // Use the retrieved DOI in the cache, not the requested DOI
            // as that will be used later on to re query the cache
            cache.set(obj.DOI, obj, ttlJitter());

            res.send(obj);

            return 0
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
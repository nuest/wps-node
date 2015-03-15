var express = require('express');
var bodyParser = require("body-parser");
var path = require('path');
var favicon = require('serve-favicon');

// https://www.npmjs.com/package/npmlog and https://nodejs.org/api/util.html#util_util_format_format
var log = require('npmlog');

var wps = require('./wps');

var publicDir = path.join(__dirname, '..', 'public');
log.info("wps", "publicDir = %s", publicDir);

function start() {
    var app = express();
    app.use(function (request, response, next) {
        log.verbose("wps", '[%d]: %s', Date.now(), request);
        var contentType = request.headers['content-type'] || '';
        var mime = contentType.split(';')[0];

        log.verbose("wps", 'content-type = %s | mime =  %s', contentType, mime);

        if (mime === 'text/xml' || mime === 'application/xml') {
            log.info("wps", "Processing raw XML...")
            var data = '';
            request.setEncoding('utf8');
            request.on('data', function (chunk) {
                data += chunk;
            });
            request.on('end', function () {
                request.rawBody = data;
                log.info("wps", "raw body: %s", request.rawBody)
                next();
            });
        } else {
            return next();
        }
    });

    app.use(favicon(path.join(__dirname, '..', 'public', 'images', 'favicon.ico')));
    //app.use(bodyParser.urlencoded({extended: false}));
    app.use(express.compress());
    app.use(express.static(publicDir));

    //app.use(express.bodyParser());

    app.get("/service", function (request, response) {
        var service = request.query.service.toLowerCase();
        if (service != wps.service) {
            wps.error("Unsupported service '" + service + "'", response);
        }

        version = typeof version !== 'undefined' ? request.query.version : wps.version.default;

        var operation = request.query.request.toLowerCase();
        log.info("wps", "KVP request: service = %s | version = %s | request = %s", service, version, operation);

        switch (operation) {
            case(wps.name.gc):
                wps.getCapabilities(version, response);
                break;
            case(wps.name.dp):
                //
                wps.error("Unsupported Operation", response);
                break;
            case(wps.name.e):
                //
                wps.error("Unsupported Operation", response);
                break;
            default:
                wps.error("Unsupported Operation", response);
                break;
        }
    });

    app.get("/process/:id", function (request, response) {
        // TODO 
    });

    app.get("/capabilities/:service/:version", function (request, response) {
        // TODO
    });

    app.post("/unmarshal", function (request, response) {
        log.verbose("wps", "unmarshal called!")
        response.setHeader("Content-Type", "application/json");
        var value = wps.unmarshal(request.rawBody);
        log.verbose("wps", "unmarshalled: \n %s", value);
        response.end(value);
    });

    //routes.setup(app, handlers);
    var port = process.env.PORT || 3000;
    app.listen(port);
    log.verbose("wps", "wps-node server listening on port %d in %s mode", port, app.settings.env);
}

exports.start = start;
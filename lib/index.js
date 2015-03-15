var log = require('npmlog');
log.level = "verbose";

var wpsServer = require("./server");

log.verbose("wps", "starting WPS...")
wpsServer.start();
log.verbose("wps", "WPS started.")
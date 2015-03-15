var assert = require("assert");
var wps = require('wps');

describe('GetCapabilities KVP', function(){
  describe('all parameters', function(){
    it('should return a capabilities document', function(){
        var service = request.query.service;
        var version = request.query.version;
        var operation = request.query.request;
        log.info("wps", "KVP request: service = %s | version = %s | request = %s", service, version, operation);

        wps.getCapabilities("WPS", "2.0.0", response);

    })
  })
})
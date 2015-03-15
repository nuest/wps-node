var util = require('util');
var log = require('npmlog');

var Jsonix = require('jsonix').Jsonix;
var XLink_1_0 = require('w3c-schemas').XLink_1_0;
var OWS_1_1_0 = require('ogc-schemas').OWS_1_1_0;
var WPS_1_0_0 = require('ogc-schemas').WPS_1_0_0;

var context = new Jsonix.Context([XLink_1_0, OWS_1_1_0, WPS_1_0_0], {
    namespacePrefixes: {
        "http://www.w3.org/1999/xlink": "xlink",
        "http://www.opengis.net/ows/2.0": "ows",
        "http://www.opengis.net/wps/1.0.0": "wps",
        "http://www.opengis.net/wps/2.0.0": "wps"
        //"http://www.opengis.net/ogc": "ogc",
        //"http://www.opengis.net/gml": "gml"
    }
});
var unmarshaller = context.createUnmarshaller();
var marshaller = context.createMarshaller();

module.exports = {
    service: "wps",
    name: {
        gc: "getcapabilities",
        dp: "describeprocess",
        e: "execute"
    },
    version: {
        v1_0_0: "1.0.0",
        v2_0_0: "2.0.0",
        default: "2.0.0"
    },
    getCapabilities: function (version, response) {
        log.verbose("wps", "GetCapabilities request for %s", version);
        log.verbose("wps", "Current reponse: %s", response);

        response.statusCode = 200;
        response.setHeader("Content-Type", "text/xml");

        var capabilities = {
            name: {
                namespaceURI: "http://www.opengis.net/wps/1.0.0",
                localPart: "Capabilities"
            },
            value: {
                language: "en-EN",
                service: "WPS",
                version: "2.0.0"
            }
        };
        
        var node = marshaller.marshalDocument(capabilities);
        var serializedNode = Jsonix.DOM.serialize(node);
        log.verbose("wps", "Response: %s", serializedNode);
        response.write(serializedNode);

        log.verbose("wps", "Finished GetCapabilities");
        response.end();
    },
    describeProcess: function () {
        // whatever
    },
    execute: function () {
        // add the execute to an internal database or queue

        // use a callback in response.end to mark the execution as done
    },
    error: function (message, response) {
        response.statusCode = 404;
        response.setHeader("Content-Type", "text/xml");
        response.end(util.format("Error: %s", message));
    },
    unmarshal: function(input) {
        var json = unmarshaller.unmarshalString(input);
        return(JSON.stringify(json));
    }
};

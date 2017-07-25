'use strict';

module.exports = buildResponse;

function buildResponse(options) {
    const sessionAttributes = options.sessionAttributes;
    const speechletResponse = options.speechletResponse;
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse
    };
}

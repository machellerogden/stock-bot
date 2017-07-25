'use strict';
module.exports = handleSessionEndRequest;

function handleSessionEndRequest(options, callback) {
    const cardTitle = 'Stock Bot';
    const speechOutput = '<speak>Thanks for using Stock Bot.</speak>';
    const cardText = 'Thanks for using Stock Bot.';
    const shouldEndSession = true;
    const sessionAttributes = {};
    const repromptText = null;
    callback({ sessionAttributes, cardTitle, cardText, speechOutput, repromptText, shouldEndSession });
}

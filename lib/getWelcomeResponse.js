'use strict';
module.exports = getWelcomeResponse;

function getWelcomeResponse(callback) {
    const sessionAttributes = {};
    const cardTitle = 'Stock Bot';
    const speechOutput = '<speak>Right now, all I can do is give you the current price of NASDAQ symbols.</speak>';
    const repromptText = '<speak>You can say, "what is the current price of GOOG?"</speak>';
    const shouldEndSession = false;
    callback({ sessionAttributes, cardTitle, speechOutput, repromptText, shouldEndSession });
}

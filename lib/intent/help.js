'use strict';
const _ = require('lodash');

module.exports = help;

function help(options, callback) {
    const shouldEndSession = false;
    let cardTitle = "Stock Bot";
    let cardText = "I cannot help you.";
    let speechOutput = "<speak>I cannot help you.";
    let repromptText = null;

    const sessionAttributes = _.result(options, 'session.attributes') || {};
    sessionAttributes.topic = 'Help';

    callback({sessionAttributes, cardTitle, cardText, speechOutput, repromptText, shouldEndSession});
}

'use strict';
const _ = require('lodash');

module.exports = buildSpeechletResponse;

function buildSpeechletResponse(options) {
    console.log('@buildSpeechletResponse - options', options);

    const cardTitle = options.cardTitle || "Stock Bot";
    const cardText = options.cardText || "";
    const cardSmallImage = options.cardSmallImage || false;
    const cardLargeImage = options.cardLargeImage || false;
    const speechOutput = options.speechOutput || "I'm sorry. I'm unable to understand the question I heard.";
    const repromptText = options.repromptText || speechOutput;
    const shouldEndSession = (_.isBoolean(options.shouldEndSession)) ? options.shouldEndSession : true;

    const card = {
        type: 'Standard',
        title: cardTitle,
        text: cardText
    };

    if (cardSmallImage || cardLargeImage) {
        card.image = {};
    }

    if (cardSmallImage) {
        card.image.smallImageUrl = cardSmallImage;
    }

    if (cardLargeImage) {
        card.image.largeImageUrl = cardLargeImage;
    }

    const outputSpeech = {
        type: 'SSML',
        ssml: speechOutput
    };

    const reprompt = {
        outputSpeech: {
            type: 'SSML',
            ssml: repromptText
        }
    };

    const speechletResponse = {
        outputSpeech,
        card,
        reprompt,
        shouldEndSession
    };

    console.log('@buildSpeechletResponse - speechletResponse', options);

    return speechletResponse;
}

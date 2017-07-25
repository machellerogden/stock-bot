'use strict';

const buildResponse = require('./lib/buildResponse');
const buildSpeechletResponse = require('./lib/buildSpeechletResponse');
const onSessionStarted = require('./lib/onSessionStarted');
const onSessionEnded = require('./lib/onSessionEnded');
const intentMap = require('./lib/intent');
const getWelcomeResponse = require('./lib/getWelcomeResponse');
const _ = require('lodash');
const secrets = require('./secrets');

exports.handler = handler;

function handler(event, context, callback) {
    console.log('@handler - event object:', JSON.stringify(event));
    console.log('@handler - context object:', JSON.stringify(context));

    function buildResponseCallback(options) {
        const sessionAttributes = options.sessionAttributes;
        const cardTitle = options.cardTitle;
        const cardText = options.cardText;
        const speechOutput = options.speechOutput;
        const repromptText = options.repromptText;
        const shouldEndSession = options.shouldEndSession;
        const speechletResponse = buildSpeechletResponse({ cardTitle, cardText, speechOutput, repromptText, shouldEndSession });
        console.log(`buildResponseCallback sessionAttributes=${sessionAttributes} speechletResponse=${speechletResponse}`);
        callback(null, buildResponse({ sessionAttributes, speechletResponse }));
    }

    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        if (secrets.appid && event.session.application.applicationId !== secrets.appid) {
            return callback('Invalid Application ID');
        }

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            console.log(`LaunchRequest requestId=${event.request.requestId}, sessionId=${event.session.sessionId}`);

            getWelcomeResponse(buildResponseCallback);

        } else if (event.request.type === 'IntentRequest') {
            const intent = event.request.intent;
            let session = event.session;
            let intentName = intent.name;

            console.log(`IntentRequest requestId=${event.request.requestId}, sessionId=${event.session.sessionId} intentName=${intentName} intentMap[intentName]=${intentMap[intentName]}`);

            try {
                intentMap[intentName]({ intent, session }, buildResponseCallback);
            } catch (err) {
                console.error('Invalid intent: ' + intentName);
                throw new Error(err);
            }

        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            return callback();
        }
    } catch (err) {
        return callback(err);
    }

    return null;
}

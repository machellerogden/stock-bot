'use strict';
const secrets = require('./secrets');
const _ = require('lodash');
const axios = require('axios');
const request = axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
});

var languageStrings = {
    'en': {
        'translation': {
            'WELCOME' : "Welcome to Stock Bot.",
            'HELP'    : "I cannot help you yet.",
            'ABOUT'   : "Stock Bot will give you realtime stock prices for NASDAQ ticker symbols.",
            'STOP'    : "Thanks for using Stock Bot."
        }
    }
    // , 'de-DE': { 'translation' : { 'TITLE'   : "Local Helfer etc." } }
};

var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    //alexa.appId = secrets.appid;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        var say = this.t('WELCOME') + ' ' + this.t('HELP');
        this.emit(':ask', say, say);
    },

    'AboutIntent': function () {
        this.emit(':tell', this.t('ABOUT'));
    },

    'CurrentPriceFromSymbol': function () {
        const context = this;
        processAttrs({ context })
            .then(getTimeSeriesFromAV)
            .then(extractPrice)
            .then((payload) => {
                const closeprice = _.result(payload, 'data.closeprice', false);
                if (_.isFinite(+closeprice)) {
                    let price = Math.round(closeprice * 100) / 100;
                    let symbol = _.result(payload, 'attrs.symbol');
                    let say = `Current price for <say-as interpret-as="spell-out">${symbol}</say-as> is \$${price}.`;
                    this.emit(':tell', say);
                } else {
                    throw new Error('@getCurrentPriceFromSymbol - invalid price value: ' + closeprice);
                }
            })
            .catch((err) => {
                console.error('@CurrentPriceFromSymbol handler - error:', err);
                let say = "Sorry, I'm unable to find a price for that symbol.";
                this.emit(':tell', say);
            });
    },

    'AMAZON.NoIntent': function () {
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', this.t('HELP'));
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP'));
    }

};

function processAttrs(payload) {
    const symbol = _.upperCase(_.result(payload, 'context.event.request.intent.slots.Symbol.value', _.result(payload, 'attrs.symbol', '')));
    _.set(payload, 'attrs.symbol', symbol);
    if (symbol) {
        return Promise.resolve(payload);
    } else {
        return Promise.reject('no symbol specified');
    }
}

function getTimeSeriesFromAV(payload) {
    const symbol = _.result(payload, 'attrs.symbol', false);
    if (symbol) {
        const url = `https://www.alphavantage.co/query`;
        const params = {
            function: 'TIME_SERIES_INTRADAY',
            symbol,
            interval: '1min',
            apikey: secrets.keys.alphavantage
        };
        return request.get(url, {
            params
        }).then((res) => {
            const timeseriesResponseData = res.data;
            _.set(payload, 'data.timeseriesResponseData', timeseriesResponseData);
            return payload;
        }).catch((err) => {
            console.error('@getTimeSeriesFromAV - request error:', err);
            return payload;
        });
    } else {
        console.error('@getTimeSeriesFromAV - error: symbol does not exist');
        return Promise.resolve(payload);
    }
}

function extractPrice(payload) {
    const responseData = _.result(payload, 'data.timeseriesResponseData', false);
    if (responseData) {
        console.log('@extractPrice - response data:', responseData);
        const timeseries = responseData[Object.keys(responseData)[1]];
        const lastminute = timeseries[Object.keys(timeseries)[0]];
        const closeprice = lastminute[Object.keys(lastminute)[3]];
        _.set(payload, 'data.closeprice', closeprice);
    } else {
        console.error('@extractPrice - error: timeseries data does not exist');
    }
    return payload;
}

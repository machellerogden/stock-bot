'use strict';
const _ = require('lodash');
const axios = require('axios');
const request = axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
});
const Promise = require('bluebird');
const secrets = require('../../secrets');

module.exports = getCurrentPriceFromSymbol;

function getCurrentPriceFromSymbol(options, callback) {
    let speechOutput = "";
    let repromptText;
    let shouldEndSession = false;

    let cardTitle = "Current Price";
    let cardText = "Sorry, I'm unable to find that ticker symbol.";

    const sessionAttributes = _.result(options, 'session.attributes') || {};

    sessionAttributes.topic = 'getCurrentPriceFromSymbol';

    function getAttrs(options) {
        const symbol = _.upperCase(_.result(options, 'intent.slots.Symbol.value') || sessionAttributes.symbol || '');
        if (symbol) {
            return Promise.resolve({ symbol });
        } else {
            return Promise.reject('no symbol specified');
        }
    }

    function getTimeSeriesFromAV(options) {
        const symbol = options.symbol;
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
            const data = res.data;
            return Object.assign({}, options, {
                data
            });
        });
    }

    function extractPrice(options) {
        const data = options.data;
        data['Time Series (1min)'][0]
        const timeseries = data[Object.keys(data)[1]];
        const lastminute = timeseries[Object.keys(timeseries)[0]];
        const closeprice = lastminute[Object.keys(lastminute)[3]];
        const result = Object.assign({}, options, {
            closeprice
        });
        return result;
    }

    getAttrs(options)
        .then(getTimeSeriesFromAV)
        .then(extractPrice)
        .then((options) => {
            if (_.isFinite(+options.closeprice)) {
                let price = Math.round(options.closeprice * 100) / 100;
                let symbol = options.symbol;
                speechOutput = `<speak>Current price for <say-as interpret-as="spell-out">${symbol}</say-as> is \$${price}.</speak>`;
                cardText = `Current price for ${symbol} is \$${price}.`;
            } else {
                throw new Error('@getCurrentPriceFromSymbol - invalid price value: ' + options.closeprice);
            }
        })
        .catch((error) => {
            console.log(error);
            speechOutput = "<speak>Sorry, I'm unable to find a price for that symbol.</speak>";
            repromptText = "<speak>Sorry, I'm unable to find a price for that symbol.</speak>";
            cardText = "Sorry, I'm unable to find the price for that symbol.";
        }).finally(() => {
            callback({ sessionAttributes, cardTitle, cardText, speechOutput, repromptText, shouldEndSession });
        });
}

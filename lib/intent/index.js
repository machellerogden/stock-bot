'use strict';
//const help = require('./help');
const getCurrentPriceFromSymbol = require('./getCurrentPriceFromSymbol');
const handleSessionEndRequest = require('./handleSessionEndRequest');

exports['CurrentPriceFromSymbol'] = getCurrentPriceFromSymbol;
//exports['HelpIntent'] = help;
//exports['AMAZON.HelpIntent'] = help;
exports['ExitIntent'] = handleSessionEndRequest;
exports['AMAZON.NoIntent'] = handleSessionEndRequest;
exports['AMAZON.StopIntent'] = handleSessionEndRequest;
exports['AMAZON.CancelIntent'] = handleSessionEndRequest;

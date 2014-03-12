const inherits = require('util').inherits ;
const EventEmitter = process.EventEmitter ;

function inheritsFromEventEmitter(c){
    inherits(c,EventEmitter);
    return c
};
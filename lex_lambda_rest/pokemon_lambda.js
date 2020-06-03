'use strict';

const http = require('https');

function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

/* Events */ 

function dispatch(intentRequest, callback) {
    http.get('https://pokeapi.co/api/v2/pokemon/ditto', (resp) => {
        let data = '';
        
        // data received 
        resp.on('data', (chunk) => {
            data += chunk;
        });
        
        // Log result after response received 
        resp.on('end', () => {
            var obj = JSON.parse(data);
            var abilities = obj.abilities;
            for (let i = 0; i < abilities.length; i++) {
                let ability = abilities[i];

                /* messy messy pls clean me later */
                console.log("ability name: ", (abilities[i]).ability.name);
            }
        });
        
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
    
    console.log(`request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
    const sessionAttributes = intentRequest.sessionAttributes;
    
    const slots = intentRequest.currentIntent.slots;
    
    const pizzaKind = slots.pizzaKind;
    
    console.log(slots);
    console.log(slots.slotOne);
    const pokemon = slots.slotOne;
    const attack = "";
    
    callback(close(sessionAttributes, 'Fulfilled',
    {'contentType': 'PlainText', 'content': `Okay, ${pokemon}'s attack is: {attack}`}));
    
    
}

// --------------- Main handler -----------------------

// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
    try {
        dispatch(event,
        (response) => {
            callback(null, response);
        });
    } catch (err) {
        callback(err);
    }
}

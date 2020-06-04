const http = require('https');

'use strict';

// Close dialog with the customer, reporting fulfillmentState of Failed or Fulfilled ("Thanks, your pizza will arrive in 20 minutes")
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
// test

/*
function http_request(params, postData) {
    return new Promise(function(resolve, reject) {
        var req = http.request(params, function(res) {
            if (res.statusCode < 200 || res.statusCode >= 300)  {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            
            var body = [] // could be a string, in the previous implementation
            res.on('data', (chunk) => {
                body.push(chunk);
            });
            res.on('end', () => {
                try {
                    body = JSON.parse(Buffer.concat(body).toString())
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        req.on('error', (err) => {
            reject(err);
        });
        if (postData) {
            req.write(postData);
        }
        // apparently important?
        req.end();
    });
}
*/
// --------------- Events -----------------------
function dispatch(intentRequest, callback) {
    let ability_list = []
    
    /*var params = {
        host:'127.0.0.1',
        port:'4000',
        method: 'GET',
        path: 'https://pokeapi.co/api/v2/pokemon/ditto'
    }*/
    
    //http_request(params, postData).then();
    
    http.get('https://pokeapi.co/api/v2/pokemon/ditto', (resp) => {
        let data = '';
        
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });
         
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            // JSON object
            let obj = JSON.parse(data);
            let abilities = obj.abilities;
            for (let i = 0; i < abilities.length; i++) {
                let ability = abilities[i];
                
                // messy messy pls clean me later 
                console.log("ability name: ", (abilities[i]).ability.name);
                
                ability_list.push(abilities[i].ability.name); // is abilities a list here?
            }
            
            console.log("ability list values: ", abilities);
            console.log("ability list values: ", ability_list);
            console.log("abili list string: ", ability_list.toString());
        });
     callback(close(sessionAttributes, 'Fulfilled',
    
    // why is this returning a blank line in lex ?
    {'contentType': 'PlainText', 'content': `Okay, ${pokemon}'s attack is: ${ability_string}.`}));   
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
    
    console.log(`request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
    const sessionAttributes = intentRequest.sessionAttributes;
    
    const slots = intentRequest.currentIntent.slots;
    
    console.log(slots.slotOne);
    
    const pokemon = slots.slotOne;
    
    const ability_string = ability_list.toString(); 
    
    console.log("ability string" + ability_string);
    console.log(typeof(ability_string))
   // put inside func 
/*    callback(close(sessionAttributes, 'Fulfilled',
    
    // why is this returning a blank line in lex ?
    {'contentType': 'PlainText', 'content': `Okay, ${pokemon}'s attack is: ${ability_string}.`}));*/
    
    
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

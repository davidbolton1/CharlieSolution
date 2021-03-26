var ManagementClient = require('auth0').ManagementClient;
const express = require('express')
var router = express.Router();

// Extended for values of any type
router.use(express.urlencoded({extended: true}))

// Flatten the array
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat

Object.defineProperty(Array.prototype, 'flatArr', {
    value: function(depth = 1) {
        return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
        }, []);
    }
});


// Pagination
// Used incase many rules are added
// https://shouts.dev/easiest-way-to-paginate-an-array-in-javascript


// getRules, recursive function to iterate through all the rules 
async function getRules(management, pagination) {
    try {
        // Set allRules to an empty array
        let allRules = [];
        // Wait for the getRulePage function to run
        var rulePage = await getRulePage(management,pagination)
        // push the Rules
        allRules.push( rulePage );
        if ( rulePage.length > 0 ) {
            pagination.page = pagination.page + 1;
            console.log ( 'Added ' + rulePage.length + ' results w/ pagination of ' + pagination.per_page );
            allRules.push(await getRules(management, pagination));
        } else {
            console.log ( 'Added ' + rulePage.length + ' results w/ pagination of ' + pagination.per_page );
            return;
        }
        // return flattened AllRules array
        return allRules.flatArr();
    } 
    // catch error, render failure view
    catch(err) {
        error = err;
        res.render("failure", {error: error});
    }
}

// In this case management = auth0 client
// pagination = array of 2 numbers: rules per page + starting page
async function getRulePage(management, pagination ) {
    return await management.getRules(pagination).then(function(rules) {
        return rules;
    })
}

// Recursively iterate through clients with getClientsPage
async function getClients(management, pagination) {
    // again set an empty array
    let allClients = [];
    // wait for the getClientPage function to run
    var clientPage = await getClientPage(management,pagination)
    // push into the allClients array
    allClients.push( clientPage );
    if ( clientPage.length > 0 ) {
        pagination.page = pagination.page + 1;
        console.log ( 'Added ' + clientPage.length + ' results w/ pagination of  ' + pagination.per_page );
        allClients.push(await getClients(management, pagination));
    } else {
        console.log ( 'Added ' + clientPage.length + ' results w/ pagination of  ' + pagination.per_page );
    return;
    }
    // returned the flattened array
return allClients.flatArr();
}

// getClientPageHelper function
async function getClientPage(management, pagination ) {
    return await management.getClients(pagination).then(function(clients) {
        return clients;
    })
}


// Grab information function
function getInfo(clients, rules) {
    // Initialize ruleList OBJ
    var ruleList = {};

    // Regex to match the line for client.  T
    // Parenthesis to catch client name from the object
    // (sets to index 1 if it's a match)
    var clientMatch = /context.clientName (===|!==|==|!=) '(.*?)'/;

    // Add all apps to an array
    for ( var i = 0; i < clients.length; i++ ) {
        if ( clients[i] != undefined ) {
            if (clients[i]['name'] !== 'All Applications') {
                ruleList[ clients[i]['name'] ] = [];
            }
        }
    }

    // Iterating through each rule and attach it to it's application
    for( var i = 0; i < rules.length; i++ ) {
        if ( rules[i] != undefined ) {
        var match = clientMatch.exec( rules[i]['script'] );
        if (match != null ) {
            // If it's a line match, tie the rule to the application
            // As noted above, index 2 should be the app name.
            ruleList[ match[2] ].push( rules[i]['name']);
        } else {
            for ( var key in ruleList) {
                // We did not find the line in the script for this rule. Assume the rule should apply to all applications.
                ruleList[ key ].push(rules[i]['name']);
            }
            }
        }
    }
    // Return the list
    return ruleList;
}

// Post request for the token + domain from env file
// Add token + domain to management client
router.post('/', function (req, res) {
    var token = process.env.AUTH0_APIV2_TOKEN;
    var domain = process.env.AUTH0_DOMAIN;
    var management = new ManagementClient({
        token: token,
        domain: domain
    });
    // Set # of rules per page (10 isn't a hard cap but it looks nicer)
    var rule_pagination = {
        per_page: 10,
        page: 0
    };
    // Apply pagination
    getRules(management, rule_pagination)
        .then(function(rules) {
            if (rules != undefined) {
                for( var i = 0; i < rules.length; i++ ) {
                    if( rules[i] != undefined ) {
                        rules[i]['name']
                    }
                }
                var client_pagination = {
                    per_page: 10,
                    page: 0
                };
                // Apply pagination to clients
                getClients(management, client_pagination)
                    .then(function(clients) {
                        for( var i = 0; i < clients.length; i++ ) {
                            if( clients[i] != undefined ) {
                                clients[i]['name'];
                            }
                        }
                        // Render the page using ruleView route
                        var appsAndRulesArray = getInfo(clients, rules );
                        //res.render("listRules", { appsAndRules: appsAndRulesArray });
                        res.render("ruleView", { appsAndRules: appsAndRulesArray });

                })
            } else {
                error = "Sorry, it looks like you don't have any rules setup";
                res.render("failure", {error: error});
            }
        })
        .catch(function(err){
            error = err;
            res.render("Failed", {error: err});
        });
});



module.exports = router;


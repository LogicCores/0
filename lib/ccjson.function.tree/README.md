**Status: DEV**

# ccjson.function.tree


The same as `ccjson` for `JSON` files but without files and only pure JS objects and functions.
Used to construct nested logic for UIs and arbitrary other tree structures.


const CCJSON = require("./ccjson");

var ccjson = new CCJSON();



// client

var api = ccjson.functionTree({
    "@load": [
        "categories"
    ],
    "@map": {
      'options': data.connect('blog.categories/*')
    },
    "@exports": {
        "get": "$impl"
    }
});

api.meta({
    deep: true
}).then(function (data) {
});

api.get({
    cache: false
}).then(function (data) {

});




ccjson.functionTree({
    "#contract": "logic.cores/page/^0.1.1",
    "@layout": {
        "url": "{path ...}"
    }
});


ccjson.functionTree({
    "#contract": "firewidgets/^0.1.1",
    // Firewidgets inherits from data mapper by aliasing exported mapper entities
    // to firewidgets local keys (original entities still available by going up inheritance tree.
    "@resources": {
        "moment.js": "{path ...}"
    }
});


ccjson.functionTree({
    "#contract": "ccjson.data.mapper/^0.1.2",
    "@api": {
        "#contract": "client",
        "api.orders": function () {
            // fetch data
        }
    },
    // Below is same as on server
    "@collections": {
        "collections.orders": "{api.orders}/orders"
    },
    "items": {
        "id": "{collections.orders}/id"
    },
    "groups": {
        "selector": "{collections.orders}/*[category='1']",
        "fields": {
            "id": "{collections.orders}/id",
            "fields": {
                "selector": "{collections.items}/*[category='{$../id}']",
                "fields": {
                    "{....}": ""
                }
            }
        }
    }
});




// server

ccjson.functionTree({
    "#contract": "ccjson.data.mapper/^0.1.2",
    "@adapters": {
        "load": function () {
            // DB adapter config
        }
    },
    "$load": function (context, pointer) {
    
        context.adapter
    
    
        
        
    },
    "@map": {
      'options': data.connect('blog.categories/*')
    }
},

ccjson.functionTree({
    // TODO: Inherit meta model
    "@api": {
        "#contract": "server",
        "api.orders": funciton () {
            // produce data using schema below
        }
    },
    // Below is same as on client
    "@collections": {
        "collections.orders": "{api.orders}/orders"
    },
    "items": {
        "id": "{collections.orders}/id"
    }
});





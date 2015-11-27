

Structure: GetterTree


getterTreeObject = {
    "value": {
        get: function () {
            return {
                "$pointer": "",
                "$value": ""
            }
        }
    },
    "rows": {
        "header": {
            get: function () {
                
            }
        },
        "item": {
            get:function () {
                
            }
        }
    },
    "items": [
        {
            "item": {
                get: function () {
                    
                }
            }
        }
    ]
}

jsonTreeObject = {
    "$hash": "<ccjson consistent hash>",
    "$time": "<utc time>",
    "$source": "<remote source uri>",
    "value": {
        "$pointer": "<relative pointer within source>",
        "$value": "VALUE"
    }
}


API:

  * jsonTreeObject = run(getterTreeObject, valueEventsStream)
  * subscriptionObject = subscribe(jsonTreeObject, pointer)
    * undoes a complete or partial frozen tree and re-subscribes to the original getters by returning a JSON subscription object
  * changeDetectionObject = hasChanged(jsonTreeObject, pointer)


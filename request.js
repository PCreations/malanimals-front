var Cookie = require('js-cookie');
var request = require('superagent');

//based on http://stackoverflow.com/a/7616484/1836434
var hashUrl = function(url, params) {
    var string = url + JSON.stringify(params);
    var hash = 0, i, chr, len;
    if (string.length == 0) return hash;
    for (i = 0, len = string.length; i < len; i++) {
        chr   = string.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

var _promises = {};

module.exports = {

    get: function(url, params) {
        var params = params || {};
        var hash = hashUrl(url, params);
        var promise = _promises[hash];
        if (promise == undefined) {
            promise = new Promise(function(resolve, reject) {
                request.
                    get(url).query(params).set('Accept', 'application/json').end( function(err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
            _promises[hash] = promise;
        }
        return promise;
    },

    post: function(url, data) {
        return new Promise(function(resolve, reject) {

            var req = request
                .post(url)
                .set('X-CSRFToken', Cookie.get('csrftoken'))
                .set('Accept', 'application/json')
                .send(data)
                .end( function(err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });

        });
    },

    put: function(url, data) {
        return new Promise(function(resolve, reject) {

            var req = request
                .put(url)
                .set('Accept', 'application/json')
                .set('X-CSRFToken', Cookie.get('csrftoken'))
                .send(data)
                .end( function(err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });

        });
    },

    del: function(url) {
        return new Promise(function(resolve, reject) {

            var req = request
                .del(url)
                .set('Accept', 'application/json')
                .set('X-CSRFToken', Cookie.get('csrftoken'))
                .end( function(err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });

        });
    }

};
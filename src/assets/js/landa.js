window.LandaJS = window.LandaJS || {
    ready: function(cb) {
        var checkIfLoaded = function() {
            if (typeof(window.__LandaJS) == 'object') {
                cb && cb.call();
            } else {
                setTimeout(function () {
                    checkIfLoaded();
                }, 200);
            }
        }

        checkIfLoaded();
    },

    getUserInfo: function() {
        return window.__LandaJS.getUserInfo();
    },

    getAccessToken: function() {
        return window.__LandaJS.getAccessToken();
    },

    uuid: function() {
        var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var chars = CHARS, uuid = new Array(36), rnd=0, r;
        for (var i = 0; i < 36; i++) {
          if (i==8 || i==13 ||  i==18 || i==23) {
            uuid[i] = '-';
          } else if (i==14) {
            uuid[i] = '4';
          } else {
            if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
            r = rnd & 0xf;
            rnd = rnd >> 4;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
        }
        return uuid.join('');
    },

    _timer: null,
    _listeners: [],

    _startListen: function() {
        var _this = this;

        if (! _this._timer) {
            _this._timer = setInterval(function () {
                try {
                    for (var i = 0; i < _this._listeners.length; i++) {
                        for (var k = 0; k < __LandaJS.result.length; k++) {
                            if (_this._listeners[i].id == __LandaJS.result[k].id) {
                                var cb = _this._listeners[i].cb, data = __LandaJS.result[k].data;

                                _this._listeners.splice(i, 1);
                                __LandaJS.result.splice(k, 1);

                                cb.call(_this, data);

                                return;
                            }
                        }
                    }
                } catch (err) {
                    alert(err);
                }
            }, 200);
        }
    },

    _pushRequest: function(req, cb) {
        var id = this.uuid();

        window.postMessage(JSON.stringify({id: id, request: req}));
        this._listeners.push({id: id, cb: cb});

        this._startListen();
    },

    requestCamera: function(cb) {
        this._pushRequest('camera', cb);
    },

    requestGeo: function(cb) {
        this._pushRequest('geo', cb);
    }
};

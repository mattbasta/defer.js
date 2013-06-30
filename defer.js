(function() {
    
var slice = function(arr) {Array.prototype.slice.call(arr, 0)};

this.Deferred = (function() {

    var PENDING = 'pending';
    var RESOLVED = 'resolved';
    var REJECTED = 'rejected';

    function defer(beforeStart) {
        var _this = this;
        var state = PENDING;
        this.state = function() {return state;};

        var doneCBs = [];
        var failCBs = [];

        var closedArgs = [];

        function execute(funcs, args, ctx) {
            for (var i = 0, e; e = funcs[i++];) {
                e.apply(ctx || _this, args);
            }
        }

        function closer(list, new_state, ctx) {
            return function() {
                if (state !== PENDING) {
                    return;
                }
                state = new_state;
                var args = slice(arguments);
                closedArgs = ctx ? args.slice(1) : args;
                execute(list, args, ctx ? args[0] : _this);
            };
        }

        this.resolve = closer(doneCBs, RESOLVED);
        this.resolveWith = closer(doneCBs, RESOLVED, true);
        this.reject = closer(failCBs, REJECTED);
        this.rejectWith = closer(failCBs, REJECTED, true);

        function wrap(instant, cblist) {
            return function() {
                if (state === instant) {
                    execute(arguments, closedArgs);
                } else if (state === PENDING) {
                    var args = slice(arguments);
                    for (var i = 0, e; e = args[i++];) {
                        cblist.push(e);
                    }
                }
                return _this;
            };
        }

        this.promise = function(obj) {
            obj = obj || {};
            obj.done = wrap(RESOLVED, doneCBs);
            obj.fail = wrap(REJECTED, failCBs);
            obj.then = function(doneFilter, failFilter) {
                var def = new defer();
                obj.done(function() {
                    def.resolveWith.apply(this, [this].concat(doneFilter.apply(this, arguments)));
                });
                obj.fail(function() {
                    var args = slice(arguments);
                    def.rejectWith.apply(this, [this].concat(failFilter ? failFilter.apply(this, args) : args));
                });
                return def.promise();
            };
            obj.always = function() {
                _this.done.apply(_this, arguments).fail.apply(_this, arguments);
            };
            return obj;
        };

        this.promise(this);

        if (beforeStart) {
            beforeStart.call(this, this);
        }
    }

    return function(func) {return new defer(func)};
})();

this.Deferred.when = this.when = function() {
    var args = slice(arguments);
    if (args.length === 1 && args[0].promise) {
        return args[0].promise();
    }
    var out = [];
    var def = this.Deferred();
    var count = 0;
    for (var i = 0, e; e = args[i++];) {
        if (!e.promise) {
            out[i] = e;
            continue;
        }
        count++;
        (function(i) {
            e.fail(def.reject).done(function() {
                count--;
                out[i] = slice(arguments);
                if (!count) {
                    def.resolve.apply(def, out);
                }
            });
        })(i);
    }
    if (!count) {def.resolve.apply(def, out);}
    return def.promise();
};

if (this.define !== undefined && define.amd) {
    define('defer', [], this.Deferred);
} else if (this.exports !== undefined) {
    exports.Deferred = this.Deferred;
    exports.when = this.Deferred.when;
}

}).call(this);

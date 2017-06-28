casper.options.viewportSize = {
    width : 1280,
    height : 800
};

casper.on('page.initialized', function( page ) {
    this.evaluate(function() {
        var isFunction = function(o) {
                return typeof o == 'function';
            },
            bind,
            slice = [].slice,
            proto = Function.prototype,
            featureMap = {
                'function-bind': 'bind'
            };

        function has(feature) {
            var prop = featureMap[feature];
            return isFunction(proto[prop]);
        }

        // check for missing features
        if (!has('function-bind')) {
            // adapted from Mozilla Developer Network example at
            // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
            bind = function bind(obj) {
                var args = slice.call(arguments, 1),
                    self = this,
                    nop = function() {},
                    bound = function() {
                        return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
                    };
                nop.prototype = this.prototype || {}; // Firefox cries sometimes if prototype is undefined
                bound.prototype = new nop();
                return bound;
            };
            proto.bind = bind;
        }
    });
});

var stamp = (function () {
    var i = 0;
    return function () {
        return ++i;
    };
})();

var template = function (input, variables) {
    for (var i = 0, len = variables.length; i < len; i++) {
        var item = variables[i];
        input = input.replace(/%[sd]/, item);
    }
    return input;
};

var newImageFilename = function ( alt ) {
    return template('tests/screenshots/casper-%d.png', [alt || stamp()]);
};

var capture = function (alt) {
    var filename = newImageFilename( alt );
    casper.capture( filename );
    casper.test.comment( filename.replace('tests/screenshots/', '') );
};

casper.on("page.error", function(msg, trace) {
    if (msg === 'WebGL not supported' ||
        msg.match(/^ReferenceError.*?Uint8ClampedArray$/)) {
        // we know
        return;
    }
    this.echo("Error: " + msg, "ERROR");
});

casper.test.on("fail", function(failure) {
    failure.message = "Message : " + failure.message + "\nLine : " + failure.line + "\nCode : " + failure.lineContents;
});
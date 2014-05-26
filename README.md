# defer.js

defer.js is a tiny jQuery-compatible Deferreds library.

[![Build Status](https://travis-ci.org/mattbasta/defer.js.png?branch=master)](https://travis-ci.org/mattbasta/defer.js)

## Why use defer.js?

- **It's small.** Minified and gzipped, it weighs (as of writing) 685 bytes. In comparison, [simply-deferred](https://github.com/sudhirj/simply-deferred) weighs ~1kb.
- **No BS.** Deprecated methods from jQuery are not included.
- **It works everywhere.** The default package includes support for AMD and node.js with no extra effort.

## Use it directly

Link to `defer.js` with a script tag and you'll get a `Deferred()` function and a `when()` function in the global scope that behaves just like jQuery's.

## Use it in Node.js

`require('./defer')` and you'll get back an object with a `Deferred()` and `when()` method.

## Use it with AMD

Include `defer.js` in a place that an AMD-compatible `define()` method is present and you'll get a `defer` module:

```js
define('module', ['defer'], function(defer) {
    var def = defer();
    // `when` is accessible via `defer.when`
    return {
        getPromise: function() {
            return def.promise();
        },
        resolve: def.resolve
    };
});
```

Notice that the AMD module doesn't have a `Deferred` method, and instead returns the equivalent function directly.

## Size info

<table>
<tr><th>Library<th>Unminified<th>Minified (uglify)<th>Minified (CC)
<tr><td><a href="https://github.com/jquery/jquery/blob/master/src/deferred.js">jQuery</a><td>4.3kb<td>1.5kb (672b gzipped)<td>[1]
<tr><td><a href="https://github.com/sudhirj/simply-deferred/blob/master/deferred.js">simply-deferred</a><td>6.5kb<td>2.7kb (994b gzipped)<td>2.4kb (938b gzipped)
<tr><td><a href="https://github.com/mattbasta/defer.js/blob/master/defer.js">defer.js</a><td>3.6kb<td>1.5kb (653b gzipped)<td>1.4kb (633b gzipped)
</table>

Note that most gzipped sizes would be even lower if the libraries were combined with other JS in a bundle because entities could be shared.

[1] jQuery's implementation cannot be closure compiled on its own.

## Missing features

- As with simply-deferred's implementation, we don't support progress notifications.

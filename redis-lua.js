// Generated by CoffeeScript 1.6.3
(function() {
  var fs, path,
    __slice = [].slice;

  fs = require('fs');

  path = require('path');

  module.exports = function(folder) {
    var file, load_script, match, scripts, _i, _len, _ref;
    scripts = {};
    _ref = fs.readdirSync(folder);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      file = _ref[_i];
      match = file.match(/(.*)-([\d]+|n).lua/);
      if (match) {
        scripts[match[1]] = {
          keys: match[2],
          code: fs.readFileSync(path.join(folder, file)).toString()
        };
      }
    }
    load_script = function(redis, script, data) {
      return redis.script("LOAD", data.code, function(err, sha) {
        return redis[script] = function() {
          var args, cb, keys_length, _j;
          args = 2 <= arguments.length ? __slice.call(arguments, 0, _j = arguments.length - 1) : (_j = 0, []), cb = arguments[_j++];
          keys_length = data.keys;
          if (keys_length === 'n') {
            keys_length = args.length;
          }
          console.log('===> keys_length: ', keys_length);
          return redis.evalsha.apply(redis, [sha, keys_length].concat(__slice.call(args), [function(err, response) {
            return cb(err, response);
          }]));
        };
      });
    };
    return function(redis) {
      var data, script, _results;
      _results = [];
      for (script in scripts) {
        data = scripts[script];
        _results.push(load_script(redis, script, data));
      }
      return _results;
    };
  };

}).call(this);
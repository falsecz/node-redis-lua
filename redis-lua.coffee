fs = require 'fs'
path = require 'path'

module.exports = (folder) ->
  scripts = {}

  for file in fs.readdirSync(folder)
    match = file.match /(.*)-([\d]+|n).lua/
    if match
      scripts[match[1]] =
        keys: match[2]
        code: fs.readFileSync(path.join(folder, file)).toString()

  load_script = (redis, script, data) ->
    redis.script "LOAD", data.code, (err, sha) ->
      redis[script] = (args..., cb) ->
        keys_length = data.keys
        keys_length = args.length if keys_length == 'n'

        redis.evalsha sha, keys_length, args..., (err, response) ->
          cb(err, response)

  (redis) ->
    load_script(redis, script, data) for script, data of scripts

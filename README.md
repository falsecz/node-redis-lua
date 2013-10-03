Lua scripts for redis-node
==========================

Injects all `.lua` files as commands to node-redis instances.

## Usage
To inject your scripts first you need to load them:

    lua_scripts = require('redis-lua')("/path/to/scripts/folder")

Then inject them to your redis instances:

    redis = require('redis').createClient(...)
    lua_scripts(redis)

# Scripts filename format

The _filename_ of your scripts must follow this format:

    {command}_{#keys}.lua

For example:

    msismember_1.lua # creates the msismember command, with 1 arguments for `KEYS`, the rest for `ARGV`
    mscard_n.lua # creates the mscard command, with all arguments sent as `KEYS`.

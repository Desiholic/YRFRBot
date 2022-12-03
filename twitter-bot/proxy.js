require('dotenv').config();

var http = require('http');
var setup = require('proxy');
var bot = require('./bot');
var url = require('url');

function notFound(res) {
    res.writeHead(404, 'text/plain'),
    res.end('404: File not found')
}

var server = setup(
    http.createServer(function(b_req, b_res) {
        // Parse the request's url
        var b_url = url.parse(b_req.url, true);
        console.log(b_url)

        const FollowsBot = bot.HandleFollowsAccount(b_url.pathname)
        if (FollowsBot == true) {

            b_res.writeHead('200', 'text/plain'),
            b_res.end('200: Success')

        } else {

            b_res.writeHead('404', 'text/plain'),
            b_res.end('404: File not found')

        }
    })
)

server.listen(7571, "127.0.0.1");

server.authenticate = function(req, fn) {
    console.log(fn)
}
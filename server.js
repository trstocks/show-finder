var http = require('http');
var path = require('path');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');


var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);


router.use(express.static(path.resolve(__dirname, 'showfinder')));
//router.use(express.static(path.resolve(__dirname, 'backend')));
router.use("/node_modules", express.static('node_modules'));


router.listen(process.env.PORT || 3000, process.env.IP,function(){

  console.log("Begin Showfinder app ");
  console.log("Are you sure it's working?");

  router.get('/venuedata/',function(reqm,res){

      //http://www.gannett-cdn.com/experiments/sites/azcentral/config.json
      var site = reqm.params.site;
      var options = {
        host: 'api.gigshr.com',
        path: '/venue',
        //port: '1338',
        //This is the only line that is new. `headers` is an object with the headers to request
        headers: {'custom': 'Custom Header Demo works'}
      };
      callback = function(response) {

        var str = ''
        response.on('data', function (chunk) {
          str += chunk;
        });

        response.on('end', function () {
          console.log(str)
          res.send(str);
        });
      }

      var req = http.request(options, callback);
      req.end();

  })

});

var CouchLogin = require('couch-login')

// Nothing about this module is http-server specific of course.
// You could also use it to do authenticated requests against
// a couchdb using sessions and storing the token somewhere else.

http.createServer(function (req, res) {
  var couch = new CouchLogin('http://192.168.7.207:5984/')

  // .. look up the token in the user's session or whatever ..
  // Look at couch.decorate(req, res) for more on doing that
  // automatically, below.

  if (sessionToken) {
    // this user already logged in.
    couch.token = sessionToken

    // now we can do things on their behalf, like:
    // 1. View their session info.
    // like doing request.get({ uri: couch + '/_session', ... })
    // but with the cookie and whatnot

    couch.get('/_session', function (er, resp, data) {
      // er = some kind of communication error.
      // resp = response object from the couchdb request.
      // data = parsed JSON response body.
      if (er || resp.statusCode !== 200) {
        res.statusCode = resp.statusCode || 403
        return res.end('Invalid login or something')
      }

      // now we have the session info, we know who this user is.
      // hitting couchdb for this on every request is kinda costly,
      // so maybe you should store the username wherever you're storing
      // the sessionToken.  RedSess is a good util for this, if you're
      // into redis.  And if you're not into redis, you're crazy,
      // because it is awesome.

      // now let's get the user record.
      // note that this will 404 for anyone other than the user,
      // unless they're a server admin.
      couch.get('/_users/org.couchdb.user:' + data.userCtx.name, etc)

      // PUTs and DELETEs will also use their session, of course, so
      // your validate_doc_update's will see their info in userCtx
    })

  } else {
    // don't have a sessionToken.
    // get a username and password from the post body or something.
    // maybe redirect to a /login page or something to ask for that.
    var login = { name: name, password: password }
    couch.login(login, function (er, resp, data) {
      // again, er is an error, resp is the response obj, data is the json
      if (er || resp.statusCode !== 200) {
        res.statusCode = resp.statusCode || 403
        return res.end('Invalid login or something')
      }

      // the data is something like
      // {"ok":true,"name":"testuser","roles":[]}
      // and couch.token is the token you'll need to save somewhere.

      // at this point, you can start making authenticated requests to
      // couchdb, or save data in their session, or do whatever it is
      // that you need to do.

      res.statusCode = 200
      res.write("Who's got two thumbs and just logged you into couch?\n")
      setTimeout(function () {
        res.end("THIS GUY!")
      }, 500)
    })
  }
})

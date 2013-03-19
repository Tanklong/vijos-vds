var Server = global.Server = {};

var spdy = require('spdy');
var gzippo = require('gzippo');
var fs = require('fs');
var express = require('express');
var app = Server.app = express();

Server.initialize = function()
{
	var ssl_options =
	{
		key: fs.readFileSync(Config.SSL.Key),
		cert: fs.readFileSync(Config.SSL.Cert),
		ca: fs.readFileSync(Config.SSL.CA)
	};
	
	Middleware.before(app);
	app.use(Compressor.rewrite);
	app.use(gzippo.staticGzip(Config.Dir.Static),
	{
		contentTypeMatch:	Config.GZip.Pattern,
		clientMaxAge:		Config.Headers.MaxAge
	});
	app.use(gzippo.compress());
	Middleware.after(app);
	
	var server_ssl = spdy.createServer(ssl_options, app);
	server_ssl.listen(Config.Port.HTTPS);
	
	app.listen(Config.Port.HTTP);
	
	Logger.info('HTTP listening at port ' + Config.Port.HTTP);
	Logger.info('HTTPS listening at port ' + Config.Port.HTTPS);
}
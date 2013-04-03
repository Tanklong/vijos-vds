var Server = global.Server = {};

var spdy = require('spdy');
var gzippo = require('gzippo');
var fs = require('fs');
var express = require('express');

var app = Server.app = express();

Server.initialize = function()
{
	//common middlewares
	Middleware.before(app);
	app.use(middleware_forbid);
	app.use(middleware_rewrite);
	app.use(gzippo.staticGzip(Config.Dir.Static), {contentTypeMatch:Config.Match.GZipMime});
	app.use(gzippo.compress());
	app.use(middleware_notfound);
	Middleware.after(app);
	
	//ssl
	if (Config.SSL.Enabled)
	{
		var ssl_options =
		{
			key: fs.readFileSync(Config.SSL.Key),
			cert: fs.readFileSync(Config.SSL.Cert),
			ca: fs.readFileSync(Config.SSL.CA)
		};

		var server_ssl = spdy.createServer(ssl_options, app);
		server_ssl.listen(Config.Port.HTTPS);
		
		Logger.info('HTTPS listening at port ' + Config.Port.HTTPS);
	}
	
	app.listen(Config.Port.HTTP);
	Logger.info('HTTP listening at port ' + Config.Port.HTTP);
}

function middleware_forbid(req, res, next)
{
	if (req.url.match(Config.Static.Forbid.Match))
	{
		if (Config.Static.Forbid.Redirect)
			res.redirect(301, Config.Static.Forbid.Host + req.url);
		else
			res.send(403, '<h1>403 Forbidden</h1>');
	}
	else
	{
		next();
	}
}

function middleware_rewrite(req, res, next)
{
	//Simple rewriter
	var t = Config.Static.Rewrite;
	for (var k in t)
	{
		if (req.url == k)
		{
			req.url = t[k];
			break;
		}
	};
	
	next();
}

function middleware_notfound(req, res, next)
{
	if (Config.Static.NotFound.Redirect)
		res.redirect(301, Config.Static.NotFound.Host + req.url);
	else
		res.send(404, '<h1>404 Not found</h1>');
}
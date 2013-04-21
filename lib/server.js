var Server = global.Server = {};

var fs = require('fs');
var express = require('express');
var MongoStore = require('connect-mongo')(express);

var app = Server.app = express();

Server.initialize = function()
{
	app.set('views', VDir);
	app.set('view engine', 'ejs');
	app.locals(Config.Dynamic.Locals);
	app.locals(
	{
		open: '{%',
		close: '%}',
		layout: true
	});
	app.use(require('express-partials')());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	/*app.use(express.session(
	{
		secret:		Config.Dynamic.CookieSecret,
		store:		new MongoStore(Config.Dynamic.DB),
		cookie:		{ maxAge: Config.Dynamic.SessionMaxAge }
	}));*/

	app.use(middleware_forbid);
	app.use(middleware_rewrite);

	app.use(express.compress());
	app.use(require('express-minify')({cache: Config.Dir.StaticCache}));
	app.use(express.static(Config.Dir.CDNStatic, {maxAge: Config.Static.Expire}));
	app.use(Config.Dynamic.Prefix, express.static(Config.Dir.DYNStatic, {maxAge: Config.Dynamic.Expire}));
	
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	require(LibDir + 'router.js')(app);
	app.use(middleware_notfound);
	
	//ssl
	if (Config.SSL.Enabled)
	{
		var ssl_options =
		{
			key:	fs.readFileSync(Config.SSL.Key),
			cert:	fs.readFileSync(Config.SSL.Cert),
			ca:		fs.readFileSync(Config.SSL.CA)
		};

		require('spdy').createServer(ssl_options, app).listen(Config.Port.HTTPS);
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
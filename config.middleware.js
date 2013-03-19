var rewriter = require('express-rewrite');

var Middleware = global.Middleware =
{
	before: function(app)
	{
		app.use(middleware_header);
		app.use(middleware_forbidden);
		app.use(middleware_rewriter);
	},
	
	after: function(app)
	{
		app.use(middleware_notfound);
	}
}

function middleware_header(req, res, next)
{
	res.setHeader('X-Powered-By', 'VijosServer');
	return next();
}

function middleware_forbidden(req, res, next)
{
	if (req.url.match(/^\/\.svn/i) || req.url.match(/\.php$/i))
		return middleware_notfound.apply(this, arguments);
	else
		return next();
}

function middleware_rewriter(req, res, next)
{
	if (req.url == '/bdsitemap.txt')
		req.url = '/bdsitemap-cdn.txt';
	
	return next();
}

function middleware_notfound(req, res, next)
{
	res.redirect(301, '//vijos.org' + req.url);
}
var Proxy = global.Proxy = {};

var httpProxy;

function middleware(req, res, next)
{
	try
	{
		Logger.info(req.connection.remoteAddress + '\t' + req.headers.host + '\t' + req.url);
	}
	catch(e)
	{
	}
	
	next();
}

Proxy.initialize = function()
{
	httpProxy = require('http-proxy');
	
	var options =
	{
		hostnameOnly: true,
		router: Config.Proxy.Router
	}
	
	httpProxy.createServer
	(
		middleware,
		options
	).listen(Config.Proxy.Port);
}
var Proxy = global.Proxy = {};

var url = require('url');

var httpProxy, server;

Proxy.initialize = function()
{
	httpProxy = require('http-proxy');
	
	//Preprocess Staticize map
	var mapping = {};
	Config.Proxy.Staticize.List.forEach(function(m)
	{
		m.Hosts.forEach(function(host)
		{
			mapping[host] = m.Prefix || '';
		});
	});
	Proxy.StaticizeMap = mapping;
	
	//Start Proxy
	var options =
	{
		hostnameOnly: true,
		router: Config.Proxy.Router
	}
	
	server = httpProxy.createServer(middleware_proxy, options);
	server.listen(Config.Proxy.Port);
	server.on('upgrade', middleware_websockets);
}

function middleware_websockets(req, socket, head)
{
    server.proxy.proxyWebSocketRequest(req, socket, head);
}

function middleware_proxy(req, res, next)
{
	if (req.headers.host == undefined)
		req.headers.host = '';
	
	Logger.info(req.connection.remoteAddress + '\t' + req.headers.host + '\t' + req.url);
	
	//Staticize ?
	if (req.headers.host !== undefined && Proxy.StaticizeMap[req.headers.host] !== undefined)
	{
		if (url.parse(req.url).pathname.match(Config.Match.StaticExt))
		{
			req.url = Proxy.StaticizeMap[req.headers.host] + req.url;
			req.headers.host = Config.Proxy.Staticize.Target;
		}
	}
	
	//Hook HEAD
	var writeHead = res.writeHead;
	res.writeHead = function()
	{
		//Modify Headers
		var t = Config.Proxy.Headers;
		for (var k in t)
		{
			if (t[k] == null)
				res.removeHeader(k);
			else
				res.setHeader(k, t[k]);
		};
		
		writeHead.apply(this, arguments);
		res.writeHead = writeHead;
		writeHead = null;
	}
	
	return next();
}
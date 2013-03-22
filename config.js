var Config = global.Config = {};

Config.Dir =
{
	//static file directory
	Static:		BaseDir + '../wwwroot',
	
	//server runtime directory (will generate logs & cache)
	Runtime:	BaseDir + '../runtime',
}

Config.Port =
{
	//in this case, our ReverseProxy on port 80 will pass requests to 81
	HTTP:	81,
	HTTPS:	443
}

//static server configuration
Config.Static =
{
	NotFound:
	{
		//if enabled, requests will be redirected if notfound
		Redirect:	true,
		Host:		'//vijos.org'
	},
	Forbid:
	{
		//which request should be forbidden
		Match:		/(^\/\.svn|\.php$)/i,
		
		//if enabled, requests will be redirected if forbidden
		Redirect:	true,
		Host:		'//vijos.org'
	},
	Rewrite:
	{
		//these resources will be rewrited
		'/bdsitemap.txt':	'/bdsitemap-cdn.txt'
	}
}

//SSL configuration
Config.SSL =
{
	Enabled:	true,
	Key:		BaseDir + '../cert/key.key',
	Cert:		BaseDir + '../cert/cert.crt',
	CA:			BaseDir + '../cert/ca.crt'
}

//Runtime file locations
Config.FileLocation =
{
	DBCache:	Config.Dir.Runtime + '/cache.json',
	Log:		Config.Dir.Runtime + '/log.log'
}

Config.Match = 
{
	//(static server) gzip match
	GZipMime:	/((text\/(plain|css|xml|javascript))|(application\/(json|x\-javascript|xml)))/,
	
	//(proxy server) staticize match
	StaticExt:	/\.(js|css|png|gif|jpg)$/i
}

//Reverse Proxy configuration
Config.Proxy =
{
	Enabled:	true,
	Port:		80,
	Router: 
	{
		//proxy rules table
		'www.vijos.org':	'127.0.0.1:81',
		'cdn.vijos.org':	'127.0.0.1:81',
		'ch.vijos.org':		'121.28.10.101:777',
		'contesthunt.tk':	'121.28.10.101:777'
	},
	Headers:
	{
		//set or unset headers (null=unset)
		'server':		'Vijos-Server',
		'x-powered-by':	null
	},
	Staticize:
	{
		Target:	'www.vijos.org',
		
		List:
		[{
			//requests match to the Host and Config.Match.StaticExt
			//will be rewrited as requesting from Config.Proxy.Staticize.Target,
			//so it will be handled by TARGET static server
			Hosts:	['ch.vijos.org', 'contesthunt.tk'],
			Prefix:	'/contesthunter'
		}]
	}
}
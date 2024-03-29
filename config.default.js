var Config = global.Config = {};

Config.Cluster = 
{
	//how many child processes
	MaxProcesses:	6, 
}

Config.Dir =
{
	//static file directory
	CDNStatic:		BaseDir + '../wwwroot',
	DYNStatic:		BaseDir + 'public',
	StaticCache:	BaseDir + '../cache',
	
	//server runtime directory (will generate logs & cache)
	Runtime:		BaseDir + '../runtime',
}

Config.Port =
{
	//in this case, our ReverseProxy on port 80 will pass requests to 81
	HTTP:	81,
	HTTPS:	443
}

//dynamic server configuration
Config.Dynamic = 
{
	Prefix:			'/vds/static',
	CookieSecret:	'11111',
	SessionMaxAge:	1800000,
	Expire:			604800000,
	DB:
	{
		db:			'vijos',
		host:		'127.0.0.1',
		username:	'11111',
		password:	'11111'
	},
	Locals:
	{
		BaseLoc:	'/vds', 
		CDNLoc:		'//www.vijos.org',
		UIRev:		1,
		Nav:
		[
			{text: '数据服务首页', link: '/vds/'}
		],
		Site:		'Vijos',
		User:
		{
			Face:		'/static/img/default_user.png',
			Name:		'Guest',
			IsLogin:	false
		}
	}
}

//static server configuration
Config.Static =
{
	Expire:			604800000,
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
		'www.vijos.org':	'127.0.0.1:81'
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
var Config = global.Config = {};

Config.Dir =
{
	Static:	BaseDir + '../wwwroot',
	Runtime: BaseDir + '../runtime',
}
Config.SSL =
{
	Key:	BaseDir + '../cert/www_vijos_org.key',
	Cert:	BaseDir + '../cert/www_vijos_org.crt',
	CA:		BaseDir + '../cert/ca-bundle.crt'
}
Config.Port =
{
	HTTP:	81,
	HTTPS:	443
}
Config.Headers =
{
	MaxAge:	1209600000
}
Config.Cache =
{
	DBFile:	Config.Dir.Runtime + '/cache.json'
}
Config.Log =
{
	LogFile: Config.Dir.Runtime + '/log.log'
}
Config.GZip = 
{
	Pattern: /((text\/(plain|css|xml|javascript))|(application\/(json|x\-javascript|xml)))/
}
Config.Proxy =
{
	Enabled:	true,
	Port:		80,
	Router: 
	{
		'www.vijos.org': '127.0.0.1:81',
		'cdn.vijos.org': '127.0.0.1:81',
	}
}
global.BaseDir = __dirname + '/';
global.LibDir = __dirname + '/lib/';
require(BaseDir + 'config.js');
require(BaseDir + 'config.middleware.js');

//=================================
//初始化目录

(function()
{
	var fs = require('fs');
	try
	{
		stats = fs.lstatSync(Config.Dir.Runtime);
	}
	catch (e)
	{
		fs.mkdirSync(Config.Dir.Runtime, 0755);
	}
})();

//=================================

global.dumpError = function(err)
{
	var msg = err.message;
	
	if (err.stack)
		msg += '\r\nStack:' + err.stack;
	
	Logger.error(msg);
}

process.on('uncaughtException', global.dumpError);

//=================================

var log = require(LibDir + 'log.js');
global.Logger = log.create(log.INFO, Config.FileLocation.Log);

Logger.info('Server started.');

//=================================

require(LibDir + 'extend.js');
require(LibDir + 'server.js');
require(LibDir + 'proxy.js');

//=================================

if (Config.Proxy.Enabled)
	Proxy.initialize();

Server.initialize();
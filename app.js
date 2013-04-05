global.BaseDir = __dirname + '/';
global.LibDir = __dirname + '/lib/';

var config = require(BaseDir + 'config.js');
var log = require(LibDir + 'log.js');

global.Logger = log.create(log.INFO, Config.FileLocation.Log);
global.Cluster = require('cluster');

global.dumpError = function(err)
{
	var msg = err.message;
	
	if (err.stack)
		msg += '\r\nStack:' + err.stack;
	
	Logger.error(msg);
}

process.on('uncaughtException', global.dumpError);

if (Config.Cluster.Enabled)
{
	if (Cluster.isMaster)
	{
		require(LibDir + 'cluster.master.js');
	}
	else
	{
		require(LibDir + 'cluster.slave.js');
	}
}
else
{
	require(LibDir + 'cluster.slave.js');
}
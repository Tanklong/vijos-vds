global.BaseDir = __dirname + '/';
global.LibDir = __dirname + '/lib/';
require(BaseDir + 'config.js');
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
//=================================

global.Cluster = require('cluster');

if (Cluster.isMaster)
{
	Logger.info('Master started.');

	//initialize folder
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

	//start child processes
	var cpuCount = require('os').cpus().length;
	cpuCount = Math.min(cpuCount, Config.Cluster.MaxProcesses);

	for (var i = 0; i < cpuCount; i++)
	{
		setTimeout(function()
		{
			Cluster.fork();
		}, i * 100);
	}

	Cluster.on('exit', function(worker)
	{
	    Logger.warn('Worker #' + worker.id + ' died.');
	    Cluster.fork();
	});
}
else
{
	Logger.info('Worker #' + Cluster.worker.id + ' started.');

	require(LibDir + 'extend.js');
	require(LibDir + 'server.js');
	require(LibDir + 'proxy.js');

	if (Config.Proxy.Enabled)
		Proxy.initialize();

	Server.initialize();
}
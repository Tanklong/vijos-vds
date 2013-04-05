var mkdirp = require('mkdirp');

require('async').series
([
	function(callback)
	{
		mkdirp(Config.Dir.Runtime, 0777, callback);
	},

	function(callback)
	{
		mkdirp(Config.Dir.StaticCache, 0777, callback);
	},

	function()
	{
		Logger.info('Master started.');
		
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
	}
]);

Cluster.on('exit', function(worker)
{
    Logger.warn('Worker #' + worker.id + ' died.');
    Cluster.fork();
});
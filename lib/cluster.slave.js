if (Config.Cluster.Enabled)
	Logger.info('Worker #' + Cluster.worker.id + ' started.');
else
	Logger.info('Server started.');

require(LibDir + 'utils.js');
require(LibDir + 'server.js');
require(LibDir + 'proxy.js');

if (Config.Proxy.Enabled)
	Proxy.initialize();

Server.initialize();
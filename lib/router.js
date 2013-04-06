var site = require(CDir + 'site.js');

module.exports = function(app)
{
	app.get('/vds', site.index);
}
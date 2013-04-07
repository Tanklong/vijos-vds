var site = require(CDir + 'site.js');

module.exports = function(app)
{
	app.get(Config.Dynamic.Locals.BaseLoc, site.index);
}
exports.index = function(req, res, next)
{
	if (req.url.lastIndexOf('/') !== req.url.length - 1)
	{
		res.redirect(301, Config.Dynamic.Locals.BaseLoc + '/');
		return;
	}

	res.render('index', {title: 'Data Service'});
}
var Compressor = global.Compressor = {};

var
	fs = require('fs'),
	uglifyjs = require('uglify-js'),
	uglifycss = require('uglifycss'),
	parse = require('url').parse,
    path = require('path');

var dirPath;
var cacheData;

function parseUrl(req)
{
	var parsed = req._parsedUrl;
	
	if (parsed && parsed.href == req.url)
		return parsed;
	else
		return req._parsedUrl = parse(req.url);
}

function getExtension(filename)
{
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}

function serializeObject()
{
	fs.writeFileSync(Config.Cache.DBFile, JSON.stringify(cacheData), 'utf8');
}

function eh_process_exit()
{
	serializeObject();
}

function cacheChanged(filename)
{
	var stat = fs.statSync(filename);
	
	if (cacheData[filename] == undefined)
		return true;
	else
		return (stat.mtime.getTime() !== cacheData[filename]);
}

function cacheUpdate(filename)
{
	var stat = fs.statSync(filename);
	cacheData[filename] = stat.mtime.getTime();
}

function compressjs(filename)
{
	return uglifyjs.minify(fs.readFileSync(filename, 'utf8'), {fromString: true}).code;
}

function compresscss(filename)
{
	return uglifycss.processString(fs.readFileSync(filename, 'utf8'), uglifycss.defaultOptions);
}

Compressor.initialize = function()
{
	try
	{
		cacheData = JSON.parse(fs.readFileSync(Config.Cache.DBFile, 'utf8'));
	}
	catch(e)
	{
	}
	
	if (cacheData == null)
		cacheData = {};
	
	dirPath = path.normalize(Config.Dir.Static);
	setInterval(serializeObject, 300000);
	
	process.on('exit', eh_process_exit);
}

Compressor.rewrite = function(req, res, next)
{
    var url = decodeURI(parseUrl(req).pathname);
	
	if (!url.match(/\.(js|css)$/i))
		return next();
	
	if (url.match(/\.gz\.(js|css)$/i))
		return next();
	
	var filename = path.normalize(path.join(dirPath, url));
	
	if (0 != filename.indexOf(dirPath))
		return next();
	
	fs.stat(filename, function(err, stat)
	{
		if (err)
			return next();
		
		if (stat.isDirectory())
			return next();
		
		var extension = getExtension(filename);
		req.url = req.url + '.gz' + extension;
		
		if (!cacheChanged(filename))
			return next();
		
		try
		{
			switch(extension.toLowerCase())
			{
				case '.css':
					var minized = compresscss(filename);
					break;
				case '.js':
					var minized = compressjs(filename);
					break;
				default:
					return next();
					break;
			}
			
			fs.writeFileSync(filename + '.gz' + extension, minized, 'utf8');
			
			cacheUpdate(filename);
		}
		catch(e)
		{
			dumpError(e);
		}
		
		return next();
	});
}
/////
// Dependencies
/////
var consolidate = require('consolidate'),
	each = require('async').each,
	extend = require('extend'),
	handlebars = require('handlebars'),
	jetpack = require('fs-jetpack')

// expose plugin
module.exports = plugin

/////
// Helper
/////
var readPartials = require('./helpers/read-partials')

/**
 * Metalsmith plugin to replace handlebar helper and code in an markdown/html file
 * @param {Object} options
 *   @property {String} directory (optional)
 *   @property {String} partials (optional)
 *   @property {String} partialExtension (optional)
 *   @property {String} path (optional)
 *   @property {Boolean} logging (optional)
 * @return {Function}
 */
function plugin(opts) {
	// default values
	opts = opts || {}

	// fixed values
	var dir = opts.directory || 'layouts',
		partialExtension = opts.partialExtension,
		partials = opts.partials,
		path = opts.path || './build',
		ext = opts.extension || 'html|php|md|hbs|htaccess',
		def = 'empty.hbs',
		logging = opts.logging || false

	// plugin action
	return (files, metalsmith, done) => {
		if(logging) {
			console.log(' ')
			console.log('[Plugin] template')
		}
		var metadata = metalsmith.metadata(),
			keys = Object.keys(files),
			htmlFiles = [],
			params = {},
			partialsList = null

		// read the partials
		partialsList = readPartials(partials, partialExtension, dir, metalsmith)
		if(logging) {
			console.log('partials')
		}
		// register them as handlebar partials
		for (var partial in partialsList) {
			if(logging) {
				console.log('>', partial)
			}

		}
		handlebars.registerPartial(partialsList)

		if(logging) {
			console.log(' ')
			console.log('files')
		}

		// iterate over all items to filter html files, exclude assets and other stuff
		keys.forEach((file) => {
			var data = files[file],
				regex = `.*\.(${ext})`

			if (file.match(new RegExp(regex, 'i')) !== null) {
				htmlFiles.push(file)
			}
		})

		// process the files
		each(Object.keys(htmlFiles), (file, next) => {
			processFile(htmlFiles[file], ext, next)
		}, done)


		function processFile(file, ext, next) {
			if(logging) {
				console.log('>', file)
			}
			// console.log('############')
			var data = extend({}, files[file], metadata),
				str = metalsmith.path(dir, data.layout || def) // layout
				//console.log('params', clonedFile)

			//console.log(data.contents.toString())

			if (files[file].hasOwnProperty('layout')) {
				var tmplPath = jetpack.path(dir, files[file].layout)

				if (jetpack.exists(tmplPath)) {

					var tmplData = jetpack.read(tmplPath)


					// render the new file
					var templateData = handlebars.compile(tmplData)

						// build template
					var content = templateData(data)

					// set new content
					files[file].contents = new Buffer(content)
					if(logging) {
						console.log('  > layout applied')
					}
				} else {
					if(logging) {
						console.log('  > onknown layout', tmplPath)
					}
				}
			} else {
				if(logging) {
					console.log('  > no layout defined')
				}
			}
			// next
			next()

		}
	}
}
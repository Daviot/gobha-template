# gobha-template

A [Metalsmith](www.metalsmith.io) plugin to generate navigations in metalsmith from meta informations

## Installation

	$ npm install gobha-template

## Javascript Usage

```js
let template = require('gobha-template')

metalsmith.use(template())
```

## Options

```js
{
	direcory: "layouts",
	extension: "html|php|md|hbs",
	partialExtension: ".hbs",
	partials: "partials"
}
```
#### directory

Defines the root folder of the layouts, based on the directory where metalsmith is executed.

#### extension

The plugin checks every file extension and when the extension matches the regex it will process the file and replace the partials in this file


#### partialExtension

Defines which extension the templates have, othewise they will be ignored

#### partials

Defines the root folder of the partials, based on the directory where metalsmith is executed.  
It will search in all files and folder in the partials folder

## Define layout

create a new file `empty.hbs` in the layout folder

``` hbs

<!doctype html>
<html>
	<head>
		{{> head }}
	</head>
	<body>
		{{{contents}}}
	<body>
</html>
```
Now you can place the meta information inside your file to set the layout from the layout directory

``` md
--- 
layout: empty.hbs
---
```

Don't forget to add the partial, we used in the head of the layout

``` hbs
<title>fancy reuseable partial</title>
<meta charset="UTF-8">
```
### Handle partials in the layout

Please see my other plugin, it works the same way but only for the files itself [gobha-partials](https://github.com/Daviot/gobha-partials)

## License
MIT
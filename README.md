# grunt-init (unreleased)

## Getting Started
Grunt-init is a scaffolding tool used to automate project creation. It will build an entire directory structure based on the current environment and the answers to a few questions. The exact files and contents created depend on the template chosen along with the answers to the questions asked.

_Note: This standalone utility used to be built-in to grunt as the "init" task. See the grunt [Upgrading from 0.3 to 0.4](https://github.com/gruntjs/grunt/wiki/Upgrading-from-0.3-to-0.4) guide for more information about this change._

## Installation
In order to use grunt-init, you'll want to install it globally.

```shell
npm install -g grunt-init
```

This will put the `grunt-init` command in your system path, allowing it to be run from anywhere.

_Notes: You may need to use sudo or run your command shell as Administrator to do this._

[Getting Started]: http://gruntjs.com/getting-started

## Usage
* Get program help and a listing of built-in templates with `grunt-init --help`
* Create a project based around a built-in template with `grunt-init templatename`
* Create a project based around a custom template with `grunt-init /path/to/template`

Note that most templates generate their files in the current directory, so be sure to change to a new directory first if you don't want to overwrite existing files.

## Built-in templates
grunt-init currently includes these basic templates.

* commonjs - Create a commonjs module, including Nodeunit unit tests. ([sample "generated" repo](https://github.com/gruntjs/grunt-init-commonjs-sample/tree/generated) | [creation transcript](https://github.com/gruntjs/grunt-init-commonjs-sample#project-creation-transcript))
* gruntfile - Create a basic Gruntfile. ([sample "generated" repo](https://github.com/gruntjs/grunt-init-gruntfile-sample/tree/generated) | [creation transcript](https://github.com/gruntjs/grunt-init-gruntfile-sample#project-creation-transcript))
* gruntplugin - Create a grunt plugin, including Nodeunit unit tests. ([sample "generated" repo](https://github.com/gruntjs/grunt-init-gruntplugin-sample/tree/generated) | [creation transcript](https://github.com/gruntjs/grunt-init-gruntplugin-sample#project-creation-transcript))
* jquery - Create a jQuery plugin, including QUnit unit tests. ([sample "generated" repo](https://github.com/gruntjs/grunt-init-jquery-sample/tree/generated) | [creation transcript](https://github.com/gruntjs/grunt-init-jquery-sample#project-creation-transcript))
* node - Create a Node.js module, including Nodeunit unit tests. ([sample "generated" repo](https://github.com/gruntjs/grunt-init-node-sample/tree/generated) | [creation transcript](https://github.com/gruntjs/grunt-init-node-sample#project-creation-transcript))

If you're curious to see what these templates generate, `cd` into an empty directory, run `grunt-init templatename`, answer the questions, and inspect the result. Or check out the listed sample "generated" repos and creation transcripts.

## Custom templates
You can create and use custom templates. Your template must follow the same structure as the [built-in templates][].

[built-in templates]: https://github.com/gruntjs/grunt-init/tree/master/templates

A sample template named `my-template` would follow this general file structure:

* `my-template/template.js` - the main template file.
* `my-template/rename.json` - template-specific rename rules, processed as templates.
* `my-template/root/` - files to be copied into the target location.

Assuming these files exist at `/path/to/my-template`, the command `grunt-init /path/to/my-template` would be used to process the template. Multiple uniquely-named templates may exist in the same directory, just like the [built-in templates][].

Additionally, if you place this custom template in your `~/.grunt-init/` directory (`%USERPROFILE%\.grunt-init\` on Windows) it will be automatically available to be used with just `grunt-init my-template`.

### Copying files
As long as a template uses the `init.filesToCopy` and `init.copyAndProcess` methods, any files in the `root/` subdirectory will be copied to the current directory when the init template is run.

Note that all copied files will be processed as templates, with any `{% %}` template being processed against the collected `props` data object, unless the `noProcess` option is set. See the [jquery template](https://github.com/gruntjs/grunt-init/blob/master/init/jquery.js) for an example.

### Renaming or excluding template files
The `rename.json` describes `sourcepath` to `destpath` rename mappings. The `sourcepath` must be the path of the file-to-be-copied relative to the `root/` folder, but the `destpath` value can contain `{% %}` templates, describing what the destination path will be.

If `false` is specified as a `destpath` the file will not be copied. Also, glob patterns are supported for `srcpath`.

## Specifying default prompt answers
Each init prompt either has a default value hard-coded or it looks at the current environment to attempt to determine that default value. If you want to override a particular prompt's default value, you can do so in the optional OS X or Linux `~/.grunt-init/defaults.json` or Windows `%USERPROFILE%\.grunt-init\defaults.json` file.

For example, my `defaults.json` file looks like this, because I want to use a slightly different name than the default name, I want to exclude my email address, and I want to specify an author url automatically.

```json
{
  "author_name": "\"Cowboy\" Ben Alman",
  "author_email": "none",
  "author_url": "http://benalman.com/"
}
```

_Note: until all the built-in prompts have been documented, you can find their names and default values in the [source code](https://github.com/gruntjs/grunt-init/blob/master/tasks/init.js)._


## Defining an init template

### exports.description
This brief template description will be displayed along with the template name when the user runs `grunt init` or `grunt-init ` to display a list of all available init templates.

```js
exports.description = descriptionString;
```

### exports.notes
If specified, this optional extended description will be displayed before any prompts are displayed. This is a good place to give the user a little help explaining naming conventions, which prompts may be required or optional, etc.

```js
exports.notes = notesString;
```

### exports.warnOn
If this optional (but recommended) wildcard pattern or array of wildcard patterns is matched, grunt will abort with a warning that the user can override with `--force`. This is very useful in cases where the init template could potentially override existing files.

```js
exports.warnOn = wildcardPattern;
```

While the most common value will be `'*'`, matching any file or directory, the [minimatch](https://github.com/isaacs/minimatch) wildcard pattern syntax used allows for a lot of flexibility. For example:

```js
exports.warnOn = 'Gruntfile.js';        // Warn on a Gruntfile.js file.
exports.warnOn = '*.js';            // Warn on any .js file.
exports.warnOn = '*';               // Warn on any non-dotfile or non-dotdir.
exports.warnOn = '.*';              // Warn on any dotfile or dotdir.
exports.warnOn = '{.*,*}';          // Warn on any file or dir (dot or non-dot).
exports.warnOn = '!*/**';           // Warn on any file (ignoring dirs).
exports.warnOn = '*.{png,gif,jpg}'; // Warn on any image file.

// This is another way of writing the last example.
exports.warnOn = ['*.png', '*.gif', '*.jpg'];
```

### exports.template
While the `exports` properties are defined outside this function, all the actual init code is specified inside. Three arguments are passed into this function. The `grunt` argument is a reference to grunt, containing all the [grunt methods and libs](api.md). The `init` argument is an object containing methods and properties specific to this init template. The `done` argument is a function that must be called when the init template is done executing.

```js
exports.template = function(grunt, init, done) {
  // See the "Inside an init template" section.
};
```

## Inside an init template
_(Documentation coming soon)_

## Built-in prompts
_(Documentation coming soon)_

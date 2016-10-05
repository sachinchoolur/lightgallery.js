# Contributing

You're more than welcome to contribute to this project. Please note: your code may be used as part of a commercial product if merged.

## Important notes
Please don't edit files in the `dist` subdirectory as they are generated via npm script. You'll find source code in the `src` subdirectory!

### Code style
Regarding code style like indentation and whitespace, **follow the conventions you see used in the source already.**

## Modifying the code
First, ensure that you have the latest [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed.

1. Fork and clone the repo.
1. Run `npm install` to get the project's dependencies
1. Run `npm run build` to produce minified version of your library.

## Submitting pull requests
Pull requests are very welcome. Note that if you are going to propose drastic changes, be sure to open an issue for discussion first, to make sure that your PR will be accepted before you spend effort coding it.

1. Javascript changes of lightgallery plugins should be made in repective github repositoy.
2. SCSS and CSS changes should be made in lightgallery.js repository. Ex: If you want to submit a PR for lightgallery.js thumbnails plugin javacsript changes should be submitted in [lg-thumbnails.js](https://github.com/sachinchoolur/lg-thumbnail.js) repository and SCSS and CSS changes should be submitted in [lightgallery.js](https://github.com/sachinchoolur/lightgallery.js) repository.
2. Create a new branch, please don't work in your `master` branch directly.
1. Add failing tests for the change you want to make. Run `npm run build` to see the tests fail.
1. Fix stuff.
1. Run `npm run build` to see if the tests pass. Repeat steps 2-4 until done.
1. Update the documentation to reflect any changes.
2. Please do not include minified files with the pull request as i will do it myself. 
1. Push to your fork and submit a pull request.

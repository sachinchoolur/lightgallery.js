# Contributing

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

1. Create a new branch, please don't work in your `master` branch directly.
1. Add failing tests for the change you want to make. Run `npm run build` to see the tests fail.
1. Fix stuff.
1. Run `npm run build` to see if the tests pass. Repeat steps 2-4 until done.
1. Update the documentation to reflect any changes.
1. Push to your fork and submit a pull request.

jest.autoMockOff();
const {defineTest} = require('jscodeshift/dist/testUtils');
const path = require('path');

defineTest(__dirname, 'changeImports', null, 'changeImports/simpleReplace');
defineTest(__dirname, 'changeImports', null, 'changeImports/keepOldImports');
defineTest(__dirname, 'changeImports', null, 'changeImports/oldImportsOnly');
defineTest(__dirname, 'changeImports', null, 'changeImports/multipleFromImports');
defineTest(__dirname, 'changeImports', null, 'changeImports/mixImports');
defineTest(__dirname, 'changeImports', null, 'changeImports/fromLibNotExists');
defineTest(__dirname, 'changeImports', null, 'changeImports/saveComment');
defineTest(__dirname, 'changeImports', null, 'changeImports');
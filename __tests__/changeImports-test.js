jest.autoMockOff();
const {defineTest} = require('jscodeshift/dist/testUtils');
const path = require('path');

defineTest(__dirname, 'changeImports', null, 'changeImports/simpleReplace');
defineTest(__dirname, 'changeImports', null, 'changeImports/keepOldImports');
defineTest(__dirname, 'changeImports', null, 'changeImports');
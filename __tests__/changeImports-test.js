jest.autoMockOff();
const {defineTest} = require('jscodeshift/dist/testUtils');
const path = require('path');

const testDir = path.join(__dirname, '..');

defineTest(__dirname, 'changeImports', null, 'changeImports/simpleReplace');
defineTest(__dirname, 'changeImports', null, 'changeImports');
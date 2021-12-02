jest.autoMockOff();
const { defineTest } = require("jscodeshift/dist/testUtils");

defineTest(__dirname, "changeImports", null, "changeImports/simpleReplace");
defineTest(__dirname, "changeImports", null, "changeImports/keepOldImports");
defineTest(__dirname, "changeImports", null, "changeImports/oldImportsOnly");
defineTest(
  __dirname,
  "changeImports",
  null,
  "changeImports/multipleFromImports"
);
defineTest(__dirname, "changeImports", null, "changeImports/mixImports");
defineTest(__dirname, "changeImports", null, "changeImports/fromLibNotExists");
defineTest(__dirname, "changeImports", null, "changeImports/saveComment");
defineTest(__dirname, "changeImports", null, "changeImports/renameImport");
defineTest(__dirname, "changeImports", null, "changeImports/default");
//
// ------ FLOW ----------
//
defineTest(__dirname, "changeImports", null, "flow/saveFlowComment");
defineTest(__dirname, "changeImports", null, "flow/simpleOutsideReplace");
defineTest(__dirname, "changeImports", null, "flow/simpleInsideReplace");
defineTest(__dirname, "changeImports", null, "flow/onlyOneFlowAnnotation");

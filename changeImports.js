const fromLib = 'lodash';
const toLib = 'ambar';
const allowedItems = [
    'reduce',
];


module.exports.parser = 'flow';

module.exports = function(fileInfo, api, options) {
    const j = api.jscodeshift;

    const root = j(fileInfo.source);

    root.find(j.ImportDeclaration)
        .filter(path => path.value.source.value === fromLib)
        .forEach(path => {
            j(path).replaceWith(
                j.importDeclaration(path.value.specifiers, j.literal(toLib))
            )
        });

    return root.toSource({
        objectCurlySpacing: false,
        quote: 'single'
    });
  };
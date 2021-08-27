const fromLib = 'lodash';
const toLib = 'ambar';
const allowedItems = new Set([
    'reduce',
    'map'
]);


module.exports.parser = 'flow';

module.exports = function(fileInfo, api, options) {
    const j = api.jscodeshift;

    const root = j(fileInfo.source);

    const fromLibItems = root.find(j.ImportDeclaration)
        .filter(path => path.value.source.value === fromLib);
    if (fromLibItems.size() > 0) {
        const fromSpecifiers = fromLibItems
            .nodes()
            .flatMap(path => path.specifiers);

        const toLibSpecifiers = fromSpecifiers
            .filter(specifier => allowedItems.has(specifier.imported.name));
        const keepSpecifiers = fromSpecifiers
            .filter(specifier => !allowedItems.has(specifier.imported.name));

        // Remove all old lib imports except first
        // First piece is a place for possible replacement for not allowed items
        for (let i = 1; i < fromLibItems.size(); ++i) {
            j(fromLibItems.at(i).get()).remove();
        }

        const firstFromItem = j(fromLibItems.at(0).get());
        firstFromItem.replaceWith(
            j.importDeclaration(keepSpecifiers, j.literal(fromLib))
        );

        firstFromItem.insertBefore(
            j.importDeclaration(toLibSpecifiers, j.literal(toLib))
        );
    }
    return root.toSource({
        objectCurlySpacing: false,
        quote: 'single'
    });
  };
const fromLib = "lodash";
const toLib = "ambar";
const allowedItems = new Set(["reduce", "map", "default"]);

// import type {a} => import {type a}
function moveTypeInsideBrackets(root, j, libName) {
  root
    .find(j.ImportDeclaration, {
      importKind: "type",
      source: { value: libName },
    })
    .forEach((i) => {
      i.value.importKind = "value";
      for (const spec of i.value.specifiers) {
        spec.importKind = "type";
      }
    });
}

function findImportsFrom(root, j, libName) {
  return root.find(j.ImportDeclaration, {
    importKind: "value",
    source: { value: libName },
  });
}

function removeAllAndGetFirst(root, j, libName) {
  const libItems = findImportsFrom(root, j, libName);

  if (libItems.size() === 0) {
    return null;
  }

  for (let i = 1; i < libItems.size(); ++i) {
    j(libItems.at(i).get()).remove();
  }

  return j(libItems.at(0).get());
}

function getAllImportPieces(root, j, libName) {
  const libItems = findImportsFrom(root, j, libName);

  const ret = libItems.nodes().flatMap((path) => path.specifiers);

  // Если не создавать такую кривую копию, то type не попадает внутрь импорта почему-то
  return ret.map((ret) => ({ ...ret }));
}

function unionPieces(a, b) {
  const included = new Set(a.map((aEl) => getImportSpecifierName(aEl)));

  const res = [...a];
  for (const element of b) {
    const name = getImportSpecifierName(element);
    if (!included.has(name)) {
      res.push(element);
      included.add(name);
    }
  }

  return res;
}

function getImportSpecifierName(specifier) {
  switch (specifier.type) {
    case "ImportDefaultSpecifier":
      return "default";
    case "ImportSpecifier":
      return specifier.imported.name;
    default:
      return null;
  }
}

// TODO rewrite this shit
function replace(target, data) {
  let comments = [];
  target.forEach((path) => {
    comments = path.node.comments;
  });
  target.replaceWith(data);
  target.forEach((path) => {
    path.node.comments = comments;
  });
}

const FlowComment = "// @flow";

function addFlowAnnotation(j, root) {
  root.find(j.Statement).at(0).insertBefore(FlowComment);
}

module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;

  // Небольшой хак, который основан на упрощении, что у нас в проектах все аннотации flow
  // находятся на первой строке и используют однострочный комментарий
  let source = fileInfo.source.trim();
  const flowAnnotationPosition = source.indexOf(FlowComment);
  if (flowAnnotationPosition !== -1) {
    source = source.slice(flowAnnotationPosition + FlowComment.length);
  }

  const root = j(source);

  moveTypeInsideBrackets(root, j, fromLib);
  moveTypeInsideBrackets(root, j, toLib);
  const fromLibPieces = getAllImportPieces(root, j, fromLib);
  if (fromLibPieces.length === 0) {
    return fileInfo.source;
  }

  const toLibPieces = getAllImportPieces(root, j, toLib);

  const allowedPieces = fromLibPieces.filter((x) =>
    allowedItems.has(getImportSpecifierName(x))
  );
  const keepPieces = fromLibPieces.filter(
    (x) => !allowedItems.has(getImportSpecifierName(x))
  );

  const totalToLibPieces = unionPieces(allowedPieces, toLibPieces);

  const firstFromItem = removeAllAndGetFirst(root, j, fromLib);
  const firstToItem = removeAllAndGetFirst(root, j, toLib);

  if (firstToItem === null) {
    if (totalToLibPieces.length > 0) {
      firstFromItem.insertBefore(
        j.importDeclaration(totalToLibPieces, j.literal(toLib))
      );
    }
  } else {
    replace(
      firstToItem,
      j.importDeclaration(totalToLibPieces, j.literal(toLib))
    );
  }

  if (keepPieces.length === 0) {
    firstFromItem.remove();
  } else {
    replace(firstFromItem, j.importDeclaration(keepPieces, j.literal(fromLib)));
  }

  if (flowAnnotationPosition > -1) {
    addFlowAnnotation(j, root);
  }

  return root.toSource({
    objectCurlySpacing: false,
    quote: "single",
  });
};

module.exports.parser = "flow";

'use babel';

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function getConfig(key, namespace = 'context-add-imports') {
  return atom.config.get(key ? namespace + '.' + key : namespace);
}

function organizeImports() {
  var end, endRow, entireFile, from, i, importStm, imports, j, k, len, len1, line, lines, organize, regex, semicolon, start, startRow, what, editor, importType;
  editor = atom.workspace.getActiveTextEditor();
  importType = getConfig('importsType');

  regex = new RegExp('(' + escapeRegExp(importType.trim()).replace('IMPORT_TYPE', ')(.+?)(') + ')', 'gm');
  lines = editor.getText().split('\n');
  start = -1;
  end = lines.length;
  for (i = j = 0, len = lines.length; j < len; i = ++j) {
    line = lines[i];
    if (start === -1 && line.match(regex)) {
      start = i;
    }
    if (start !== -1 && line && !line.match(regex)) {
      end = i - 1;
      break;
    }
  }
  startRow = start;
  endRow = end;
  imports = editor.getTextInBufferRange([[startRow, 0], [endRow, 0]]);

  // filter out any 0 length lines
  imports = imports.split('\n').filter(function(stm) {
    return stm.length;
  });
  // filter out lines that don't match the regex
  // imports = imports.filter(function(importRegex, stm) {
  //   return importRegex.test(stm);
  // }.bind(null, regex));
  if (imports.length === 0) {
    return;
  }
  organize = [];
  for (k = 0, len1 = imports.length; k < len1; k++) {
    importStm = imports[k];
    if (!importStm.match(regex)) {
      continue;
    }
    what = regex.exec(importStm)[2];
    organize.push(what);
  }
  organize.sort(function(a, b) {
    return a.localeCompare(b, {sensitivity:'base'});
  });
  organize = organize.map(function(arg) {
    return importType.trim().replace('IMPORT_TYPE', arg);
  });
  return editor.setTextInBufferRange([[start, 0], [end, 0]], (organize.join('\n')) + '\n');
}

export {organizeImports};

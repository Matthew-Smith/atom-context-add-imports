'use babel';

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function organizeImports(editor, importType) {
  var _, end, endRow, entireFile, from, i, importStm, imports, j, k, len, len1, line, lines, organize, regex, semicolon, start, startRow, what;

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
  //   if (!importRegex.test(stm)) {
  //     console.log(stm);
  //   }
  //   return importRegex.test(stm);
  // }.bind(null, regex));
  // console.log('number of imports: ' + imports.length);
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
    console.log(what);
  }
  organize.sort(function(a, b) {
    return a.localeCompare(b, {sensitivity:'base'});
  });
  organize = organize.map(function(arg) {
    return importType.trim().replace('IMPORT_TYPE', arg);
  });
  console.log(organize);
  return editor.setTextInBufferRange([[start, 0], [end, 0]], (organize.join('\n')) + '\n');
}

export {organizeImports};

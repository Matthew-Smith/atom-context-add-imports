'use babel';

function log(message) {
  if (getConfig('debugLog')) {
    console.log(message);
  }
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function getConfig(key, namespace = 'manage-globals') {
  return atom.config.get(key ? namespace + '.' + key : namespace);
}

function organizeGlobals() {
  log('Organizing Globals');
  var end, endRow, entireFile, from, i, globalStm, globals, j, k, len, len1, line, lines, organize, regex, semicolon, start, startRow, what, editor, globalType;
  editor = atom.workspace.getActiveTextEditor();
  globalType = getConfig('globalsType');

  regex = new RegExp('(' + escapeRegExp(globalType.trim()).replace('GLOBAL_TYPE', ')(.+?)(') + ')', 'gm');
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
  globals = editor.getTextInBufferRange([[startRow, 0], [endRow, 0]]);

  // filter out any 0 length lines
  globals = globals.split('\n').filter(function(stm) {
    return stm.length;
  });
  // filter out lines that don't match the regex
  // globals = globals.filter(function(globalRegex, stm) {
  //   return globalRegex.test(stm);
  // }.bind(null, regex));
  if (globals.length === 0) {
    return;
  }
  organize = [];
  for (k = 0, len1 = globals.length; k < len1; k++) {
    globalStm = globals[k];
    if (!globalStm.match(regex)) {
      continue;
    }
    what = regex.exec(globalStm)[2];
    organize.push(what);
  }
  organize.sort(function(a, b) {
    return a.localeCompare(b, {sensitivity:'base'});
  });
  organize = organize.map(function(arg) {
    return globalType.trim().replace('GLOBAL_TYPE', arg);
  });
  return editor.setTextInBufferRange([[start, 0], [end, 0]], (organize.join('\n')) + '\n');
}

export {organizeGlobals};

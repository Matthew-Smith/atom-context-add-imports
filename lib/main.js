'use babel';

import {CompositeDisposable} from 'atom'

const config = {
  importsType: {
    type: 'string',
    default: '/*global IMPORT_TYPE*/\n'
  }
};

var subscriptions = null;

function getConfig(key, namespace = 'context-add-imports') {
  return atom.config.get(key ? namespace + '.' + key : namespace);
}

function activate(state) {
  subscriptions = new CompositeDisposable();
  subscriptions.add(
    atom.commands.add(
      'atom-workspace',
      'context-add-imports:addImport',
      addImport
    )
  );
}

function deactivate() {
  if (subscriptions) {
    subscriptions.dispose();
  }
}

function addImport() {
  var editor = atom.workspace.getActiveTextEditor();
  var output = '';
  if (editor) {
    var cursors = editor.getCursors();
    for (var i = 0; i < cursors.length; i++) {
      var cursor = cursors[i];
      var cursorBuffer = cursors[i].getCurrentWordBufferRange();
      var importName = editor.getTextInBufferRange(cursorBuffer);
      output += getConfig('importsType').replace('IMPORT_TYPE', importName);
    }
  }
  editor.buffer.setTextInRange("0:0", output);
}

export {config, activate, deactivate, addImport};

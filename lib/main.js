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
  if (editor) {
    var cursor = editor.getCursors()[0];
    var selection = editor.getSelectedText();
    var oldPosition = cursor.getBufferPosition();
    cursor.setBufferPosition('0:0');
    editor.insertText(getConfig('importsType').replace('IMPORT_TYPE', selection));
    cursor.setBufferPosition(oldPosition);
  }
}

export {config, activate, deactivate, addImport};

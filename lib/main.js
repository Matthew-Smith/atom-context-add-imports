'use babel';

import {organizeImports} from './organizeImports.js'

import {CompositeDisposable} from 'atom'

const config = {
  importsType: {
    type: 'string',
    default: '/*global IMPORT_TYPE*/\n',
    description: 'The definition for the type of imports to use, specify IMPORT_TYPE where the import name should go'
  },
  organizeImports: {
    type: 'boolean',
    default: false,
    description: 'If true, then the imports at the top of the file will be sorted into alphabetic order when a new import is added'
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
  var importType = getConfig('importsType');
  if (editor) {
    var cursors = editor.getCursors();
    for (var i = 0; i < cursors.length; i++) {
      var cursor = cursors[i];
      var cursorBuffer = cursors[i].getCurrentWordBufferRange();
      var importName = editor.getTextInBufferRange(cursorBuffer);
      output += importType.replace('IMPORT_TYPE', importName);
    }
  }
  editor.buffer.setTextInRange("0:0", output);
  organizeImports(editor, importType);
}

export {config, activate, deactivate, addImport};

'use babel';

import {organizeGlobals} from './organizeGlobals.js'

import {CompositeDisposable} from 'atom'

const config = {
  globalsType: {
    type: 'string',
    default: '/*global IMPORT_TYPE*/\n',
    description: 'The definition for the type of globals to use, specify IMPORT_TYPE where the global name should go'
  },
  organizeGlobals: {
    type: 'boolean',
    default: true,
    description: 'If true, then the globals at the top of the file will be sorted into alphabetic order when a new global is added'
  },
  multiLine: {
    type: 'boolean',
    default: true,
    description: 'If true, the globals will be separated onto individual lines'
  }
};

var subscriptions = null;

function getConfig(key, namespace = 'manage-globals') {
  return atom.config.get(key ? namespace + '.' + key : namespace);
}

function activate(state) {
  subscriptions = new CompositeDisposable();
  subscriptions.add(
    atom.commands.add(
      'atom-workspace',
      'manage-globals: Add Global',
      addGlobal
    )
  );
  subscriptions.add(
    atom.commands.add(
      'atom-workspace',
      'manage-globals: Organize Globals',
      organizeGlobals
    )
  );
}

function deactivate() {
  if (subscriptions) {
    subscriptions.dispose();
  }
}

function addGlobal() {
  var editor = atom.workspace.getActiveTextEditor();
  var output = '';
  if (editor) {
    var cursors = editor.getCursors();
    for (var i = 0; i < cursors.length; i++) {
      var cursor = cursors[i];
      var cursorBuffer = cursors[i].getCurrentWordBufferRange();
      var importName = editor.getTextInBufferRange(cursorBuffer);
      output += getConfig('globalsType').replace('IMPORT_TYPE', importName);
    }
  }
  editor.buffer.setTextInRange("0:0", output);
  if (getConfig('organizeGlobals')) {
    organizeGlobals();
  }
}

export {config, activate, deactivate, addGlobal};

'use babel';

import {organizeGlobals} from './organizeGlobals.js'

import {CompositeDisposable} from 'atom'

const config = {
  globalsType: {
    type: 'string',
    default: '/*global GLOBAL_TYPE*/\n',
    description: 'The definition for the type of globals to use, specify GLOBAL_TYPE where the global name should go'
  },
  organizeOnAdd: {
    type: 'boolean',
    default: true,
    description: 'If true, then the globals at the top of the file will be sorted into alphabetic order when a new global is added'
  },
  multiLine: {
    type: 'boolean',
    default: true,
    description: 'If true, the globals will be separated onto individual lines'
  },
  debugLog: {
    type: 'boolean',
    default: false,
    description: 'Outputs plugin debug information into the console'
  }
};

var subscriptions = null;

function getConfig(key, namespace = 'manage-globals') {
  return atom.config.get(key ? namespace + '.' + key : namespace);
}

function log(message) {
  if (getConfig('debugLog')) {
    console.log(message);
  }
}

function activate(state) {
  log('Activating manage-globals');
  subscriptions = new CompositeDisposable();
  subscriptions.add(
    atom.commands.add(
      'atom-workspace',
      'manage-globals: Add Global',
      addGlobal
    )
  );
  log('\tSubscription added for addGlobal');
  subscriptions.add(
    atom.commands.add(
      'atom-workspace',
      'manage-globals: Organize Globals',
      organizeGlobals
    )
  );
  log('\tSubscription added for organizeGlobals');
}

function deactivate() {
  log('Deactivating manage-globals');
  if (subscriptions) {
    subscriptions.dispose();
    log('\tSubscriptions disposed');
  }
}

function addGlobal() {
  log('Adding Global');
  var editor = atom.workspace.getActiveTextEditor();
  var output = '';
  if (editor) {
    var cursors = editor.getCursors();
    log('\tFound ' + cursors.length + ' cursors');
    for (var i = 0; i < cursors.length; i++) {
      var cursor = cursors[i];
      var cursorBuffer = cursors[i].getCurrentWordBufferRange();
      var globalName = editor.getTextInBufferRange(cursorBuffer);
      output += getConfig('globalsType').replace('GLOBAL_TYPE', globalName);
      log('\tCursor ' + i + ' has text: ' + globalName);
    }
  }
  log('\tOutputting new globals' + output);
  editor.buffer.setTextInRange("0:0", output);
  if (getConfig('organizeGlobals')) {
    organizeGlobals();
  }
}

export {config, activate, deactivate, addGlobal};

'use babel';

import {CompositeDisposable} from 'atom'

var subscriptions = null;
// export const config = {
//   importsType: {
//     type: 'string',
//     default: `/*global ${selection}*/\n`
//   }
// };

function activate(state) {
  console.log('activating context-add-imports');
  subscriptions = new CompositeDisposable();
  subscriptions.add(
    atom.commands.add(
      'atom-workspace',
      'context-add-imports:addImport',
      addImport
    )
  );
  console.log('context-add-imports activation completed');
}

function deactivate() {
  if (subscriptions) {
    subscriptions.dispose();
  }
}

function addImport() {
  var editor = atom.workspace.getActiveTextEditor();
  if (editor) {
    cursor = editor.getCursors()[0];
    selection = editor.getSelectedText();
    console.log(`Adding ${selection} To imports`);
    oldPosition = cursor.getBufferPosition();
    cursor.setBufferPosition("0:0");
    editor.insertText(`/*global ${selection}*/\n`);
    cursor.setBufferPosition(oldPosition);
  }
}

export {activate, deactivate, addImport};

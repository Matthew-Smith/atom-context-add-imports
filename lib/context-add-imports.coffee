{CompositeDisposable} = require 'atom'

module.exports =
  subscriptions: null

  activate: (state) ->
    console.log "activating context-add-imports"
    @subscriptions = new CompositeDisposable
    console.log "Subscriptions created"
    @subscriptions.add atom.commands.add 'atom-workspace', 'context-add-imports:addImport': => @addImport()
    console.log "Mapping command completed"

  deactivate: ->
    @subscriptions.dispose()

  addImport: ->
    if editor = atom.workspace.getActiveTextEditor()
      cursor = editor.getCursors()[0]
      selection = editor.getSelectedText()
      console.log("Adding #{selection} To imports")
      oldPosition = cursor.getBufferPosition()
      cursor.setBufferPosition("0:0")
      editor.insertText("/*global #{selection}*/")
      editor.insertNewline()
      cursor.setBufferPosition(oldPosition)

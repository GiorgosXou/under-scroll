"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");


let tempEditor;
let focusedEditor;
let isExtensionEnabled = vscode.workspace.getConfiguration("UnderScroll").get("automaticallyEnabled", true);

const visibleRangeChanged = () => vscode.window.onDidChangeTextEditorVisibleRanges(({textEditor}) => {
    if (!isExtensionEnabled) { return; }
    
    if (vscode.window.activeTextEditor == textEditor) {focusedEditor = textEditor;}
    if (vscode.window.visibleTextEditors.length < 2)  { return; }
    if (vscode.window.activeTextEditor != textEditor) { /*return;*/} // ??
    if (textEditor.viewColumn == undefined || focusedEditor.document.uri.scheme == "output")  { return; }  //excluding vscode's "Output" window
    if (vscode.window.visibleTextEditors.some((editor) => editor.document.uri.scheme == "git")) { return; } //excluding git's comparison
    

    tempEditor = focusedEditor;
    vscode.window.visibleTextEditors
    .forEach(editor => {
        if (editor != focusedEditor && editor.document.uri.scheme != "output" && focusedEditor.document.uri.fsPath == editor.document.uri.fsPath && editor.viewColumn != undefined){
            editor.revealRange(new vscode.Range(tempEditor.visibleRanges[0].end.line +1 , 0, tempEditor.visibleRanges[0].end.line +1, 0), vscode.TextEditorRevealType.AtTop);
            tempEditor = editor;
        }
    });
    
});



function toggleUnderSynchronizedScrolling() {
    isExtensionEnabled = !isExtensionEnabled;
    vscode.window.showInformationMessage(`Under Scrolling is now ${isExtensionEnabled ? "Enabled" : "Disabled"}!`);
}
/**
 * will be run on this extension's activation
 * @param context
 */
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand("UnderScroll.toggleUnderSynchronizedScrolling", () => toggleUnderSynchronizedScrolling()));
    vscode.window.onDidChangeVisibleTextEditors(visibleRangeChanged); // an event fired when multiple editors are opened
    
    // if there are multiple editors already on startup
    if (vscode.window.visibleTextEditors.length > 1) {
         visibleRangeChanged();
    } 
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
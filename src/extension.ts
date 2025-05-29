import * as vscode from "vscode";
import { upload } from "./commands/upload";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("pokepaste.upload", upload)
  );
}

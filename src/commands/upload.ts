import * as vscode from "vscode";
import * as path from "path";

async function getInput(options: vscode.InputBoxOptions): Promise<string> {
  const result = await vscode.window.showInputBox(options);
  if (result === undefined) {
    throw new Error("Upload cancelled.");
  }
  return result;
}

async function doUpload(
  paste: string,
  title: string,
  author: string,
  notes: string
) {
  const body = new URLSearchParams({ paste, title, author, notes });

  return fetch("https://pokepast.es/create", {
    method: "POST",
    body,
  });
}

export async function upload(textEditor: vscode.TextEditor) {
  try {
    const paste = textEditor.document.getText().replaceAll("\n", "\r\n");

    const title = await getInput({
      prompt: "Team name",
      placeHolder: "Enter a name for your team",
      value: path.basename(
        textEditor.document.fileName.replace(/\.[^/.]+$/, "")
      ),
    });

    const author = await getInput({
      prompt: "Author name",
      placeHolder: "Enter your name",
    });

    const notes = await getInput({
      prompt: "Notes",
      placeHolder: "Enter any notes for your team",
    });

    const { url } = await doUpload(paste, title, author, notes);
    await vscode.env.clipboard.writeText(url);

    vscode.window
      .showInformationMessage(
        "Team uploaded successfully! The link has been copied to your clipboard.",
        "Open"
      )
      .then(
        (selection) =>
          selection === "Open" && vscode.env.openExternal(vscode.Uri.parse(url))
      );
  } catch (error) {
    vscode.window.showErrorMessage(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

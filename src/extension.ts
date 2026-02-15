import * as vscode from "vscode";
import { generateThemeFromPrompt } from "./aiThemeService";
import { applyTheme } from "./themeApplier";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "palette-forge.generateTheme",
    async () => {
      const prompt = await vscode.window.showInputBox({
        prompt: "Describe the theme you want (e.g. 'warm sunset with amber and deep purple', 'minimal nord dark')",
        placeHolder: "e.g. Ocean at dusk with teal and coral accents",
        validateInput: (value) =>
          value.trim().length === 0 ? "Please enter a description" : null,
      });

      if (!prompt?.trim()) {
        return;
      }

      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Palette Forge",
          cancellable: false,
        },
        async (progress) => {
          progress.report({ message: "Generating theme with AI..." });
          try {
            const theme = await generateThemeFromPrompt(prompt.trim());
            if (theme) {
              applyTheme(theme);
              progress.report({ message: "Applying theme..." });
              vscode.window.showInformationMessage(
                "Palette Forge: Theme applied! Check your editor and workbench."
              );
            } else {
              vscode.window.showErrorMessage(
                "Palette Forge: Could not generate a valid theme. Check your API key and try again."
              );
            }
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            vscode.window.showErrorMessage(`Palette Forge: ${message}`);
          }
        }
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

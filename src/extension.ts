import * as vscode from "vscode";
import { generateThemeFromPrompt } from "./aiThemeService";
import { applyTheme } from "./themeApplier";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "palette-forge.generateTheme",
    async () => {
      const mode = await vscode.window.showQuickPick(
        [
          { label: "Dark", description: "Deep/background-first themes" },
          { label: "Medium", description: "Balanced contrast (semi-dark)" },
          { label: "Light", description: "Light background themes" },
        ],
        { placeHolder: "Choose a base mode for the theme" }
      );

      if (!mode) {
        return;
      }

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
            const theme = await generateThemeFromPrompt(prompt.trim(), mode.label.toLowerCase());
            if (theme) {
              applyTheme(theme);
              progress.report({ message: "Applying theme..." });
              vscode.window.showInformationMessage(
                "Palette Forge: Theme applied! Check your editor and workbench."
              );
            } else {
              const channel = vscode.window.createOutputChannel("Palette Forge");
              channel.appendLine("ERROR: Could not parse API response as valid JSON");
              channel.appendLine("This usually means:");
              channel.appendLine("1. Your OpenAI API key is invalid or expired");
              channel.appendLine("2. Your API account doesn't have sufficient credits");
              channel.appendLine("3. The API is having issues (check api.openai.com status)");
              channel.show();
              vscode.window.showErrorMessage(
                "Palette Forge: Failed to generate valid theme. Check Output panel for details."
              );
            }
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            const channel = vscode.window.createOutputChannel("Palette Forge");
            channel.appendLine("ERROR: " + message);
            channel.show();
            vscode.window.showErrorMessage(`Palette Forge: ${message}`);
          }
        }
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

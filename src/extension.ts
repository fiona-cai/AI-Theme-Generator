import * as vscode from "vscode";
import { generateThemeFromPrompt } from "./aiThemeService";
import { applyTheme } from "./themeApplier";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "palette-forge.generateTheme",
    async () => {
      const mode = await vscode.window.showQuickPick(
        [
          { label: "Dark", description: "Deep, high-contrast themes" },
          { label: "Medium", description: "Balanced, semi-dark themes" },
          { label: "Light", description: "Bright, light background themes" },
        ],
        { placeHolder: "Choose a base mode for your AI-generated theme" }
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
          title: "AI Theme Generator",
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
                "AI Theme Generator: Theme applied! Check your editor and workbench."
              );
            } else {
              const channel = vscode.window.createOutputChannel("AI Theme Generator");
              channel.appendLine("ERROR: Could not parse API response as valid JSON");
              channel.appendLine("This usually means:");
              channel.appendLine("1. Your OpenAI API key is invalid or expired");
              channel.appendLine("2. Your API account doesn't have sufficient credits");
              channel.appendLine("3. The API is having issues (check api.openai.com status)");
              channel.show();
              vscode.window.showErrorMessage(
                "AI Theme Generator: Failed to generate valid theme. Check Output panel for details."
              );
            }
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            const channel = vscode.window.createOutputChannel("AI Theme Generator");
            channel.appendLine("ERROR: " + message);
            channel.show();
            vscode.window.showErrorMessage(`AI Theme Generator: ${message}`);
          }
        }
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

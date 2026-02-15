import * as vscode from "vscode";

export interface GeneratedTheme {
  workbench?: Record<string, string>;
  tokenColors?: Record<string, string>;
}

/**
 * Apply generated theme by updating workbench.colorCustomizations and
 * editor.tokenColorCustomizations. Uses the currently active theme as base
 * so customizations layer on top and apply instantly.
 */
export function applyTheme(theme: GeneratedTheme): void {
  const config = vscode.workspace.getConfiguration();

  if (theme.workbench && Object.keys(theme.workbench).length > 0) {
    const existing = config.get<Record<string, string>>(
      "workbench.colorCustomizations"
    );
    const merged = { ...(existing ?? {}), ...theme.workbench };
    config.update(
      "workbench.colorCustomizations",
      merged,
      vscode.ConfigurationTarget.Global
    );
  }

  if (theme.tokenColors && Object.keys(theme.tokenColors).length > 0) {
    const existing = config.get<Record<string, unknown>>(
      "editor.tokenColorCustomizations"
    );
    // tokenColorCustomizations can be a global object or per-theme; we merge into global
    const existingObj =
      existing && typeof existing === "object" && !Array.isArray(existing)
        ? (existing as Record<string, string>)
        : {};
    const merged = { ...existingObj, ...theme.tokenColors };
    config.update(
      "editor.tokenColorCustomizations",
      merged,
      vscode.ConfigurationTarget.Global
    );
  }
}

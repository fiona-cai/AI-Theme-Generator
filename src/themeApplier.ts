import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export interface GeneratedTheme {
  workbench?: Record<string, string>;
  tokenColors?: Record<string, string>;
}

/**
 * Apply generated theme by:
 * 1. Updating workbench.colorCustomizations with all workbench colors
 * 2. Updating editor.tokenColorCustomizations with token colors
 * 3. Updating editor.semanticTokenColorCustomizations for semantic highlighting
 * 
 * Note: We apply to the CURRENT theme (not trying to set a custom theme name)
 * so colors work regardless of which base theme is active.
 */
export function applyTheme(theme: GeneratedTheme): void {
  const config = vscode.workspace.getConfiguration();

  // Apply workbench color customizations at GLOBAL LEVEL ONLY
  // (not per-theme) so colors apply to any active theme
  if (theme.workbench && Object.keys(theme.workbench).length > 0) {
    const existing =
      (config.get<Record<string, unknown>>("workbench.colorCustomizations") as
        | Record<string, unknown>
        | undefined) ?? {};

    // Merge colors at global level only - this ensures they work with any theme
    const merged = { ...(existing as Record<string, unknown>), ...theme.workbench };

    config.update(
      "workbench.colorCustomizations",
      merged,
      vscode.ConfigurationTarget.Global
    );
  }

    if (theme.tokenColors && Object.keys(theme.tokenColors).length > 0) {
      const existing =
        (config.get<Record<string, unknown>>("editor.tokenColorCustomizations") as
          | Record<string, unknown>
          | undefined) ?? {};

      const activeTheme =
        vscode.workspace.getConfiguration("workbench").get<string>(
          "colorTheme",
          ""
        ) || "";
      const themeKey = activeTheme ? `[${activeTheme}]` : "";

      const result: Record<string, unknown> = { ...existing };
      for (const [k, v] of Object.entries(theme.tokenColors)) {
        result[k] = v;
      }

      if (themeKey) {
        const existingPer =
          existing && typeof existing[themeKey] === "object"
            ? (existing[themeKey] as Record<string, unknown>)
            : undefined;
        result[themeKey] = { ...(existingPer ?? {}), ...theme.tokenColors };
      }

      config.update(
        "editor.tokenColorCustomizations",
        result,
        vscode.ConfigurationTarget.Global
      );

      try {
        const semExisting =
          (config.get<Record<string, unknown>>("editor.semanticTokenColorCustomizations") as
            | Record<string, unknown>
            | undefined) ?? {};

        const mapFrom: Record<string, string> = {
          variables: "variable",
          functions: "function",
          types: "type",
          keywords: "keyword",
          strings: "string",
          numbers: "number",
        };

        const semanticMap: Record<string, string> = {};
        for (const [k, v] of Object.entries(theme.tokenColors)) {
          const semKey = mapFrom[k];
          if (semKey) semanticMap[semKey] = v as string;
        }

        if (Object.keys(semanticMap).length > 0) {
          const semResult: Record<string, unknown> = { ...semExisting };
          const existingRules =
            semExisting && typeof semExisting.rules === "object"
              ? (semExisting.rules as Record<string, unknown>)
              : {};
          semResult.rules = { ...existingRules };
          for (const [k, v] of Object.entries(semanticMap)) {
            (semResult.rules as Record<string, unknown>)[k] = { foreground: v };
          }

          if (themeKey) {
            const existingPerTheme =
              semExisting && typeof semExisting[themeKey] === "object"
                ? (semExisting[themeKey] as Record<string, unknown>)
                : undefined;
            const perThemeRules =
              existingPerTheme && typeof existingPerTheme.rules === "object"
                ? (existingPerTheme.rules as Record<string, unknown>)
                : {};
            semResult[themeKey] = { ...(existingPerTheme ?? {}), rules: { ...perThemeRules } };
            for (const [k, v] of Object.entries(semanticMap)) {
              ((semResult[themeKey] as Record<string, any>).rules as Record<string, unknown>)[k] = { foreground: v };
            }
          }

          config.update(
            "editor.semanticTokenColorCustomizations",
            semResult,
            vscode.ConfigurationTarget.Global
          );
        }
      } catch (e) {
        // non-critical
      }
    }

  // Emit debug output to an output channel
  try {
    const channel = vscode.window.createOutputChannel("Palette Forge");
    const finalWorkbench = config.get("workbench.colorCustomizations");
    const finalToken = config.get("editor.tokenColorCustomizations");
    
    channel.appendLine("--- Palette Forge: Applied Theme ---");
    channel.appendLine("--- Generated Workbench Colors ---");
    channel.appendLine(JSON.stringify(theme.workbench, null, 2));
    channel.appendLine("--- Generated Token Colors ---");
    channel.appendLine(JSON.stringify(theme.tokenColors, null, 2));
    channel.appendLine("--- Total colors in workbench.colorCustomizations ---");
    const customCount = theme.workbench ? Object.keys(theme.workbench).length : 0;
    channel.appendLine(`Added ${customCount} workbench color customizations`);
    channel.show(true);
    
    vscode.window.showInformationMessage(
      `Palette Forge: Theme applied! Added ${customCount} colors. Check Output panel for details.`
    );
  } catch (e) {
    // ignore output errors
  }
}

import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export interface GeneratedTheme {
  workbench?: Record<string, string>;
  tokenColors?: Record<string, string>;
}

/**
 * Apply generated theme by:
 * 1. Creating a complete VS Code theme file and registering it
 * 2. Updating workbench.colorCustomizations and editor.tokenColorCustomizations
 * 3. Setting workbench.colorTheme to use the generated theme
 */
export function applyTheme(theme: GeneratedTheme): void {
  const config = vscode.workspace.getConfiguration();

  // Generate a unique theme name based on timestamp
  const timestamp = Date.now();
  const themeName = `Palette Forge ${timestamp}`;
  
  // Use VS Code's extensions directory to store the theme
  // This makes the theme discoverable by VS Code
  const homeDir = process.env.HOME || process.env.USERPROFILE || "/tmp";
  const extensionsDir = path.join(homeDir, ".vscode", "extensions");
  const paletteForgeExtDir = path.join(extensionsDir, "palette-forge-generated");
  const themeFilePath = path.join(paletteForgeExtDir, "theme.json");

  // Build the complete theme JSON object
  const themeJson: Record<string, unknown> = {
    name: themeName,
    type: "light", // will be overridden by colors
    colors: theme.workbench ?? {},
    tokenColors: theme.tokenColors
      ? [
          {
            scope: ["comment"],
            settings: { foreground: theme.tokenColors.comments },
          },
          {
            scope: ["string"],
            settings: { foreground: theme.tokenColors.strings },
          },
          {
            scope: ["keyword"],
            settings: { foreground: theme.tokenColors.keywords },
          },
          {
            scope: ["constant.numeric"],
            settings: { foreground: theme.tokenColors.numbers },
          },
          {
            scope: ["entity.name.type"],
            settings: { foreground: theme.tokenColors.types },
          },
          {
            scope: ["entity.name.function"],
            settings: { foreground: theme.tokenColors.functions },
          },
          {
            scope: ["variable"],
            settings: { foreground: theme.tokenColors.variables },
          },
        ].filter((rule) => rule.settings.foreground !== undefined)
      : [],
  };

  try {
    // Create extensions/palette-forge-generated directory if it doesn't exist
    if (!fs.existsSync(paletteForgeExtDir)) {
      fs.mkdirSync(paletteForgeExtDir, { recursive: true });
    }

    // Write theme file
    fs.writeFileSync(themeFilePath, JSON.stringify(themeJson, null, 2), "utf8");

    // Update workbench.colorTheme to the generated theme
    // This is the key setting that switches the active theme
    config.update(
      "workbench.colorTheme",
      themeName,
      vscode.ConfigurationTarget.Global
    );

    // Also write customizations for overlay/refinement if needed
    if (theme.workbench && Object.keys(theme.workbench).length > 0) {
      const existing =
        (config.get<Record<string, unknown>>("workbench.colorCustomizations") as
          | Record<string, unknown>
          | undefined) ?? {};

      const activeTheme =
        vscode.workspace.getConfiguration("workbench").get<string>(
          "colorTheme",
          ""
        ) || "";
      const themeKey = activeTheme ? `[${activeTheme}]` : "";

      const mergedTop = { ...(existing as Record<string, unknown>), ...theme.workbench };

      if (themeKey) {
        const existingPer =
          existing && typeof existing[themeKey] === "object"
            ? (existing[themeKey] as Record<string, unknown>)
            : {};
        mergedTop[themeKey] = { ...(existingPer ?? {}), ...theme.workbench };
      }

      config.update(
        "workbench.colorCustomizations",
        mergedTop,
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
      const activeTheme = config.get("workbench.colorTheme");
      
      channel.appendLine("--- Palette Forge: Applied Theme ---");
      channel.appendLine(`Theme Name: ${themeName}`);
      channel.appendLine(`Theme File: ${themeFilePath}`);
      channel.appendLine(`Active Theme Setting (workbench.colorTheme): ${activeTheme}`);
      channel.appendLine("--- workbench.colorCustomizations ---");
      channel.appendLine(JSON.stringify(finalWorkbench, null, 2));
      channel.appendLine("--- editor.tokenColorCustomizations ---");
      channel.appendLine(JSON.stringify(finalToken, null, 2));
      channel.show(true);
    } catch (e) {
      // ignore
    }
  } catch (err) {
    vscode.window.showErrorMessage(
      `Palette Forge: Failed to write theme file. ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

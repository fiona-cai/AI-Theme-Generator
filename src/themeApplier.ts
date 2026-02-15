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
    const existing =
      (config.get<Record<string, unknown>>("editor.tokenColorCustomizations") as
        | Record<string, unknown>
        | undefined) ?? {};

    // Determine the active theme and its per-theme key (e.g. "[Default Dark+]")
    const activeTheme =
      vscode.workspace.getConfiguration("workbench").get<string>(
        "colorTheme",
        ""
      ) || "";
    const themeKey = activeTheme ? `[${activeTheme}]` : "";

    // We'll build a new object preserving existing structured entries (like textMateRules,
    // semanticTokenColors) while merging simple token color keys (comments, strings, etc.)
    const result: Record<string, unknown> = { ...existing };

    // Merge into top-level shorthand keys (comments/strings/keywords/...)
    for (const [k, v] of Object.entries(theme.tokenColors)) {
      result[k] = v;
    }

    // Also merge into the per-theme sub-object so per-theme customizations are updated
    if (themeKey) {
      const existingPerTheme =
        existing && typeof existing[themeKey] === "object"
          ? (existing[themeKey] as Record<string, unknown>)
          : undefined;
      result[themeKey] = { ...(existingPerTheme ?? {}), ...theme.tokenColors };
    }

    config.update(
      "editor.tokenColorCustomizations",
      result,
      vscode.ConfigurationTarget.Global
    );

    // Also attempt to update semantic token colors so languages using semantic
    // highlighting pick up the new palette. We map common shorthand keys to
    // likely semantic token types.
    try {
      const semExisting =
        (config.get<Record<string, unknown>>("editor.semanticTokenColorCustomizations") as
          | Record<string, unknown>
          | undefined) ?? {};

      const semanticMap: Record<string, string> = {};
      const mapFrom = {
        variables: "variable",
        functions: "function",
        types: "type",
        keywords: "keyword",
        strings: "string",
        numbers: "number",
      } as Record<string, string>;

      for (const [k, v] of Object.entries(theme.tokenColors)) {
        const semKey = (mapFrom as Record<string, string>)[k];
        if (semKey) semanticMap[semKey] = v;
      }

      if (Object.keys(semanticMap).length > 0) {
        const semResult: Record<string, unknown> = { ...semExisting };

        // Merge into global rules
        const existingRules =
          semExisting && typeof semExisting.rules === "object"
            ? (semExisting.rules as Record<string, unknown>)
            : {};
        semResult.rules = { ...existingRules };
        for (const [k, v] of Object.entries(semanticMap)) {
          semResult.rules = { ...(semResult.rules as Record<string, unknown>), [k]: { foreground: v } };
        }

        // Also set per-theme rules
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
            (semResult[themeKey] as Record<string, unknown>).rules = {
              ...((semResult[themeKey] as Record<string, any>).rules ?? {}),
              [k]: { foreground: v },
            };
          }
        }

        config.update(
          "editor.semanticTokenColorCustomizations",
          semResult,
          vscode.ConfigurationTarget.Global
        );
      }
    } catch (e) {
      // Non-critical; don't block if semantic update fails
      // keep silent - user still gets textMate customizations
    }
  }
}

import * as vscode from "vscode";
import { GeneratedTheme } from "./themeApplier";

const THEME_SYSTEM_PROMPT = `You are a VS Code theme designer. Given a short text description, you output a JSON object that can be used to customize the current theme.

Output ONLY valid JSON, no markdown or explanation. The JSON must have exactly two top-level keys:
1. "workbench" - object mapping workbench color IDs to hex colors (e.g. "#1e1e1e"). Use only these common IDs: editor.background, editor.foreground, editor.lineHighlightBackground, activityBar.background, activityBar.foreground, sideBar.background, sideBar.foreground, titleBar.activeBackground, titleBar.activeForeground, statusBar.background, statusBar.foreground, tab.activeBackground, tab.activeForeground, tab.inactiveBackground, tab.inactiveForeground, list.activeSelectionBackground, list.activeSelectionForeground, list.hoverBackground, input.background, input.foreground, input.border, button.background, button.foreground, focusBorder, scrollbarSlider.background, scrollbarSlider.hoverBackground, terminal.background, terminal.foreground, panelTitle.activeBackground, panelTitle.activeForeground, panelSectionHeader.background, panelSectionHeader.foreground.
2. "tokenColors" - object for editor.tokenColorCustomizations. Use only these keys (string values, hex colors): comments, strings, keywords, numbers, types, functions, variables. You can also use "textMateRules" as an array but prefer the simple keys when possible.

Support three base modes: "dark", "medium", and "light". For "dark" prefer low-light, high-contrast backgrounds (e.g. #0d1117, #0b1220). For "light" prefer bright backgrounds (e.g. #fafafa). For "medium" prefer muted mid-tone backgrounds that are neither fully dark nor fully light (e.g. #2b2f3a, #e7ecef) and slightly lower contrast for UI elements. When the user requests a mode, adapt the palette (backgrounds, UI accents, terminal colors, and panel/heading colors) accordingly.

All color values must be valid hex: #RGB or #RRGGBB. Generate a cohesive palette (5-20 workbench entries, 5-10 token entries) that matches the user's description and requested mode.`;

function getApiKey(): string {
  const config = vscode.workspace.getConfiguration("paletteForge");
  const key = config.get<string>("openaiApiKey", "");
  if (key) return key;
  return process.env.OPENAI_API_KEY ?? "";
}

function getModel(): string {
  const config = vscode.workspace.getConfiguration("paletteForge");
  return config.get<string>("model", "gpt-4o-mini");
}

export async function generateThemeFromPrompt(
  userPrompt: string,
  mode: string = "dark"
): Promise<GeneratedTheme | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "OpenAI API key not set. Add paletteForge.openaiApiKey in Settings or set OPENAI_API_KEY."
    );
  }

  const model = getModel();
    const body = {
      model,
      messages: [
        { role: "system", content: THEME_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Generate a VS Code theme for: "${userPrompt}"\nPreferred mode: "${mode}". Use "dark", "medium", or "light" rules for backgrounds and contrast.`,
        },
      ],
    temperature: 0.7,
    max_tokens: 1500,
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${err}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("Empty response from OpenAI");
  }

  // Strip markdown code fence if present
  let raw = content;
  const fence = raw.match(/^```(?:json)?\s*([\s\S]*?)```$/m);
  if (fence) raw = fence[1].trim();

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return null;
    }
    const obj = parsed as Record<string, unknown>;
    const workbench =
      typeof obj.workbench === "object" && obj.workbench !== null
        ? (obj.workbench as Record<string, string>)
        : undefined;
    const tokenColors =
      typeof obj.tokenColors === "object" && obj.tokenColors !== null
        ? (obj.tokenColors as Record<string, string>)
        : undefined;

    if (!workbench && !tokenColors) return null;

    return {
      workbench: workbench && Object.keys(workbench).length > 0 ? workbench : undefined,
      tokenColors:
        tokenColors && Object.keys(tokenColors).length > 0 ? tokenColors : undefined,
    };
  } catch {
    return null;
  }
}

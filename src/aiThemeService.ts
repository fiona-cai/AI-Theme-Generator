import * as vscode from "vscode";
import { GeneratedTheme } from "./themeApplier";

const LIGHT_THEME_REFERENCE = `
For "light" mode, base your colors on VS Code's "Light (Visual Studio)" theme:
- editor.background: #FFFFFF (white)
- editor.foreground: #000000 (black)
- editor.lineHighlightBackground: #E5EBF1 (very light blue)
- activityBar.background: #F3F3F3 (light gray)
- sideBar.background: #F3F3F3 (light gray)
- sideBar.foreground: #333333 (dark gray)
- list.hoverBackground: #E8E8E8 (light gray)
- tab.activeBackground: #FFFFFF (white)
- tab.inactiveBackground: #E8E8E8 (light gray)
- statusBar.background: #007ACC (blue accent)
Token colors: comments=#008000 (green), strings=#a31515 (red), keywords=#0000ff (blue), numbers=#098658 (green), types=#800000 (maroon), functions=#0451a5 (blue), variables=#000000 (black)
Keep light mode bright, professional, and readable with high contrast. Use these proven colors as a base for any variations.
`;

const THEME_SYSTEM_PROMPT = `You are a VS Code theme designer. Given a short text description, you output a JSON object that can be used to customize the current theme.

Output ONLY valid JSON, no markdown or explanation. The JSON must have exactly two top-level keys:
1. "workbench" - object mapping workbench color IDs to hex colors (e.g. "#1e1e1e"). Include as many of these keys as possible: editor.background, editor.foreground, editor.lineHighlightBackground, activityBar.background, activityBar.foreground, sideBar.background, sideBar.foreground, sideBarTitle.foreground, titleBar.activeBackground, titleBar.activeForeground, statusBar.background, statusBar.foreground, tab.activeBackground, tab.activeForeground, tab.inactiveBackground, tab.inactiveForeground, list.activeSelectionBackground, list.activeSelectionForeground, list.hoverBackground, input.background, input.foreground, input.border, button.background, button.foreground, focusBorder, scrollbarSlider.background, scrollbarSlider.hoverBackground, terminal.background, terminal.foreground, panelTitle.activeForeground, panelTitle.inactiveForeground, panelSectionHeader.background, panelSectionHeader.foreground, gitDecoration.modifiedResourceForeground, gitDecoration.addedResourceForeground.
2. "tokenColors" - object for editor.tokenColorCustomizations. Use only these keys (string values, hex colors): comments, strings, keywords, numbers, types, functions, variables. You can also use "textMateRules" as an array but prefer the simple keys when possible.

Support three base modes: "dark", "medium", and "light".

For "dark" mode: Use deep, high-contrast backgrounds (e.g. #0d1117, #0b1220). Prefer lighter text on dark backgrounds. Use saturated accents.

For "light" mode: ${LIGHT_THEME_REFERENCE} Generate light, professional themes suitable for daytime use.

For "medium" mode: Use balanced mid-tone backgrounds (e.g. #2b2f3a, #e7ecef) with medium contrast. Good for people who want something between light and dark.

All color values must be valid hex: #RGB or #RRGGBB. Generate a cohesive palette (10-30 workbench entries, 5-7 token entries) that matches the user's description and adheres strictly to the requested mode. Use consistent saturation and contrast across all colors.`;

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
        content: `Generate a VS Code theme for: "${userPrompt}"\nMode: ${mode}. Use ONLY ${mode} mode rules for backgrounds, contrast, and all colors. Ensure this is a cohesive ${mode}-mode palette.`,
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

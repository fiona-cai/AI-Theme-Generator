import * as vscode from "vscode";
import { GeneratedTheme } from "./themeApplier";

const LIGHT_THEME_REFERENCE = `
For "light" mode, base your colors on VS Code's "Default Light Modern" theme:
- editor.background: #FFFFFF (white)
- editor.foreground: #3B3B3B (dark gray)
- editor.inactiveSelectionBackground: #E5EBF1 (very light blue)
- editor.selectionHighlightBackground: #ADD6FF80 (light blue with alpha)
- editorLineNumber.foreground: #6E7681 (muted gray)
- editorLineNumber.activeForeground: #171184 (dark blue)
- editorIndentGuide.background1: #D3D3D3 (light gray)
- activityBar.background: #F8F8F8 (off-white)
- activityBar.foreground: #1F1F1F (dark gray)
- activityBar.inactiveForeground: #616161 (medium gray)
- activityBarBadge.background: #005FB8 (blue accent)
- activityBarBadge.foreground: #FFFFFF (white)
- sideBar.background: #F8F8F8 (off-white)
- sideBar.foreground: #3B3B3B (dark gray)
- sideBar.border: #E5E5E5 (light border)
- sideBarTitle.foreground: #3B3B3B (dark gray)
- sideBarSectionHeader.background: #F8F8F8 (off-white)
- sideBarSectionHeader.foreground: #3B3B3B (dark gray)
- sideBarSectionHeader.border: #E5E5E5 (light border)
- titleBar.activeBackground: #F8F8F8 (off-white)
- titleBar.activeForeground: #1E1E1E (very dark)
- titleBar.border: #E5E5E5 (light border)
- titleBar.inactiveBackground: #F8F8F8 (off-white)
- titleBar.inactiveForeground: #8B949E (muted gray)
- statusBar.background: #F8F8F8 (off-white)
- statusBar.foreground: #3B3B3B (dark gray)
- statusBar.border: #E5E5E5 (light border)
- statusBar.focusBorder: #005FB8 (blue accent)
- statusBarItem.hoverBackground: #1F1F1F11 (dark with alpha)
- statusBarItem.hoverForeground: #000000 (black)
- statusBarItem.remoteBackground: #005FB8 (blue accent)
- statusBarItem.remoteForeground: #FFFFFF (white)
- tab.activeBackground: #FFFFFF (white)
- tab.activeForeground: #3B3B3B (dark gray)
- tab.activeBorderTop: #005FB8 (blue accent)
- tab.inactiveBackground: #F8F8F8 (off-white)
- tab.inactiveForeground: #868686 (medium gray)
- tab.border: #E5E5E5 (light border)
- tab.selectedBorderTop: #68a3da (light blue)
- list.activeSelectionBackground: #E8E8E8 (light gray)
- list.activeSelectionForeground: #000000 (black)
- list.hoverBackground: #F2F2F2 (very light gray)
- list.focusAndSelectionOutline: #005FB8 (blue accent)
- input.background: #FFFFFF (white)
- input.foreground: #3B3B3B (dark gray)
- input.border: #CECECE (light border)
- input.placeholderForeground: #767676 (medium gray)
- button.background: #005FB8 (blue accent)
- button.foreground: #FFFFFF (white)
- button.hoverBackground: #0258A8 (darker blue)
- button.secondaryBackground: #E5E5E5 (light border)
- button.secondaryForeground: #3B3B3B (dark gray)
- button.secondaryHoverBackground: #CCCCCC (light gray)
- focusBorder: #005FB8 (blue accent)
- scrollbarSlider.background: #CCCCCC (light gray)
- scrollbarSlider.hoverBackground: #B3B3B3 (medium gray)
- editorGutter.addedBackground: #2EA043 (green)
- editorGutter.modifiedBackground: #005FB8 (blue)
- editorGutter.deletedBackground: #F85149 (red)
- panel.background: #F8F8F8 (off-white)
- panel.border: #E5E5E5 (light border)
- panelTitle.activeForeground: #3B3B3B (dark gray)
- panelTitle.inactiveForeground: #3B3B3B (dark gray)
- panelTitle.activeBorder: #005FB8 (blue accent)
- panelSectionHeader.background: #F8F8F8 (off-white)
- panelSectionHeader.foreground: #3B3B3B (dark gray)
- terminal.foreground: #3B3B3B (dark gray)
- terminal.tab.activeBorder: #005FB8 (blue accent)
- editorGroupHeader.tabsBackground: #F8F8F8 (off-white)
- editorGroupHeader.tabsBorder: #E5E5E5 (light border)
- editorGroup.border: #E5E5E5 (light border)
- widget.border: #E5E5E5 (light border)
- notificationCenterHeader.background: #FFFFFF (white)
- notificationCenterHeader.foreground: #3B3B3B (dark gray)
- notifications.background: #FFFFFF (white)
- notifications.border: #E5E5E5 (light border)
- notifications.foreground: #3B3B3B (dark gray)
Token colors: comments=#008000 (green), strings=#A31515 (red), keywords=#0000FF (blue), numbers=#098658 (green), types=#800000 (maroon), functions=#0451a5 (blue), variables=#3B3B3B (dark gray)
Keep light mode bright, professional, and readable with high contrast on white backgrounds. Use these proven colors from Default Light Modern as base for any variations.
`;

const DARK_THEME_REFERENCE = `
For "dark" mode, base your colors on VS Code's "Default Dark Modern" theme:
- editor.background: #1F1F1F (dark gray)
- editor.foreground: #CCCCCC (light gray)
- editorLineNumber.foreground: #6E7681 (muted gray)
- editorLineNumber.activeForeground: #CCCCCC (light gray)
- editorIndentGuide.background1: Not directly specified, but use #3C3C3C (very dark gray)
- activityBar.background: #181818 (very dark)
- activityBar.foreground: #D7D7D7 (light gray)
- activityBar.inactiveForeground: #868686 (medium gray)
- activityBar.activeBorder: #0078D4 (blue accent)
- activityBar.border: #2B2B2B (dark border)
- activityBarBadge.background: #0078D4 (blue accent)
- activityBarBadge.foreground: #FFFFFF (white)
- sideBar.background: #181818 (very dark)
- sideBar.foreground: #CCCCCC (light gray)
- sideBar.border: #2B2B2B (dark border)
- sideBarTitle.foreground: #CCCCCC (light gray)
- sideBarSectionHeader.background: #181818 (very dark)
- sideBarSectionHeader.foreground: #CCCCCC (light gray)
- sideBarSectionHeader.border: #2B2B2B (dark border)
- titleBar.activeBackground: #181818 (very dark)
- titleBar.activeForeground: #CCCCCC (light gray)
- titleBar.border: #2B2B2B (dark border)
- titleBar.inactiveBackground: #1F1F1F (dark gray)
- titleBar.inactiveForeground: #9D9D9D (muted gray)
- statusBar.background: #181818 (very dark)
- statusBar.foreground: #CCCCCC (light gray)
- statusBar.border: #2B2B2B (dark border)
- statusBar.focusBorder: #0078D4 (blue accent)
- statusBarItem.hoverBackground: #F1F1F133 (light with alpha)
- statusBarItem.hoverForeground: #FFFFFF (white)
- statusBarItem.remoteBackground: #0078D4 (blue accent)
- statusBarItem.remoteForeground: #FFFFFF (white)
- statusBar.debuggingBackground: #0078D4 (blue accent)
- statusBar.debuggingForeground: #FFFFFF (white)
- tab.activeBackground: #1F1F1F (dark gray)
- tab.activeForeground: #FFFFFF (white)
- tab.activeBorderTop: #0078D4 (blue accent)
- tab.inactiveBackground: #181818 (very dark)
- tab.inactiveForeground: #9D9D9D (muted gray)
- tab.border: #2B2B2B (dark border)
- tab.selectedBorderTop: #6caddf (light blue)
- list.activeSelectionBackground: #0078D4 (blue accent)
- list.activeSelectionForeground: #FFFFFF (white)
- list.hoverBackground: #1F1F1F (dark gray, subtle)
- list.focusAndSelectionOutline: #0078D4 (blue accent)
- input.background: #313131 (dark gray)
- input.foreground: #CCCCCC (light gray)
- input.border: #3C3C3C (very dark gray)
- input.placeholderForeground: #989898 (muted gray)
- button.background: #0078D4 (blue accent)
- button.foreground: #FFFFFF (white)
- button.hoverBackground: #026EC1 (darker blue)
- button.secondaryBackground: #00000000 (transparent)
- button.secondaryForeground: #CCCCCC (light gray)
- button.secondaryHoverBackground: #2B2B2B (dark)
- focusBorder: #0078D4 (blue accent)
- scrollbarSlider.background: #4E4E4E (medium gray)
- scrollbarSlider.hoverBackground: #5E5E5E (lighter gray)
- editorGutter.addedBackground: #2EA043 (green)
- editorGutter.modifiedBackground: #0078D4 (blue)
- editorGutter.deletedBackground: #F85149 (red)
- panel.background: #181818 (very dark)
- panel.border: #2B2B2B (dark border)
- panelTitle.activeForeground: #CCCCCC (light gray)
- panelTitle.inactiveForeground: #9D9D9D (muted gray)
- panelTitle.activeBorder: #0078D4 (blue accent)
- panelSectionHeader.background: #181818 (very dark)
- panelSectionHeader.foreground: #CCCCCC (light gray)
- terminal.foreground: #CCCCCC (light gray)
- terminal.tab.activeBorder: #0078D4 (blue accent)
- editorGroupHeader.tabsBackground: #181818 (very dark)
- editorGroupHeader.tabsBorder: #2B2B2B (dark border)
- editorGroup.border: #FFFFFF17 (white with alpha)
- widget.border: #313131 (dark gray)
- notificationCenterHeader.background: #1F1F1F (dark gray)
- notificationCenterHeader.foreground: #CCCCCC (light gray)
- notifications.background: #1F1F1F (dark gray)
- notifications.border: #2B2B2B (dark border)
- notifications.foreground: #CCCCCC (light gray)
Token colors: comments=#6A737D (muted gray), strings=#A5D6FF (light blue), keywords=#FF7B72 (light red), numbers=#79C0FF (bright blue), types=#F0883E (orange), functions=#D2A8FF (light purple), variables=#CCCCCC (light gray)
Keep dark mode high-contrast with saturated accents (#0078D4 blue, #FF7B72 red, etc.). Use these proven colors from Default Dark Modern as base for variations.
`;

const THEME_SYSTEM_PROMPT = `You are a VS Code theme designer. Given a short text description, you output a JSON object that can be used to customize the current theme.

Output ONLY valid JSON, no markdown or explanation. The JSON must have exactly two top-level keys:
1. "workbench" - object mapping workbench color IDs to hex colors (e.g. "#1e1e1e"). Include as many of these keys as possible: editor.background, editor.foreground, editor.lineHighlightBackground, editorLineNumber.foreground, activityBar.background, activityBar.foreground, sideBar.background, sideBar.foreground, sideBarTitle.foreground, sideBarSectionHeader.background, sideBarSectionHeader.foreground, titleBar.activeBackground, titleBar.activeForeground, statusBar.background, statusBar.foreground, statusBarItem.remoteBackground, statusBarItem.remoteForeground, tab.activeBackground, tab.activeForeground, tab.inactiveBackground, tab.inactiveForeground, tab.selectedBorderTop, list.activeSelectionBackground, list.activeSelectionForeground, list.hoverBackground, input.background, input.foreground, input.border, button.background, button.foreground, button.hoverBackground, focusBorder, scrollbarSlider.background, scrollbarSlider.hoverBackground, terminal.background, terminal.foreground, terminal.tab.activeBorder, panelTitle.activeForeground, panelTitle.inactiveForeground, panelSectionHeader.background, panelSectionHeader.foreground, editorGutter.addedBackground, editorGutter.modifiedBackground, editorGutter.deletedBackground, notificationCenterHeader.background, panel.background, panel.border, widget.border.
2. "tokenColors" - object for editor.tokenColorCustomizations. Use only these keys (string values, hex colors): comments, strings, keywords, numbers, types, functions, variables. You can also use "textMateRules" as an array but prefer the simple keys when possible.

Support three base modes: "dark", "medium", and "light".

For "dark" mode: ${DARK_THEME_REFERENCE} Generate dark, professional themes with high contrast for low-light environments.

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

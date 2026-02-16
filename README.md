# AI Theme Generator

Generate and instantly apply custom VS Code themes from a text prompt using AI.

## How it works

1. Run **Palette Forge: Generate theme from prompt** from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. **Select a mode**: Choose between **Dark**, **Medium**, or **Light** to set the base brightness/contrast for the generated theme.
   - **Light**: Calibrated to VS Code's "Light (Visual Studio)" theme — professional, high-contrast colors for daytime use.
   - **Dark**: Deep, high-contrast backgrounds with saturated accents.
   - **Medium**: Balanced mid-tones suitable for flexible lighting conditions.
3. Enter a short description (e.g. *"warm sunset with amber and deep purple"*, *"minimal nord dark"*, *"ocean at dusk with teal and coral"*).
4. The extension uses OpenAI to generate a cohesive color palette and:
   - Writes a complete VS Code theme file.
   - Updates `workbench.colorTheme` to use the generated theme.
   - Also updates color customizations for overlay refinement.
   - Changes are applied instantly—no reload required.

## Setup

1. **OpenAI API key**  
   - In VS Code: **Settings** → search for `Palette Forge` → set **OpenAI Api Key**, or  
   - Set the `OPENAI_API_KEY` environment variable.

2. **(Optional)** Change the model in settings (`paletteForge.model`). Default is `gpt-4o-mini`; you can use `gpt-4o` for more creative themes.

## What gets customized

- **Workbench colors**: editor background/foreground, side bar, activity bar, title bar, status bar, tabs, lists, inputs, buttons, scrollbars, terminal, panels, git decorations, and more.
- **Editor tokens**: comments, strings, keywords, numbers, types, functions, variables (TextMate rules).
- **Semantic tokens**: variable, function, type, keyword, string, number.

The theme is stored and persisted; customizations layer on top for refinement.

## Color Mode Calibration

### Light Mode
Light themes are calibrated to **VS Code's "Light (Visual Studio)"** theme, ensuring professional, proven color choices:
- Editor background: `#FFFFFF` (white)
- Editor foreground: `#000000` (black)
- Token colors: comments green, strings red, keywords blue, numbers dark green, types maroon, functions blue, variables black
- Perfect for daytime development with high contrast and readability

### Dark Mode
Dark themes use deep, high-contrast backgrounds with saturated accents. Example:
- Editor background: `#0d1117` (very dark blue-black)
- Editor foreground: `#c9d1d9` (light gray)
- Ideal for low-light environments

### Medium Mode
Medium themes provide balanced mid-tone backgrounds with moderate contrast. Good for flexible lighting conditions.

## Development

```bash
npm install
npm run compile
```

Press **F5** in VS Code to open an Extension Development Host and try the command there.

## Debug output

After applying a theme, an output panel named **"Palette Forge"** opens showing:
- The generated theme name and file path.
- The exact `workbench.colorCustomizations` and `editor.tokenColorCustomizations` applied.

This helps you verify which colors were written and debug any missing elements.

## License

MIT

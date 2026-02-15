# Palette Forge

Generate and instantly apply custom VS Code themes from a text prompt using AI.

## How it works

1. Run **Palette Forge: Generate theme from prompt** from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Enter a short description (e.g. *"warm sunset with amber and deep purple"*, *"minimal nord dark"*, *"ocean at dusk with teal and coral"*).
3. The extension uses OpenAI to generate a cohesive color palette and applies it as **color customizations** on top of your current theme—no reload required.

## Setup

1. **OpenAI API key**  
   - In VS Code: **Settings** → search for `Palette Forge` → set **OpenAI Api Key**, or  
   - Set the `OPENAI_API_KEY` environment variable.

2. **(Optional)** Change the model in settings (`paletteForge.model`). Default is `gpt-4o-mini`; you can use `gpt-4o` for more creative themes.

## What gets customized

- **Workbench**: editor background/foreground, side bar, activity bar, title bar, status bar, tabs, lists, inputs, buttons, scrollbars, etc.
- **Editor tokens**: comments, strings, keywords, numbers, types, functions, variables.

Customizations are written to your user settings (`workbench.colorCustomizations` and `editor.tokenColorCustomizations`), so they persist and layer on top of any base theme.

## Development

```bash
npm install
npm run compile
```

Press **F5** in VS Code to open an Extension Development Host and try the command there.

## License

MIT

# AI Theme Generator

**Generate and instantly apply custom VS Code themes from a text prompt using AI.**  
Clean, fast, and configurable – with a small friendly mascot in the icon if you like a bit of personality.

![AI Theme Generator Icon](./icon.png)

## How it works

1. **Run the command**
   - Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
   - Run **AI Theme Generator: Create theme from prompt**.

2. **Pick a base mode**
   - **Dark** – deep, high‑contrast backgrounds.
   - **Medium** – balanced, semi‑dark.
   - **Light** – bright, light backgrounds.

3. **Describe your theme**
   - Examples:
     - `"warm sunset with amber and deep purple"`
     - `"minimal nord dark"`
     - `"ocean at dusk with teal and coral accents"`

4. **AI does the rest**
   AI Theme Generator uses OpenAI to:
   - Generate a cohesive, editor‑friendly color palette.
   - Write a complete VS Code theme file.
   - Set `workbench.colorTheme` to your newly generated theme.
   - Add `workbench.colorCustomizations` and `editor.tokenColorCustomizations` for extra refinement.

5. **Instant results**
   - No window reloads.
   - No manual JSON editing.
   - Your AI‑generated theme appears as soon as it’s created.

## Setup

### OpenAI API key

AI Theme Generator needs access to the OpenAI API:

- **VS Code Settings**
  - Open **Settings** → search for **“AI Theme Generator”**.
  - Set **OpenAI API Key**.

- **Or via environment variable**
  - Set `OPENAI_API_KEY` in your shell environment.

### Model configuration

- Default model: `gpt-4o-mini`
- Change it in Settings (AI Theme Generator → Model) if you want:
  - `gpt-4o-mini` – fast and efficient.
  - `gpt-4o` – more creative palettes.

## What gets customized

AI Theme Generator doesn’t just repaint the background; it tunes the whole workspace:

- **Workbench colors**
  - Editor background and foreground
  - Side bar, activity bar, title bar, status bar
  - Tabs, lists, inputs, buttons
  - Panels, terminal, scrollbars
  - Git decorations, and more

- **Editor (TextMate) tokens**
  - Comments, strings, keywords
  - Numbers, types, functions, variables

- **Semantic tokens**
  - `variable`, `function`, `type`, `keyword`, `string`, `number`, and more

Your generated theme is stored and persisted, with customizations layered on top so you can fine‑tune details later.

## Color mode calibration

### Light mode

Calibrated against VS Code’s **“Light (Visual Studio)”** theme so things stay crisp and legible:

- Editor background: `#FFFFFF`
- Editor foreground: `#000000`
- Classic token colors:
  - Comments: green
  - Strings: red
  - Keywords: blue
  - Numbers: dark green
  - Types: maroon
  - Functions: blue
  - Variables: black

Great for all‑day, high‑contrast coding in bright environments.

### Dark mode

Deep, high‑contrast backgrounds with vibrant accents:

- Example baseline:
  - Editor background: `#0d1117`
  - Editor foreground: `#c9d1d9`

Perfect for late‑night sessions in a dim room.

### Medium mode

Balanced mid‑tone backgrounds and moderate contrast:

- Easy on the eyes when your lighting changes.
- Ideal if you switch between light and dark environments but don’t want to swap themes constantly.

## Development

Want to tinker with AI Theme Generator itself?

```bash
npm install
npm run compile
```

Then:

- Press **F5** in VS Code to open an **Extension Development Host**.
- In that window, run **AI Theme Generator: Create theme from prompt** to try it out.

## Debug output

After a theme is applied, an output panel named **“AI Theme Generator”** opens and shows:

- The generated theme name and file path.
- The exact `workbench.colorCustomizations` used.
- The exact `editor.tokenColorCustomizations` applied.

Use this to verify what colors were written, copy favorite values, or debug anything that looks off.

## License

MIT – fork it, remix it, and keep generating new AI‑powered themes.

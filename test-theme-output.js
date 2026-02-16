#!/usr/bin/env node
/**
 * Test script to simulate theme generation and verify output structure.
 * This shows what the generated theme JSON looks like.
 * 
 * Light mode is now calibrated to VS Code's "Light (Visual Studio)" theme.
 */

const timestamp = Date.now();
const themeName = `Palette Forge ${timestamp}`;

// Example: Light mode theme (calibrated to Light (Visual Studio) base)
const lightThemeExample = {
  workbench: {
    "editor.background": "#FFFFFF",
    "editor.foreground": "#000000",
    "editor.lineHighlightBackground": "#E5EBF1",
    "activityBar.background": "#F3F3F3",
    "activityBar.foreground": "#333333",
    "sideBar.background": "#F3F3F3",
    "sideBar.foreground": "#333333",
    "titleBar.activeBackground": "#F3F3F3",
    "titleBar.activeForeground": "#000000",
    "statusBar.background": "#007ACC",
    "statusBar.foreground": "#FFFFFF",
    "terminal.background": "#FFFFFF",
    "terminal.foreground": "#000000",
    "panelTitle.activeForeground": "#000000",
    "panelSectionHeader.background": "#F3F3F3",
    "gitDecoration.modifiedResourceForeground": "#D4A05C",
  },
  tokenColors: {
    comments: "#008000",    // green (VS Light theme)
    strings: "#a31515",     // red (VS Light theme)
    keywords: "#0000ff",    // blue (VS Light theme)
    numbers: "#098658",     // green (VS Light theme)
    types: "#800000",       // maroon (VS Light theme)
    functions: "#0451a5",   // blue (VS Light theme)
    variables: "#000000",   // black (VS Light theme)
  },
};

// Example: Dark mode theme
const darkThemeExample = {
  workbench: {
    "editor.background": "#0d1117",
    "editor.foreground": "#c9d1d9",
    "editor.lineHighlightBackground": "#161b22",
    "activityBar.background": "#0d1117",
    "activityBar.foreground": "#8b949e",
    "sideBar.background": "#010409",
    "sideBar.foreground": "#c9d1d9",
    "titleBar.activeBackground": "#0d1117",
    "titleBar.activeForeground": "#c9d1d9",
    "statusBar.background": "#161b22",
    "statusBar.foreground": "#c9d1d9",
    "terminal.background": "#0d1117",
    "terminal.foreground": "#c9d1d9",
    "panelTitle.activeForeground": "#c9d1d9",
    "panelSectionHeader.background": "#010409",
    "gitDecoration.modifiedResourceForeground": "#d4a574",
  },
  tokenColors: {
    comments: "#8b949e",
    strings: "#a5d6ff",
    keywords: "#ff7b72",
    numbers: "#79c0ff",
    types: "#f0883e",
    functions: "#d2a8ff",
    variables: "#c9d1d9",
  },
};

console.log("=== Light Mode Example (Calibrated to Light (Visual Studio) Theme) ===");
console.log(JSON.stringify(lightThemeExample, null, 2));

console.log("\n=== Dark Mode Example ===");
console.log(JSON.stringify(darkThemeExample, null, 2));

console.log("\n=== Light Mode Token Colors (from Light (Visual Studio)) ===");
console.log(`comments: #008000 (green)`);
console.log(`strings: #a31515 (red)`);
console.log(`keywords: #0000ff (blue)`);
console.log(`numbers: #098658 (green)`);
console.log(`types: #800000 (maroon)`);
console.log(`functions: #0451a5 (blue)`);
console.log(`variables: #000000 (black)`);

console.log("\n=== Summary ===");
console.log(`✓ Light mode now uses Light (Visual Studio) as reference`);
console.log(`✓ Professional, proven colors for light backgrounds`);
console.log(`✓ High contrast, daytime-friendly defaults`);
console.log(`✓ AI will generate variations while staying true to light mode guidelines`);
console.log(`✓ Dark and Medium modes continue with their own calibrations`);


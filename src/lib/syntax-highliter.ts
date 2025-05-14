import "./shiki-theming.css";
import { createHighlighterCore, HighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import lightPlus from "shiki/themes/light-plus.mjs";
import darkPlus from "shiki/themes/dark-plus.mjs";
import jsonLang from "shiki/langs/json.mjs";
import htmlLang from "shiki/langs/html.mjs";

let highlighter: HighlighterCore;

export const syntaxHighlight = async (code: string, lang: string) => {
  highlighter ??= await createHighlighterCore({
    engine: createOnigurumaEngine(import("shiki/wasm")),
    themes: [lightPlus, darkPlus],
    langs: [htmlLang, jsonLang],
  });

  return highlighter.codeToHtml(code, {
    lang: lang,
    defaultColor: false,
    themes: {
      light: "light-plus",
      dark: "dark-plus",
    },
  });
};

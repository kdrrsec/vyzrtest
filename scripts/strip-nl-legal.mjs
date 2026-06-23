import fs from "node:fs";

const src = "c:/Users/kgoga/Desktop/Vyzr-github-export/src/lib/legal-document.ts";
const dest = "c:/Users/kgoga/Desktop/Vyzr/src/lib/legal-document.ts";

let s = fs.readFileSync(src, "utf8");
s = s.replace(/const nl: LegalBlock\[\] = \[[\s\S]*?\];\s*\n\s*const en:/, "const en:");
s = s.replace(
  /export function getLegalBlocks\(locale: string\): LegalBlock\[\] \{\s*return locale === "nl" \? nl : en;\s*\}/,
  "export function getLegalBlocks(): LegalBlock[] {\n  return en;\n}"
);
fs.writeFileSync(dest, s, "utf8");
console.log("ok");

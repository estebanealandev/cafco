const fs = require("fs");
const html = fs.readFileSync("C:/Users/esteb/Downloads/index.html", "utf8");

const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (cssMatch) {
  let css = cssMatch[1];
  // Convert custom properties in :root to Tailwind @theme optionally, but keeping pure CSS is safer and guaranteed identical.
  // The manifest allows Tailwind 4 without theme file if needed, but it's simpler to just append it.
  const rootMatch = css.match(/:root\s*{([\s\S]*?)}/);
  if (rootMatch) {
    let rootVars = rootMatch[1];
    rootVars = rootVars.replace(/\/\*.*?\*\//g, "");
    const themeVars =
      rootVars
        .split(";")
        .map((l) => l.trim())
        .filter(Boolean)
        .join(";\n  ") + ";";

    const tailwindTheme = `
@import 'tailwindcss';
@import './fonts.css';

@theme {
  ${themeVars.replace(/(--font-.*?:)(.*);/g, "$1 $2, sans-serif;")}
}

@layer base {
  :root {
    --background: var(--color-bg);
    --foreground: var(--color-text);
  }

  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-body);
  }
}
      `.trim();

    // We will actually just write back the whole raw css block into globals.css after importing tailwindcss
    const fullCss = `
@import 'tailwindcss';
@import './fonts.css';

@layer base {
  :root {
    --background: #F5F1EC;
    --foreground: #2C2824;
  }
}

${css}
`;
    fs.writeFileSync("src/app/globals.css", fullCss);
  }
}

const bodyMatch = html.match(/<body>([\s\S]*?)<script>/);
if (bodyMatch) {
  let body = bodyMatch[1];

  body = body.replace(/class=/g, "className=");
  body = body.replace(/stroke-width/g, "strokeWidth");
  body = body.replace(/stroke-opacity/g, "strokeOpacity");
  body = body.replace(/fill-opacity/g, "fillOpacity");
  body = body.replace(/fill-rule/g, "fillRule");

  // self closing tags
  body = body.replace(/<img([^>]*)>/g, (m, p1) => {
    return p1.endsWith("/") ? m : `<img${p1} />`;
  });
  body = body.replace(/<input([^>]*)>/g, (m, p1) => {
    return p1.endsWith("/") ? m : `<input${p1} />`;
  });
  body = body.replace(/<hr([^>]*)>/g, (m, p1) => {
    return p1.endsWith("/") ? m : `<hr${p1} />`;
  });
  body = body.replace(/<br>/g, "<br />");

  // Convert inline styles to React style objects
  body = body.replace(/style="([^"]*)"/g, (match, p1) => {
    const rules = p1.split(";").filter((r) => r.trim());
    const obj = {};
    rules.forEach((r) => {
      let [k, ...vParts] = r.split(":");
      const v = vParts.join(":");
      if (k && v) {
        const camelK = k.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        obj[camelK] = v.trim();
      }
    });
    return `style={${JSON.stringify(obj)}}`;
  });

  // HTML event handlers
  body = body.replace(/onsubmit="[^"]*"/g, "");

  fs.writeFileSync("parsed_body.txt", body);
}
console.log("Done.");

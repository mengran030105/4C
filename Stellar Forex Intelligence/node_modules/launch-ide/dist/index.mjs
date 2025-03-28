var R = Object.defineProperty, N = Object.defineProperties;
var k = Object.getOwnPropertyDescriptors;
var P = Object.getOwnPropertySymbols;
var W = Object.prototype.hasOwnProperty, F = Object.prototype.propertyIsEnumerable;
var D = (t, e, o) => e in t ? R(t, e, { enumerable: !0, configurable: !0, writable: !0, value: o }) : t[e] = o, _ = (t, e) => {
  for (var o in e || (e = {}))
    W.call(e, o) && D(t, o, e[o]);
  if (P)
    for (var o of P(e))
      F.call(e, o) && D(t, o, e[o]);
  return t;
}, v = (t, e) => N(t, k(e));
import y from "fs";
import x from "path";
import g from "child_process";
import H from "os";
import u from "chalk";
import B from "dotenv";
const $ = {
  "/Cursor.app/Contents/MacOS/Cursor": "/Cursor.app/Contents/MacOS/Cursor",
  "/Windsurf.app/Contents/MacOS/Electron": "/Windsurf.app/Contents/MacOS/Electron",
  "/Visual Studio Code.app/Contents/MacOS/Electron": "/Visual Studio Code.app/Contents/MacOS/Electron",
  "/Visual Studio Code - Insiders.app/Contents/MacOS/Electron": "/Visual Studio Code - Insiders.app/Contents/MacOS/Electron",
  "/VSCodium.app/Contents/MacOS/Electron": "/VSCodium.app/Contents/MacOS/Electron",
  "/WebStorm.app/Contents/MacOS/webstorm": "/WebStorm.app/Contents/MacOS/webstorm",
  "/HBuilderX.app/Contents/MacOS/HBuilderX": "/HBuilderX.app/Contents/MacOS/HBuilderX",
  "/Atom.app/Contents/MacOS/Atom": "atom",
  "/Atom Beta.app/Contents/MacOS/Atom Beta": "/Atom Beta.app/Contents/MacOS/Atom Beta",
  "/Brackets.app/Contents/MacOS/Brackets": "brackets",
  "/Sublime Text.app/Contents/MacOS/Sublime Text": "/Sublime Text.app/Contents/SharedSupport/bin/subl",
  "/Sublime Text.app/Contents/MacOS/sublime_text": "/Sublime Text.app/Contents/SharedSupport/bin/subl",
  "/Sublime Text 2.app/Contents/MacOS/Sublime Text 2": "/Sublime Text 2.app/Contents/SharedSupport/bin/subl",
  "/Sublime Text Dev.app/Contents/MacOS/Sublime Text": "/Sublime Text Dev.app/Contents/SharedSupport/bin/subl",
  "/PhpStorm.app/Contents/MacOS/phpstorm": "/PhpStorm.app/Contents/MacOS/phpstorm",
  "/PyCharm.app/Contents/MacOS/pycharm": "/PyCharm.app/Contents/MacOS/pycharm",
  "/PyCharm CE.app/Contents/MacOS/pycharm": "/PyCharm CE.app/Contents/MacOS/pycharm",
  "/IntelliJ IDEA.app/Contents/MacOS/idea": "/IntelliJ IDEA.app/Contents/MacOS/idea",
  "/IntelliJ IDEA Ultimate.app/Contents/MacOS/idea": "/IntelliJ IDEA Ultimate.app/Contents/MacOS/idea",
  "/IntelliJ IDEA Community Edition.app/Contents/MacOS/idea": "/IntelliJ IDEA Community Edition.app/Contents/MacOS/idea",
  "/Zed.app/Contents/MacOS/zed": "zed",
  "/GoLand.app/Contents/MacOS/goland": "/GoLand.app/Contents/MacOS/goland",
  "/AppCode.app/Contents/MacOS/appcode": "/AppCode.app/Contents/MacOS/appcode",
  "/CLion.app/Contents/MacOS/clion": "/CLion.app/Contents/MacOS/clion",
  "/RubyMine.app/Contents/MacOS/rubymine": "/RubyMine.app/Contents/MacOS/rubymine",
  "/MacVim.app/Contents/MacOS/MacVim": "mvim",
  "/Rider.app/Contents/MacOS/rider": "/Rider.app/Contents/MacOS/rider"
}, L = {
  code: ["/Visual Studio Code.app/Contents/MacOS/Electron"],
  "code-insiders": ["/Visual Studio Code - Insiders.app/Contents/MacOS/Electron"],
  webstorm: ["/WebStorm.app/Contents/MacOS/webstorm"],
  cursor: ["/Cursor.app/Contents/MacOS/Cursor"],
  windsurf: ["/Windsurf.app/Contents/MacOS/Electron"],
  atom: ["/Atom.app/Contents/MacOS/Atom"],
  hbuilder: ["/HBuilderX.app/Contents/MacOS/HBuilderX"],
  phpstorm: ["/PhpStorm.app/Contents/MacOS/phpstorm"],
  pycharm: ["/PyCharm.app/Contents/MacOS/pycharm"],
  idea: ["/IntelliJ IDEA.app/Contents/MacOS/idea"],
  codium: ["/VSCodium.app/Contents/MacOS/Electron"],
  goland: ["/GoLand.app/Contents/MacOS/goland"],
  colin: ["/CLion.app/Contents/MacOS/clion"],
  appcode: ["/AppCode.app/Contents/MacOS/appcode"],
  "atom-beta": ["/Atom Beta.app/Contents/MacOS/Atom Beta"],
  brackets: ["/Brackets.app/Contents/MacOS/Brackets"],
  rider: ["/Rider.app/Contents/MacOS/rider"],
  rubymine: ["/RubyMine.app/Contents/MacOS/rubymine"],
  sublime: ["/Sublime Text.app/Contents/MacOS/sublime_text"],
  zed: ["/Zed.app/Contents/MacOS/zed"]
}, V = {
  cursor: "cursor",
  windsurf: "windsurf",
  code: "code",
  vscodium: "vscodium",
  codium: "codium",
  webstorm: "webstorm",
  "webstorm.sh": "webstorm",
  hbuilderx: "hbuilderx",
  "hbuilderx.sh": "hbuilderx",
  atom: "atom",
  Brackets: "brackets",
  "code-insiders": "code-insiders",
  emacs: "emacs",
  gvim: "gvim",
  idea: "idea",
  "idea.sh": "idea",
  phpstorm: "phpstorm",
  "phpstorm.sh": "phpstorm",
  pycharm: "pycharm",
  "pycharm.sh": "pycharm",
  rubymine: "rubymine",
  "rubymine.sh": "rubymine",
  sublime_text: "subl",
  vim: "vim",
  goland: "goland",
  "goland.sh": "goland",
  rider: "rider",
  "rider.sh": "rider"
}, X = {
  code: ["code"],
  "code-insiders": ["code-insiders"],
  webstorm: ["webstorm.sh"],
  cursor: ["cursor"],
  windsurf: ["windsurf"],
  atom: ["atom"],
  hbuilder: ["hbuilderx"],
  phpstorm: ["phpstorm.sh"],
  pycharm: ["pycharm.sh"],
  idea: ["idea.sh"],
  codium: ["vscodium"],
  goland: ["goland"],
  brackets: ["Brackets"],
  rider: ["rider"],
  rubymine: ["rubymine.sh"],
  sublime: ["sublime_text"],
  vim: ["vim"],
  emacs: ["emacs"]
}, J = {
  "Cursor.exe": "",
  "Windsurf.exe": "",
  "Code.exe": "",
  "Code - Insiders.exe": "",
  "VSCodium.exe": "",
  "webstorm.exe": "",
  "webstorm64.exe": "",
  "HBuilderX.exe": "",
  "HBuilderX64.exe": "",
  "HBuilder.exe": "",
  "HBuilder64.exe": "",
  "Brackets.exe": "",
  "atom.exe": "",
  "sublime_text.exe": "",
  "notepad++.exe": "",
  "clion.exe": "",
  "clion64.exe": "",
  "idea.exe": "",
  "idea64.exe": "",
  "phpstorm.exe": "",
  "phpstorm64.exe": "",
  "pycharm.exe": "",
  "pycharm64.exe": "",
  "rubymine.exe": "",
  "rubymine64.exe": "",
  "goland.exe": "",
  "goland64.exe": "",
  "rider.exe": "",
  "rider64.exe": ""
}, z = {
  code: ["Code.exe"],
  "code-insiders": ["Code - Insiders.exe"],
  webstorm: ["webstorm.exe", "webstorm64.exe"],
  cursor: ["Cursor.exe"],
  windsurf: ["Windsurf.exe"],
  atom: ["atom.exe"],
  hbuilder: ["HBuilderX.exe", "HBuilder.exe", "HBuilderX64.exe", "HBuilder64.exe"],
  phpstorm: ["phpstorm.exe", "phpstorm64.exe"],
  pycharm: ["pycharm.exe", "pycharm64.exe"],
  idea: ["idea.exe", "idea64.exe"],
  codium: ["VSCodium.exe"],
  goland: ["goland.exe", "goland64.exe"],
  colin: ["clion.exe", "clion64.exe"],
  brackets: ["Brackets.exe"],
  rider: ["rider.exe", "rider64.exe"],
  rubymine: ["rubymine.exe", "rubymine64.exe"],
  sublime: ["sublime_text.exe"],
  notepad: ["notepad++.exe"]
}, j = {
  darwin: $,
  linux: V,
  win32: J
}, I = {
  darwin: L,
  linux: X,
  win32: z
}, d = "{file}", m = "{line}", b = "{column}";
function U(t, e, o, n) {
  let r = "".concat(t, ":").concat(e, ":").concat(o);
  if (typeof n == "string")
    r = n.replace(d, t).replace(m, e.toString()).replace(b, o.toString());
  else if (n instanceof Array)
    return n.map((a) => a.replace(d, t).replace(m, e.toString()).replace(b, o.toString()));
  return [r];
}
function G(t) {
  const { processName: e, fileName: o, lineNumber: n, colNumber: r, workspace: a, openWindowParams: h, pathFormat: c } = t, l = { editorBasename: Z(e), openWindowParams: h, workspace: a }, M = Q(l) || "{file}";
  return U(o, n, r, c || M);
}
function Z(t) {
  let e = x.basename(t).replace(/\.(exe|cmd|bat|sh)$/i, "");
  const o = process.platform, n = Object.keys(I[o]);
  for (let r = 0; r < n.length; r++)
    if ((I[o][n[r]] || []).some((h) => t.endsWith(h))) {
      e = n[r];
      break;
    }
  return e.toLowerCase();
}
function Q(t) {
  const { editorBasename: e, openWindowParams: o, workspace: n } = t;
  switch (e) {
    case "atom":
    case "atom beta":
    case "subl":
    case "sublime":
    case "sublime_text":
    case "wstorm":
    case "charm":
    case "zed":
      return "".concat(d, ":").concat(m, ":").concat(b);
    case "notepad++":
      return ["-n" + m, "-c" + b, d];
    case "vim":
    case "mvim":
      return ["+call cursor(".concat(m, ", ").concat(b, ")"), d];
    case "joe":
    case "gvim":
      return ["+" + m, d];
    case "emacs":
    case "emacsclient":
      return ["+" + m + ":" + b, d];
    case "rmate":
    case "mate":
    case "mine":
      return ["--line", m, d];
    case "code":
    case "code-insiders":
    case "code - insiders":
    case "codium":
    case "cursor":
    case "windsurf":
    case "vscodium":
    case "hbuilderx":
    case "hbuilder":
      return [
        ...n ? [n] : [],
        "-g",
        ...o ? [o] : [],
        "".concat(d, ":").concat(m, ":").concat(b)
      ];
    case "appcode":
    case "clion":
    case "clion64":
    case "idea":
    case "idea64":
    case "phpstorm":
    case "phpstorm64":
    case "pycharm":
    case "pycharm64":
    case "rubymine":
    case "rubymine64":
    case "webstorm":
    case "webstorm64":
    case "goland":
    case "goland64":
    case "rider":
    case "rider64":
      return [
        ...n ? [n] : [],
        "--line",
        m,
        d
      ];
  }
  return "";
}
const K = {
  darwin: "ps ax -o comm=",
  linux: "ps -eo comm --sort=comm",
  // wmic's performance is better, but window11 not build in
  win32: 'wmic process where "executablepath is not null" get executablepath'
}, q = 'powershell -NoProfile -Command "Get-CimInstance -Query \\"select executablepath from win32_process where executablepath is not null\\" | % { $_.ExecutablePath }"';
function Y(t) {
  let e = null;
  if (process.env.CODE_EDITOR) {
    const n = T(process.env.CODE_EDITOR);
    if (n)
      e = n;
    else
      return [process.env.CODE_EDITOR];
  }
  const o = x.resolve(process.cwd(), ".env.local");
  if (y.existsSync(o) && !e) {
    const n = y.readFileSync(o, "utf-8"), r = B.parse(n || "");
    if (r.CODE_EDITOR) {
      const a = T(r.CODE_EDITOR);
      if (a)
        e = a;
      else
        return [r.CODE_EDITOR];
    }
  }
  if (t && !e) {
    const n = T(t);
    n && (e = n);
  }
  try {
    let n;
    const r = process.platform, a = process.platform === "win32", h = K[r], c = j[r];
    ee(a);
    let p = "";
    try {
      p = g.execSync(h, { encoding: "utf-8" });
    } catch (S) {
      a && (p = g.execSync(q, { encoding: "utf-8" }));
    }
    const l = Object.keys(c), M = p.split(a ? "\r\n" : "\n").map((S) => S.trim());
    for (let S = 0; S < l.length; S++) {
      const s = l[S];
      let C = "", O = "";
      if (a) {
        const i = M.find(
          (E) => x.basename(E) === s
        );
        i && (O = x.basename(i), C = i);
      } else if (r === "darwin") {
        const i = M.find(
          (E) => E.endsWith(s)
        );
        if (i) {
          const E = i.replace(s, ""), w = c[s];
          O = s, w.includes("/") ? C = "".concat(E).concat(w) : C = w;
        }
      } else
        p.indexOf(s) !== -1 && (O = s, C = c[s]);
      if (O && C) {
        if (e != null && e.includes(O))
          return [C];
        n || (n = [C]);
      }
    }
    if (n)
      return n;
  } catch (n) {
  }
  return process.env.VISUAL ? [process.env.VISUAL] : process.env.EDITOR ? [process.env.EDITOR] : [null];
}
const T = (t) => {
  const e = process.platform;
  return I[e] && I[e][t] || null;
}, ee = (t) => {
  if (t)
    try {
      g.execSync("chcp 65001");
    } catch (e) {
    }
};
function te(t) {
  switch (t) {
    case "vim":
    case "emacs":
    case "nano":
      return !0;
  }
  return !1;
}
function ne() {
  if (process.env.CODE_INSPECTOR_FORMAT_PATH)
    try {
      return JSON.parse(process.env.CODE_INSPECTOR_FORMAT_PATH);
    } catch (e) {
      return null;
    }
  const t = x.resolve(process.cwd(), ".env.local");
  if (y.existsSync(t)) {
    const e = y.readFileSync(t, "utf-8"), o = B.parse(e || "");
    if (o.CODE_INSPECTOR_FORMAT_PATH)
      try {
        return JSON.parse(o.CODE_INSPECTOR_FORMAT_PATH);
      } catch (n) {
        return null;
      }
  }
  return null;
}
function A(t, e) {
  console.log(
    u.red("Could not open " + x.basename(t) + " in the editor.")
  ), e && (e[e.length - 1] !== "." && (e += "."), console.log(
    u.red("The editor process exited with an error: " + e)
  )), console.log(
    "To set up the editor integration, add something like " + u.cyan("CODE_EDITOR=code") + " to the " + u.green(".env.local") + " file in your project folder, or add " + u.green('editor: "code"') + " to CodeInspectorPlugin config, and then restart the development server. Learn more: " + u.green("https://goo.gl/MMTaZt")
  );
}
let f = null;
function oe(t) {
  return t === "reuse" ? "-r" : t === "new" ? "-n" : "";
}
function de(t) {
  let { file: e, line: o = 1, column: n = 1, editor: r, method: a, format: h, onError: c } = t;
  if (!y.existsSync(e))
    return;
  let [p, ...l] = Y(r);
  const M = ne() || h;
  if (!p || p.toLowerCase() === "none") {
    typeof c == "function" ? c(e, "Failed to recognize IDE automatically") : console.log(
      "Failed to recognize IDE automatically, add something like " + u.cyan("CODE_EDITOR=code") + " to the " + u.green(".env.local") + " file in your project folder, or add " + u.green('editor: "code"') + " to CodeInspectorPlugin config, and then restart the development server. Learn more: " + u.green("https://goo.gl/MMTaZt")
    );
    return;
  }
  process.platform === "linux" && e.startsWith("/mnt/") && /Microsoft/i.test(H.release()) && (e = x.relative("", e));
  let S = null;
  if (o ? l = l.concat(
    G({
      processName: p,
      fileName: e,
      lineNumber: o,
      colNumber: n,
      workspace: S,
      openWindowParams: oe(a),
      pathFormat: M
    })
  ) : l.push(e), f && te(p) && f.kill("SIGKILL"), process.platform === "win32") {
    const s = (i) => i.replace(/([&|<>,;=^])/g, "^$1"), C = (i) => i.includes("^") ? '^"'.concat(i, '^"') : i.includes(" ") ? '"'.concat(i, '"') : i, O = [p, ...l.map(s)].map(C).join(" ");
    f = g.exec(O, {
      stdio: "inherit",
      // @ts-ignore
      shell: !0,
      env: v(_({}, process.env), {
        NODE_OPTIONS: ""
      })
    });
  } else
    f = g.spawn(p, l, {
      stdio: "inherit",
      env: v(_({}, process.env), {
        NODE_OPTIONS: ""
      })
    });
  f.on("exit", function(s) {
    f = null, s && (typeof c == "function" ? c(e, "(code " + s + ")") : A(e, "(code " + s + ")"));
  }), f.on("error", function(s) {
    typeof c == "function" ? c(e, s.message) : A(e, s.message);
  });
}
export {
  U as formatOpenPath,
  de as launchIDE
};

const fs = require("fs");
const path = require("path");

const packageJson = JSON.parse(fs.readFileSync("../package.json", "utf-8"));

delete packageJson.devDependencies;
delete packageJson.private;
delete packageJson.workspaces;
delete packageJson.keywords;
delete packageJson.dependencies.axios;
delete packageJson.dependencies.react;
delete packageJson.dependencies["react-dom"];
delete packageJson.dependencies["react-router-dom"];

packageJson.main = "app.js";
packageJson.scripts = {
  start: "set DEBUG=backend:dev && node ./app.js",
};

fs.writeFileSync(
  path.join("..", "dist", "backend", "package.json"),
  JSON.stringify(packageJson, null, 2)
);

console.log("package.json procesado y copiado en la carpeta dist");

const fs = require("fs");
const path = require("path");

const envs = fs.readFileSync("./.env", "utf-8");
fs.writeFileSync(path.join("..", "dist", "backend", ".env"), envs);

console.log(".env copiado en la carpeta dist/backend");

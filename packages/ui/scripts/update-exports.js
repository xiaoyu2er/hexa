const pkg = require("../package.json");
const fs = require("fs");
const path = require("path");
const uiFiles = fs.readdirSync(path.resolve(__dirname, "../src/ui"));

const uiExports = uiFiles.reduce((acc, file) => {
  const name = file.replace(/\.tsx$/, "");
  acc[`./${name}`] = "./src/ui/" + file;
  return acc;
}, {});

const otherFiles = fs
  .readdirSync(path.resolve(__dirname, "../src"))
  .filter((file) => file.endsWith(".tsx") && file !== "index.tsx");

console.log(
  "@hexa/ui",
  [...uiFiles, ...otherFiles].map((f) => f.replace(/\.tsx?$/, ""))
);

const otherExports = otherFiles.reduce((acc, file) => {
  const name = file.replace(/\.tsx$/, "");
  acc[`./${name}`] = "./src/" + file;
  return acc;
}, {});

pkg.exports = {
  "./hooks": "./src/hooks/index.tsx",
  "./icons": "./src/icons/index.tsx",
  ...uiExports,
  ...otherExports,
  ".": "./src/index.tsx",
};

// udpate package.json
fs.writeFileSync(
  path.resolve(__dirname, "../package.json"),
  JSON.stringify(pkg, null, 2) + "\n"
);

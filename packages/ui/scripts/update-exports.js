const pkg = require("../package.json");
const fs = require("fs");
const path = require("path");
const uiFiles = fs.readdirSync(path.resolve(__dirname, "../src/ui"));
console.log("uiFiles", uiFiles);

const uiExports = uiFiles.reduce((acc, file) => {
  const name = file.replace(/\.tsx$/, "");
  acc[`./${name}`] = {
    import: [`./dist/ui/${name}.mjs`],
    types: [`./dist/ui/${name}.d.mts`],
  };
  return acc;
}, {});

const otherFiles = fs
  .readdirSync(path.resolve(__dirname, "../src"))
  .filter((file) => file.endsWith(".tsx") && file !== "index.tsx");

console.log("otherFiles", otherFiles);

const otherExports = otherFiles.reduce((acc, file) => {
  const name = file.replace(/\.tsx$/, "");
  acc[`./${name}`] = {
    import: [`./dist/${name}.mjs`],
    types: [`./dist/${name}.d.mts`],
  };
  return acc;
}, {});

pkg.exports = {
  "./hooks": {
    import: ["./dist/hooks/index.mjs"],
    types: "./dist/hooks/index.d.mts",
  },
  "./icons": {
    import: ["./dist/icons/index.mjs"],
    types: ["./dist/icons/index.d.mts"],
  },
  ...uiExports,
  ...otherExports,
  ".": {
    import: ["./dist/index.mjs"],
    types: ["./dist/index.d.mts"],
  },
};

// udpate package.json
fs.writeFileSync(
  path.resolve(__dirname, "../package.json"),
  JSON.stringify(pkg, null, 2) + "\n"
);

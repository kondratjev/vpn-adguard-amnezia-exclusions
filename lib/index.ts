import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getUrlListFromFile(filePath: string) {
  const resolvedPath = path.resolve(__dirname, filePath);
  const file = await Bun.file(resolvedPath).text();
  return file
    .split("\n")
    .filter((url) => {
      if (Boolean(url) && !url.startsWith("*")) {
        return url;
      }
    })
    .sort()
    .map((url) => ({ hostname: url, ip: "" }));
}

async function transformExclusions() {
  const [regularExclusions, selectiveExclusions] = await Promise.all([
    getUrlListFromFile("../data/exclusions.regular.txt"),
    getUrlListFromFile("../data/exclusions.selective.txt"),
  ]);

  await Promise.all([
    await Bun.write(
      "dist/amnezia_regular.json",
      JSON.stringify(regularExclusions)
    ),
    await Bun.write(
      "dist/amnezia_selective.json",
      JSON.stringify(selectiveExclusions)
    ),
  ]);
}

transformExclusions().then(() => console.log("Success!"));

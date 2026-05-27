const fs = require("fs");

const data = JSON.parse(fs.readFileSync("allquestion.json", "utf8"));

const updatedData = data.map((item, index) => ({
  ...item,
  id: index + 1
}));

fs.writeFileSync(
  "allquestion.json",
  JSON.stringify(updatedData, null, 2),
  "utf8"
);

console.log("ID berhasil diubah");
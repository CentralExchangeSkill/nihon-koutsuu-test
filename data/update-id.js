const fs = require("fs");

const data = JSON.parse(fs.readFileSync("50q_3.json", "utf8"));

const updatedData = data.map((item, index) => ({
  ...item,
  id: index + 101
}));

fs.writeFileSync(
  "50q_3_updated.json",
  JSON.stringify(updatedData, null, 2),
  "utf8"
);

console.log("ID berhasil diubah dari 101 sampai 150");
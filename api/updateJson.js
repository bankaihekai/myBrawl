const fs = require("fs");

// Read JSON file
const filePath = "data.json";
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

// Add a new entry
const newEntry = {
  id: Date.now(),
  name: "NewUser",
  score: Math.floor(Math.random() * 100)
};

data.push(newEntry);

// Write back to JSON
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

console.log("JSON file updated!");

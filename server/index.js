const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const FILE_PATH = path.join(__dirname, "results.csv");

// Tính số ngày trong năm hiện tại
function getDaysInCurrentYear() {
  const year = new Date().getFullYear();
  return new Date(year, 11, 31).getDate() === 31
    ? year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
      ? 366
      : 365
    : 365;
}

// Đọc danh sách số đã quay
function getPreviousResults() {
  if (!fs.existsSync(FILE_PATH)) return [];

  const data = fs.readFileSync(FILE_PATH, "utf-8");
  return data
    .split("\n")
    .filter(Boolean)
    .map((line) => parseInt(line.split(",")[0]));
}

// Ghi thêm kết quả mới
function appendResult(number) {
  const date = new Date().toISOString();
  fs.appendFileSync(FILE_PATH, `${number},${date}\n`);
}

app.get("/random", (req, res) => {
  const days = getDaysInCurrentYear();
  const previous = getPreviousResults();

  if (previous.length >= days) {
    return res.status(400).json({ message: "Đã quay hết số trong năm!" });
  }

  let randomNumber;

  do {
    randomNumber = Math.floor(Math.random() * days) + 1;
  } while (previous.includes(randomNumber));

  appendResult(randomNumber);

  res.json({
    year: new Date().getFullYear(),
    totalDays: days,
    result: randomNumber,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://${process.env.HOST}:${PORT}`);
});

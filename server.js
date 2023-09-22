const express = require("express");
const path = require("path");
const fsUtils = require("./helper/fsUtils");
const uuid = require("./helper/uuid");
const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// GET Route for homepage
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// GET Route for feedback page
app.get("/api/notes", (req, res) => {
  fsUtils.readFromFile("./db/db.json").then((data) => {
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  const userNote = {
    title: title,
    text: text,
    id: uuid(),
  };
  fsUtils.readAndAppend(userNote, "./db/db.json");
  console.log(userNote);
  res.json("Note was added");
});

app.delete("/api/notes/:id", (req, res) => {
  const noteDelete = req.params.id;
  fsUtils.readFromFile("./db/db.json").then((data) => {
    const userNote = JSON.parse(data);
    const indexToDelete = userNote.findIndex(
      (userNote) => userNote.id === noteDelete
    );
    if (indexToDelete !== -1) {
      userNote.splice(indexToDelete, 1);

      fsUtils.writeToFile("./db/db.json", JSON.stringify(userNote)).then(() => {
        res.json("Deleted");
      });
    }
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

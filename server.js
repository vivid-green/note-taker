// const db = require("./db/db.json");
const fs = require("fs");
const path = require("path");
const express = require("express");
const { json } = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use( express.static( __dirname + "/public"));

const readDb = () => {
    return new Promise((resolve,reject) => {
        fs.readFile(path.join(__dirname,"./db/db.json"),"utf8",(err,data) => {
            if(err) return reject(err);
            resolve(data);
        });
    })
};

const writeDb = (db) => {
    return new Promise((resolve,reject) => {
        fs.writeFile(path.join(__dirname,"./db/db.json"),db,(err,data) => {
            if(err) return reject(err);
            resolve("File Updated");
        });
    })
};

const addNote = (newNote,data) => {

}

app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname,"./db/db.json"));
});

app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    console.log(newNote);
    readDb().then(data => {
        const db = JSON.parse(data);
        const id = db.length + 1;
        newNote.id = id;
        db.push(newNote);
        writeDb(JSON.stringify(db)).then(message => {
            res.send("Note Saved!");
        })
    })
});

app.delete('/api/notes/:id', function (req, res) {
    const deleteId = parseInt(req.params.id);
    readDb().then(data => {
        let db = JSON.parse(data);
        db = db.filter(note => {
            let {id} = note;
            return id === deleteId ? false : true;
        });
       writeDb(JSON.stringify(db)).then(message => {
           res.send("Note Deleted!");
       })
    });
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public" ,"./notes.html"));
});
  
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "./index.html"));
});

// res.sendFile( path.join( __dirname, 'client', 'index.html' ));

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
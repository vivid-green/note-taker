const fs = require("fs");
const path = require("path");
const dbPath = "../db/db.json";

const readDb = () => {
    return new Promise((resolve,reject) => {
        fs.readFile(path.join(__dirname, dbPath),"utf8",(err,data) => {
            if(err) return reject(err);
            resolve(data);
        });
    })
};

const writeDb = (db) => {
    return new Promise((resolve,reject) => {
        fs.writeFile(path.join(__dirname, dbPath),db,(err,data) => {
            if(err) return reject(err);
            resolve("File Updated");
        });
    })
};

module.exports = function(app) {

    app.get("/api/notes", (req, res) => {
        res.sendFile(path.join(__dirname, dbPath));
    });
    
    app.post("/api/notes", (req, res) => {
        const newNote = req.body;
        console.log(newNote);
        readDb().then(data => {
            const db = JSON.parse(data);
            const id = Date.now();
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
            const db = JSON.parse(data)
            .filter(({id} = note) => id === deleteId ? false : true);
            writeDb(JSON.stringify(db)).then(message => {
                res.send("Note Deleted!");
            })
        });
    })    
}
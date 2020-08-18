const express = require('express');
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");
const csv = require('csv-parser');
const fs = require('fs');
const e = require('express');
const PORT = 9999;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/displayStudent", (req, res) => {
    let allStudents = [];
    fs.createReadStream("./students.csv").pipe(csv()).on('data', (row) => {
        allStudents.push(row);
    }).on('end', () => {
        res.send(allStudents)
    })
})

app.post("/addStudents", (req, res) => {
    fs.appendFile("./students.csv", "\n" + Object.values(req.body), (err) => {
        if (err) {
            console.log("er")
        }
    })
    res.json({ msg: "Submitted" })
})

app.post("/searchStudent", (req, res) => {
    let isExist = false;
    fs.createReadStream("./students.csv").pipe(csv()).on('data', (row) => {
        if (row.Student_Id === req.body.student_ID) {
            res.send(row);
            isExist = true;
        }
    }).on('end', () => {
        if (!isExist) {
            res.json({ Status: `No Data Found By Id ${req.body.student_ID}` })
        }
    })
})
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`)
})

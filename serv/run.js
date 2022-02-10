//import express from 'express'
const express = require('express');
const { copyFileSync } = require('fs');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express()
const bodyParser = require('body-parser');
//import spawn from "child_process";
const spawn = require('child_process').spawn;
const port = 5000;
app.use(cors())
app.use(bodyParser.json());
app. use (bodyParser. urlencoded ({ extended : true }));
app.get('/', (req,res) => {
    console.log(req.body);
    console.log('p')
});

const pathtoscript = 'C:/Aydar/scripts/graphics.py'
const pathtousers = 'C:/Aydar/scripts';
app.get('/graph1', (req,res) => {
    let user = req.query.user;
    return res.sendFile(path.resolve(`../scripts/analysis/${user}/Activity_diagram.jpg`));
});

app.get('/graph2', (req,res) => {
    let user = req.query.user;
    return res.sendFile(path.resolve(`../scripts/analysis/${user}/Top_domains.jpg`));
});

app.get('/graph3', (req,res) => {
    let user = req.query.user;
    return res.sendFile(path.resolve(`../scripts/analysis/${user}/Weekly_activity.jpg`));
});

app.get('/week', (req,res) => {
    let user = req.query.user;
    let idx = req.query.idx;
    return res.sendFile(path.resolve(`../scripts/analysis/${user}/Top_domains_week_${idx}.jpg`));
});


app.get('/scr', (req,res) => {
    let user = req.query.user;
    let dir = req.query.dir;
    const pythonProcess = spawn('python', [pathtoscript, pathtousers, user, dir]);

    pythonProcess.stdout.on('data', function(data) {
        console.log('data', data.toString());
        //res.send(data.toString());
        if (data.toString().includes('vse')) {
            res.send(JSON.stringify('success'));
        }
    });
});

app.get('/dir', (req,res) => {
    let path = req.query.path;
    let dir = fs.readdirSync(path);
    //console.log(dir);
    res.json(dir);
});

app.get('/image', (req, res) => {
    let name = req.query.name;
    //let img = fs.readFileSync(`./bpla/${name}.jpg`);
    return res.sendFile(path.resolve(`./images/${name}`));
})

app.listen(port, console.log('Работает на 5000'));
const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public'));
const STATIC_PATH = __dirname + '/public/';

const fs = require('fs-extra');

app.get('/', (req, res) => {
    res.sendFile(STATIC_PATH + 'index.html');
});

app.get('/comic', (req, res) => {
    res.sendFile(STATIC_PATH + 'comic.html');
});

app.get('/blog', (req, res) => {
    res.sendFile(STATIC_PATH + 'blog.html');
});

app.get('/about', (req, res) => {
    res.sendFile(STATIC_PATH + 'about.html');
});

app.get('/request', (req, res) => {
    if (req.query.type === 'comic') {
        fs.readJSON(`${STATIC_PATH}comics/${req.query.id}/meta.json`)
            .then(meta => {
                res.send(meta);
            })
            .catch(err => {
                console.error(err);
                res.send({error: err});
            });
    }
})

app.listen(process.env.PORT || 1452);
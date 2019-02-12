// 
const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public'));
const STATIC_PATH = __dirname + '/public/';
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const fs = require('fs-extra');
const dl = require('download');
const errHandle = err => {
    fs.appendFile('./public/log.txt', err.toString() + '\n');
}

const config = fs.readJSONSync('./config.json');

app.get('/', (req, res) => {
    res.sendFile(STATIC_PATH + 'index.html');
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

app.get('/admin', (req, res) => {
    res.sendFile(STATIC_PATH + 'admin.html')
});

app.post('/upload', (req, res) => {
    let body = req.body;
    /* contains: 
        title, month, date, year, author, 
        dispUrl, dispFn, origUrl, origFn,
        password
    */
    // check mandatory properties
    if (body.password === config.users[body.author].pass && 
            body.title && body.month &&
            body.date && body.year &&
            body.author &&
            body.dispUrl && body.dispFn) {
        // Promises are nested for ordered procedure
        // resolve request
        // lower string, then replace whitespaces with dashes
        let safeTitle = require('case').lower(body.title).replace(' ', '-');
        // process requested name
        function unsubstitute(str) {
            return str.replace('${UPSTREAM}', config.upstream).replace('${SAFE_TITLE}', safeTitle);
        }
        let paths = {
            upstream: {
                disp: unsubstitute(body.dispUrl),
                orig: unsubstitute(body.origUrl)
            },
            dest: {
                disp: unsubstitute(body.dispFn),
                orig: unsubstitute(body.origFn)
            }
        }

        // check latest
        fs.readFile('./public/comics/meta.js').then(
            (file) => {
                // meta.js content: 
                // latest=[number]
                let latest = parseInt(file.toString().split('=')[1]) + 1;
                // make dir for all files related to this comic
                fs.mkdirp(`./public/comics/${latest}`).then(
                    () => {
                        // store metadata
                        let writtenJSON = {
                            "id": latest,
                            "name": body.title,
                            "year": body.year,
                            "month": body.month,
                            "date": body.date,
                            "author": body.author,
                            "hover": body.hover,
                            "image": paths.dest.disp
                        }
                        // parallel tasks: metadata, file dl
                        fs.writeJSON(`./public/comics/${latest}/meta.json`, writtenJSON).then()
                            .catch(err => {
                                errHandle(err);
                        });

                        dl(paths.upstream.disp).then(
                            f => {
                                fs.writeFile(`./public/comics/${latest}/${paths.dest.disp}`, f);
                        }).catch(err => {
                            errHandle(err);
                        });

                        if (body.origUrl) {
                            dl(paths.upstream.orig).then(
                                f => {
                                    fs.writeFile(`./public/comics/${latest}/${paths.dest.orig}`, f);
                            }).catch(err => {
                                errHandle(err);
                            });
                        }

                        fs.writeFile('./public/comics/meta.js', `latest=${latest}`).then()
                            .catch(err => {
                                errHandle(err);
                            });
                        res.sendFile(STATIC_PATH + '/index.html');
                    }
                ).catch(err => {
                    errHandle(err);
                });
        });
    } else {
        errHandle('Warning: Unauthorized Entry. Request Denied.');
        res.send('Sorry, this content is not available in your country.');
    }
});

app.listen(process.env.PORT || config.port);
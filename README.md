# KNOB
> Knob's Not One Blog

## For Users
The structure tree for this repo is ~~complicated~~ simple. (* = feature not implemented)
```
knob/
    public/
        * blogs/

        comics/
            1/
                your-comic-nam.png
                [any other file you like, e.g. raw, hi-res copies]
                meta.json
            2/...
            3/...
            ...
            meta.js (mind that its extension is js, for it will be imported into client page as text/javascript)
        css/
            * blog.css
            comic.css
            * index.css
        js/
            lib/
                axios.min.js (imported module, originally MIT-licensed)
            * blog.js
            comic.js
        index.html
        * about.html
        * blog.html
        comic.html
    index.js (node.js entry point)
    (misc npm-generated files and node_modules/)
```

### Comics
Comics are stored in numbered directories of `./public/comics/`, along with a mandatory meta.json file.
Another file called `mata.js` is stored in `./public/comics/`, and only holds init stage value(s) that client script will import.

#### meta.json
The template of `meta.json` is listed as follows.
```
 {
     "id": 1,
     "name": "Roche Limit",
     "year": 2019,
     "month": 2,
     "date": 6,
     "author": "fakefred",
     "hover": "I tried losing weight, but it didn't help.",
     "image": "roche-limit.png"
 }
```
It is forbidden to set month to any other format, but you can tamper with date whatever you want.

#### meta.js
```
latest = 3
```

Yes, it _is_ just one line, one variable declaration, and 10 bytes.
Though automation is in progress, you must as for now manually change its value at each comic upload.
`comic.js` will read it, and then fetch the comic numbered 3, in this case.
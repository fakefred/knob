const page_title = document.getElementsByTagName('title')[0],
      title      = document.getElementById('title'),
      info       = document.getElementById('info'),
      comic      = document.getElementById('comic');

const MONTH_HASH = ['Wtf', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

let current = latest;

function render(id) {
    axios.get('/request', {params: {
        type: 'comic',
        id
    }}).then(res => {
        if (res.error) {
            handleError(res,error);
        } else {
            let data = res.data;
            console.log(data);
            page_title.innerText = title.innerHTML = data.name;
            info.innerHTML = `${MONTH_HASH[data.month]} ${data.date} ${data.year} <i>by</i> ${data.author}`;
            comic.src = `/comics/${data.id}/${data.image}`;
            comic.title = data.hover;
            current = id;
        }
    });
}

function handleError(err) {
    alert(err);
}

function navigate(param) {
    if (param === 'next' && current < latest) {
        render(++ current);
    } else if (param === 'prev' && current > 1) {
        render(-- current);
    } else if (param === 'random') {
        let randComic = current;
        while (randComic === current) {
            randComic = Math.ceil(Math.random() * latest);
        }
        render(randComic);
    } else {
        // do nothing
    }
}

function go() {
    let id = parseInt(document.getElementById('goto').value);
    if (id <= latest && id > 0) {
        render(id);
    }
}

// init
let id = window.location.hash;
if (!id) {
    render(latest);
} else if (/\d+/.test(id)) {
    id = parseInt(id.slice(1));
    if (id > 0 && id <= latest) {
        render(id);
    }
}


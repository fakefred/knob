let date = new Date();
document.getElementById('month').value = date.getMonth() + 1;
document.getElementById('date').value = date.getDate();
document.getElementById('year') .value = date.getFullYear();

setInterval(() => {
    if (
        document.getElementById('input-title').value !== '' &&
        document.getElementById('month').value !== '' &&
        document.getElementById('date').value !== '' &&
        document.getElementById('year').value !== '' &&
        document.getElementById('author').value !== '' &&
        document.getElementById('disp-url').value !== '' &&
        document.getElementById('disp-fn').value !== '' &&
        document.getElementById('hover').value !== '' &&
        document.getElementById('password').value !== ''
    ) {
        document.getElementById('submit').type = 'submit';
    }
}, 2000);
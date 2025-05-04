const express = require('express');
const app = express();
const path = require('path');

// Cerinta 2: Port si afisare cai
const PORT = 8080;
console.log('__dirname:', __dirname);
console.log('__filename:', __filename);
console.log('process.cwd():', process.cwd());

// Cerinta 3: Configurare EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pagini'));

// Cerinta 6: Folder static
app.use(express.static(path.join(__dirname, 'public')));

// Cerinta 8 Ruta default
app.get('/', (req, res) => {
    res.render('index', {
        title: 'OnlyMerch - Funny T-Shirts & Hoodies'
    });
});

app.get('/index', (req, res) => {
    res.render('index', {
        title: 'OnlyMerch - Funny T-Shirts & Hoodies'
    });
});

app.get('/home', (req, res) => {
    res.render('index', {
        title: 'OnlyMerch - Funny T-Shirts & Hoodies'
    });
});

// Cerinta 9 ruta wildcard
app.get('/:page', (req, res) => {
    const page = req.params.page;
    console.log(`Requested page: ${page}`);
    const validPages = ['index', 'home', 'despre'];
    if (!validPages.includes(page)) {
        return res.status(404).render('eroare', {
            titlu: 'Pagina nu a fost gasita',
            text: 'Pagina solicitata nu exista pe acest server',
            imagine: '/resources/img/404.png'
        });
    }
    res.render(page, (err, html) => {
        if (err) {
            if (err.message.startsWith('Failed to lookup view')) {
                return res.status(404).render('eroare', {
                    titlu: 'Pagina nu a fost gasita',
                    text: 'Pagina solicitata nu exista pe acest server',
                    imagine: '/resources/img/404.png'
                });
            }
            console.error(err);
            return res.status(500).send('Eroare interna');
        }
        res.send(html);
    });
});

// Cerinta 16: Afisare IP
app.get('/despre', (req, res) => {
    res.render('despre', {
        title: 'Despre Noi',
        userIp: req.ip
    });
});

// Cerinta 13: obGlobal cu proprietate obErori si functia initErori
const fs = require('fs');
const obGlobal = { obErori: null };

function initErori() {
    try {
        const rawData = fs.readFileSync(path.join(__dirname, 'erori.json'));
        const eroriData = JSON.parse(rawData);
        
        eroriData.info_erori.forEach(eroare => {
            eroare.imagine = path.join(eroriData.cale_baza, eroare.imagine);
        });
        
        obGlobal.obErori = eroriData;
    } catch (err) {
        console.error('Eroare la încărcarea erorilor:', err);
    }
}

initErori();

// Cerinta 14: Functia afisareEroare
function afisareEroare(res, identificator, titlu, text, imagine) {
    let eroare = obGlobal.obErori.info_erori.find(e => e.identificator === identificator);
    
    if (!eroare) {
        eroare = obGlobal.obErori.eroare_default;
        identificator = 'default';
    }

    const params = {
        identificator,
        titlu: titlu || eroare.titlu,
        text: text || eroare.text,
        imagine: imagine || eroare.imagine
    };

    if (eroare.status) res.status(identificator);
    res.render('eroare', params);
}

// Cerinta 17: middleware 403
app.use('/resources', (req, res, next) => {
    if (req.url.endsWith('/')) {
        afisareEroare(res, 403);
    } else {
        next();
    }
});
// Cerinta 18: ruta pentru .ejs
app.get('*.ejs', (req, res) => {
    afisareEroare(res, 400);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

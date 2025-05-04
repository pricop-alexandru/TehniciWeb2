const express = require('express');
const app = express();
const path = require('path');
const sass = require('sass');
const fs = require('fs');
const sharp = require('sharp');

// Define global properties for SCSS and CSS folders
global.folderScss = path.join(__dirname, 'public/styles/sass');
global.folderCss = path.join(__dirname, 'public/styles/css');

// Add 'backup' folder to the list of folders created automatically by the app
const vect_foldere = ['temp', 'temp1', 'backup'];

// Create folders if they don't exist
vect_foldere.forEach(folder => {
    const folderPath = path.join(__dirname, folder);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`Folder creat: ${folderPath}`);
    }
});

// Function to copy old CSS file to backup folder before overwriting
function backupCssFile(cssFilePath) {
    if (fs.existsSync(cssFilePath)) {
        const backupFolderPath = path.join(__dirname, 'backup', 'resurse', 'css');
        if (!fs.existsSync(backupFolderPath)) {
            fs.mkdirSync(backupFolderPath, { recursive: true });
        }
        const fileName = path.basename(cssFilePath);
        const backupFilePath = path.join(backupFolderPath, fileName);
        try {
            fs.copyFileSync(cssFilePath, backupFilePath);
            console.log(`Backup created for ${fileName} at ${backupFilePath}`);
        } catch (err) {
            console.error(`Eroare la copierea fisierului backup pentru ${fileName}:`, err);
        }
    }
}

// Function to compile SCSS to CSS
function compileazaScss(caleScss, caleCss) {
    // Resolve paths relative to folderScss and folderCss if relative
    if (!path.isAbsolute(caleScss)) {
        caleScss = path.join(global.folderScss, caleScss);
    }
    if (caleCss) {
        if (!path.isAbsolute(caleCss)) {
            caleCss = path.join(global.folderCss, caleCss);
        }
    } else {
        // If caleCss missing, save in folderCss with same name as SCSS but .css extension
        const scssFileName = path.basename(caleScss, '.scss');
        caleCss = path.join(global.folderCss, scssFileName + '.css');
    }

    // Backup old CSS file before compiling
    backupCssFile(caleCss);

    try {
        const result = sass.compile(caleScss, {
            style: 'expanded',
            loadPaths: [path.join(__dirname, 'node_modules', 'bootstrap', 'scss')]
        });
        // Ensure output folder exists
        const cssFolder = path.dirname(caleCss);
        if (!fs.existsSync(cssFolder)) {
            fs.mkdirSync(cssFolder, { recursive: true });
        }
        fs.writeFileSync(caleCss, result.css);
        console.log(`SCSS compilat cu succes: ${caleScss} -> ${caleCss}`);
    } catch (err) {
        console.error(`Eroare la compilarea SCSS pentru ${caleScss}:`, err);
    }
}

// Initial compilation of all SCSS files in folderScss
function compileAllScss() {
    if (!fs.existsSync(global.folderScss)) {
        console.error(`Folderul SCSS nu exista: ${global.folderScss}`);
        return;
    }
    const files = fs.readdirSync(global.folderScss);
    files.forEach(file => {
        if (file.endsWith('.scss')) {
            compileazaScss(file);
        }
    });
}

// Watch folderScss for changes and recompile changed/created SCSS files
function watchScssFolder() {
    if (!fs.existsSync(global.folderScss)) {
        console.error(`Folderul SCSS nu exista pentru watch: ${global.folderScss}`);
        return;
    }
    fs.watch(global.folderScss, (eventType, filename) => {
        if (filename && filename.endsWith('.scss')) {
            console.log(`Fisier SCSS modificat/creat: ${filename}, recompilare...`);
            compileazaScss(filename);
        }
    });
}

// Load gallery JSON
const galerieData = JSON.parse(fs.readFileSync(path.join(__dirname, 'galerie.json'), 'utf-8'));

// Helper to get current quarter of the hour (1-4)
function getCurrentQuarter(date = new Date()) {
    const minutes = date.getMinutes();
    if (minutes < 15) return 1;
    if (minutes < 30) return 2;
    if (minutes < 45) return 3;
    return 4;
}

// Generate resized images for medium and small sizes using sharp
function generateResizedImages(imagePath, sizes = [{name: 'medium', width: 300}, {name: 'small', width: 300}]) {
    sizes.forEach(size => {
        const outputDir = path.join(path.dirname(imagePath), size.name);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        const outputFile = path.join(outputDir, path.basename(imagePath));
        
        // Always regenerate images to ensure correct sizing
        sharp(imagePath)
            .resize(size.width, null, {
                withoutEnlargement: true,
                fit: 'inside'
            })
            .jpeg({ quality: 100 })
            .toFile(outputFile)
            .then(() => console.log(`Resized image created: ${outputFile}`))
            .catch(err => console.error(`Error resizing image ${outputFile}:`, err));
    });
}

// Route for gallery page
app.get('/galerie', (req, res) => {
    const currentQuarter = getCurrentQuarter();
    const caleGalerie = galerieData.cale_galerie;
    // Filter images by current quarter
    let filteredImages = galerieData.imagini.filter(img => parseInt(img.sfert_ora) === currentQuarter);
    // Limit to 10 images
    filteredImages = filteredImages.slice(0, 10);

    // Generate resized images for each
    filteredImages.forEach(img => {
        const fullImagePath = path.join(__dirname, 'public', caleGalerie, img.cale_imagine);
        generateResizedImages(fullImagePath);
    });

    res.render('galerie', {
        title: 'Galerie - OnlyMerch',
        cale_galerie: caleGalerie,
        imagini: filteredImages
    });
});

// Add 'galerie' and new pages to validPages in wildcard route
const validPages = ['index', 'home', 'despre', 'galerie', 'banner', 'deals', 'video', 'bestsellers', 'shop', 'new', 'contact', 'faq'];

// Cerinta 9 ruta wildcard
app.get('/:page', (req, res) => {
    const page = req.params.page;
    console.log(`Requested page: ${page}`);
    if (!validPages.includes(page)) {
        return res.status(404).render('eroare', {
            titlu: 'Pagina nu a fost gasita',
            text: 'Pagina solicitata nu exista pe acest server',
            imagine: '/resources/img/404.png',
            identificator: 404
        });
    }
    res.render(page, {identificator: null}, (err, html) => {
        if (err) {
            if (err.message.startsWith('Failed to lookup view')) {
                return res.status(404).render('eroare', {
                    titlu: 'Pagina nu a fost gasita',
                    text: 'Pagina solicitata nu exista pe acest server',
                    imagine: '/resources/img/404.png',
                    identificator: 404
                });
            }
            console.error(err);
            return res.status(500).send('Eroare interna');
        }
        res.send(html);
    });
});

// Run initial compilation and start watching
compileAllScss();
watchScssFolder();

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

// Cerinta 16: Afisare IP
app.get('/despre', (req, res) => {
    res.render('despre', {
        title: 'Despre Noi',
        userIp: req.ip
    });
});

// Cerinta 13: obGlobal cu proprietate obErori si functia initErori
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
app.use('/resurse', (req, res, next) => {
    if (req.url.endsWith('/')) {
        afisareEroare(res, 403);
    } else {
        next();
    }
});

// Cerinta 18: ruta pentru .ejs
app.get('.ejs', (req, res) => {
    afisareEroare(res, 400);
});

// Cerinta 19: ruta pentru favicon
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/resources/ico/favicon.ico'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Foldere create:', vect_foldere);
});

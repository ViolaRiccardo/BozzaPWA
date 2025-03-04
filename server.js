const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const server = http.createServer((req, res) => {
    // Costruisci il percorso del file richiesto
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

    // Estensione del file
    const extname = path.extname(filePath);

    // Mappa le estensioni ai tipi di contenuto
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.ico': 'image/x-icon'
    };

    // Imposta il tipo di contenuto in base all'estensione
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Leggi il file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File non trovato
                fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
            } else {
                // Errore del server
                res.writeHead(500);
                res.end(`Errore del server: ${err.code}`);
            }
        } else {
            // Successo
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'), {
        headers: {
            'Cache-Control': 'no-store'
        }
    });
});

app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/greet/:name', (req, res) => {
    const name = req.params.name;
    const lang = req.query.lang === 'ru' ? 'ru' : 'en';

    const namePattern = /^[\p{L}]+(?:[ -][\p{L}]+)*$/u;

    if (!namePattern.test(name) || name.length > 50) {
        return res.status(400).json({
            error: 'Invalid name'
        });
    }

    const message = lang === 'ru'
        ? `Привет, ${name}!`
        : `Hello, ${name}!`;

    res.json({
        message: message,
        timestamp: new Date().toISOString(),
        lang: lang
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: 'Not found'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

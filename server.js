const express = require('express');
const path = require('path');
const fs = require('fs');

// Crear la aplicación Express
const app = express();

// Configuración de middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Orden de las letras en "Maria Jose"
const ordenLetras = ["M", "A", "R", "I", "A", "J", "O", "S", "E"];

// Cargar poemas desde la carpeta "poemas"
const loadPoems = () => {
    const poems = {};

    ordenLetras.forEach(letra => {
        try {
            poems[letra] = require(`./poemas/${letra}.js`);
        } catch (error) {
            console.error(`Error cargando el poema ${letra}:`, error);
        }
    });

    return poems;
};

const poems = loadPoems();

// Ruta principal (página de inicio)
app.get('/', (req, res) => {
    res.render('index', { poems: ordenLetras });
});

// Ruta para cada poema
app.get('/poema/:letra', (req, res) => {
    const letra = req.params.letra.toUpperCase(); // Convertir a mayúscula
    const poema = poems[letra];

    if (poema) {
        res.render('poema', { letra, poema });
    } else {
        res.status(404).send('Poema no encontrado');
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
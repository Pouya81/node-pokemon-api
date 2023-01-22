const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const { success, getUniqueId } = require('./helper.js');
let pokemons = require('./mock-pokemon');

const app = express();
const port = 3000;

app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json());

// app.use((req, res, next) => {
//     console.log(`URL : ${req.url}`);
//     next();
// });

app.get('/', (req,res) => res.send('Hello again, Express ! 🤝'));

// On utilise la liste pokemons dans notre point de terminaison :
app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemon = pokemons.find(pokemoni => pokemoni.id === id);
    //res.send(`Vous avez demandé le pokémon ${pokemon.name}.`);
    const message = {a:'Un pokémon a bien été trouvé', b:777};
    res.json(success(message,pokemon));
})

// On retourne tous les pokemons présents dans l'API Rest
app.get('/api/pokemons', (req, res) => {
    const totalpokemon = pokemons.length;
    //res.send(`Le nombre total de pokemons est ${totalpokemon}.`);
    const message = (`Voici la liste des ${totalpokemon} pokémons.`);
    res.json(success(message,pokemons));
})

app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons);
    const pokemonCreated = { ...req.body, ...{id: id, created: new Date()}};
    pokemons.push(pokemonCreated);
    const message = `Le pokemon ${pokemonCreated.name} a bien été crée.`;
    res.json(success(message, pokemonCreated));
});



app.listen(port, () => console.log(`Notre application node est bien démarré sur : http://localhost:${port}`));
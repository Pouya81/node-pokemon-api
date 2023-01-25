const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const { success, getUniqueId } = require('./helper.js');
let pokemons = require('./mock-pokemon');
const PokemonModel = require('./src/models/pokemon.js');

const app = express();
const port = 3000;

const sequelize = new Sequelize(
    'pokedex',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2'
        },
        logging: false
    }
);

sequelize.authenticate()
    .then(_ => console.log('La connexion à la base de données a bien été établie.'))
    .catch(error => console.error(`Impossible de se connecter à la base de données ${error}`));

const Pokemon = PokemonModel(sequelize, DataTypes);

sequelize.sync({force: true})
.then(_ => {   
    console.log('La base de données "Pokedex" a bien été synchronisée.');

    Pokemon.create({
        name: 'Bulbizzare',
        hp: 25,
        cp: 5,
        picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png',
        types: ["Plante", "Poison"].join()
    }).then(bulbizzare => console.log(bulbizzare.toJSON()));
});


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

app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonUpdated = { ...req.body, id: id };
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon;
    })
    const message = `Le pokémon ${pokemonUpdated.name} a bien été modifié.`;
    res.json(success(message, pokemonUpdated));
});

app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id);
    pokemons = pokemons.filter(pokemon => pokemon.id !== id);
    const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé`;
    res.json(success(message, pokemonDeleted));
});

app.listen(port, () => console.log(`Notre application node est bien démarré sur : http://localhost:${port}`));
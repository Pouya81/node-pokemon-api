const express = require('express');
const { success } = require('./helper.js');
let pokemons = require('./mock-pokemon');

const app = express();
const port = 3000;

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

app.listen(port, () => console.log(`Notre application node est bien démarré sur : http://localhost:${port}`));
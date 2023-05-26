import express from 'express';
const app = express();
import { Server } from 'socket.io';
import path from 'path';
import cors from 'cors';
import pokemon from 'pokemon';
import Pokedex from 'pokedex';

const pokedex = new Pokedex();

const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors())

const server = app.listen(4000, () => {
    console.log('server listening on port 4000');
});

let userList = []
const io = new Server(server);

function getPokemonAnime() {
    const pokeName = pokemon.random();
    const pokemonData = pokedex.pokemon(pokeName.toLowerCase());

    if (pokeName && pokemonData?.sprites?.animated) {
        return {
            name: pokeName,
            url: pokemonData?.sprites?.animated
        };
    } else {
        const pokeName = pokemon.random();
        const pokemonData = pokedex.pokemon(pokeName.toLowerCase());
        return {
            name: pokeName || "anonymous",
            url: pokemonData?.sprites?.animated || ""
        };
    }
}

io.on('connect', (socket) => {
    socket.on('chat-message', (msg, name) => {
        let checkId = userList.find(item => item?.id === socket.id);
        if (!checkId) {
            try {
                const { name, url } = getPokemonAnime();
                userList.push({ id: socket.id, name, url });
            } catch (error) {
                console.log('Error fetching Pokémon data:', error);
            }
        }
        checkId = userList.find(item => item?.id === socket.id);
        if (checkId?.name) {
            io.emit('chat-message', msg, checkId.name, checkId.url, checkId.id);
        }
        console.log('message:', msg);
    });

    socket.on('disconnect', () => {
        let index = userList.findIndex(item => item?.id === socket.id);
        userList.splice(index, 1);
        console.log("user is disconnected")
    });

}); 
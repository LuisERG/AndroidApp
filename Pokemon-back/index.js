const PokemonList = require("./models/pokemon-list");
const Results = require("./models/results");

const express = require("express");
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let usuario = {
    nombre:'',
    apellido: ''
   };

let respuesta = {
    error: false,
    codigo: 200,
    mensaje: ''
   };

app.get('/', function(req, res) {
 respuesta = {
  error: true,
  codigo: 200,
  mensaje: 'Punto de inicio'
 };
 res.send(respuesta);
});

app.get('/pokemon', function (req, res) {
    console.log("req query: ", req.query);
    const defaultOffset = 0;
    const defaultLimit = 20;

    let offset = req.query.offset;
    let limit = req.query.limit;

    if(offset == null || offset === '') {
        offset = defaultOffset;
    }
    else offset = parseInt(offset);

    if(limit == null || limit === '') {
        limit = defaultLimit;
    }
    else limit = parseInt(limit);

    console.log("offset: " + offset + ", limit: " + limit);

    readPokemons(offset, limit, (results) => {
        console.log("RESULTS: ", results)
        respuesta = new PokemonList(null,null,results);
        res.send(respuesta);
    });
    
});

function readPokemons(offset, limit, callback) {

    fs.readFile('./tests/pokemons.json', (err, data) => {
        let begin = offset;
        let size = offset + limit;
        console.log("begin: " + begin + ", size: " + size);
        if (err) throw err;
        let results = JSON.parse(data).results.slice(offset, offset + limit);
        console.log("Results:", results);

        if (typeof callback == "function")
            callback(results);

        return results;
    });
}

app.get('/usuario', function (req, res) {
 respuesta = {
  error: false,
  codigo: 200,
  mensaje: ''
 };
 if(usuario.nombre === '' || usuario.apellido === '') {
  respuesta = {
   error: true,
   codigo: 501,
   mensaje: 'El usuario no ha sido creado'
  };
 } else {
  respuesta = {
   error: false,
   codigo: 200,
   mensaje: 'respuesta del usuario',
   respuesta: usuario
  };
 }
 res.send(respuesta);
});


app.listen(4000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
   });
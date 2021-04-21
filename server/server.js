const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

app.listen(PORT, () => {
    console.log('listening on port', PORT)
});

//setting up pool
const Pool = pg.Pool;
const pool = new Pool ({
    database: 'jazzy_sql',
    host: 'Localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
})

//adding pool.on for debugging
pool.on('connect', () => {
    console.log('Postgresql connected');
});

//adding in a error to check for errors or  idle clients
pool.on('error', (error) => {
    console.log('Error with postgres pool', error);
});


// TODO - Replace static content with a database tables
// const artistList = [ 
//     {
//         name: 'Ella Fitzgerald',
//         birthdate: '04-25-1917'
//     },
//     {
//         name: 'Dave Brubeck',
//         birthdate: '12-06-1920'
//     },       
//     {
//         name: 'Miles Davis',
//         birthdate: '05-26-1926'
//     },
//     {
//         name: 'Esperanza Spalding',
//         birthdate: '10-18-1984'
//     },
// ]
// const songList = [
//     {
//         title: 'Take Five',
//         length: '5:24',
//         released: '1959-09-29'
//     },
//     {
//         title: 'So What',
//         length: '9:22',
//         released: '1959-08-17'
//     },
//     {
//         title: 'Black Gold',
//         length: '5:17',
//         released: '2012-02-01'
//     }
// ];

//getting the GET for artists
app.get('/artist', (req, res) => {
    console.log(`In /songs GET`);
    const sqlText = `SELECT * FROM "artists" ORDER BY "year_born";`
    pool.query(sqlText)
        .then((result) => {
            console.log(`Got stuff back from the database`, result);
            res.send(result.rows);
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500);
        })
    // res.send(artistList);
});

//getting the POST for artists
app.post('/artist', (req, res) => {
    // artistList.push(req.body);
    const sqlText = `INSERT INTO "artists" VALUES('${req.body.artist_name}', '${res.body.year_born}');`
    pool.query(sqlText)
        .then((result) => {
            res.sendStatus(201);
        })
        .catch((error) => {
            res.sendStatus(500);
        })
    // res.sendStatus(201);
});

app.get('/song', (req, res) => {
    console.log(`In /songs GET`);
    const sqlText = `SELECT * FROM "songs" ORDER BY "title";`
    pool.query(sqlText)
        .then((result) => {
            console.log(`Got stuff back from the database`, result);
            res.send(result.rows);
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500);
        })
    // res.send(songList);
});

app.post('/song', (req, res) => {
    // songList.push(req.body);
    // res.sendStatus(201);
    const sqlText = `INSERT INTO "songs" VALUES('${req.body.title}', '${res.body.length}', ${res.body.released});`
    pool.query(sqlText)
        .then((result) => {
            res.sendStatus(201);
        })
        .catch((error) => {
            res.sendStatus(500);
        })
});



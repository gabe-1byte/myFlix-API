const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'), // import the built in node modules fs and path
    path = require('path');

const app = express();

// setup the logger to log into a log.txt file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}));

let topMovies = [
    {
        title: 'The Crow',
        director: 'Alex Proyas'
    },
    {
        title: 'The Lord of the Rings: The Return of the King',
        director: 'Peter Jackson'
    },
    {
        title: 'The Lord of the Rings: The Two Towers',
        director: 'Peter Jackson'
    },
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        director: 'Peter Jackson'
    },
    {
        title: 'Kurt Cobain: Montage of Heck',
        director: 'Brett Morgen'
    },
    {
        title: 'The Dark Knight',
        director: 'Christopher Nolan'
    },
    {
        title: 'Dumb and Dumber',
        director: 'Peter Farrelly'
    },
    {
        title: 'The Mask',
        director: 'Chuck Russell'
    },
    {
        title: 'Wayne\'s World',
        director: 'Penelope Spheeris'
    },
    {
        title: 'Pearl Jam Twenty',
        director: 'Cameron Crowe'
    }
];

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to my top movie list!');
});

app.use(morgan('common'));

app.use(express.static('public'));

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// error handling
const bodyParser = require('body-parser'),
    methodOverride = require('method-override');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('You\'ve encountered an error!');
});


// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});
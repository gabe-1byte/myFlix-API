const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'), // import the built in node modules fs and path
    path = require('path'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    uuid = require('uuid');
const { Deserializer } = require('v8');

const app = express();

const { check, validationResult } = require('express-validator');

const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
// mongoose.connect('mongodb://localhost:27017/cfDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});

// setup the logger to log into a log.txt file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}));

// Setup bodyParser middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const passport = require('passport');
require('./passport');

let auth = require('./auth')(app);

const cors = require('cors');
app.use(cors());

let users = [
    {
        id: 1,
        name: 'Gabe',
        password: 'thisIsAPassword123',
        email: 'GabesEmail@xyz.com',
        birthday: '2007-03-13',
        favoriteMovies: [
            'The Crow'
        ]
    },
    {
        id: 2,
        name: 'Sam',
        password: 'SamsPassword123',
        email: 'sams_email@xyz.com',
        birthday: '2000-01-02',
        favoriteMovies: [
            'The Mask'
        ]
    },
    {
        id: 3,
        name: 'Alex',
        password: 'AlexHasAPassword456',
        email: 'alexHasAnEmail@xyz.com',
        birthday: '1999-04-18',
        favoriteMovies: [
            'The Dark Knight', 'Kurt Cobain: Montage of Heck'
        ]
    },
    {
        id: 4,
        name: 'Jordan',
        password: 'JordanHasAPassword789',
        email: 'JordansEpicEmail@xyz.com',
        birthday: '1998-09-09'
    },
    {
        id: 5,
        name: 'Taylor',
        password: 'TaylorsPasscode123',
        email: 'TaylorsBoringEmailName@xyz.com',
        birthday: '1997-12-30'
    }
]

let movies = [
    {
        Title: 'The Crow',
        Description: 'The night before his wedding, musician Eric Draven and his fiancée are murdered by members of a violent gang. On the anniversary of their death, Eric rises from the grave and assumes the mantle of the Crow, a supernatural avenger.',
        Genre: { 
            Name: 'Action',
            Description: 'Action movies are characterized by fast-paced sequences, physical feats, and a focus on excitement and adventure. They often include elements like chases, fights, explosions, and stunts.'
        },
        Director:{
            Name: 'Alex Proyas',
            Bio: 'Alex Proyas is an Australian filmmaker, screenwriter, and producer. He is best known for his work in the fantasy and science fiction genres, with films such as "The Crow," "Dark City," and "I, Robot." Proyas is recognized for his visually striking style and ability to create atmospheric worlds in his films.',
            Birth: '1963',
            Death: 'N/A'
        },
        imageURL: 'https://posters.movieposterdb.com/09_11/1994/109506/l_109506_3096a83e.jpg',
        featured: true
    },
    {
        Title: 'The Lord of the Rings: The Return of the King',
        Description: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.',
        Genre: {
            Name: 'Fantasy',
            Description: 'Fantasy films are characterized by magical elements, mythical creatures, and imaginative worlds. They often involve quests, adventures, and the battle between good and evil, allowing for the exploration of complex themes in a fantastical setting.'
        },
        Director: {
            Name: 'Peter Jackson',
            Bio: 'Peter Jackson is a New Zealand filmmaker, director, and producer, best known for his work on the "The Lord of the Rings" and "The Hobbit" trilogies. His adaptations of J.R.R. Tolkien\'s novels received critical acclaim and numerous awards, including multiple Academy Awards. Jackson is recognized for his innovative use of visual effects and his ability to bring epic fantasy stories to life on the big screen.',
            Birth: '1961',
            Death: 'N/A'
        },
        imageURL: 'https://posters.movieposterdb.com/22_11/2003/167260/l_the-lord-of-the-rings-the-return-of-the-king-movie-poster_a977da10.jpg',
        featured: true
    },
    {
        Title: 'The Lord of the Rings: The Two Towers',
        Description: 'While Frodo and Sam edge closer to Mount Doom to destroy the One Ring, the divided fellowship makes a stand against Sauron\'s new ally, Saruman, and his hordes of Isengard.',
        Genre: {
            Name: 'Fantasy',
            Description: 'Fantasy movies are characterized by magical elements, mythical creatures, and imaginative worlds. They often involve quests, adventures, and the battle between good and evil, allowing for the exploration of complex themes in a fantastical setting.'
        },
        Director: {
            Name: 'Peter Jackson',
            Bio: 'Peter Jackson is a New Zealand filmmaker, director, and producer, best known for his work on the "The Lord of the Rings" and "The Hobbit" trilogies. His adaptations of J.R.R. Tolkien\'s novels received critical acclaim and numerous awards, including multiple Academy Awards. Jackson is recognized for his innovative use of visual effects and his ability to bring epic fantasy stories to life on the big screen.',
            Birth: '1961',
            Death: 'N/A'
        },
        imageURL: 'https://posters.movieposterdb.com/24_06/2002/167261/s_the-lord-of-the-rings-the-two-towers-movie-poster_28018e33.jpg',
        featured: false
    },
    {
        Title: 'The Lord of the Rings: The Fellowship of the Ring',
        Description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
        Genre: {
            Name: 'Fantasy',
            Description: 'Fantasy movies are characterized by magical elements, mythical creatures, and imaginative worlds. They often involve quests, adventures, and the battle between good and evil, allowing for the exploration of complex themes in a fantastical setting.'
        },
        Director: {
            Name: 'Peter Jackson',
            Bio: 'Peter Jackson is a New Zealand filmmaker, director, and producer, best known for his work on the "The Lord of the Rings" and "The Hobbit" trilogies. His adaptations of J.R.R. Tolkien\'s novels received critical acclaim and numerous awards, including multiple Academy Awards. Jackson is recognized for his innovative use of visual effects and his ability to bring epic fantasy stories to life on the big screen.',
            Birth: '1961', 
            Death: 'N/A'
        },
        imageURL: 'https://posters.movieposterdb.com/22_06/2001/120737/l_120737_0ff31144.jpg',
        featured: false
    },
    {
        Title: 'Kurt Cobain: Montage of Heck',
        Description: 'An in-depth look at the life, career, and death of musician Kurt Cobain.',
        Genre: {
            Name: 'Documentary',
            Description: 'Documentary films are a non-fiction genre that aims to document reality for the purposes of instruction, education, or maintaining a historical record. They often explore real-life events, people, and social issues, using various cinematic techniques to tell their stories.'
        },
        Director: {
            Name: 'Brett Morgan',
            Bio: 'Brett Morgan is an American filmmaker known for his innovative documentaries. He gained acclaim for films like "The Kid Stays in the Picture" and "Kurt Cobain: Montage of Heck," which blend archival footage, animation, and personal narratives. Morgan\'s work often explores the complexities of fame and the human experience.',
            Birth: '1970',
            Death: 'N/A'
        },
        imageURL: 'https://posters.movieposterdb.com/15_02/2015/4229236/s_4229236_9c378ee9.jpg',
        featured: true
    },
    {
        Title: 'The Dark Knight',
        Description: 'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham. The Dark Knight must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        Genre: {
            Name: 'Action',
            Description: 'Action movies are characterized by fast-paced sequences, physical feats, and a focus on excitement and adventure. They often include elements like chases, fights, explosions, and stunts.'
        },
        Director: {
            Name: 'Christopher Nolan',
            Bio: 'Christopher Nolan is a British-American filmmaker known for his innovative storytelling and complex narratives. He gained fame with films like "Memento," "Inception," and "The Dark Knight" trilogy. Nolan is recognized for his use of practical effects, non-linear plots, and exploration of philosophical themes.',
            Birth: '1970',
            Death: 'N/A'
        },
        imageURL: 'https://posters.movieposterdb.com/08_06/2008/468569/l_468569_fe24b125.jpg',
        featured: false
    },
    {
        Title: 'Dumb and Dumber',
        Description: 'The cross-country adventures of two good-hearted but incredibly stupid friends.',
        Genre: {
            Name: 'Comedy',
            Description: 'Comedy films are designed to elicit laughter from the audience. They often feature exaggerated characters, humorous situations, and witty dialogue, exploring themes of love, friendship, and the absurdities of life.'
        },
        Director: {
            Name: 'Peter Farrelly',
            Bio: 'Peter Farrelly is an American filmmaker, screenwriter, and producer known for his work in the comedy genre. He gained fame as one half of the Farrelly Brothers duo, co-directing hit films like "Dumb and Dumber," "There\'s Something About Mary," and "Shallow Hal." Farrelly is recognized for his unique blend of raunchy humor and heartfelt storytelling.',
            Birth: '1956',
            Death: 'N/A'
        },
        imageURL: 'https://posters.movieposterdb.com/11_04/1994/109686/l_109686_d708d01a.jpg',
        featured: false
    },
    {
        Title: 'The Mask',
        Description: 'Bank clerk Stanley Ipkiss is transformed into a manic superhero when he wears a mysterious mask.',
        Genre: {
            Name: 'Comedy',
            Description: 'Comedy films are designed to elicit laughter from the audience. They often feature exaggerated characters, humorous situations, and witty dialogue, exploring themes of love, friendship, and the absurdities of life.'
        },
        Director: {
            Name: 'Chuck Russell',
            Bio: 'Chuck Russell is an American filmmaker, screenwriter, and producer known for his work in the action and horror genres. He gained recognition for directing films like "The Blob," "A Nightmare on Elm Street 3: Dream Warriors," and "The Mask." Russell is known for his ability to blend humor with thrilling elements in his films.',
            Birth: '1961',
            Death: 'N/A'
        },
        imageURL: 'https://posters.movieposterdb.com/08_11/1994/110475/l_110475_1b7b7311.jpg',
        featured: false
    },
    {
        Title: 'Wayne\'s World',
        Description: 'Two slacker friends try to promote their public-access cable show.',
        Genre: {
            Name: 'Comedy',
            Description: 'Comedy films are designed to elicit laughter from the audience. They often feature exaggerated characters, humorous situations, and witty dialogue, exploring themes of love, friendship, and the absurdities of life.'
        },
        Director: {
            Name: 'Penelope Spheeris',
            Bio: 'Penelope Spheeris is an American filmmaker known for her work in documentary and narrative cinema. She gained fame for directing "The Decline of Western Civilization" documentary series and comedies like "Wayne\'s World." Spheeris is recognized for her ability to blend humor with social commentary.',
            Birth: '1945',
            Death: 'N/A'
        },
        imageURL: 'https://posters.movieposterdb.com/08_05/1992/105793/l_105793_80a48abc.jpg',
        featured: false
    },
    {
        Title: 'Pearl Jam Twenty',
        Description: 'A look at the Seattle band Pearl Jam and its rise to fame in the 1990s.',
        Genre: {
            Name: 'Documentary',
            Description: 'Documentary films are a non-fiction genre that aims to document reality for the purposes of instruction, education, or maintaining a historical record. They often explore real-life events, people, and social issues, using various cinematic techniques to tell their stories.'
        },
        Director: {
            Name: 'Cameron Crowe',
            Bio: 'Cameron Crowe is an American filmmaker, producer, and screenwriter known for his work in the romantic comedy and drama genres. He gained fame for films like "Almost Famous," "Jerry Maguire," and "Say Anything." Crowe is recognized for his ability to blend music with storytelling and his exploration of youth culture.'
        },
        imageURL: 'https://posters.movieposterdb.com/11_09/2011/1417592/s_1417592_62a57e20.jpg',
        featured: false
    }
];

// CREATE
app.post('/users',
    [
        check('name', 'Username is required').isLength({min: 5}),
        check('name', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('password', 'Password is required').not().isEmpty(),
        check('email', 'Email does not appear to be valid').isEmail()
    ], async (req, res) => {

        // check the validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        
    let hashedPassword = Users.hashPassword(req.body.password);
    await Users.findOne({name: req.body.name})
        .then((user) => {
            if(user) {
                return res.status(400).send(req.body.name + ' already exists!');
            } else {
                Users
                .create({
                    name: req.body.name,
                    password: hashedPassword,
                    email: req.body.email,
                    birthday: req.body.birthday
                })
                .then((user) =>{res.status(201).json(user)})
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        }); 
});

app.post('/users/:Username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({name: req.params.name}, {
        $push: {FavoriteMovies: req.params.MovieID}
    },
    {new: true})
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// READ
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/users/:name', async (req, res) => {
    await Users.findOne({ Name: req.params.name })
        .then((user) => {
            if (user) {
                res.json(user);
            } else {
                res.status(400).send('User not found');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/:movieTitle', async (req, res) => {
    await Movies.findOne({Title: req.params.movieTitle})
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/genre/:genreName', async (req, res) => {
    const { genreName } = req.params;
    await Movies.findOne({'Genre.Name': genreName})
        .then((movie) => {
            if (movie) {
                res.status(200).json(movie.Genre);
            } else {
                res.status(400).send('Genre not found');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/director/:directorName', async (req, res) => {
    const { directorName } = req.params;
    await Movies.findOne({'Director.Name': directorName})
        .then((movie) => {
            if (movie) {
                res.status(200).json(movie.Director);
            } else {
                res.status(400).send('Director not found');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// UPDATE 
app.put('/users/:name',
    [
        check('name', 'Username is required').isLength({min: 5}),
        check('name', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('password', 'Password is required').not().isEmpty(),
        check('email', 'Email does not appear to be valid').isEmail()
    ], async (req, res) => {

        // check the validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        await Users.findOneAndUpdate({name: req.body.name}, {$set:
          {
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            birthday: req.body.birthday
          }
        },
        {new: true})
        .then((updatedUser) => {res.status(201).json(updatedUser);})
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error:' + err);
        })
});

// DELETE
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({name: req.params.name}, {
        $pull: {FavoriteMovies: req.params.MovieID}
    },
    {new: true})
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.delete('/users/:name', async (req, res) => {
    await Users.findOneAndDelete({name: req.params.name})
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.name + ' was not found');
            } else {
                res.status(200).send(req.params.name + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to my top movie list!');
});

app.use(morgan('common'));

app.use(express.static('public'));

// error handling

app.use(methodOverride());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('You\'ve encountered an error!');
});


// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Your app is listening on port ' + port);
});
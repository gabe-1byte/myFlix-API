const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'), // import the built in node modules fs and path
    path = require('path'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    uuid = require('uuid');
const { Deserializer } = require('v8');

const app = express();

// setup the logger to log into a log.txt file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}));

// Setup bodyParser middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

let users = [
    {
        id: 1,
        name: 'Gabe',
        favoriteMovies: [
            'The Crow'
        ]
    },
    {
        id: 2,
        name: 'Sam',
        favoriteMovies: [
            'The Mask'
        ]
    },
    {
        id: 3,
        name: 'Alex',
        favoriteMovies: [
            'The Dark Knight', 'Kurt Cobain: Montage of Heck'
        ]
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
        imgeURL: 'https://posters.movieposterdb.com/09_11/1994/109506/l_109506_3096a83e.jpg',
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
        featured: true
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
app.post('/users', (req, res) => {
    const newUser = req.body;
    
    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('User must have a name');
    }
});

app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle} = req.params;
    
    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`Movie ${movieTitle} added to ${user.name}, User ID: ${id}`);
    } else {
        res.status(400).send('User not found');
    }
});

// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle} = req.params;
    
    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`Movie ${movieTitle} has been removed from ${user.name}, User ID: ${id}`);
    } else {
        res.status(400).send('User not found');
    }
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    
    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id != id);
        res.status(200).send(`User: ${user.name} with the User ID: ${id} has been deleted`);
    } else {
        res.status(400).send('User not found');
    }
});



// UPDATE 
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    
    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('User not found');
    }
});


// READ
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.Title === title); 

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('Movie not found');
    }
});

app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.Genre.Name === genreName)?.Genre; 

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('Genre not found');
    }
});

    app.get('/movies/director/:directorName', (req, res) => {
        const { directorName } = req.params;
        const director = movies.find(movie => movie.Director.Name === directorName)?.Director;
    
        if (director) {
            res.status(200).json(director);
        } else {
            res.status(400).send('Director not found');
        }
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
app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});
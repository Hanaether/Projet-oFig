// Toujours commencer par importer les variables d'environnement !
require('dotenv').config();

const express = require('express');

// on charge le package express-session
const expressSession = require('express-session');

// on importe le router
const router = require('./app/router');

// un peu de config
const PORT = process.env.PORT || 5000;

const app = express();

// on cable le middleware express-session avec app.use
// attention...
// on le met AVANT le chargement du routeur (app.use(router))
app.use(expressSession({
  resave: true, // -> on va voir la doc si on veut
  saveUninitialized: true, // -> on va voir la doc si on veut
  secret: "Guess it!", // clé de hashage (clé secrete)
  cookie: { // informations sur le cookie
    secure: false, // cokie pas sécurisé, car on est en HTTP et non pas en HTTPS.
    maxAge: (1000*60*60) // durée max du cookie en ms. 1000 * 60 * 60 = une heure.
  }
}));

// on dit a express...

// qu'on veut utiliser ejs
app.set('view engine', 'ejs');

// et que les vues sont dans le dossier /app/views
app.set('views', 'app/views');

// servir les fichiers statiques qui sont dans "integration"
app.use(express.static('integration'));

app.locals.bidule = "chose";

// routage !
app.use(router);


// on lance le serveur
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

const express = require('express');

// on importe nos controllers
const mainController = require('./controllers/mainController');
const bookmarksController = require('./controllers/bookmarksController');
const dataMapper = require('./dataMapper');


const router = express.Router();

// page d'accueil
// petite nouveauté : on peut donner deux middlewares, a une seule route
// chic non ? 
// sur les deux routes qui suivent, on charge les catégories avant de construire
// notre réponse.
router.get('/', mainController.leftMenu, mainController.homePage);

// page article
router.get('/article/:id', mainController.leftMenu, mainController.articlePage);

// page ajout aux favoris.
router.get('/bookmarks/add/:id', bookmarksController.addToFavorites);

// page supprimer des favoris.
router.get('/bookmarks/delete/:id', bookmarksController.removeFromFavorites);

// page favoris
router.get('/bookmarks', bookmarksController.bookmarksPage);


// on exporte le router 
module.exports = router;
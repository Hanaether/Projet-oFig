const path = require('path');

const dataMapper = require('../dataMapper');

const bookmarksController = {

  // méthode pour afficher le panier
  bookmarksPage: (request, response) => {
    // ici, je veux afficher mes favoris.
    // ici, je vais récupérer le tableau des favoris,
    // depuis la fameuse session.
    // je vais ensuite les récupérer en SQL...
    // et les donner à ma vue.

    // si y'a pas de bookmarks dans la session ?
    if (!request.session.bookmarks) {
      // on affiche la vue, sans bookmarks. on donne un tableau vide.
      // comme c'est vide, la boucle dans notre vue ejs, n'affichera rien.
      response.render('bookmarks', {
        bookmarks: []
      });
    } else {
      // si il y a bien des bookmarks dans la session.
      // on appelle le dataMapper, en donnant en premier parametre
      // la liste de nos bookmarks (request.session.bookmarks)

      // est un tableau du genre : [5, 2]
      const bookmarksInSession = request.session.bookmarks;

      // j'apelle le datamapper
      dataMapper.getFigurinesByIds(bookmarksInSession, (error, result) => {
        if (error) {
          console.log('SQL Error : ', error);
        } else {
          // si jarrive ici, tout va bien
          // dans result.rows, j'aurai les résultats corresondant aux ids demandés.
          const figurinesFromDatabase = result.rows;
  
          // et j'affiche ma vue bookmarks
          // en lui donnant les données en provenance de SQL
          response.render('bookmarks', {
            bookmarks: figurinesFromDatabase
          });
        }
      });
    }
  },
  addToFavorites: (request, response) => {
    // je récupère l'id que je veux stocker dans mes favoris
    const figurineId = request.params.id;

    // on veut ajouter l'id "figurineId" dans nos bookmarks.
    // les bookmarks existent dans notre session.
    // on commence par regarder si un tableau "bookmarks" existe dans notre session
    // si il n'existe pas. on le crée.
    // rappel : on accède à la session avec request.session
    if (!request.session.bookmarks) {
      // ok, le tableau n'existe pas. je le crée.
      // je crée une nouvelle clé dans l'objet
      // dedans, je met un tableau vide.
      request.session.bookmarks = [];
    }
    // ok cool j'ai créé mon tableau de bookmarks si il n'existait pas.
    // maintenant, je vais ajouter dedans l'id de la figurine que je veux.
    // a ce stade, la clé bookmarks existe forcément
    // carj e l'ai créé si besoin au dessus (dans le if)
    request.session.bookmarks.push(figurineId);

    // ok, on a stocké la figurine dans les bookmarks.
    // et maintenant ? on redirige vers la page favoris.
    response.redirect('/bookmarks');
  },
  removeFromFavorites: (request, response) => {
    // supprimer un favori.
    // je sais que j'ai un tableau request.session.bookmarks, qui contient les favoris.
    // je veux enlever de ce tableau, l'id du favori qui est dans mes parametres d'url

    // on commence par extraire l'id dedmandé
    const figurineId = request.params.id;

    // et maintenant : enlever une case d'un tableau
    // je veux filtrer sur mes favoris, en ne conservant que ceux dont l'id
    // est différent de "figurineId"
    // rappel : dans le tableau de bookmarks, j'ai des ids
    // genre [4, 2, 3]
    // résultat : j'obitens un tableau, sans l'id que je ne veux plus
    request.session.bookmarks = // on écrase l'ancien tableau
      request.session.bookmarks.filter((id) => id !== figurineId) //  avec le résultat de filter
  
    response.redirect('/bookmarks');
  }
};


module.exports = bookmarksController;

const utils = require('../utils');

const dataMapper = require('../dataMapper');

const mainController = {
  leftMenu: (request, response, next) => {
    dataMapper.getFigurineCountByCategories((error, result) => {
      if (error) {
        console.log(error);
      } else {
        const categoriesFromDatabase = result.rows;

        // response.locals = une autre facon de donner des variables
        // a notre vue.
        response.locals.categories = categoriesFromDatabase;

        // et maintenant ?
        // je next au prochain middleware
        // c'est a dire, en fonction de la route, dans un des controlleurs.
        next();
      }
    });
  },
  // méthode pour la page d'accueil
  homePage: (request, response) => {
    // objectif
    // j'apelle le datamapper, je récupère les figurines,
    // et je les donne a ma vue
    // puis, je rendrai ma vue dynamique pour itérer et afficher toutes les figurines
    // qu'on lui donne.
    dataMapper.getAllFigurines((error, result) => {
      if (error) {
        console.log('SQL Error : ', error);
      } else {
        // si jarrive ici, j'ai bien un résultat.
        // ici, je récupère mes figurines depuis la base de donnée
        const figurinesFromDatabase = result.rows;

        // probleme : dans chaque case de figurinesFroMDatabase, j'ai un objet
        // et dans cet objet, j'ai une note moyenne sous forme de nombre
        // je voudrais plutot avoir la petite string avec les étoiles

        // je boucle sur mon tableau de figurines.
        // pour chaque figurine. je passerai dans la boucle.
        for (let i = 0 ; i < figurinesFromDatabase.length ; i++) {
          // je sais que dans figurinesFromDatabase[i], j'ai la case courante.
          // je sais que la case courante, est un objet.
          // et que dans cet objet, j'ai un ".avg"
          const averageRatingAsNumber = figurinesFromDatabase[i].avg;

          // maintenant, je fabrique une string avec la fonction 
          // "buildStarsString"
          // rappel : elle prend un parametre une note (nombre) et renvoie
          // le nombre d'étoiles correspondant, sous forme de string.
          const averageRatingAsString = utils.buildStarsString(averageRatingAsNumber);

          // dernière étape : je vais remplacer le figurinesFromDatabase[i].avg
          // par la string que j'ai fabriquée
          figurinesFromDatabase[i].avg = averageRatingAsString;
        }
        // exercice...
        // pourquoi ne pas essayer de recoder la boucle au dessus, avec un .map ?
        // vous avez plus bas un exemple

        // j'affiche ma vue et je lui donne les données en provenance de SQL
        response.render(
          'home',
          {
            figurines: figurinesFromDatabase,
          }
        );
      }
    });
  },

  // méthode pour la page article
  articlePage: (request, response) => {
    // je récupère le parametre d'url
    const figurineId = request.params.id;

    dataMapper.getFigurineById(figurineId, (error, result) => {
      if (error) {
        console.log('SQL Error : ', error);
      } else {
        const figurineFromDatabase = result.rows[0];

        // 2eme requete : on récupère les reviews de cette figurine.
        dataMapper.getReviewsByFigurineId(figurineId, (error, result) => {
          if (error) {
            console.log('SQL Error : ', error);
          } else {
            // je récupère les reviews dans le résultat SQL
            const reviewsFromDatabase = result.rows;

            // je veux transformer le tableau de reviews avant de le donner a ma vue.
            // je veux transformer les notes, sous forme de nombre (1-5)
            // en string qui contient les étoiles.

            // j'utilise map pour "transformer" mon tableau de reviews
            // map prend un callback, qui sera appelé pour chaque case du tableau
            const formattedReviews = reviewsFromDatabase.map((review) => {
              // dans ce callback, je vais renvoyer un nouvel objet.
              // rappel : c'est un tableau d'objet
              // je crée un nouvel objet,
              // ou je copie ma review, champ par champ
              // sauf ! la note, que je vais transformer
              return {
                id: review.id,
                author: review.author,
                note: utils.buildStarsString(review.note),
                title: review.title,
                message: review.message,
              }
            })

            response.render('article', {
              figurine: figurineFromDatabase,
              reviews: formattedReviews,
            });
          }
        })
      }
    });
  }

};


module.exports = mainController;

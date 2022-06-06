const client = require('./database');

const dataMapper = {
    getAllFigurines: (callback) => {
        // toutes les figurines + leur note moyenne
        const selectAllFigurinesQuery = `
            SELECT figurine.*, ROUND(AVG(review.note)) as avg
            FROM review JOIN figurine
            ON review.figurine_id = figurine.id
            GROUP BY figurine.id;
        `;
        // je joue ma requete avec client.query, et je donne le callback
        client.query(selectAllFigurinesQuery, callback);
    },
    getFigurineById: (id, callback) => {
        // je déclare ma requete
        const selectFigurineByIdQuery = 'SELECT * from "figurine" WHERE "id"=$1;';
        // je joue ma requete avec client.query, et je donne ses parametres
        // qui remplaceront les $1, $2...
        // et a la fin, je donne le callback.
        client.query(selectFigurineByIdQuery, [id], callback);
    },
    getFigurinesByIds: (idsArray, callback) => {
        // dans idsArray, j'ai un tableau, du genre : [4, 2]

        // ANY attend un tableau. je peux donner directement le tableau javascript !
        // pas besoin de join, et pas de souci avec l'injection SQL, je peux bien utiliser le  $1
        const selectFigurineByIdQuery = 
            'SELECT * from "figurine" WHERE "id" = ANY($1)';

        // je joue ma requete avec client.query.
        client.query(selectFigurineByIdQuery, [idsArray], callback);
    },
    getReviewsByFigurineId: (figurineId, callback) => {
        const selectReviewsByFigurineIdQuery = 
            'SELECT * from "review" WHERE "figurine_id" = $1';

        // on insere l'id de figurine en parametre à la place du $1
        client.query(selectReviewsByFigurineIdQuery, [figurineId], callback);
    },
    getFigurineCountByCategories: (callback) => {
        const getCountQuery = 
            'SELECT category, COUNT(*) FROM "figurine" GROUP BY category;'
        
        client.query(getCountQuery, callback);
    }
};

module.exports = dataMapper;

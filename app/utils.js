// &#9733 = étoile pleine
// &#9734 = étoile vide

const buildStarsString = (note) => {
    // objectif : en fonction de la note (un nombre entier)
    // afficher le bon nombre d'étoiles pleines
    // puis si besoin, des étoiles vides
    let finalString = "";
    i = 0;

    // je boucle entre 0 et 5 (car 5 étoiles max)
    while (i < 5) {
        // si l'étoile que je dessine actuellement,
        // est en dessous de la note
        // alors, j'écris une étoile pleine
        if (i < note) { 
            finalString += '&#9733; ';
        } else { // sinon... une étoile vide.
            finalString += '&#9734; ';
        }
        // je n'oublie pas d'incrémenter ma boucle...
        i++;
    }
    return finalString;
}

// j'exporte un objet, qui contient ma fonction "buildStarsString"
module.exports = {
    buildStarsString,
    // équivalent de : 
    // buildStarsString: buildStarsString,
    // rappel : ca s'apelle la "shorthand property (feature de es6)"
}
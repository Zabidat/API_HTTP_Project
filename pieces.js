
// Cette syntaxe permt d importer (faire entrer 1 fichier par ex; avislisterAvis depuis le fichier avis.js) des varaibles et des fonctions ds notre fichier ss rajouter d autres balises script ds notre HTML
import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherAvis, afficherGraphiqueAvis } from "./avis.js";



//Recuperer les donnees(pieces)eventuellemnt stockees ds le localStorage (avec la fct getItem)
let pieces = window.localStorage.getItem("pieces");  

if (pieces === null)                                 // c est pr q le navigateur n accede pas au serveur tt le temps : cett condition
{

    // Récupération des donnees (ou des pièces ) depuis le fichier JSON(depuis l API HTTP)
    const reponse = await fetch('http://localhost:8081/pieces/');       // la fct fecth(utlise par defaut le verbe GET) envoit une requete et prend en argument()une chaine de caractere qui contient l adresse du serveur web et le chemin qui decrit la ressource que nous souhaiton manipuler.
    pieces = await reponse.json();                   // await(operation asynchrone) ici permt de parsser (transformer) le contenu recuperer(en forme d une chaine de caractere) en haut au format JSON.
    const elt1 = pieces[0].categorie;
    console.log(elt1);
   
    // Convertir ou TRANSFORMER les donnees recu (avt de les enregistrer ds le localStorage)
    const valeurPieces = JSON.stringify(pieces);


    //Puis les enregistrer ou STOCKER ds le localStorage grace a la fct setItem
    window.localStorage.setItem("pieces", valeurPieces);


} 
else
{
    // s il y a des donnees , on les reconstrui en memoire grace a la fct JSON.parse
    pieces = JSON.parse(pieces);   


}


// On app la fct(ajoutlistenerAvis) pr ajouter l ecoute du formulaire
ajoutListenerEnvoyerAvis(); 






// Fonction va creer des elts html dont le browzer va generer la page  
function genererPieces(pieces)
{

    for (let i = 0; i < pieces.length; i++)            // la boucle for permet d generer toutes les fiches produits ou integrer les 5 fiches produit a notre page
    {
    
        // la variable i = permet de recuper la piece a l index de parcous de la boucle
        const article = pieces[i];                           

        // Recuperation de l elt du DOM qui accueillera les fiches
        const sectionFiches = document.querySelector(".fiches");
        //Creation d 1e balise dediee a une piece automobile
        const pieceElement = document.createElement("article");

        // Création des balises
        const imageElement = document.createElement("img");
        imageElement.src = article.image;

        const nomElement = document.createElement("h2");
        nomElement.innerText = article.nom;

        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;  // (Verifiez nos donnees- Possibiliter 1: on a utiliser operateur ternaire utlisait lorsqu on doit choisir entre 2 possibilites;  (${article.prix < 35 ? = expression a terster); "€" = valeur si vrai; "€€€" = valeur si faux)

        const categorieElement = document.createElement("p");
        categorieElement.innerText = article.categorie ?? "(aucune catégorie)";    //( Verifiez nos donnes- Possibiliter 2:  ?? aucune categorie= operateur nullish qui ns dit que ce genre de piece automobile n appartien a aucun categorie)

        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = article.description ?? "Pas de description pour le moment.";

        const stockElement = document.createElement("p");
        stockElement.innerText = article.disponibilite ? "En stock" : "Rupture de stock";


        // Ajout du bouton(on a creer une tag boutton ds html) sr chaqu fiche de produit avec un attribut data-id= qui contient l identifiant de la piece auto
        const avisBouton = document.createElement("button"); 
        avisBouton.dataset.id = article.id;                                     // ds le bouton on a ajouter lattribut data-id( grace a la proprieter dataset.id), cela ns permettra de recuprer l elt parent auquel ajouter les avis
        avisBouton.textContent = "Afficher les avis"; 



        //On rattach la balise article a la section Fiches
        sectionFiches.appendChild(pieceElement);
        // On Rattache l image a pieceElement (la balise article)
   
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement); 

        //Ajout des éléments au DOM 
        pieceElement.appendChild(descriptionElement); 
        pieceElement.appendChild(stockElement); 

        //Ajout de l elemt au DOM
        pieceElement.appendChild(avisBouton);

    } 

    //Appeler de la fct ajoutListenerAvis a la suite du code de generation DOM de tous les fichiers produits
    ajoutListenersAvis();                // l ajout de cette fct ne creera pas d errur ds notre code car on l a importer avant de l utliser avec cet syntaxe a la 1ere ligne du fichier pieces.js

}

// Premier affichage de la page

genererPieces(pieces); 



// Pr affciher les avis depuis le localStorage: Ecrir 1e boucle qui parcours tt les pieces(et pr chaq piece)

for (let i = 0; i < pieces.length; i++)
{
    //Recuperer les valeurs stockes ds le localStorage
    const id = pieces[i].id;
    const avisJSON = window.localStorage.getItem(`avis-piece-${id}`);
    const avis = JSON.parse(avisJSON); 

   
    if(avis !== null)                 // si la vleur est presente, alors recupere eltParent grace a l attribut data-id
    {
        const pieceElement = document.querySelector(`artcile[data-id="${id}"]`);
        afficherAvis(pieceElement, avis);
    }

}







//LA GESTION DES BOUTON: 
// Ordonner ou Trier les fiches produits grace a la fct sort

// Trier les pieces selon leur prix par Ordre croissant : CORRIGEZ 
const boutonTrier = document.querySelector(".btn-trier");

boutonTrier.addEventListener("click", function ()           // ecouter l evenement click de la souris et //addevListener = permet de modifier l ordre des pieces en fct de leur prix      
{
    const piecesOrdonnees = Array.from(pieces);                   // la fct Array.from =cree une copie de la liste piece. Cela permt de ne pas toucher a l ordre des elts pieces, Prque les autres Tries et filtres de la page fonctionne normalemen
    piecesOrdonnees.sort(function (a, b)                           // On a appeler la fct sort qi prend en param 1e funct anonyme qui prend 2 para(a,b)qui reprensent 2 elts de la liste comparer
    {
        return a.prix - b.prix;                           // la fct anony retourne 1 nmbr otbenu a la difference des prix
    });
    //Effacement de l ecran et regeneration de la page
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees); 

});
 


// Ajout du Listener pour filtrer les pieces non abordables             Ou Filtrer les elts d 1e liste avec la fct filter: constbtnFilter = filtre les pieces indisponibles

const boutonFiltrer = document.querySelector(".btn-filtrer");
 
boutonFiltrer.addEventListener("click", function ()                   //attacher EventListener a l evenemen click, ici pas besoin de creer une copie de liste car la fct filter le fera 
{
    const piecesFiltrees = pieces.filter(function (piece)             // on appele la fct filter par une fction anonym qui renvoie une valeur booleene
    {
        return piece.prix <= 35;                                     // fct anonym renvoi 1e valeur booleene avec la condition piece.prix<=35
    });

    //Effacement de l ecran et regeneration de la page avec lespieces filtrees uniquement
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);

});
 


// Trier les pieces par prix decroissant( prix du plus grand au plus petit) : on a repris la meme methode comme les boutons deja present en haut
const boutonDecroissant = document.querySelector(".btn-decroissant");        // recuperer la reference btndecroissant
 
boutonDecroissant.addEventListener("click", function ()                     // attacher un EventListener sur l evenement click
{
    const piecesOrdonnees = Array.from(pieces);                            // on cree une copie de la liste piece
    piecesOrdonnees.sort(function (a, b)                                  // puis on appele la fct sort
    {
        return b.prix - a.prix;
    });

    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);

});



// Filtrer les pieces sans description
const boutonNoDescription = document.querySelector(".btn-nodesc");
 
boutonNoDescription.addEventListener("click", function ()        
{
    const piecesFiltrees = pieces.filter(function (piece)                   // on appele la fct filter 
    {
        return piece.description                                            //est retounee la proprieter description et si la description est absente alors elt ne sera ds la list des piece
    });

    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);

}); 




// Afficher une liste des pieces abordable cad au prix < 35euros

// 1- on va generer un liste contenant que les noms des pieces

const noms = pieces.map(piece => piece.nom);            // On a utliser la fct map sur la liste des pieces et map prend en parametre une fct lambda avec le symbole =>(map(piece => piece.nom))
// la fct lambda signi retrouner la valeur de la proprieter nom de l objet piece

// Ensuite on veut supprimer les noms des pieces non abordables
for(let i = pieces.length -1 ; i >= 0; i--)                              // la boucle va parcourir ts les noms et elle va commencer au dernier indice(=pieces.length-1); et i-- = on diminuera de 1 la valeur de i et on doit descendre en dessous de zero
{
    if(pieces[i].prix > 35)                          // la condition veirifie si le prix de la piece est > 35
    {
        noms.splice(i,1)                            // on supprime le noms de la piece ds la liste nom grace a la fct splice
    }
}
console.log(noms)


// Creer les elts du DOM qui formeront la liste a l ecran: 
const pElement = document.createElement('p');
pElement.innerText = "Pièces abordables";


// Creation de la liste 
const abordablesElements = document.createElement("ul");

//Ensuite parcourons la liste des noms avec for
// Ajout de chaque nom a la liste
for(let i=0; i < noms.length; i++)                    // for va prendre 3 etapes de generation 
{
    const nomElement = document.createElement("li");   // creation de li
    nomElement.innerText = noms[i];                    // remplissage de son contenu textuel
    abordablesElements.appendChild(nomElement)         // l ajout au parent

}

// Ajout de l en-tete puis de la liste au bloc resultats filtres en Haut.

document.querySelector(".abordables").appendChild(pElement).appendChild(abordablesElements);  

// Rattacher elt ul a 1 elt present ds la page:

      


// Afficher la description des pieces disponible a cote de la description abordables

const nomsDisponibles = pieces.map(piece => piece.nom);
const prixDisponibles = pieces.map(piece => piece.prix);

for(let i = pieces.length -1 ; i >= 0; i--)
{
    if(pieces[i].disponibilite === false)
    {
        nomsDisponibles.splice(i,1)                           // supprimer ou ajouter 1 elt ds le tableau(i = position ou index de l elt, 1= elt a supprimer , dc ca sera lui mm, ..= elt a jaouter )
        prixDisponibles.splice(i,1) 
    }
}

const disponiblesElement = document.createElement("ul");

for(let i=0 ; i < nomsDisponibles.length ; i++)
{
    const nomElement = document.createElement("li");
    nomElement.innerText = `${nomsDisponibles[i]} - ${prixDisponibles[i]} €`;
    disponiblesElement.appendChild(nomElement)
}

const pElementDisponible = document.createElement('p');
pElementDisponible.innerText = "Pièces disponibles:";
document.querySelector(".disponible").appendChild(pElementDisponible).appendChild(disponiblesElement); 



//Recuperer 1e reference a la balise input avec querySelector et ajouter 1 eventLiseter
const inputPrixMax = document.querySelector('#prix-max');
inputPrixMax.addEventListener('input', function()
{
    const piecesFiltrees = pieces.filter(function(piece)
    {
        return piece.prix <= inputPrixMax.value;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);  
})


// Ajout du Listener pr mettre a jour des donnes du localStorage
const boutonMettreAjour = document.querySelector(".btn-maj");

//Ajout eventListener qui supprimera le contenu du localStorage (avc la fct removeItem)
boutonMettreAjour.addEventListener("click", function() 
{
    window.localStorage.removeItem("pieces"); 
});


// On va faire appel a la fct AfficherGraphiqueAvis:
await afficherGraphiqueAvis(); 


 





//Afficher la valeur sur Value:

var slider = document.getElementById("prix-max");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function()
{
    output.innerHTML = this.value;
} 







// A retenir sur le terminal node.js: Apres chaque modification du js
//Il faut arreter le processus (Node.js) avec la commande: ctrl+ c ou ctrl +z
// Ensuite taper la commande: npm run dev et copier le protocole http et coller sur google pour voir l evolution de notre travail











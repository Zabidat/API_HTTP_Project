
/* global Chart */ 


export function ajoutListenersAvis()             // on appalera ct fonction dans le fichier pieces.js apres la boucle for de generation des elemts du DOM qui se trouve ds la fct generePieces;  // Deplacer (avec le mot cle export cette function sera disponible en dehors de ce fichier) ou exporter ce ficier dans un autre fichier: Ici, on va Envoyer une requete http pour recuper les avis associer a une piece. 

{

    const piecesElements = document.querySelectorAll(".fiches article button");         // On va recupere touts les balises button present sur notre fiche produit
 
    for (let i = 0; i < piecesElements.length; i++)                              // avec la boucle for nous parcourons ts ces boutons pour leur ajouter un eventlister
    {
        // on va ecouter l event click sur le bouton
     piecesElements[i].addEventListener("click", async function (event){

        
        const id = event.target.dataset.id;                       //event.target= en cliquant sr le bouton;  Grace a la proprieter dataset.id = permt de recuperer la valeur de l attribut data-id      
        const reponse = await fetch("http://localhost:8081/pieces/" + id + "/avis");       //Fetch= permet d acceder a une ressource (l appel de cette fonct permet d envoyer une requete GET sur le serveur localhost:8081 pour demander la ressource/peices);  cet id de la piece = permt d appeler la fct fetch avec une url personaliser
        const avis = await reponse.json(); 

        // Appel a la fct setItem (en calculant le nom de la cle localStorage grace a ID(${id= de la piece}); et convertir ou TRansformer les avis recu JSON grace (JSON.stringify); Pr forunir une valeur a la localStorage )
        window.localStorage.setItem(`avis-piece-${id}`, JSON.stringify(avis)); 

        const pieceElement = event.target.parentElement;
        afficherAvis(pieceElement, avis); 

     });  

 
    }
 
} 

// EXPORTER CETTE FCT en dessous (avc le mot cle export pr quel soit disponi a lexterieur du fichier)Creer 1e fct qi prend 2 parametre(eltduDom ou est rattacher le tag p, avis(la liste des avis a ajouter) )

export function afficherAvis(pieceElement, avis)
{
    const avisElement = document.createElement("p");
    
    // ENSUITE, on va remplir le contnu html du tag p, en parcouran les avis et en ajoutan le nom d utlisateur(${avis[i]}.utlisateur)etson commentaire suivi d1 retour a la ligne
    for(let i = 0; i < avis.length; i++)
    {
        avisElement.innerHTML += `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire} <br>`;
        //console.log(avis[i].utilisateur);
    }
    // Rattacher elt p au parentElement que ns avons recupere precedemment
    
    pieceElement.appendChild(avisElement); 
    

}





//2EME FCT:  NS ALLONS CREER UNE FCT Ajoutlistern pr envoyer 

export function ajoutListenerEnvoyerAvis()
{
   
    //ON recupere une refernece au form grace de querySelector
    const formulaireAvis = document.querySelector(".formulaire-avis");
    
    //Ensuit, on ajout 1 eventListener sur l evenemn submit(qi se declenchera qd utilisateur cliqra sr le btn envoyer)
    formulaireAvis.addEventListener("submit", function (event)
    {
        
        // 1: bloquer le comportemn par defaut du navigateur
        event.preventDefault();

        //Creer 1 objet(du new avis)qi servra d charge utile avec les 3 proprietes{avec queryselector= pr recuperer les valeur envoyer; pr l ID de la piece=ns ciblns le tag qui porte attribut(name=piece-id); ns utlison event-target(plutot q document)comme point de depart pr la fct queryselector;enfin on recuper la proprie value= qi contien la valeur saisi par utlisateur sr le site web; ainsi on fait la mme chose pr ulistauer et le commentaire }
        const avis =
        {
            pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
            utlisateur: event.target.querySelector("[name=utilisateur]").value,
            commentaire: event.target.querySelector("[name=commentaire]").value,
            nbEtoiles: parseInt(event.target.querySelector("[name=nbEtoiles]").value)

        }; 



        // L charg util est prete, et on va la convertir en JSON(avc la fct JSON.stringify)
        const chargeUtile = JSON.stringify(avis); 

        //Enfin, on appel la fct fetch avec ces 2 arguments(url et objet de configuration() ): ces news donnees seront stocker ds l API HTTP
        fetch("http://localhost:8081/avis", {
            
            method: "POST",                                              // ct proprieter renseigne le verbe http POST(pr creer 1 new avis)
            hearders:{ " Content-Type": "application/json" },            // Pour que le serveur l ineterprete correctemen
            body: chargeUtile                                            // la charg utile au format json

        });


    });


}



// Code pr Afficher un graphique du nombre d etoile attribuer sr la page web: 1= Creer une fct que ns exportons

export async function afficherGraphiqueAvis()
{
    // Recuperer ts les avis de la plateforme en faisant 1e requete a l API HTTP sr le chemin/avis
    const avis = await fetch("http://localhost:8081/avis").then(avis => avis.json());

    // Calcul du nombre total de commentaires par quantité ou niveau d'étoiles( de 1 a 5) attribuées: on a 1 tableau de 5 elts initialiser a zero

    const nb_commentaires = [0, 0, 0, 0, 0];

    // Parcourir les avis grace a la boucle for et incrementer les elts de la liste correspondant au nombr d etoile attribuer

    for (let commentaire of avis) 
    {
        nb_commentaires[commentaire.nbEtoiles - 1]++;
    }


    // Preparer la configuration du graphique en commencant pr: Le label= la liste des labels et datasets= contient la liste d objet et 3 proprieter

     // Légende ou nom qui s'affichera sur la gauche à côté de la barre horizontale
     const labels = ["5", "4", "3", "2", "1"];

     // Configurer les Données avec l objet data et personnalisation du graphique: 
     const data = 
     {
         labels: labels,
         datasets: [{
             label: "Étoiles attribuées",
             data: nb_commentaires.reverse(),              // inverser la liste nb-commentaire pr affciher le nbde commentair pr 5 etoile, 4 etoile ainsi de suite. 
             backgroundColor: "rgba(255, 230, 0, 1)",       // couleur jaune
         }],

     };


  
    // Creer l Objet de configuration final: on trouve le type= grphique, les data=donnees, et Options: axe principale
    const config = 
    {
        type: "bar",
        data: data,
        options: {
            indexAxis: "y",
        },
    };

    // On va Creer le Graphique pr de vrai: Rendu du Graphique ds l elt canvas
    new Chart(
        document.querySelector("#graphique-avis"),        // on specifie l elt du DOM auquel le rattacher
        config,                                          // c est l objet de configuration
    ); 



    // 2eme graphiqu pr afficher le nbr de commentair attribuer au pieces disponibl

    // 1- Recupere les pieces depuis le localStorage
    const piecesJSON = window.localStorage.getItem("pieces");

    //const pieces = piecesJSON ? JSON.parse(piecesJSON) : [];
    const pieces = JSON.parse(piecesJSON)

    // Calcul du nombre de commentaires en creant 2 variables: 
    let nbCommentairesDispo = 0;
    let nbCommentairesNonDispo = 0;


    // Parcourer la liste des piece avc la bcle for et a l aide d1e conditin if( pr incremmenter la bonne variable )

    for (let i = 0; i < avis.length; i++) 
    {
        const piece = pieces.find(p => p.id === avis[i].pieceId);

        if (piece) {
            if (piece.disponibilite) 
            {
                nbCommentairesDispo++;
            } else {
                nbCommentairesNonDispo++;
            }

        } 

    }


    //Creer 1e liste pour les labels de notre graphiq(dispo et non disponible) ou Legende qui s affcihe sur la gauch a cote d la barre horizo

    const labelsDispo = ["Disponibles", "Non dispo."];


    //Creer 1 objet de configuration pr les donnees ou Donnes et personnalisation du graphique

    const dataDispo = 
    {
        labels: labelsDispo,
        datasets: [{                                                
            label: "Nombre de commentaires",
            data: [nbCommentairesDispo, nbCommentairesNonDispo],      // On specifie la valuer de la porprieter data en creant 1e list ds laquel on place 2 valeurs comme les variable [nbCommentair, etnbCommtNondispo ]
            backgroundColor: "rgba(0, 230, 255, 1)",                 // turquoise
        }],
    };



    // Creer 1 Objet de configuration (final) pr tout le graphique

    const configDispo = 
    {
        type: "bar",
        data: dataDispo,
    };



    // Rendu du graphique ds l elt canvas et a l inverse du graphiq pr les etoile, on specifie ps l axe principal horizontal( car par defaut c est l axe vertical qui sera utliser )

    new Chart(
        document.querySelector("#graphique-dispo"),
        configDispo,
    );


    // En Appellant new Chart = prmt de creer le graphique


}


// G-C(globalchart= (Pr faire comprendre a eslint que c est variable globale))
















// POUR LA FUNCTION 1: AJOUTLISTENERAVIS

//1- ON A Rajouter await avt l appel a la fct fetch, et transformer la function de leventListener en fct asynchrone avec le mot cle async
//2-  On a stocke la response de l API dans 1e const (const response), ct reponse est au format JSON
// Reconstituer les donnee en memoir grace a la methode JSON (cont avis= await reponse.json())
// 4 Apres avr recuper les avis, on les rajout au DOM
// IL fau recuperer eltParent grac a la propriet parentElement sur la cible de l evenem








// ${}= cet id est 1 parametre qui est changeable par exemple ici, id est une variable. 
// la fct fetch permt d envoyer une requete GET au serveur. localhost(est le nom du domaine ou adresse IP)

// ${}= on ecrit comm ca en js pour ne pas combiner avec une chaine de caractere










// Le SERVICE WEB: sont des API qui permet de manipuler les donnees avec 4 services:
// POST(pr Creer une information); GET( Pr lire ou recuperer informatoo); PUT(pr mise a jour , ou update ou modifier info) et DELETE(pr Supprimer information)

//Le SERVEUR WEB: c est l endroit (ou un programme informatique) qu on deploie un service web dont on peut acceder grace a un adresse

// Protocole HTTP: un protocle de communication entre le clt e tle serveur via une requete (aller) et une reponse (au retour)

// Package = une librairie, npm install= installe rle package; la fct fetch(permet d envoye run requete)= utlise par defaut l API GET.

// GET/ PIECE= association du verbe HTTP et du ressource (le chemin)decrive l operation demande pr le navigateur et qui ser TRAITER par le service web.

// Qd le navigateur execute la fct fecth, il realise une operation asynchrone(mettre en veille le code a l origine de la reque en attendant la reponse, NEANMOINS le site va continuer de fonctionner comme executer le js, mettre a jour affichage,etc)



 




// ON fait la requete avec 2 elts pr que le serveur la comprenne:
// 1 nom de la ressource comm "piece"(pr acceder au pieces automobile), et "avis"=pr acceder aux avis des utilisateurs
// 2 les API ou verbes HTTP comme GET= lire une information et POST = creer une information.



//COMPRENDRE LA PROGRAMMATION AYNCHRONE: EN DESSOUS

// Programmation Asynchrone= Permet au site web quand on fait une requete au serveur, de constinuer de travailler en attendant la reponse du serveur 
// POUR faire de la programmation Asynchrone, on utlise le mot cle "await", suivi de l instruction asynchrone (comm la function fetch= cette fct doit etre en mode asynchrone en utilisant async, 
//suivi de function (event= declaration de la function)). 


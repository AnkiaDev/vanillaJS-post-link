/* 
VanillaJS Link Post
*/


function afficherLiens(){ // Fonction d'affichage des liens de en provenance du serveur

    fetch("https://oc-jswebsrv.herokuapp.com/api/liens")
    .then(response=>{
        return response.json();
    })
    .then(listeLiens=> {
        listeLiens.map(lien => {  //Boucle de création de chaque élément.

            const bulleLien = document.createElement("div");    //Création de la box blanche.
            bulleLien.classList.add("lien");                    //
    
            const titreElt = document.createElement("a");       //Création du titre cliquable.
            titreElt.href = lien.url;                  //
            titreElt.textContent = lien.titre + " ";   //
            titreElt.style.textDecoration = "none";             //
            titreElt.style.fontWeight = "bold";                 //
            titreElt.style.color = "#428bca";                   //
            titreElt.style.display = "inline";                  //
    
            const linkElt = document.createElement("p");       //Création du lien.
            linkElt.textContent = lien.url;           //
            linkElt.style.display = "inline";
    
            const autorElt = document.createElement("p");                 //Création du la ref auteur.
            autorElt.textContent = "Ajouté par " + lien.auteur;  //
    
            bulleLien.appendChild(titreElt);    //
            bulleLien.appendChild(linkElt);     //
            bulleLien.appendChild(autorElt);    //Introduction dans la bulle.
    
            document.getElementById("contenu").appendChild(bulleLien);  //Introduction dans le DOM
    
        }) 
    })
    .catch(error=>{
        console.error(error);
    })
    
}

// Création du bouton Ajouter Lien

function initButton() {

    divFormElt.innerHTML = "";
    const buttonAdd = document.createElement("button");
    buttonAdd.setAttribute("id", "buttonAdd");
    buttonAdd.textContent = "Ajouter un lien";  
    buttonAdd.addEventListener("click", function(){   // Gestionnaire d'événement lors du clique sur le boutton "Ajouter un lien"

        divFormElt.innerHTML = ""; // Vidage de la Div
        divFormElt.appendChild(formElt); // Integration des éléments du formulaire
    });
    divFormElt.appendChild(buttonAdd);

}

// Création du formulaire lors du clique sur "Ajouter un lien".

const divFormElt = document.getElementById("formulaire");
initButton();

function createInputElt(id, placeholder, taille) {    // Fonction création des inputs
    const inputElt = document.createElement("input");
    inputElt.type = "text";
    inputElt.setAttribute("id", id);
    inputElt.setAttribute("required", "true");
    inputElt.setAttribute("placeholder", placeholder)
    inputElt.setAttribute("name", id)
    inputElt.setAttribute("size", taille)
    inputElt.style.marginRight = "15px";
    inputElt.style.padding = "10px, 0px, 15px, 0px"
    return inputElt;
}

const inputAutor = createInputElt("auteur", "Entrez votre nom", 20);  // input nom d'auteur
const inputTitle = createInputElt("titre", "Entrez le titre du lien", 40); // input nom du lien
const inputLink = createInputElt("url", "Entrez l'URL du lien", 40);  // input URL du lien

    
const buttonSubmit = document.createElement("button"); // Création du bouton submit
buttonSubmit.setAttribute("submit", "true");
buttonSubmit.textContent = "Ajouter";

const formElt = document.createElement("form"); // Création du formulaire et intégration des inputs
formElt.appendChild(inputAutor);
formElt.appendChild(inputTitle);
formElt.appendChild(inputLink);
formElt.appendChild(buttonSubmit);


// Création de la class 

const nouveauLien = class {
    constructor(titre, url, auteur) {
        this.titre = titre;
        this.url = url;
        this.auteur = auteur;
    }
}

// Fonction de check du http(s) URL 

function checkHttp(value){
    if(value.indexOf("http://") === -1 && value.indexOf("https://") === -1) {
       return ("http://" + value);
    }
    else {
        return value;
    }
}

// Création du message d'information

function afficherMessage(titre) {
    
    const msgInfo = document.createElement("div");
    msgInfo.setAttribute("id", "msgInfo");
    msgInfo.textContent = `Le lien ${titre} à bien été ajouté`;
    document.getElementById("getMsgInfo").appendChild(msgInfo);

}


// Ajout d'un événement au bouton Submit

formElt.addEventListener("submit", function(e) {

    const titre = formElt.elements.titre.value;   // Attribution des paramètres constructor de la class
    const lien = checkHttp(formElt.elements.url.value);
    const auteur = formElt.elements.auteur.value;

    const ajouterLien = new nouveauLien(titre, lien, auteur); // Ajout d'un nouveau lien à la liste grace à la class
    fetch("https://oc-jswebsrv.herokuapp.com/api/lien", { // Envoi de ajouterLien au serveur
        headers: {
            "content-type":"application/json"
        },
        method: "POST",
        body: JSON.stringify(ajouterLien)
    })
    .then(response =>{
        console.log(response);
    })
    .catch(error=> {
        console.error(error)
    });   
    
    divFormElt.innerHTML = "";  // Vidage du formulaire

    setTimeout(function(){
        document.getElementById("contenu").innerHTML = "";  // Vidage de l'ancienne liste
        afficherLiens() // Affichage de la nouvelle liste
    }, 2000) ;    
    
    
    afficherMessage(titre);     // Affichage du message d'info
    setTimeout(function() {     // Disparition du message d'info au bout de deux seconde et replacement par le bouton Ajouter lien
        document.getElementById("getMsgInfo").innerHTML = "";
        initButton(); // replacement du bouton initial
    }, 2000);

    inputAutor.value = "";     // Vidage des inputs   
    inputTitle.value = "";
    inputLink.value = "";

    e.preventDefault();

});


afficherLiens();    // Affichage des trois liens initiaux
function recupererDonnees(){

    var ressource = document.getElementById("recherche").value;
    var requete = 'PREFIX owl: <http://www.w3.org/2002/07/owl#>' +
        'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>' +
        'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
        'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>' +
        'PREFIX foaf: <http://xmlns.com/foaf/0.1/>' +
        'PREFIX dc: <http://purl.org/dc/elements/1.1/>' +
        'PREFIX : <http://dbpedia.org/resource/>' +
        'PREFIX dbpedia2: <http://dbpedia.org/property/>' +
        'PREFIX dbpedia: <http://dbpedia.org/>' +
        'PREFIX skos: <http://www.w3.org/2004/02/skos/core#>' +
        'SELECT * WHERE {' +
         ressource + ' foaf:name ?name; dbo:genre ?genre; dbo:releaseDate ?date; dbo:developer ?dev; dbp:director ?directeur; dbo:publisher ?publisher; dbo:abstract ?description.' +
        'FILTER(langMatches(lang(?description),"FR"))'+
        '}';

    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(requete) + "&format=json";
    console.log(url);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        console.log(this.status);
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            console.log(results);
            remplirDonnees(results);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}

function remplirDonnees(data){
    var developpeur = null;
    window.getElementById("jeu-nom").innerHTML = data.results.bindings[0].name.value;
    window.getElementById("jeu-genre").innerHTML = data.results.bindings[0].genre.value;
    window.getElementById("jeu-date").innerHTML = data.results.bindings[0].date.value;
    window.getElementById("jeu-developpeur").innerHTML = data.results.bindings[0].dev.value;
    window.getElementById("jeu-directeur").innerHTML = data.results.bindings[0].directeur.value;
    window.getElementById("jeu-editeur").innerHTML = data.results.bindings[0].publisher.value;
    window.getElementById("jeu-description").innerHTML = data.results.bindings[0].description.value;
    //window.getElementById("jeu-plateforme").innerHTML = data.results.bindings[0].description.;
}
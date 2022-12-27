function recupererDonnees(){
    console.log("recupererDonnees");
    var params = new URLSearchParams(window.location.search);
    var ressource = params.get("ressource");
    console.log(ressource);
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
        'SELECT ?name ?dev ?directeur ?publisher ?description (GROUP_CONCAT(DISTINCT ?dates;SEPARATOR=";") AS ?date) (GROUP_CONCAT(DISTINCT ?genres;SEPARATOR=";") AS ?genre) (GROUP_CONCAT(DISTINCT ?plateformes;SEPARATOR=";") AS ?plateforme) WHERE {' +
        '<'+ ressource +'> foaf:name ?name; dbp:genre ?genre; dbo:releaseDate ?dates; dbp:developer ?dev; dbo:publisher ?publisher; dbo:abstract ?description; dbp:platforms ?plateformes.' +
        'FILTER(langMatches(lang(?description),"FR"))'+
        'OPTIONAL{<'+ ressource +'> dbp:director ?directeur}' +
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
    document.getElementById("jeu-nom").innerHTML = data.results.bindings[0].name.value;
    getImageWiki(data.results.bindings[0].name.value, "jeu-image");
    const genres = data.results.bindings[0].genre.value.split(";");
    for(let i = 0; i < genres.length; i++){
        recupererNomParRessource(genres[i],"jeu-genre");
    }
    const dates = data.results.bindings[0].date.value.split(";");
    for (let i = 0; i < dates.length; i++) {
        document.getElementById("jeu-date").innerHTML += `<span class="badge bg-primary badge-pill">${dates[i]}</span>`;
    }
    recupererNomParRessource(data.results.bindings[0].dev.value,"jeu-developpeur");
    if(data.results.bindings[0].directeur !== undefined){
        recupererNomParRessource(data.results.bindings[0].directeur.value, "jeu-directeur");
    }
    recupererNomParRessource(data.results.bindings[0].publisher.value,"jeu-editeur");
    document.getElementById("jeu-description").innerHTML = data.results.bindings[0].description.value;
    //window.getElementById("jeu-plateforme").innerHTML = data.results.bindings[0].description.;
}

function recupererNomParRessource(ressource, id){
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
        '<'+ ressource +'> rdfs:label ?name.' +
        'FILTER(langMatches(lang(?name),"FR"))'+
        '}';

    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(requete) + "&format=json";
    console.log(url);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        console.log(this.status);
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            console.log(data.results.bindings[0].name.value);
            document.getElementById(id).innerHTML += `<span class="badge bg-primary badge-pill">${data.results.bindings[0].name.value}</span>`;
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}
function getImageWiki(search,id){
    const url = "https://en.wikipedia.org/w/api.php?origin=*&action=query&titles="+search+"&prop=images&format=json";
    let image_name;
    let image_url;
    let image_ref;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const pages = data.query.pages;
            const page = pages[Object.keys(pages)[0]];
            const images = page.images;
            image_name = images[0].title;
            image_name = image_name.replace("File:","");
            image_url = "https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=File:"+image_name+"&prop=imageinfo&iiprop=url&format=json";
            console.log(image_url);
            fetch(image_url)
                .then(response => response.json())
                .then(data => {
                    const pages = data.query.pages;
                    const page = pages[Object.keys(pages)[0]];
                    const image = page.imageinfo;
                    image_ref = image[0].url;
                    console.log(image_ref);
                    document.getElementById(id).src = image_ref;
                });
        });
}
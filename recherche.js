function rechercheParNom(){
    var nom = document.getElementById("recherche").value;
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
        'SELECT ?jeu ?name ?date ?serie ?description (GROUP_CONCAT(DISTINCT ?date; SEPARATOR=" ; ") AS ?dates) WHERE {' +
        '?jeu a dbo:VideoGame; a dbo:Software; foaf:name ?name; dbo:releaseDate ?date; dbp:series ?serie ;rdfs:comment ?description.' +
        'FILTER(regex(?name,".*'+nom+'.*") && langMatches(lang(?description),"FR"))'+
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
            afficherResultats(results);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}

function afficherResultats(data){

    var ressource,nom, date, serie, description;

    var div = document.getElementById("contenaireResultat");

    div.innerHTML = "";

    data.results.bindings.forEach(r => {
        ressource = r.jeu.value;
        nom = r.name.value;
        date = r.dates.value;
        description = r.description.value;
        serie = r.serie.value;
        lien = "/jeu.html?ressource="+ressource;

        div.innerHTML += `<div class="card col-4 mx-auto my-3" style="width: 18rem;">
            <img src="img/assassin.png" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${nom}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${serie}</h6>
                    <h6 class="card-subtitle mb-2 text-muted">${date}</h6>
                    <p class="card-text" style="color: #353b48">${description}</p>
                    <a href=${lien} class="btn btn-primary">Voir détails</a>
                </div> 
        </div>`;
    });
}
function getImage(){
    const search = document.getElementById("recherche").value;
    const url = "https://en.wikipedia.org/w/api.php?origin=*&action=query&titles="+search+"&prop=pageimages&format=json";
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
                .then(data2 => {
                    const pages2 = data2.query.pages;
                    const page2 = pages2[Object.keys(pages2)[0]];
                    const imageinfo = page2.imageinfo;
                    image_ref = imageinfo[0].url;
                    console.log(image_ref);
                    document.getElementById("searchimage").src = image_ref;
                })
                .catch(error => console.log(error));

        })
        .catch(error => console.log(error));
}

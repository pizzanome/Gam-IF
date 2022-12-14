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
        'SELECT ?jeu ?name ?serie ?description (GROUP_CONCAT(DISTINCT ?date; SEPARATOR=" ; ") AS ?dates) WHERE {' +
        '?jeu a dbo:VideoGame; a dbo:Software; foaf:name ?name; dbo:releaseDate ?date; dbp:series ?serie ;rdfs:comment ?description.' +
        'FILTER(regex(?name,".*'+nom+'.*") && langMatches(lang(?description),"FR"))'+
        '}';

    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(requete) + "&format=json";
    console.log(url);

    executeSparqlRequest(requete)
        .then(data => afficherResultats(data));
}

function afficherResultats(data) {
    const div = document.getElementById("contenaireResultat");
    div.innerHTML = "";

    data.results.bindings.forEach(r => {
        const ressource = r.jeu.value;
        const nom = r.name.value;
        const date = r.dates.value;
        let description = r.description.value;
        const serie = r.serie.value;
        const lien = `jeu.html?ressource=${ressource}`;

        //si la description est trop longue, on la coupe
        if(description.length > 250){
            description = description.substring(0,250)+"...";
        }

        div.innerHTML += `<div class="card col-4 mx-auto my-3" style="width: 21rem;">
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

function autoComplete(value) {
    document.getElementById("autocomplete").innerHTML = "";

    if (!value) {
        // Champ de texte vide
        return;
    }

    const request = `
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX foaf: <http://xmlns.com/foaf/0.1/>
            PREFIX dc: <http://purl.org/dc/elements/1.1/>
            PREFIX : <http://dbpedia.org/resource/>
            PREFIX dbpedia2: <http://dbpedia.org/property/>
            PREFIX dbpedia: <http://dbpedia.org/>
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            SELECT ?game ?name ?description WHERE {
                ?game a dbo:VideoGame; a dbo:Software; rdfs:comment ?description; foaf:name ?name.FILTER(regex(?name,"^${value}") && langMatches(lang(?description),"FR"))
            } LIMIT 5
    `;

    executeSparqlRequest(request)
        .then(data => {
            data.results.bindings.forEach(result => {
                const div = document.createElement("div");

                //div.innerHTML = `<a href="/jeu.html?ressource=${result.game.value}">${result.name.value}</a>`;
                div.innerHTML += `<a href="/jeu.html?ressource=${result.game.value}" class="list-group-item list-group-item-action">${result.name.value}</a>`;
                document.getElementById("autocomplete").appendChild(div);
            });
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

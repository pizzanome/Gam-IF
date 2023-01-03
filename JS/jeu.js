function getData() {
    const params = new URLSearchParams(window.location.search);
    const ressource = params.get("ressource");

    const request = `
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX : <http://dbpedia.org/resource/>PREFIX dbpedia2: <http://dbpedia.org/property/>
        PREFIX dbpedia: <http://dbpedia.org/>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT ?name ?dev ?directeur ?publisher ?description (GROUP_CONCAT(DISTINCT ?dates;SEPARATOR=";") AS ?date) (GROUP_CONCAT(DISTINCT ?genres;SEPARATOR=";") AS ?genre) (GROUP_CONCAT(DISTINCT ?plateformes;SEPARATOR=";") AS ?plateforme) ?serie (GROUP_CONCAT(DISTINCT ?jeu;SEPARATOR=";") AS ?jeux)
        WHERE {
        VALUES ?ressource {<${ressource}>}
        ?ressource rdfs:label ?name; dbp:genre ?genres; dbo:releaseDate ?dates; dbp:developer ?dev; dbo:publisher ?publisher; dbo:abstract ?description; dbp:platforms ?plateformes.
        FILTER(langMatches(lang(?description),"FR") && langMatches(lang(?name),"FR"))
        OPTIONAL{?ressource dbp:director ?directeur}
        OPTIONAL{?ressource dbo:series ?serie. ?serie dbp:game ?jeu. FILTER(?jeu != ?ressource)}
        }`;

    executeSparqlRequest(request)
        .then(data => printData(data));
}

function printData(data) {
    document.getElementById("jeu-nom").innerHTML = data.results.bindings[0].name.value;

    getImageGBApi(data.results.bindings[0].name.value,"jeu")
        .done(function (response) {
            let imageUrl = response.results[0].image.original_url;
            document.getElementById("jeu-image").src = imageUrl;
        });

    const genres = data.results.bindings[0].genre.value.split(";");
    for (let i = 0; i < genres.length; i++) {
        printResourceName(genres[i], "jeu-genre");
    }

    const dates = data.results.bindings[0].date.value.split(";");
    for (let i = 0; i < dates.length; i++) {
        document.getElementById("jeu-date").innerHTML += `<span class="badge bg-primary badge-pill">${dates[i]}</span>`;
    }

    printDeveloperLink(data.results.bindings[0].dev.value, "jeu-developpeur");

    if (data.results.bindings[0].directeur !== undefined) {
        printResourceName(data.results.bindings[0].directeur.value, "jeu-directeur");
    }

    printResourceName(data.results.bindings[0].publisher.value, "jeu-editeur");

    document.getElementById("jeu-description").innerHTML = data.results.bindings[0].description.value;

    if(data.results.bindings[0].serie !== undefined) {
        document.getElementById("jeu-serie").innerHTML = "Jeux de la série " + data.results.bindings[0].serie.value + " : <br><ul>";
        const jeux = data.results.bindings[0].jeux.value.split(";");
        for (let i = 0; i < jeux.length; i++) {
            document.getElementById("jeu-serie").innerHTML += `<li>`;
            printListGame(jeux[i], "jeu-serie");
            document.getElementById("jeu-serie").innerHTML += `</li>`;
        }
        document.getElementById("jeu-serie").innerHTML += "</ul>";
    }

    const plateformes = data.results.bindings[0].plateforme.value.split(";");
    for (let i = 0; i < plateformes.length; i++) {
        printPlateformeLink(plateformes[i], "jeu-plateforme");
    }
}

function printListGame(ressource, id){
    const request = `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX : <http://dbpedia.org/resource/>
    PREFIX dbpedia2: <http://dbpedia.org/property/>
    PREFIX dbpedia: <http://dbpedia.org/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT ?name
    WHERE {
    <${ressource}> rdfs:label ?name.
    FILTER(langMatches(lang(?name),"FR"))
    }`;

    executeSparqlRequest(request)
        .then(data => {
            var jeu = data.results.bindings[0].name.value;
            document.getElementById(id).innerHTML += `<a href="plateforme.html?ressource=${ressource}">${jeu}</a><br>`;
        });
}

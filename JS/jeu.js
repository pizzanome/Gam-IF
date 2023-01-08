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
        SELECT ?name ?dev ?directeur ?publisher ?description (GROUP_CONCAT(DISTINCT ?dates;SEPARATOR=";") AS ?date) (GROUP_CONCAT(DISTINCT ?genres;SEPARATOR=";") AS ?genre) (GROUP_CONCAT(DISTINCT ?plateformes;SEPARATOR=";") AS ?plateforme)
        WHERE {
        <${ressource}> rdfs:label ?name; dbp:genre ?genres; dbo:releaseDate ?dates; dbp:developer ?dev; dbo:publisher ?publisher; dbo:abstract ?description; dbp:platforms ?plateformes.
        FILTER(langMatches(lang(?description),"FR") && langMatches(lang(?name),"FR"))
        OPTIONAL{<${ressource}> dbp:director ?directeur}
        }`;

    executeSparqlRequest(request)
        .then(data => printData(data))
        .catch(() => {
            document.getElementById("game").innerHTML = "<h1>Erreur : Aucune donnée trouvée pour ce jeu</h1>";
        });
}

function printData(data) {
    document.getElementById("jeu-nom").innerHTML = data[0].name.value;

    getImageGBApi(data[0].name.value,"jeu")
        .done(function (response) {
            let imageUrl = response.results[0].image.original_url;
            document.getElementById("jeu-image").src = imageUrl;
        });

    const genres = data[0].genre.value.split(";");
    for (const genre of genres) {
        printResourceName(genre, "jeu-genre");
    }

    const dates = data[0].date.value.split(";");
    for (const date of dates) {
        document.getElementById("jeu-date").innerHTML += `<span class="badge bg-primary badge-pill">${date}</span>`;
    }

    printDeveloperLink(data[0].dev.value, "jeu-developpeur");

    if (data[0].directeur !== undefined) {
        printResourceName(data[0].directeur.value, "jeu-directeur");
    }

    printResourceName(data[0].publisher.value, "jeu-editeur");

    document.getElementById("jeu-description").innerHTML = data[0].description.value;

    const plateformes = data[0].plateforme.value.split(";");
    for (const plateforme of plateformes) {
        printPlateformeLink(plateforme, "jeu-plateforme");
    }
}

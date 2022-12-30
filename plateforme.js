function getData(){

    var ressource = document.getElementById("recherche").value;
    var request = 'PREFIX owl: <http://www.w3.org/2002/07/owl#>' +
        'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>' +
        'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
        'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>' +
        'PREFIX foaf: <http://xmlns.com/foaf/0.1/>' +
        'PREFIX dc: <http://purl.org/dc/elements/1.1/>' +
        'PREFIX : <http://dbpedia.org/resource/>' +
        'PREFIX dbpedia2: <http://dbpedia.org/property/>' +
        'PREFIX dbpedia: <http://dbpedia.org/>' +
        'PREFIX skos: <http://www.w3.org/2004/02/skos/core#>' +
        'SELECT ?name (GROUP_CONCAT(DISTINCT ?developer; SEPARATOR=";") AS ?developers) (GROUP_CONCAT(DISTINCT ?fabricant; SEPARATOR=";") AS ?fabricants) ?systeme ?predecesseur ?successeur ?description WHERE {'+
        'VALUES ?ressource {<'+ ressource +'>}' +
        '?ressource rdfs:label ?name; dbo:abstract ?description; dbp:developer ?developer; dbp:manufacturer ?fabricant.'+
        'OPTIONAL{ ?ressource dbp:os ?systeme.}'+
        'OPTIONAL{ ?ressource dbp:predecessor ?predecesseur.}'+
        'OPTIONAL{ ?ressource dbp:successor ?successeur.}'+
        'FILTER(langMatches(lang(?description),"FR") && langMatches(lang(?name),"FR"))}';

    executeSparqlRequest(request)
        .then(data => printData(data));
}

function printData(data) {
    document.getElementById("plateforme-nom").innerHTML = data.results.bindings[0].name.value;

    getImageFromWikipedia(data.results.bindings[0].name.value)
        .then(imageUrl => document.getElementById("plateforme-image").src = imageUrl);

    const developers = data.results.bindings[0].developers.value.split(";");
    for (let i = 0; i < developers.length; i++) {
        printResourceName(developers[i], "plateforme-developpeur");
    }

    const manufactureurs = data.results.bindings[0].fabricants.value.split(";");
    for (let i = 0; i < manufactureurs.length; i++) {
        printResourceName(manufactureurs[i], "plateforme-manufactureur");
    }

    if (data.results.bindings[0].systeme !== undefined) {
        printResourceName(data.results.bindings[0].systeme.value, "plateforme-os");
    }

    if (data.results.bindings[0].predecesseur !== undefined) {
        printResourceName(data.results.bindings[0].predecesseur.value, "plateforme-predecesseur");
    }

    if (data.results.bindings[0].successeur !== undefined) {
        printResourceName(data.results.bindings[0].successeur.value, "plateforme-successeur");
    }

    document.getElementById("plateforme-description").innerHTML = data.results.bindings[0].description.value;
}

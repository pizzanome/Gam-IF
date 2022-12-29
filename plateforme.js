function recupererDonneesPlateforme(){

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
        'SELECT ?name (GROUP_CONCAT(DISTINCT ?developer; SEPARATOR=";") AS ?developers) (GROUP_CONCAT(DISTINCT ?fabricant; SEPARATOR=";") AS ?fabricants) ?systeme (GROUP_CONCAT(DISTINCT ?dateSortie; SEPARATOR=";") AS ?dates) ?predecesseur ?successeur ?description WHERE {'+
        'VALUES ?ressource {<'+ ressource +'>}' +
        '?ressource rdfs:label ?name; dbo:abstract ?description; dbp:developer ?developer; dbp:manufacturer ?fabricant.'+
        'OPTIONAL{ ?ressource dbp:date ?dateSortie.}'+
        'OPTIONAL{ ?ressource dbp:os ?systeme.}'+
        'OPTIONAL{ ?ressource dbp:predecessor ?predecesseur.}'+
        'OPTIONAL{ ?ressource dbp:successor ?successeur.}'+
        'FILTER(langMatches(lang(?description),"FR") && langMatches(lang(?name),"FR"))}';

    executeSparqlRequest(request)
        .then(data => printDataPlateforme(data));
}

function printDataPlateforme(data){

}
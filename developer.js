function recupererDonneesDeveloper(){

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
        'SELECT ?name (GROUP_CONCAT(DISTINCT ?fondateurs; SEPARATOR=";") AS ?fondateurs) ?date (GROUP_CONCAT(DISTINCT ?localisation; SEPARATOR=";") AS ?localisations) ?effectif ?anneeEffectif ?revenue ?anneeRevenue ?description WHERE {' +
        'VALUES ?ressource {<'+ressource+'>}' +
        '?ressource rdfs:label ?name; dbo:abstract ?description.'+
        '{?ressource dbp:foundedBy ?fondateurs} UNION {?ressource dbp:founders ?fondateurs} UNION {?ressource dbp:founder ?fondateurs}' +
        '{?ressource dbo:locationCity ?localisation} UNION {?ressource dbp:locationCity ?localisation} UNION {?ressource dbo:location ?localisation}' +
        'OPTIONAL{ ?ressource dbo:foundingYear ?date.}' +
        'OPTIONAL{?ressource dbo:revenue ?revenue; dbo:revenueYear ?anneeRevenue. FILTER(regex(datatype(?revenue),"http://dbpedia.org/datatype/usDollar"))}' +
        'OPTIONAL{{?ressource dbp:numEmployees ?effectif} UNION {?ressource dbo:numEmployees ?effectif} OPTIONAL{?ressource dbp:numEmployeesYear ?anneeEffectif.}}' +
        'FILTER(langMatches(lang(?description),"FR") && langMatches(lang(?name),"FR"))}';

    executeSparqlRequest(request)
        .then(data => printDataDeveloper(data));
}

function printDataDeveloper(data){

}
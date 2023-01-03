function getData(){
    const params = new URLSearchParams(window.location.search);
    const ressource = params.get("ressource");

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
        .then(data => printData(data));
}

function printData(data) {
    document.getElementById("developer-nom").innerHTML = data.results.bindings[0].name.value;

    getImageGBApi(data.results.bindings[0].name.value,"developer")
        .done(function (response) {
            let imageUrl = response.results[0].image.original_url;
            document.getElementById("developer-image").src = imageUrl;
        });

    const fondateurs = data.results.bindings[0].fondateurs.value.split(";");
    for (let i = 0; i < fondateurs.length; i++) {
        printResourceName(fondateurs[i], "developer-fondateurs");
    }

    if(data.results.bindings[0].date !== undefined){
        printResourceName(data.results.bindings[0].date.value, "developer-date");
    }

    const localisations = data.results.bindings[0].localisations.value.split(";");
    for (let i = 0; i < localisations.length; i++) {
        printResourceName(localisations[i], "developer-siege");
    }

    if (data.results.bindings[0].effectif !== undefined) {
        printResourceName(data.results.bindings[0].effectif.value, "developer-effectif");
        if(data.results.bindings[0].anneeEffectif !== undefined){
            printResourceName(data.results.bindings[0].anneeEffectif.value, "developer-anneeEffectif");
        }
    }

    if (data.results.bindings[0].revenu !== undefined) {
        printResourceName(data.results.bindings[0].revenu.value, "developer-revenu");
        if(data.results.bindings[0].anneeRevenu !== undefined){
            printResourceName(data.results.bindings[0].anneeRevenu.value, "developer-anneeRevenu");
        }
    }

    document.getElementById("developer-description").innerHTML = data.results.bindings[0].description.value;
}
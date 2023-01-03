let dateFilter = {};
let platformFilter = {};
let developerFilter = {};

function filterByDate(buttonId, filter) {
    const button = document.getElementById(buttonId);
    if (button.classList.contains("active")) {
        // Si le filtre a déjà été cliqué, on le retire
        button.classList.remove("active");
        delete dateFilter[buttonId];
    } else {
        // Sinon on l'ajoute
        button.classList.add("active");
        dateFilter[buttonId] = "(" + filter + ")";
    }
}

function filterByPlatform(buttonId, platform) {
    const button = document.getElementById(buttonId);
    if (button.classList.contains("active")) {
        // Si le filtre a déjà été cliqué, on le retire
        button.classList.remove("active");
        delete platformFilter[buttonId];
    } else {
        // Sinon on l'ajoute
        button.classList.add("active");
        platformFilter[buttonId] = "(" + platform + ")";
    }
}

function filterByDeveloper(buttonId, developer) {
    const button = document.getElementById(buttonId);
    if (button.classList.contains("active")) {
        // Si le filtre a déjà été cliqué, on le retire
        button.classList.remove("active");
        delete developerFilter[buttonId];
    } else {
        // Sinon on l'ajoute
        button.classList.add("active");
        developerFilter[buttonId] = "(" + developer + ")";
    }
}

function search() {
    document.getElementById("autocomplete").style.display = "none";

    const name = document.getElementById("recherche").value;

    let filters = "";

    if (Object.keys(dateFilter).length > 0) {
        filters += " && (" + Object.values(dateFilter).join(" || ") + ")";
    }

    if (Object.keys(platformFilter).length > 0) {
        filters += " && (" + Object.values(platformFilter).map(platform => `regex(?platform,"${platform}")`).join(" || ") + ")";
    }

    if (Object.keys(developerFilter).length > 0) {
        filters += " && (" + Object.values(developerFilter).map(developer => `regex(?developer,"${developer}")`).join(" || ") + ")";
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
        SELECT ?game ?name ?description ?serie (GROUP_CONCAT(DISTINCT ?date; SEPARATOR=" ; ") AS ?date)
        WHERE {
        ?game a dbo:VideoGame; a dbo:Software; rdfs:label ?name; dbo:releaseDate ?date; dbp:series ?serie; rdfs:comment ?description; dbp:platforms ?platform; dbo:developer ?developer.
        FILTER(regex(?name,"${name}") && langMatches(lang(?description),"FR") && langMatches(lang(?name),"FR")${filters})
        } LIMIT 50`;

    executeSparqlRequest(request)
        .then(data => printResults(data));
}

function printResults(data) {
    const resultDiv = document.getElementById("contenaireResultat");
    resultDiv.innerHTML = "";

    if (data.results.length === 0) {
        resultDiv.innerHTML = "Aucun résultat";

        return;
    }

    console.log(data.results.bindings);

    data.results.bindings.forEach(r => {
        let ressource = r.game.value;
        ressource = encodeURIComponent(ressource);
        const name = r.name.value;
        const releaseDate = r.date.value;
        let description = r.description.value;
        const serie = r.serie.value;

        // Si la description est trop longue, on la coupe
        if (description.length > 250) {
            description = description.substring(0, 250) + "...";
        }

        getImageGBApi(name,"jeu")
            .done(function (data) {
                let imageUrl = data.results[0].image.original_url;
                console.log(imageUrl);
                resultDiv.innerHTML += `<div class="card col-4 mx-auto my-3" style="width: 21rem;">
                <img src=${imageUrl} class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${serie}</h6>
                        <h6 class="card-subtitle mb-2 text-muted">${releaseDate}</h6>
                        <p class="card-text descriptionCard" style="color: #353b48">${description}</p>
                        <a href=jeu.html?ressource=${ressource} class="btn btn-primary">Voir détails</a>
                    </div>
                </div>`;
        });
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
            SELECT ?game ?name ?description
            WHERE {
            ?game a dbo:VideoGame; a dbo:Software; rdfs:comment ?description; rdfs:label ?name.
            FILTER(regex(?name,"^${value}") && langMatches(lang(?description),"FR") && langMatches(lang(?name),"FR"))
            } LIMIT 5
    `;

    executeSparqlRequest(request)
        .then(data => {
            data.results.bindings.forEach(result => {
                const div = document.createElement("div");

                let resource = result.game.value;
                resource = encodeURIComponent(resource);
                const name = result.name.value;

                div.innerHTML += `<a href="jeu.html?ressource=${resource}" class="list-group-item list-group-item-action">${name}</a>`;
                document.getElementById("autocomplete").appendChild(div);
            });
        });
}

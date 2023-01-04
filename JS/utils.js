function executeSparqlRequest(request) {
    console.log(request);

    return new Promise((resolve) => {
        const url = `//dbpedia.org/sparql?query=${encodeURIComponent(request)}&format=json`;

        const xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                const data = JSON.parse(this.responseText).results.bindings;
                if (data.length === 0) {
                    reject();
                }

                resolve(data);
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);
    });
}

function getImageFromWikipedia(game) {
    const gameNorm = encodeURIComponent(game);
    const url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=${gameNorm}&prop=images&format=json`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const pages = data.query.pages;
            const page = pages[Object.keys(pages)[0]];

            let imageName = page.images[0].title.replace("File:", "");
            imageName = encodeURIComponent(imageName);
            const imageUrl = `https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=File:${imageName}&prop=imageinfo&iiprop=url&format=json`;

            return fetch(imageUrl)
                .then(response => response.json())
                .then(data => {
                    const pages = data.query.pages;
                    const page = pages[Object.keys(pages)[0]];
                    const image = page.imageinfo;

                    return (image !== undefined && image.length > 0) ? image[0].url : "";
                });
        });
}

function getImageGBApi(nom, type) {
    const key = "361817f45f87302548f18c9121d15e9d227db4af";
    let ressource = "";
    switch (type) {
        case "plateforme":
            ressource = "object";
            break;
        case "jeu":
            ressource = "game";
            break;
        case "developpeur":
            ressource = "company";
            break;
    }

    const url = "https://www.giantbomb.com/api/search/?api_key=" + key + "&format=jsonp&query=" + nom + "&resources=" + ressource;

    return $.ajax({
        url: url,
        type: "GET",
        dataType: "jsonp",
        jsonp: "json_callback"
    });
}

function printResourceName(ressource, id) {
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
        SELECT *
        WHERE {
        <${ressource}> rdfs:label ?name.
        FILTER(langMatches(lang(?name),"FR"))
        }`;

    executeSparqlRequest(request)
        .then(data => {
            document.getElementById(id).innerHTML += `<span class="badge bg-primary badge-pill">${data[0].name.value}</span>`;
        })
        .catch(() => {
            if (ressource.includes("http://dbpedia.org/resource/")) {
                document.getElementById(id).innerHTML += `<span class="badge bg-primary badge-pill">${ressource.split("http://dbpedia.org/resource/")[1]}</span>`;
            } else {
                document.getElementById(id).innerHTML += `<span class="badge bg-primary badge-pill">${ressource}</span>`;
            }
        });
}

function printPlateformeLink(ressource, id) {
    if (ressource.includes("http://dbpedia.org/resource/")) {
        document.getElementById(id).innerHTML += `<a href="plateforme.html?ressource=${ressource}" class="badge bg-primary badge-pill">${ressource.split("http://dbpedia.org/resource/")[1]}</a>`;
    } else {
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
        SELECT ?plateforme
        WHERE {
        ?plateforme a dbo:VideoGame; a dbo:Device; rdfs:label ?name.
        FILTER(regex(?name,"${ressource}"))
        }`;

        executeSparqlRequest(request)
            .then(data => {
                const plateforme = data[0].plateforme.value;
                document.getElementById(id).innerHTML += `<a href="plateforme.html?ressource=${plateforme}" class="badge bg-primary badge-pill">${ressource}</a><br>`;
            });
    }
}

function printDeveloperLink(ressource, id) {
    if (ressource.includes("http://dbpedia.org/resource/")) {
        document.getElementById(id).innerHTML += `<a href="developer.html?ressource=${ressource}" class="badge bg-primary badge-pill">${ressource.split("http://dbpedia.org/resource/")[1]}</a>`;
    } else {
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
        SELECT ?developer
        WHERE {
        ?developer a dbo:Company; rdfs:label ?name.
        FILTER(regex(?name,"${ressource}"))
        }`;

        executeSparqlRequest(request)
            .then(data => {
                const developer = data[0].developer.value;
                document.getElementById(id).innerHTML += `<a href="developer.html?ressource=${developer}" class="badge bg-primary badge-pill">${ressource}</a>`;
            });
    }
}

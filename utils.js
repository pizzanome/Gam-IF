function executeSparqlRequest(request) {
    console.log(request);

    return new Promise((resolve) => {
        const url = `http://dbpedia.org/sparql?query=${encodeURIComponent(request)}&format=json`;

        const xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                resolve(JSON.parse(this.responseText));
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
            //const imageName = page.title.replace("File:", "");
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

function getImageGBApi(nom) {
    const key = "361817f45f87302548f18c9121d15e9d227db4af";
    const url = "https://www.giantbomb.com/api/search/?api_key=" + key + "&format=jsonp&query=" + nom + "&resources=game";
    let image_url;
    //ajax call of url
    return $.ajax({
        url: url,
        type: "GET",
        dataType: "jsonp",
        jsonp: "json_callback"
    });
}

function getImageFromWikidata(game) {
    const gameNorm = encodeURIComponent(game);
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&sites=enwiki&props=claims&titles=${gameNorm}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const entities = data.entities;
            const entity = entities[Object.keys(entities)[0]];
            const claims = entity.claims;
            const claim = claims.P18[0];
            const image = claim.mainsnak.datavalue.value;

            const imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${image}`;
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

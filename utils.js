function executeSparqlRequest(request) {
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

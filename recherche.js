function rechercheParNom(){
    var nom = document.getElementById("recherche").value;
    var requete = 'PREFIX owl: <http://www.w3.org/2002/07/owl#>\n' +
        'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n' +
        'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n' +
        'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n' +
        'PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n' +
        'PREFIX dc: <http://purl.org/dc/elements/1.1/>\n' +
        'PREFIX : <http://dbpedia.org/resource/>\n' +
        'PREFIX dbpedia2: <http://dbpedia.org/property/>\n' +
        'PREFIX dbpedia: <http://dbpedia.org/>\n' +
        'PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n' +
        'PREFIX dbo: <https://dbpedia.org/ontology/>\n' +
        '\n' +
        'SELECT * WHERE {\n' +
        '?Jv a dbo:VideoGames; a dbo:Software; foaf:name ?name.' +
        'FILTER(regex(?name,".*'+nom+'.*"))'+
        '}';

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var results = JSON.parse(this.responseText);
            console.log(results)
            afficherResultats(results);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function afficherResultats(data){
    // Tableau pour mémoriser l'ordre des variables ; sans doute pas nécessaire
    // pour vos applications, c'est juste pour la démo sous forme de tableau
    var index = [];

    var contenuTableau = "<tr>";

    data.head.vars.forEach((v, i) => {
        contenuTableau += "<th>" + v + "</th>";
        index.push(v);
    });

    data.results.bindings.forEach(r => {
        contenuTableau += "<tr>";

        index.forEach(v => {

            if (r[v])
            {
                if (r[v].type === "uri")
                {
                    contenuTableau += "<td><a href='" + r[v].value + "' target='_blank'>" + r[v].value + "</a></td>";
                }
                else {
                    contenuTableau += "<td>" + r[v].value + "</td>";
                }
            }
            else
            {
                contenuTableau += "<td></td>";
            }

        });


        contenuTableau += "</tr>";
    });


    contenuTableau += "</tr>";

    document.getElementById("resultats").innerHTML = contenuTableau;

}
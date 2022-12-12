function getImage(){
    const search = document.getElementById("searchbar").value;
    const url = "https://en.wikipedia.org/w/api.php?origin=*&action=query&titles="+search+"&prop=pageimages&format=json";
    let image_name;
    let image_url;
    let image_ref;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const pages = data.query.pages;
            const page = pages[Object.keys(pages)[0]];
            const images = page.images;
            image_name = images[0].title;
            image_name = image_name.replace("File:","");
            image_url = "https://en.wikipedia.org/w/api.php?origin=*&action=query&titles=File:"+image_name+"&prop=imageinfo&iiprop=url&format=json";
            console.log(image_url);
            fetch(image_url)
                .then(response => response.json())
                .then(data2 => {
                    const pages2 = data2.query.pages;
                    const page2 = pages2[Object.keys(pages2)[0]];
                    const imageinfo = page2.imageinfo;
                    image_ref = imageinfo[0].url;
                    console.log(image_ref);
                    document.getElementById("searchimage").src = image_ref;
                })
                .catch(error => console.log(error));

        })
        .catch(error => console.log(error));
}

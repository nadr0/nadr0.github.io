function clearProject(){
    var iframe = document.getElementById('iframe');
    var code = document.getElementById('code');
    var controls = document.getElementById('controls');
    var links = document.getElementById('links');
    var description = document.getElementById('description');

    iframe.src = "";
    code.href = "";
    description.innerHTML = "";

    while(controls.childNodes.length){
        controls.removeChild(controls.firstChild);
    }

    while(links.childNodes.length){
        links.removeChild(links.firstChild);
    }

}

function populateProject(projectName, contentClassName){
    // clearProject();

    var projectData = siteData[projectName];
    var controls = document.getElementById('controls');
    var links = document.getElementById('links');
    var description = document.getElementById('description');

    var contentRow = document.querySelector('.row.content.' + contentClassName[1]);
    console.log(contentRow);


    // // updateIframe(projectData.src);
    // updateGithub(projectData.code);
    //
    // // Set description
    // description.innerHTML = projectData.description;
    //
    // // Populate links
    // for(link in projectData.links){
    //     var linkElement = document.createElement('a');
    //     linkElement.classList.add('overlay-rows');
    //     linkElement.innerHTML = link;
    //     linkElement.href = projectData.links[link];
    //     links.appendChild(linkElement);
    // }
    //
    // // Populate controls
    // for(control in projectData.controls){
    //     var controlElement = document.createElement('div');
    //     controlElement.classList.add('overlay-rows');
    //     controlElement.innerHTML = control + " : " + projectData.controls[control];
    //     controls.appendChild(controlElement);
    // }

}

function displayCheck(elem,data,onDisplay,type){

    if(data === ""){
        elem.style.display = 'none';
    }else{
        elem.style.display = type;
        onDisplay();
    }
}

function updateIframe(data){
    var iframe = document.getElementById('iframe');

    displayCheck(iframe, data,
        function(){
            iframe.src = data
        }, 'block');
}

function updateGithub(data){
    var code = document.getElementById('code');

    displayCheck(code, data,
        function(){
            code.href = data
        }, 'block');
}

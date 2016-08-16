function clearProject(childDivs){
    // var iframe = document.getElementById('iframe');
    // var code = document.getElementById('code');

    var description = childDivs[0];
    var links = childDivs[1];
    var controls = childDivs[2];

    // iframe.src = "";
    // code.href = "";
    description.innerHTML = "";

    while(controls.childNodes.length){
        controls.removeChild(controls.firstChild);
    }

    while(links.childNodes.length){
        links.removeChild(links.firstChild);
    }

}

function populateProject(projectName, contentClassName){
    clearSelection();

    var projectData = siteData[projectName];

    var contentRow = document.querySelector('.row.content.' + contentClassName[1]);
    showElem(contentRow);

    var childDivs = contentRow.getElementsByClassName('text');

    var links = childDivs[1];
    var controls = childDivs[2];

    clearProject(childDivs);

    // Set description
    childDivs[0].innerHTML = projectData.description;


    // // updateIframe(projectData.src);
    // updateGithub(projectData.code);

    // // Populate links
    for(link in projectData.links){
        var linkElement = document.createElement('a');
        linkElement.classList.add('overlay-rows');
        linkElement.innerHTML = link;
        linkElement.href = projectData.links[link];
        links.appendChild(linkElement);
    }

    // Populate controls
    for(control in projectData.controls){
        var controlElement = document.createElement('div');
        controlElement.classList.add('overlay-rows');
        controlElement.innerHTML = control + " : " + projectData.controls[control];
        controls.appendChild(controlElement);
    }

}

function showElem(elem){
    elem.classList.add('show');
}

function unshowElem(elem){
    elem.classList.remove('show');
}

function clearSelection(){
    var elems = document.getElementsByClassName('show');
    for (var i = 0; i < elems.length; i++) {
        var childDivs = elems[i].getElementsByClassName('text');
        clearProject(childDivs);
        elems[i].classList.remove('show');

    }
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

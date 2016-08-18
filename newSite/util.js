function clearProject(childDivs){
    // var iframe = document.getElementById('iframe');

    var description = childDivs[0];
    var links = childDivs[1];
    var controls = childDivs[2];

    // iframe.src = "";
    description.innerHTML = "";

    while(controls.childNodes.length){
        controls.removeChild(controls.firstChild);
    }

    while(links.childNodes.length){
        links.removeChild(links.firstChild);
    }

}

function populateProject(projectName, contentClassName){
    var projectData = siteData[projectName];

    var sameElement = document.querySelector('.row.content.' + contentClassName[1]+".show");
    if(sameElement){
        if(projectData.title === sameElement.querySelector('.project-title').innerHTML){
            clearSelection();
            return;
        }
    }

    clearSelection();

    var contentRow = document.querySelector('.row.content.' + contentClassName[1]);
    showElem(contentRow);

    var childDivs = contentRow.getElementsByClassName('text');
    var projectTitle = contentRow.querySelector('.project-title');

    var links = childDivs[1];
    var controls = childDivs[2];

    clearProject(childDivs);

    // Set description
    childDivs[0].innerHTML = projectData.description;


    // Set title
    projectTitle.innerHTML = projectData.title;

    updateGithub(projectData.code, contentRow);

    updatePlayButton(projectData.src, contentRow);

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
        var code = elems[i].querySelector('.project-github');
        code.href = '';
        code.style.display = 'none';
        var projectTitle = elems[i].querySelector('.project-title');
        projectTitle.innerHTML = '';

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

function updateGithub(data, contentRow){
    var code = contentRow.querySelector('.project-github');

    displayCheck(code, data,
        function(){
            code.href = data
        }, 'inline-block');
}

function updatePlayButton(data, contentRow){
    var container = contentRow.querySelector('.project-demo');

    // Removes all event listeners
    var containerClone = container.cloneNode(true);
    container.parentNode.replaceChild(containerClone, container);
    containerClone.style.display = 'inline-block';

    displayCheck(containerClone, data,
        function(){
            containerClone.addEventListener('click',function(){
                console.log(data);
            })
        }, 'inline-block');
}

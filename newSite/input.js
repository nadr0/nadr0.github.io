function mouseoverexamples(event){
  var leftlist = document.getElementById('leftlist');
  var li = document.getElementsByTagName('li');
  for (var i = 0; i < li.length; i++) {
    li[i].addEventListener("mouseover", function( event ) {   
      event.target.style.listStyleType = 'square';
      document.body.style.cursor = 'pointer';
    }, false);
    li[i].addEventListener("mouseout", function( event ) {
      event.target.style.listStyleType = 'none';
      document.body.style.cursor = 'default';
    },false);
  };

  // leftlist.addEventListener("mouseover", function( event ) {
  //   leftlist.style.overflowY = "scroll";
  // }, false);

};


/*
  Pass in something from data.js
*/
function loadData(data){

  /* Retrieve the project text */
  var projectText = document.getElementById("projectText");

  /* Github repo button */
  var githubRepo = document.getElementById("githublinkButton");
  /* Github img for link*/
  var githubRepoImg = document.getElementById("githublinkImg");

  /* Get the project title*/
  var projectTitle = document.getElementById("projectName");
  
  /* Get canvas button */
  var canvasButton = document.getElementById("canvasButton");

  /* Set the onlick event*/
  if(data.src){
    /* Show that there is a canvas element to display*/
    canvasButton.onclick = function(){display_iframe(data.src)};
    canvasButton.innerHTML = "CANVAS";
  }else{
    /* No canvas or program to display */
    canvasButton.onclick = function(){/*Nothing*/};
    canvasButton.innerHTML = "";
  }

  /* Setting the project title*/
  projectTitle.innerHTML = data.title;

  /* Set project text */
  projectText.innerHTML = data.info;

  /* If there is a link to the github repo*/
  if(data.code != ""){
    /* Set Github repo*/
    githubRepo.href = data.code;
    /* Turn the repo link back on */
    githubRepoImg.src = "images/GitHub-Mark-32px.png";
  }else{
    /* Turn off the github image for they don't get a link to a repo*/
    githubRepoImg.src = "";
  }

  /* Display everything */
  displayButtons();
  displayProjectText();
  displayProjectTitle();
}

/* 
  Clear the current project info
*/
function clearData(){
  hideProjectText();
  hideButtons();
  hide_iframe();
  hideProjectTitle();
}

/*
  Display project title
*/
function displayProjectTitle(){
  var projectTitle = document.getElementById("projectName");
  projectTitle.style.display = "inline";
}

/* Hide project title*/
function hideProjectTitle(){
  var projectTitle = document.getElementById("projectName");
  projectTitle.style.display = "none";
}

/* 
  Display project text
*/
function displayProjectText(){
  var projectText = document.getElementById("projectText");
  projectText.style.display = "inline-block";
} 

/*
  Hide project text
*/
function hideProjectText(){
  var projectText = document.getElementById("projectText");
  projectText.style.display = "none";
}

/* 
  Display buttons
*/

function displayButtons(){

  /* Display the buttons*/
  canvasButton.style.display = "inline-block";
  githubButton.style.display = "inline-block";
  clearButton.style.display = "inline-block";

}


/* 
  Hide buttons
*/

function hideButtons(){

  /* Hide the buttons*/
  canvasButton.style.display = "none";
  githubButton.style.display = "none";
  clearButton.style.display = "none";
  returnButton.style.display = "none";
}

/*
  Displays and populates the iframe element
*/
function display_iframe(src){
  var iframe = document.getElementById("project_iframe");
  var frameContainer = document.getElementById("frameContainer");
  frameContainer.style.display = "inline";
  displayReturnButton();
  iframe.style.display = "inline";
  iframe.src = src;
  iframe.focus();
}

/*
  Clears and hides the iframe element
*/
function hide_iframe(){  
  var iframe = document.getElementById("project_iframe");
  var frameContainer = document.getElementById("frameContainer");
  frameContainer.style.display = "none";
  iframe.style.display = "none";
  iframe.src = "";
  hideReturnButton();
}


/* 
  Display controls
*/
function displayControls(){
  var projectControls = document.getElementById("project_controls");
  projectControls.style.display = "inline";
}

/* 
  Hide controls
*/
function hideControls(){
  var projectControls = document.getElementById("project_controls");
  projectControls.style.display = "none";
}

/*  
  Display return button
*/
function displayReturnButton(){
  returnButton.style.display = "inline";
}

/*
  Hide return button
*/
function hideReturnButton(){
  returnButton.style.display = "none";
}
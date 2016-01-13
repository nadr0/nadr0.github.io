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

  var githubRepoImg = document.getElementById("githublinkImg");

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

  displayButtons();
  displayProjectText();
}

/* 
  Clear the current project info
*/
function clearData(){
  hideProjectText();
  hideButtons();
  hide_iframe();
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

}

/*
  Displays and populates the iframe element
*/
function display_iframe(data){
  var iframe = document.getElementById("project_iframe");
  iframe.style.display = "inline";
  iframe.src = data.src;
}

/*
  Clears and hides the iframe element
*/
function hide_iframe(){  
  var iframe = document.getElementById("project_iframe");
  iframe.style.display = "none";
  iframe.src = "";
}
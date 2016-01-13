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


  /* Set project text */
  projectText.innerHTML = data.info;

  /* Set Github repo*/
  githubRepo.href = data.code;
  console.log(githubRepo);
  console.log(githubRepo.href);

}


/* 
  Display buttons
*/

function displayButtons(){

  /* canvas button */
  var canvasButton = document.getElementById("canvasButton");

  /* github button*/
  var githubButton = document.getElementById("codeButton");

  /* clear button */
  var clearButton = document.getElementById("clearcodeButton");

  /* Display the buttons*/
  canvasButton.style.display = "inline-block";
  githubButton.style.display = "inline-block";
  clearButton.style.display = "inline-block";

}


/* 
  Hide buttons
*/

function hideButtons(){
    /* canvas button */
  var canvasButton = document.getElementById("canvasButton");

  /* github button*/
  var githubButton = document.getElementById("codeButton");

  /* clear button */
  var clearButton = document.getElementById("clearcodeButton");

  /* Hide the buttons*/
  canvasButton.style.display = "none";
  githubButton.style.display = "none";
  clearButton.style.display = "none";

}
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
  var githubRepo = document.getElementById("githublink");


}

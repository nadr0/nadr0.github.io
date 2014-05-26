
function mouseoverexamples(event){
  var li = document.getElementsByTagName('li');
  for (var i = 0; i < li.length; i++) {
    li[i].addEventListener("mouseover", function( event ) {   
      event.target.style.fontSize = 110 + "%";
      event.target.style.textDecoration = "underline";
      event.target.style.listStyleType = 'square';
      document.body.style.cursor = 'pointer';
    }, false);
    li[i].addEventListener("mouseout", function( event ) {
      event.target.style.fontSize = 100 + "%";
      event.target.style.textDecoration = "none";
      event.target.style.listStyleType = 'none';
      document.body.style.cursor = 'default';
    },false);
  };
}

function LoadiFrame(link,source){
  var frame = document.getElementById("frame");
  var sourcecode = document.getElementById("sourcecodelink");
  var clearbutton = document.getElementById("clear");
  var sourcebutton = document.getElementById("sourcecode");

  clearbutton.style.visibility = "visible";
  sourcebutton.style.visibility = "visible";

  frame.src = link;
  frame.focus();

  sourcecode.href = source;

  if(source === null){
    sourcecode.removeAttribute("href");
  }
}

function cleariframe(element){
  var frame = document.getElementById("frame");
  var sourcebutton = document.getElementById("sourcecode");

  frame.removeAttribute("src");
  element.style.visibility = "hidden";
  sourcebutton.style.visibility = "hidden";
}
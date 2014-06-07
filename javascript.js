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
// Is the windows application still broken?
function LoadiFrame(link,source,info,controls){
  
  var frame = document.getElementById("frame");
  var sourcecode = document.getElementById("sourcecodelink");
  var clearbutton = document.getElementById("clear");
  var sourcebutton = document.getElementById("sourcecode");
  var exampleinfo = document.getElementById("exampleinfo");
  var examplecontrols = document.getElementById("examplecontrols");

  if(exampleinfo.innerHTML === undefined){
    exampleinfo.innerHTML = "";
  }else{
    exampleinfo.innerHTML = info;
  }

  if(examplecontrols.innerHTML === undefined){
    examplecontrols.innerHTML = "";
  }else{
    examplecontrols.innerHTML = controls;
  }

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
  var exampleinfo = document.getElementById("exampleinfo");
  var examplecontrols = document.getElementById("examplecontrols");

  exampleinfo.innerHTML = "";
  examplecontrols.innerHTML = "";

  frame.removeAttribute("src");
  element.style.visibility = "hidden";
  sourcebutton.style.visibility = "hidden";
}
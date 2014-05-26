var bleuetrougeinfo = "Bleu et Rouge is a game I made for Clay.io's Got Game? Competition // 2014. It was one month of development and two weeks of judging. I placed 4th and won a Nexus 7."
var snowinfo = 'Snow is one part of a weather collection I am creating.  My goal is to create different weather types in using javascript to give that "feeling" when its snowing out.';

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

function LoadiFrame(link,source,info){
  var frame = document.getElementById("frame");
  var sourcecode = document.getElementById("sourcecodelink");
  var clearbutton = document.getElementById("clear");
  var sourcebutton = document.getElementById("sourcecode");
  var exampleinfo = document.getElementById("exampleinfo");

  if(exampleinfo.innerHTML === undefined){
    exampleinfo.innerHTML = "";
  }else{
    exampleinfo.innerHTML = info;
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

  exampleinfo.innerHTML = "";
  frame.removeAttribute("src");
  element.style.visibility = "hidden";
  sourcebutton.style.visibility = "hidden";
}
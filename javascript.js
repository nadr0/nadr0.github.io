function mouseoverexamples(event){
  var leftlist = document.getElementById('leftlist');
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

  leftlist.addEventListener("mouseover", function( event ) {
    leftlist.style.overflow = "scroll";
  }, false);

};


// Is the windows application still broken?
function LoadiFrame(link,source,info,controls,link1,link2,link3,link1IH,link2IH,link3IH){
  
  var frame = document.getElementById("frame");
  var sourcecode = document.getElementById("sourcecodelink");
  var clearbutton = document.getElementById("clear");
  var sourcebutton = document.getElementById("sourcecode");
  var exampleinfo = document.getElementById("exampleinfo");
  var examplecontrols = document.getElementById("examplecontrols");
  var Link1 = document.getElementById("link1");
  var Link2 = document.getElementById("link2");
  var Link3 = document.getElementById("link3");


  var hidebutton = document.getElementById("hide");

  Link1.innerHTML = "";
  Link2.innerHTML = "";
  Link3.innerHTML = "";

  if(link1 != ""){
    Link1.innerHTML = link1IH;
    Link1.href = link1;
  }
  if(link2 != ""){
    Link2.innerHTML = link2IH;
    Link2.href = link2;
  }
  if(link3 != ""){
    Link3.innerHTML = link3IH;
    Link3.href = link3;
  }

  if(exampleinfo.innerHTML === undefined){
    exampleinfo.innerHTML = "";
  }else{
    exampleinfo.innerHTML = info;
  };

  if(examplecontrols.innerHTML === undefined){
    examplecontrols.innerHTML = "";
  }else{
    examplecontrols.innerHTML = controls;
  };

  if(!source){
    sourcebutton.style.display = "none";
    sourcecode.style.cursor = "default";
    sourcecode.removeAttribute("href");
    }
  else{
    sourcebutton.style.display = "block";
    sourcebutton.style.visibility = "visible";
    sourcecode.href = source;
  };

  clearbutton.style.visibility = "visible";
  hidebutton.style.visibility = "visible";

  frame.src = link;
  frame.focus();


  if(source === null){
    sourcecode.removeAttribute("href");
  };
};

function cleariframe(element){
  var frame = document.getElementById("frame");
  var sourcebutton = document.getElementById("sourcecode");
  var hidebutton = document.getElementById("hide");
  var exampleinfo = document.getElementById("exampleinfo");
  var examplecontrols = document.getElementById("examplecontrols");
  var link1 = document.getElementById("link1");
  var link2 = document.getElementById("link2");
  var link3 = document.getElementById("link3");

  exampleinfo.innerHTML = "";
  examplecontrols.innerHTML = "";
  link1.innerHTML = "";
  link2.innerHTML = "";
  link3.innerHTML = "";

  frame.removeAttribute("src");
  element.style.visibility = "hidden";
  sourcebutton.style.visibility = "hidden";
  hidebutton.style.visibility = "hidden";

};

function resetsidebar(){
  var leftlist = document.getElementById("leftlist");
  var iframe = document.getElementById("iframe");
  var returnbutton = document.getElementById("return");
  var returnleftlist = document.getElementById("returnleftlist");

  returnleftlist.style.width = "0%";
  returnleftlist.style.height = "0%";

  returnbutton.style.visibility = "hidden";

  iframe.style.marginLeft = "25%";
  leftlist.style.marginLeft = "0%";

};

function hidesidebar(){
  var leftlist = document.getElementById("leftlist");
  var iframe = document.getElementById("iframe");
  var returnbutton = document.getElementById("return");
  var returnleftlist = document.getElementById("returnleftlist");

  returnleftlist.style.width ="10%";
  returnleftlist.style.height = "100%";

  returnbutton.style.visibility = "visible";

  iframe.style.marginLeft = "10%";
  leftlist.style.marginLeft = "-25%";
};
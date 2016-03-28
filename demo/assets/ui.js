// Intialize layout
var container = document.getElementById("container");
var content = document.getElementById("content");
var clientWidth = 0;
var clientHeight = 0;
var contentWidth = 0;
var contentHeight = 0;

// Initialize Scroller
this.scroller = new Scroller(render, {
  zooming: true,
  minZoom : 1/4,
  maxZoom : 4,
});

var rect = container.getBoundingClientRect();
scroller.setPosition(rect.left + container.clientLeft, rect.top + container.clientTop);
// scroller.setPosition(0,0);


// Reflow handling
var reflow = function() {
  clientWidth = container.clientWidth;
  clientHeight = container.clientHeight;
  scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);
};

// // Reflow handling
// var reflow = function() {
//   console.log("reflow")
//   console.log(clientHeight + " , " +window.innerHeight);
//   console.log(contentWidth + ",  " + window.innerWidth);

//   var imgElem = document.getElementById("img");

//   var zoomFactor = 1/16;
//   console.log($("#img").attr("src"))
//   if ($("#img").attr("src")) {
//     console.log($("#img").width())
//     console.log("DOING STUFF")
//     var imgWidth = $("#img").width();
//     var imgHeight = $("#img").height();
//     // // Calculate maximum zoom level based on window size that preserves aspect ratio
//     // zoomFactor = Math.min((window.innerHeight - 50) / imgHeight, (window.innerWidth - $("#controlPanel").width() - 30) / imgWidth);
//     // container.style.width = (imgWidth*zoomFactor)+"px";
//     // container.style.height = (imgHeight*zoomFactor)+"px";

//     // // Outer box holds the container and imgScrollbox
//     // $("#outerBox").height(imgHeight*zoomFactor + 10);
//     // $("#outerBox").width(imgWidth*zoomFactor + 10);
//   }

//   // Zoom level limited by window size
//   scroller.options.minZoom = zoomFactor;
//   scroller.zoomTo(zoomFactor,0,0,true);

//   clientWidth = container.clientWidth;
//   clientHeight = container.clientHeight;

//   scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);

//   var rect = container.getBoundingClientRect();
//   scroller.setPosition(rect.left + container.clientLeft, rect.top + container.clientTop);

//   // Resize overlaying canvas
//   // $("#rectDisplay").css({"width": (parseInt(container.style.width)-20), "height": (parseInt(container.style.height) - 20)});
//   // $("#rectDisplay").css({"width": container.style.width, "height": container.style.height});
//   // $("#rectDisplay").attr({"width": container.style.width, "height": container.style.height});
//   // $("#rectGuideDisplay").attr({"width": container.style.width, "height": container.style.height});

//   // $("#outerBox").height(parseInt(container.style.height)+20);
//   // $("#outerBox").width(parseInt(container.style.width)+20);

//   // updateRectCanvas();
// };

window.addEventListener("resize", reflow, false);
reflow();

if ('ontouchstart' in window) {

  container.addEventListener("touchstart", function(e) {
    // Don't react if initial down happens on a form element
    if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
      return;
    }

    scroller.doTouchStart(e.touches, e.timeStamp);
    e.preventDefault();
  }, false);

  document.addEventListener("touchmove", function(e) {
    scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
  }, false);

  document.addEventListener("touchend", function(e) {
    scroller.doTouchEnd(e.timeStamp);
  }, false);

  document.addEventListener("touchcancel", function(e) {
    scroller.doTouchEnd(e.timeStamp);
  }, false);

} else {

  var mousedown = false;

  container.addEventListener("mousedown", function(e) {
    if (e.target.tagName.match(/input|textarea|select/i)) {
      return;
    }

    scroller.doTouchStart([{
      pageX: e.pageX,
      pageY: e.pageY
    }], e.timeStamp);

    mousedown = true;
  }, false);

  document.addEventListener("mousemove", function(e) {
    if (!mousedown) {
      return;
    }

    scroller.doTouchMove([{
      pageX: e.pageX,
      pageY: e.pageY
    }], e.timeStamp);

    mousedown = true;
  }, false);

  document.addEventListener("mouseup", function(e) {
    if (!mousedown) {
      return;
    }

    scroller.doTouchEnd(e.timeStamp);

    mousedown = false;
  }, false);

  container.addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" :  "mousewheel", function(e) {
    scroller.doMouseZoom(e.detail ? (e.detail * -120) : e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
  }, false);

}

/*
// Test for background activity (slow down scrolling)
setInterval(function() {
  var arr = [];
  for (var i=0, l=Math.random()*600; i<l; i++) {
    arr.push.call(arr, document.querySelectorAll(".abc" + i));
  }
}, 50);
*/

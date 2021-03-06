// create the root namespace and making sure we're not overwriting it
var ANNOTATOR = ANNOTATOR || {};
// create a general purpose namespace method
// this will allow us to create namespace a bit easier
ANNOTATOR.createNS = function (namespace) {
  var nsparts = namespace.split('.');
  var parent = ANNOTATOR;
  // we want to be able to include or exclude the root namespace
  // So we strip it if it's in the namespace
  if (nsparts[0] === 'ANNOTATOR') {
    nsparts = nsparts.slice(1);
  }
  // loop through the parts and create
  // a nested namespace if necessary
  for (var i = 0; i < nsparts.length; i++) {
    var partname = nsparts[i];
    // check if the current parent already has
    // the namespace declared, if not create it
    if (typeof parent[partname] === 'undefined') {
      parent[partname] = {};
    }
    // get a reference to the deepest element
    // in the hierarchy so far
    parent = parent[partname];
  }
  // the parent is now completely constructed
  // with empty namespaces and can be used.
  return parent;
};
// Create the namespace
ANNOTATOR.createNS('ANNOTATOR.CONTROLLER');

/************************/
/** Anotator Functions **/
/************************/
ANNOTATOR.createAnnotatorWithImage = function(imgSelector) {
  console.log(isImgLoaded);
  // When the image finished loading, setup the annotator
  $(imgSelector).on('load', function(){
    $(imgSelector).off('load');
    CONTROLLER = ANNOTATOR.CONTROLLER();
    CONTROLLER.init(imgSelector);
  });

  // Rough check if image is already loaded  !!! This might not work
  var isImgLoaded = true;
  if (!$(imgSelector)[0].complete) {
    isImgLoaded = false;
  }
  if (typeof $(imgSelector)[0].naturalWidth !== 'undefined' && $(imgSelector)[0].naturalWidth === 0) {
    isImgLoaded = false;
  }
  // If the image is already loaded, manually trigger the event
  if (isImgLoaded) {
    $(imgSelector).trigger('load');
  }
};

ANNOTATOR.CONTROLLER = function() {
  'use strict';
  var scroller;
  var container, content;
  var mousedown =  false;

  function _render() {
    console.log('<Rendering Annotator>');
    console.log('</Rendering Annotator>');
  }

  function _prepDOM() {
    console.log('<Prepping DOM for Annotator>');
    $('body').append(
      $('<div/>', {id: 'annot_container'}).append(
        $('<div/>', {id: 'annot_content'}).append(
          $('<img/>', {id: 'annot_img'})
        )
      )
    );
    console.log('</Prepping DOM for Annotator>');
  }

  function _bindMouseEvents() {
    console.log('binding');
    $('#annot_container').on("mousedown", function(e) {
      e.preventDefault();
      if (e.target.tagName.match(/input|textarea|select/i)) {
        return;
      }

      CONTROLLER.scroller.doTouchStart([{
        pageX: e.pageX,
        pageY: e.pageY
      }], e.timeStamp);

      CONTROLLER.mousedown = true;
    });

    $(document).on("mousemove", function(e) {
      if (!CONTROLLER.mousedown) {
        return;
      }

      CONTROLLER.scroller.doTouchMove([{
        pageX: e.pageX,
        pageY: e.pageY
      }], e.timeStamp);

      CONTROLLER.mousedown = true;
    });

    $(document).on("mouseup", function(e) {
      if (!CONTROLLER.mousedown) {
        return;
      }

      CONTROLLER.scroller.doTouchEnd(e.timeStamp);

      CONTROLLER.mousedown = false;
    });

    $('#annot_container')[0].addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "wheel" :  "mousewheel", function(e) {
      // CONTROLLER.scroller.doMouseZoom(e.detail ? (e.detail * -120) : e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
      var verScroll = e.wheelDeltaY ? -e.wheelDeltaY : e.deltaY;
      if (verScroll) {
        CONTROLLER.scroller.doMouseZoom(verScroll, e.timeStamp, e.pageX, e.pageY);
      }
    });
  }

  function init(imgSelector) {

    console.log('<Init CONTROLLER>');
    // create the DOM elements needed for the annotator
    _prepDOM();
    // change the image source
    $('#annot_img').attr('src', $(imgSelector).attr('src'));

    // Intialize layout
    // Keep these as globals to support render.js (taken from zyna scroller)
    CONTROLLER.container = $('#annot_container');
    CONTROLLER.content = $('#annot_content');
    var contentWidth = $('#annot_img').width();
    var contentHeight = $('#annot_img').height();

    // Initialize Scroller
    CONTROLLER.scroller = new Scroller(render, {
      zooming: true,
      minZoom : 1/4,
      maxZoom : 4,
    });
    var rect = $('#annot_container')[0].getBoundingClientRect();
    CONTROLLER.scroller.setPosition(rect.left + CONTROLLER.container[0].clientLeft, rect.top + CONTROLLER.container[0].clientTop);

    // Reflow handling
    var reflow = function() {
      console.log('<Reflow>');
      CONTROLLER.scroller.setDimensions($('#annot_container').width(), $('#annot_container').height(),
          $('#annot_img').width(), $('#annot_img').height());
      console.log('</Reflow>');
    };
    reflow();

    // _render();

    $(window).on('resize', reflow);
    _bindMouseEvents();
    console.log('</Init CONTROLLER>');
  }

  // public API
  return {
    init: init,
    scroller: scroller,
    content: content
  };
};

console.log('loaded annotator');


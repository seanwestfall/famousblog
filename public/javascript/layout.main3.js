/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Sean Westfall
 * @license MIT
 * @copyright Sean Westfall, 2015
 */

 * Load Famo.us components */
var Engine = famous.core.Engine;
var Surface = famous.core.Surface;
var HeaderFooterLayout = famous.views.HeaderFooterLayout;
var Scrollview = famous.views.Scrollview;
var StateModifier = famous.modifiers.StateModifier;
var Modifier = famous.core.Modifier;
var View = famous.core.View;
var RenderNode = famous.core.RenderNode;
var Transform = famous.core.Transform;
var RenderController = famous.views.RenderController;
var Easing          = famous.transitions.Easing;

/* Load html content */
var contentHtml = $('.content').html();
var headerHtml = $('.header').html();
var naviHtml = $('.navi').html();
var footerHtml = $('.footer').html();
var socialButtons = $('.social').html();

/* DOM context */
var mainContext = Engine.createContext();

/*
 * This page is essentiailly split into two layers
 * A content layer on the bottom which contains the
 * fixed content. And a hidden layer on top that shows
 * after scrolling past the header.
 * mainContext
 *   BASE LAYER
 *     CONTENT LAYER -- scrollpane and navilayer
 *     HIDDEN LATER -- dynamic navi and social buttons
 *
 * The content is switched via an event handler 
 */

/* BASE LAYER */
// The base layout contains the content section (with
// dynamic header, navi, and social buttons
// and the fixed header
var baselayout = new HeaderFooterLayout({
  direction: 1 // vertical layout
});

/* CONTENT LAYER */
/* or the lower layer */
/*---------------------*/
var contentlayout = new HeaderFooterLayout({
  direction: 0 // horizontal layout
});

/* HIDDEN LAYER */
/* the upper layer */
/*---------------------*/
var hiddenlayout = new HeaderFooterLayout({
  direction: 0 // horizontal layout
});

/******************************************************
Content layer
*******************************************************
The content layer contains a scrollview pane
and a header footer layout that contains the header and the footer
*******************************************************/
/* ScrollPane */
var scrollview = new Scrollview();

var surfaces = [];
scrollview.sequenceFrom(surfaces);

/* contentSurface contains the main view's content */
var contentSurface = new Surface({
    size: [780,undefined],
    content: contentHtml,
    properties: {
        backgroundColor: '#fff',
        opacity: 0,
        color: '#000',
        textAlign: "top",
    }
});
contentSurface.pipe(scrollview);

// set the contentHeight plus the size of the header
var contentHeight = $('.content').outerHeight( true ) + 120;

contentSurface.node = new RenderNode();
contentSurface.mod = new Modifier();

// vertical height modifier
contentSurface.mod.sizeFrom(function(){
    targetHeight = contentHeight;
    if (true){
        return [undefined,targetHeight];
    } else {
        return [undefined,true];
    }
});

// transition effect modifier
contentSurface.modOpacity = new StateModifier();
contentSurface.modOpacity.setOpacity(0);
contentSurface.modOpacity.setOpacity(1, {duration : 800});

/* fixed header */
var baseView = new View();

var baseHeader = new Surface({
    size: [undefined, 80],
    content: headerHtml,
    properties: {
        backgroundColor: 'rgba(0,0,0,0)',
        color: 'white',
        textAlign: "right"
    }
});

baseHeader.ctrl = new RenderController({
  inTransition: {curve: Easing.inOutQuart, duration: 600},
  outTransition: {curve: Easing.inOutQuart, duration: 600},
  overlap: true,
});

baseHeader.ctrl.inOpacityFrom(function(progress) { return progress; });
baseHeader.ctrl.outOpacityFrom(function(progress) { return progress; });

var headerview = new View();
var wideheader =  new Surface({
  transform : Transform.behind,
  size: [undefined, 100],
  properties: {
    backgroundColor: 'black'
  }
});
headerview.add(wideheader);

baseView.add(headerview);

baseView.add(new Modifier({
      transform : Transform.inFront,
      size: [930, undefined],
      origin: [.5, 0],
      align: [.5, 0]
}));

var x = document.referrer;

if(!x) {
  baseView.add(new Modifier({
        transform : Transform.inFront,
        size: [930, undefined],
        origin: [.5, 0],
        align: [.5, 0]
  })).add(baseHeader.ctrl);
} else {
  baseView.add(new Modifier({
        transform : Transform.inFront,
        size: [930, undefined],
        origin: [.5, 0],
        align: [.5, 0]
  })).add(baseHeader);
}




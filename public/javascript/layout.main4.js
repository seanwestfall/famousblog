/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Sean Westfall
 * @license MIT
 * @copyright Sean Westfall, 2015
 */

/* Load Famo.us components */
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
 *     CONTENT LAYER
 *     HIDDEN LATER
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

// Within the Scrollpane is the baseView,
// Which contains the main header (scrollable)
// and the NaviLayout, which is the scrollable content
// pane.
var baseView = new View();

// navilayor contains the header/footer/content pane
// for the navi bar and social buttons
var navilayout = new HeaderFooterLayout({
  direction: 0
});

// variable x determines whether to to
// enact the animations or not upon first opening 
var x = document.referrer;

/*************************************************************/

/* header (scrollable) */
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

/* navi */
var naviView = new View();
var naviSurface = new Surface({
    transform : Transform.inFront,
    size: [140, undefined],
    content: naviHtml,
    properties: {
        backgroundColor: 'white',
        color: 'black',
        lineHeight: "40px",
        textAlign: "right"
    }
});

naviSurface.ctrl = new RenderController({
    inTransition: {curve: Easing.inOutQuart, duration: 600},
    outTransition: {curve: Easing.inOutQuart, duration: 600},
    overlap: true
});

naviSurface.ctrl.inTransformFrom(function(progress) {
    return Transform.translate(0, window.innerHeight * (1.0 - progress), 0);
});

naviSurface.ctrl.outTransformFrom(function(progress) {
    return Transform.translate(0, window.innerHeight * progress - window.innerHeight, 0);
});

naviSurface.node = new RenderNode();
naviSurface.mod = new Modifier({
  align: [0, 0],
  origin: [0, 0],
  opacity:1
});

naviSurface.node.add(naviSurface.mod).add(naviSurface);

naviSurface.pipe(scrollview);
naviView.add(naviSurface.ctrl);

if(!x) {
  navilayout.header.add(new Modifier({
    transform : Transform.inFront,
    align: [0, 0],
    origin: [0, 0]
  })).add(naviSurface.ctrl);
} else {
  navilayout.header.add(new Modifier({
    transform : Transform.inFront,
    align: [0, 0],
    origin: [0, 0]
   })).add(naviSurface);
}

/* social buttons */
var smView = new View();

var smModifier = new Modifier({
    transform : Transform.inFront,
    align: [0, 0],
    origin: [0, 0]
});

var smSurface = new Surface({
    size: [230, undefined],
    content: socialButtons,
    properties: {
        backgroundColor: 'rgba(255,255,255,0)',
        color: 'black',
        lineHeight: "0px",
        textAlign: "center"
    }
});
smSurface.ctrl = new RenderController({
  inTransition: {curve: Easing.inOutQuart, duration: 600},
  outTransition: {curve: Easing.inOutQuart, duration: 600}
});

smSurface.ctrl.inOpacityFrom(function(progress) { return progress; });
smSurface.ctrl.outOpacityFrom(function(progress) { return progress; });

/* contentSurface */
// contains the dynamic content
var contentSurface = new Surface({
    size: [930,undefined],
    content: contentHtml,
    properties: {
        backgroundColor: '#fff',
        opacity: 0,
        color: '#000',
        textAlign: "top",
    }
});
contentSurface.pipe(scrollview);

if(x) {
	contentSurface.addClass("contentSurface");
	$('.innerContent').addClass("contentSurface");
}

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

// add the contentSurface to navilayout
navilayout.content.add(contentSurface.modOpacity).add(contentSurface);

if(!x) {
  navilayout.footer.add(smModifier).add(smSurface.ctrl);
} else {
  smSurface.addClass('smSurface');
  navilayout.footer.add(smModifier).add(smSurface);
}


// add navilayout to the BaseView
baseView.add(new Modifier({
      transform : Transform.behind,
      size: [930, undefined],
      origin: [.5, 0],
      align: [.5, 0]
})).add(navilayout);

/* End of the NaviLayout Section */
/*************************************************************/

/* this is the main section where the scrollview is set */
contentSurface.node.add(contentSurface.mod).add(baseView);
surfaces.push(contentSurface.node);

/* view to be added to the contentlayout then baselayout */
var view = new View();
var sModifier = new StateModifier({
  size: [undefined,undefined],
  origin: [.5,0],
  align: [.5,0]
});
view.add(sModifier).add(scrollview);

// and the main view is added to the contentlayout
contentlayout.content.add(view);

baselayout.content.add(contentlayout);

/****************************************************************/
/* Footer */
// footer is added the the baselayout
baselayout.footer.add(new Modifier({
      transform : Transform.inFront,
      size: [930, 50],
      origin: [.5, 0],
      align: [.5, 0]
})).add(new Surface({
    transform : Transform.inFront,
    size: [undefined, 50],
    content: footerHtml,
    properties: {
        backgroundColor: 'white',
        color: '#000',
        lineHeight: "50px",
        textAlign: "right"
    }
}));

/*****************************************************************/
/* Stick header */
// This is the header that moves with the scrollview and disappears
var stickyheader = new Surface({
    size: [undefined, 0],
    content: "<div><a class='login' onclick='openModal()'>login</a></div>",
    properties: {
       backgroundColor: 'black',
       color: 'white',
        textAlign: "right"
    }
});

stickyheader.node = new RenderNode();
stickyheader.mod = new Modifier({size:[0,0]});
stickyheader.node.add(stickyheader.mod).add(stickyheader);
baselayout.header.add(stickyheader);

/*****************************************************************/

/*****************************************************************/
/* HiddenLayout */
// This is the header that moves with the scrollview and disappears
var stickyheader = new Surface({
    size: [undefined, 0],
    content: "<div><a class='login' onclick='openModal()'>login</a></div>",
    properties: {
       backgroundColor: 'black',
       color: 'white',
        textAlign: "right"
    }
});

stickyheader.node = new RenderNode();
stickyheader.mod = new Modifier({size:[0,0]});
stickyheader.node.add(stickyheader.mod).add(stickyheader);
baselayout.header.add(stickyheader);
/*****************************************************************/

/* Events */
scrollview.sync.on('update',function(e){
  if(scrollview.getAbsolutePosition()>80) {
    stickyheader.setSize([undefined,20]);
  } else {
    stickyheader.setSize([undefined,0]);
  }
});

/* baselayout is finally added to the main context */
mainContext.add(baselayout);
naviSurface.ctrl.show(naviSurface);
baseHeader.ctrl.show(baseHeader);
smSurface.ctrl.show(smSurface);
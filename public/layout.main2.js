/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Sean Westfall
 * @license MIT
 * @copyright Sean Westfall, 2015
 */

/* main DOM */
var mainContext = Engine.createContext();

/* ---
 * The layout structure consists of
 * A BASE LAYOUT that contains
 * a contentlayout with a hidden layout over it
 * 
 * --- */

/* BASE LAYER */
var baselayout = new HeaderFooterLayout({
  direction: 1
});
var contentlayout = new HeaderFooterLayout({
  direction: 0
});

/* ScrollPane */
var scrollview = new Scrollview();

var surfaces = [];
scrollview.sequenceFrom(surfaces);

var contentSurface = new Surface({
    content: contentHtml,
    properties: {
        backgroundColor: '#fff',
        opacity: 0,
        color: '#000',
        textAlign: "top",
    }
});
contentSurface.pipe(scrollview);

contentSurface.node = new RenderNode();
contentSurface.mod = new Modifier();

// vertical height modifier
contentSurface.mod.sizeFrom(function(){
    //target = $('.content').height();
    //targetHeight = $('.content').height() + $('.footer').height() + 55; // the 55px account for the top margin and padding.
    if (true){
        return [undefined,9000];
    } else {
        return [undefined,true];
    }
});

// transition effect modifier
contentSurface.modOpacity = new StateModifier();
contentSurface.modOpacity.setOpacity(0);
contentSurface.modOpacity.setOpacity(1, {duration : 800});

var baseHeader = new Surface({
    size: [undefined, 80],
    content: headerHtml,
    properties: {
        backgroundColor: 'black',
        color: 'white',
        textAlign: "right"
    }
});
/* BASE LAYER */
var baselayout = new HeaderFooterLayout({
  direction: 1
});

/* --- */

/* CONTENT LAYER */
var contentlayout = new HeaderFooterLayout({
  direction: 0
});

/* ScrollPane and Main Content Section */
var scrollview = new Scrollview();

var surfaces = [];
scrollview.sequenceFrom(surfaces);

var contentSurface = new Surface({
    content: contentHtml,
    properties: {
        backgroundColor: '#fff',
        opacity: 0,
        color: '#000',
        textAlign: "top",
    }
});
contentSurface.pipe(scrollview);

contentSurface.node = new RenderNode();
contentSurface.mod = new Modifier();

// vertical height modifier
contentSurface.mod.sizeFrom(function(){
    //target = $('.content').height();
    //targetHeight = $('.content').height() + $('.footer').height() + 55; // the 55px account for the top margin and padding.
    if (true){
        return [undefined,9000];
    } else {
        return [undefined,true];
    }
});

// transition effect modifier
contentSurface.modOpacity = new StateModifier();
contentSurface.modOpacity.setOpacity(0);
contentSurface.modOpacity.setOpacity(1, {duration : 800});

// baseView contains the section header wrapped by a screen wide
// wrapper header
var baseView = new View();

var baseHeader = new Surface({
    size: [undefined, 80],
    content: headerHtml,
    properties: {
        backgroundColor: 'black',
        color: 'white',
        textAlign: "right"
    }
});

// headerview contains the blank header wrapper
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
})).add(baseHeader);

/* navi */
var navilayout = new HeaderFooterLayout({
  direction: 0
});
var naviView = new View();

var naviSurface = new Surface({
    size: [140, undefined],
    content: naviHtml,
    properties: {
        backgroundColor: 'white',
        color: 'black',
        lineHeight: "40px",
        textAlign: "right"
    }
});


naviSurface.node = new RenderNode();
naviSurface.mod = new Modifier({
  align: [0, 0],
  origin: [0, 0],
  opacity:1
});

naviSurface.node.add(naviSurface.mod).add(naviSurface);

naviSurface.pipe(scrollview);
naviView.add(naviSurface);
navilayout.header.add(naviSurface);
navilayout.content.add(contentSurface);

/* social buttons */
var smView = new View();

var smModifier = new Modifier({
    align: [0, 0],
    origin: [0, 0]
});

smView.add(smModifier).add(new Surface({
    size: [230, undefined],
    content: socialButtons,
    properties: {
        backgroundColor: 'rgba(255,255,255,0)',
        color: 'black',
        lineHeight: "0px",
        textAlign: "center"
    }
}));
navilayout.footer.add(smView);

baseView.add(new Modifier({
      transform : Transform.behind,
      size: [930, undefined],
      origin: [.5, 0],
      align: [.5, 0]
})).add(navilayout);

/* contentSurface sets the scrollview here */
contentSurface.node.add(contentSurface.modOpacity).add(contentSurface.mod).add(baseView);
surfaces.push(contentSurface.node);

/* main view */
var view = new View();
var sModifier = new StateModifier({
  size: [undefined,undefined],
  origin: [.5,0],
  align: [.5,0]
});
view.add(sModifier).add(scrollview);



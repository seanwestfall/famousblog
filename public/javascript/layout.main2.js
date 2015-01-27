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
 * mainContext {
 * BASE LAYER
 *   CONTENT LAYER -- scrollpane and navilayer
 *   HIDDEN LATER -- dynamic navi and social buttons
 * }
 */

/* BASE LAYER */
// The base layout contains the content section (with
// dynamic header, navi, and social buttons
// and the fixed header
var baselayout = new HeaderFooterLayout({
  direction: 1
});

/* CONTENT LAYER */
/* or the lower layer */
/*---------------------*/
var contentlayout = new HeaderFooterLayout({
  direction: 0
});

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

console.log($('.content').outerHeight( true ) + 120);
var contentHeight = $('.content').outerHeight( true ) + 120;

contentSurface.node = new RenderNode();
contentSurface.mod = new Modifier();

// vertical height modifier
contentSurface.mod.sizeFrom(function(){
    //target = $('.content').height();
    //targetHeight = $('.content').height() + $('.footer').height() + 55; // the 55px account for the top margin and padding.
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

// navilayor contains the header/footer/content pane
var navilayout = new HeaderFooterLayout({
  direction: 0
});

/* navi */
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
  navilayout.header.add(naviSurface.ctrl);
  $('.innerContent').css("margin-left","140px");
} else {
  navilayout.header.add(naviSurface);
}
navilayout.content.add(contentSurface.modOpacity).add(contentSurface);

/* social buttons */
var smView = new View();

var smModifier = new Modifier({
    transform : Transform.inFront,
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
  outTransition: {curve: Easing.inOutQuart, duration: 600},
  overlap: true,
});

smSurface.ctrl.inOpacityFrom(function(progress) { return progress; });
smSurface.ctrl.outOpacityFrom(function(progress) { return progress; });

//smView.add(smModifier).add(smSurface.ctrl);
//navilayout.footer.add(smView);
if(!x) {
  navilayout.footer.add(smModifier).add(smSurface.ctrl);
} else {
  navilayout.footer.add(smModifier).add(smSurface);
}

baseView.add(new Modifier({
      transform : Transform.behind,
      size: [930, undefined],
      origin: [.5, 0],
      align: [.5, 0]
})).add(navilayout);

/* this is the main section where the scrollview is set */
contentSurface.node.add(contentSurface.mod).add(baseView);
surfaces.push(contentSurface.node);

/* main view */
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

/* This is where the footer is added the the baselayout */
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

/* Second Hidden Layer */
/*---------------------*/
var hiddenlayout = new HeaderFooterLayout({
  direction: 0
});

// dynamic hidden navi
var naviView2 = new View();

var naviModifier2 = new Modifier({
    size: [140, undefined],
    align: [0, 0],
    origin: [0, 0],
    opacity: 0
});

naviView2.add(naviModifier2)

var naviSurface2 = new Surface({
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


naviSurface2.node = new RenderNode();
naviSurface2.mod = new StateModifier({opacity:0});

naviSurface2.node.add(naviSurface2.mod).add(naviSurface2);

naviView2.add(naviSurface2);

// add to hidden layout
hiddenlayout.header.add(naviView2);

/* dynamic hidden social buttons */
var smView2 = new View();

var smModifier2 = new Modifier({
    align: [-.8, 0],
    origin: [-.8, 0]
});

smView2.add(smModifier2)

var smSurface2 = new Surface({
    size: [230, undefined],
    content: socialButtons,
    properties: {
        backgroundColor: 'rgba(255,255,255,0)',
        color: 'black',
        lineHeight: "0px",
        textAlign: "center"
    }
});

smSurface2.node = new RenderNode();
smSurface2.mod = new StateModifier({opacity:0});

smSurface2.node.add(smSurface2.mod).add(smSurface2);

smView2.add(smSurface2);

// add a invisible content layer for proper spacing
hiddenlayout.content.add(new Modifier({
      transform : Transform.behind,
      size: [930, undefined],
      origin: [.5, 0],
      align: [.5, 0],
      opacity: 0
})).add(new Surface({
    size: [930, undefined],
    properties: {
      opacity: 0
    }
}));

// add to hiddenlayout
hiddenlayout.footer.add(smView2);

// add hidden layout to baselayout
var baselayoutmod = new Modifier({
      transform : Transform.behind,
      size: [930, undefined],
      origin: [.5, 0],
      align: [.5, 0],
      opacity: 0
});
baselayout.content.add(baselayoutmod).add(hiddenlayout);

/* scroll events */
scrollview.sync.on('update',function(e){
  if(scrollview.getAbsolutePosition()>80) {
    baselayoutmod.setOpacity(1);
    $('.navi').css('margin-top','20px');
    $('.sociallist').css('margin-top','20px');
    //$('.sociallist > li').css('margin-left','-230px');
    smModifier.setOpacity(0);
    naviSurface2.mod.setOpacity(1);
    smSurface2.mod.setOpacity(1);
    stickyheader.setSize([undefined,20]);
  } else {
    baselayoutmod.setOpacity(0);
    $('.navi').css('margin-top','120px');
    $('.sociallist').css('margin-top','120px');
    //$('.sociallist > li').css('margin-left','185px');
    smModifier.setOpacity(1);
    naviSurface2.mod.setOpacity(0);
    smSurface2.mod.setOpacity(0);
    stickyheader.setSize([undefined,0]);
  }
});

/* baselayout is finally added to the main context */
mainContext.add(baselayout);
naviSurface.ctrl.show(naviSurface);
baseHeader.ctrl.show(baseHeader);
smSurface.ctrl.show(smSurface);
if(!x) {
  $('.innerContent').css("margin-left","140px");
}



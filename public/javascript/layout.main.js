/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Sean Westfall
 * @license MIT
 * @copyright Sean Westfall, 2015
 */

var Engine = famous.core.Engine;
var Surface = famous.core.Surface;
var HeaderFooterLayout = famous.views.HeaderFooterLayout;
var Scrollview = famous.views.Scrollview;
var StateModifier = famous.modifiers.StateModifier;
var Modifier = famous.core.Modifier;
var View = famous.core.View;
var RenderNode = famous.core.RenderNode;
var Transform = famous.core.Transform;

var contentHtml = $('.content').html();
var headerHtml = $('.header').html();
var naviHtml = $('.navi').html();
var footerHtml = $('.footer').html();
var socialButtons = $('.social').html();

/* main DOM */
var mainContext = Engine.createContext();

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
baseHeader.pipe(scrollview);

var baseView = new View();

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

var navilayout = new HeaderFooterLayout({
  direction: 0
});

/* navi */
var naviView = new View();

//var naviModifier = new Modifier({
    //align: [0, 0],
    //origin: [0, 0]
//});

//naviView.add(naviModifier)

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


//contentlayout.header.add(naviView);

contentlayout.content.add(view);
//contentlayout.footer.add(smView);

baselayout.content.add(contentlayout);

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

/* SURFACE LAYER */
/*var surfacelayout = new HeaderFooterLayout({
  direction: 0
});
var contentlayout = new HeaderFooterLayout({
  direction: 1
});*/

var stickyheader = new Surface({
    size: [undefined, 0],
    content: "<div>login</div>",
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

var hiddenlayout = new HeaderFooterLayout({
  direction: 0
});

/* hidden navi */
var naviView2 = new View();

var naviModifier2 = new Modifier({
    size: [140, undefined],
    align: [0, 0],
    origin: [0, 0],
    opacity: 0
});

naviView2.add(naviModifier2)

var naviSurface2 = new Surface({
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
naviSurface2.mod = new Modifier({opacity:0});

naviSurface2.node.add(naviSurface2.mod).add(naviSurface2);

naviView2.add(naviSurface2);

hiddenlayout.header.add(naviView2);

baselayout.content.add(new Modifier({
      transform : Transform.behind,
      size: [930, undefined],
      origin: [.5, 0],
      align: [.5, 0]
})).add(hiddenlayout);

var layoutview = new View();
layoutview.add(new Modifier({
      transform : Transform.inFront,
      size: [930, undefined],
      origin: [.5, 0],
      align: [.5, 0]
})).add(baselayout);
//mainContext.add(layoutview);

/* hidden social buttons */

/* scroll events */
scrollview.sync.on('update',function(e){
  if(scrollview.getAbsolutePosition()>80) {
    //naviSurface.mod.setOpacity(0);
    //naviSurface2.mod.setOpacity(1);
    stickyheader.setSize([undefined,20]);
  } else {
    //naviSurface.mod.setOpacity(1);
    //naviSurface2.mod.setOpacity(0);
    stickyheader.setSize([undefined,0]);
  }
});

mainContext.add(baselayout);

/*var headerview = new View();
var wideheader =  new Surface({
  transform : Transform.behind,
  size: [undefined, 100],
  properties: {
    backgroundColor: 'black'
  }
});
headerview.add(wideheader);
surfaces.push(wideheader);*/
//mainContext.add(headerview);


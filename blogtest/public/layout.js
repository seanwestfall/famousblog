var Engine = famous.core.Engine;
var Surface = famous.core.Surface;
var HeaderFooterLayout = famous.views.HeaderFooterLayout;
var Modifier = famous.core.Modifier;
var RenderController = famous.views.RenderController;
var Easing          = famous.transitions.Easing;
var Transform = famous.core.Transform;
var View = famous.core.View;

var Scrollview  = famous.views.Scrollview;

var mainContext = Engine.createContext();


var scrollview = new Scrollview();

var surfaces = [];

var windowheight = $(window).height();

/* Header footer Layout stuff */
var headerHtml = "<div class='title'>" +
  "<div class='maintitle'>Fields of Goldfish</div>" +
  "<div class='subheader'>tranquility, wisdom, and long life</div>" +
  "</div>";

var layout = new HeaderFooterLayout();
var layout2 = new HeaderFooterLayout();

var contentlayout = new Surface({
    size: [undefined, undefined],
    content: "<div class='content parallax-window'></div>",
    properties: {
        backgroundColor: 'rgba(255,255,255,0)',
    }
});
layout.content.add(contentlayout);
contentlayout.pipe(scrollview);

var baseHeader = new Surface({
    transform : Transform.inFront,
    size: [930, 100],
    content: headerHtml,
    properties: {
        backgroundColor: 'rgba(0,0,0,1)',
        color: 'white',
        textAlign: "right"
    }
});
baseHeader.pipe(scrollview);

var wideview = new View();
var wideheader =  new Surface({
  transform : Transform.behind,
  size: [undefined, 100],
  properties: {
    backgroundColor: 'rgba(0,0,0,1)'
  }
});
wideheader.pipe(scrollview);

var wideMod = new Modifier({
      transform : Transform.behind,
      size: [undefined,100],
      origin: [0.5,0],
      align: [0.5,0]
});

wideview.add(wideheader);

var headerview = new View();
var headerMod = new Modifier({
      transform : Transform.inFront,
      size: [930,100],
      origin: [0.5,0],
      align: [0.5,0]
});
headerview.add(headerMod).add(baseHeader);

var combinedview = new View();
//combinedview.add(headerview).add(wideheader);

layout.footer.add(headerview);
layout2.footer.add(wideheader);

var main = new View();

var windowheight = $(window).height();

combinedview.add(layout);
combinedview.add(layout2);
var mainMod = new Modifier({
      transform : Transform.inFront,
      size: [undefined,windowheight],
      origin: [0,0],
      align: [0,0]
});

main.add(mainMod).add(combinedview);

surfaces.push(main);

for (var i = 0; i < 9; i++) {
 var surface = new Surface({
   transform : Transform.behind,
   size: [undefined, windowheight],
   properties: {
     backgroundColor: "hsl(" + (i * 360 / 10) + ", 100%, 50%)",
   }
 });
 surface.pipe(scrollview);
 surfaces.push(surface);
}
scrollview.sequenceFrom(surfaces);

mainContext.add(scrollview);

//$('.parallax-window').parallax({imageSrc: '/images/tumblr_mufk1f9MSo1sohz2fo3_400.gif'});

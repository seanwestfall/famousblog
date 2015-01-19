var Engine = famous.core.Engine;
var Surface = famous.core.Surface;
var HeaderFooterLayout = famous.views.HeaderFooterLayout;
var Grid = famous.views.GridLayout;
var StateModifier = famous.modifiers.StateModifier;
var Modifier = famous.core.Modifier;
var View = famous.core.View;
var Scrollview = famous.views.Scrollview;
var RenderNode = famous.core.RenderNode;

var Transform = famous.core.Transform;

var mainContext = Engine.createContext();

var layout = new HeaderFooterLayout();

//var CollectionLayout = require('famous-flex');
//var FlexScrollView = require(['FlexScrollView']);
//console.log(FlexScrollView);

//var scrollView = new FlexScrollView();

var contentHtml = $('.content').html();
var headerHtml = $('.header').html();
var naviHtml = $('.navi').html();
var footerHtml = $('.footer').html();
var socialButtons = $('.social').html();

var view = new View();
var sModifier = new StateModifier({
  size: [undefined,undefined],
  origin: [.5,0],
  align: [.5,0]
});

var scrollview = new Scrollview();

var surfaces = [];
scrollview.sequenceFrom(surfaces);

var innerSurface = new Surface({
    content: contentHtml,
    properties: {
        backgroundColor: '#fff',
        opacity: 0,
        color: '#000',
        textAlign: "top",
    }
});
innerSurface.pipe(scrollview);

innerSurface.node = new RenderNode();
innerSurface.mod = new Modifier();
innerSurface.modOpacity = new StateModifier();

innerSurface.mod.sizeFrom(function(){
    //target = $('.content').height();
    //targetHeight = $('.content').height() + $('.footer').height() + 55; // the 55px account for the top margin and padding.
    if (true){
        return [undefined,9000];
    } else {
        return [undefined,true];
    }
})

innerSurface.modOpacity.setOpacity(0);
innerSurface.modOpacity.setOpacity(1, {duration : 800});
var mainheader = new Surface({
    size: [undefined, 100],
    content: headerHtml,
    properties: {
        backgroundColor: 'black',
        color: 'white',
        textAlign: "right"
    }
});

var sizeModifier = new Modifier({
  transform : Transform.behind,
  align: [0.7,0],
  origin: [0.7,0]
});
sizeModifier.sizeFrom(function(){
    var wsize = $(window).width();
    var hsize = $(window).height();
    return [wsize*2,hsize];
});

//layout.header.add(mainheader);

var headerwrap = new Surface({
    size: [undefined, 100],
    properties: {
        backgroundColor: 'black'
    }
});

var contentView = new View();
contentView.add(sizeModifier).add(headerwrap);
contentView.add(mainheader);
contentView.add(innerSurface);

innerSurface.node.add(innerSurface.modOpacity).add(innerSurface.mod).add(contentView);
surfaces.push(innerSurface.node);

var smView = new View();

var smModifier = new Modifier({
    align: [1, 0.20],
    origin: [0.95, 0]
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


view.add(sModifier).add(scrollview);

var contentlayout = new HeaderFooterLayout({
  direction: 0
});

var naviView = new View();

var naviModifier = new Modifier({
    align: [0.25, 0.22],
    origin: [0.5, 0]
});

naviView.add(naviModifier).add(new Surface({
    size: [140, undefined],
    content: naviHtml,
    properties: {
        backgroundColor: 'white',
        color: 'black',
        lineHeight: "40px",
        textAlign: "right"
    }
}));

contentlayout.header.add(naviView);

contentlayout.content.add(smView);

contentlayout.content.add(view);

layout.content.add(contentlayout);


layout.footer.add(new Surface({
    size: [undefined, 50],
    content: footerHtml,
    properties: {
        backgroundColor: 'white',
        color: '#000',
        lineHeight: "50px",
        textAlign: "right"
    }
}));

var headerview = new View();

var headersurface = new Surface({
    size: [undefined, 100],
    content: '<div class="login"><span><a onClick="openModal()">login</a></span></div>',
    properties: {
        backgroundColor: 'black',
        color: "grey",
        textAlign: "right"
    }
});

headerview.add(new Modifier({
    transform : Transform.behind,
    size: [undefined,undefined],
    origin: [.5, 0],
    align: [.5, 0]
})).add(headersurface);

var layoutview = new View();

layoutview.add(new Modifier({
      transform : Transform.inFront,
      size: [930, undefined],
      origin: [.5, 0],
      align: [.5, 0]
})).add(layout);

//mainContext.add(headerview);
mainContext.add(layoutview);

//scrollview.setPosition(90);
//mainContext.add(layoutview);

var stickyheader = new Surface({
    size: [undefined, 20],
    content: "<div>login</div>",
    properties: {
       backgroundColor: 'black',
       color: 'white',
        textAlign: "right"
    }
});

layout.header.add(stickyheader);

stickyheader.addClass('stickyheader');
$('.stickyheader').hide();

scrollview.sync.on('update',function(e){
  if(scrollview.getAbsolutePosition()>100) {
    $('.stickyheader').show();
  } else {
    $('.stickyheader').hide();
  }
});

var Transform       = famous.core.Transform;
var Modifier        = famous.core.Modifier;

var Lightbox        = famous.views.Lightbox;
var Easing          = famous.transitions.Easing;

$('.about').on('click','a',function(){ openModal() });

var modal = new Surface({
    size:[500,500],
    content: "<label for='username'>Username:</label><input name='username' type='text'/>" +
             "<label for='password'>Password:</label><input name='password' type='text'/>" +
             "<a href='/admin'>LOGIN</a>",
    properties:{
        color: 'black',
        backgroundColor:'#fa5c4f'
    }
})

modal.on('click',function(){ hideModal() });

modal.lightbox = new Lightbox({
    inTransform: Transform.translate(0,500,0),
    outTransform: Transform.translate(0,500,0),
    inTransition: {duration:1000, curve:Easing.outElastic},
    outTransition: {duration:200, curve:Easing.inOutQuad},
});

mainContext.add(new Modifier({origin:[0.5,0.5],transform: Transform.inFront})).add(modal.lightbox);

function openModal(){
    modal.lightbox.show(modal);
}

function hideModal(){
    modal.lightbox.hide();
}


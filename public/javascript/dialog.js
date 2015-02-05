var Engine = famous.core.Engine;
var Surface = famous.core.Surface;

var Transform       = famous.core.Transform;
var Modifier        = famous.core.Modifier;

var Lightbox        = famous.views.Lightbox;
var Easing          = famous.transitions.Easing;

var RenderController = famous.views.RenderController;

var mainContext = Engine.createContext();

var login = $('.login').html();

$('.about').on('click','a',function(){ openModal() });

var modal = new Surface({
    size:[500,316],
    content: login,
      properties:{
        color: 'black',
        backgroundColor:'#fa5c4f'
    }
});

//modal.on('click',function(){ hideModal() });

modal.lightbox = new Lightbox({
    inTransform: Transform.translate(0,0,0),
    outTransform: Transform.translate(0,0,0),
    inTransition: {duration:1000, curve:Easing.outElastic},
    outTransition: {duration:200, curve:Easing.inOutQuad},
});


var test = new Surface({
    size:[500,316],
      properties:{
        color: 'black',
        backgroundColor:'red'
    }
});

test.ctrl = new RenderController({
    inTransition: {curve: Easing.inOutQuart, duration: 600},
    outTransition: {curve: Easing.inOutQuart, duration: 600},
    overlap: true
});

test.ctrl.inTransformFrom(function(progress) {
    return Transform.translate(window.innerWidth * (1.0 - progress), 0, 0);
});

test.ctrl.outTransformFrom(function(progress) {
    return Transform.translate(window.innerWidth * progress - window.innerWidth, 0, 0);
});

// Add to the context or parent view
mainContext.add(new Modifier({origin:[0.5,0.5],transform: Transform.inFront})).add(test.ctrl);

//test.ctrl.show(test);

mainContext.add(new Modifier({origin:[0.5,0.5],transform: Transform.inFront})).add(modal.lightbox);

function openModal(){
    modal.lightbox.show(modal);
}

function hideModal(){
    modal.lightbox.hide();
}



var Engine = famous.core.Engine;
var Surface = famous.core.Surface;

var Transform       = famous.core.Transform;
var Modifier        = famous.core.Modifier;

var Lightbox        = famous.views.Lightbox;
var Easing          = famous.transitions.Easing;

var RenderController = famous.views.RenderController;

var mainContext = Engine.createContext();

$('.about').on('click','a',function(){ openModal() });

var modal = new Surface({
    size:[500,500],
    content: '<div class="row"> \
        <div class="col-md-offset-5 col-md-3"> \
            <div class="form-login"> \
            <h4>Welcome back.</h4> \
            <input type="text" id="userName" class="form-control input-sm chat-input" placeholder="username" /> \
            </br> \
            <input type="text" id="userPassword" class="form-control input-sm chat-input" placeholder="password" /> \
            </br> \
            <div class="wrapper"> \
            <span class="group-btn"> \
                <a href="/admin" class="btn btn-primary btn-md">login <i class="fa fa-sign-in"></i></a> \
            </span> \
            <span><a onclick="hideModal()">close</a></span> \
            </div> \
            </div> \
        </div> \
    </div>',
      properties:{
        color: 'black',
        backgroundColor:'#fa5c4f'
    }
});

//modal.on('click',function(){ hideModal() });

modal.lightbox = new Lightbox({
    inTransform: Transform.translate(0,500,0),
    outTransform: Transform.translate(0,500,0),
    inTransition: {duration:1000, curve:Easing.outElastic},
    outTransition: {duration:200, curve:Easing.inOutQuad},
});


var test = new Surface({
    size:[500,500],
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



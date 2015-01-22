// Global Templates
SSR.compileTemplate('header', Assets.getText('_includes/header.html'));
SSR.compileTemplate('navi', Assets.getText('_includes/navi.html'));
SSR.compileTemplate('footer', Assets.getText('_includes/footer.html'));
SSR.compileTemplate('mainlayout', Assets.getText('_layouts/layout.html'));

// Router Conf
Router.configure({
  layout: 'mainlayout',
  header: 'header',
  navi:   'navi',
  footer: 'footer'
});

// File Directories
var fs = Npm.require('fs');
__ROOT_APP_PATH__ = fs.realpathSync('.');

var arr = __ROOT_APP_PATH__.split("/");
var index = arr.indexOf(".meteor");
arr.splice(index, (arr.length-index));
arr.shift();
arr.push("private");
arr.push("_posts");
var dir = '/' + arr.join('/');

var walk = function(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) results = results.concat(walk(file))
        else results.push(file)
    })
    return results
}

// Router routes
Router.map(function() {
  this.route('/', {
    where: 'server',
    action: function() {
      var items = walk(dir);
      var posts = [];
      items.forEach(function(i) {
        var item = i.split("/");
        var file = item.pop();
        var fileTerms = file.split("-");
        var post = {};
        post.year = fileTerms[0];
        post.month = fileTerms[1];
        post.day = fileTerms[2];
        post.file = file;

        var date = new Date(post.year,post.month-1,post.day);
        var arrdate = date.toString().split(' ');
        arrdate.splice(4);
        post.fdate = arrdate.join(' ');
        fileTerms.splice(0,3);
        post.title = fileTerms.join(' ');

        var extension = post.title.split('.');
        post.filename = extension[0];
        post.extension = extension[1];

        posts.push(post);
      });

      SSR.compileTemplate('content', Assets.getText('home.html'));
      var html = SSR.render('mainlayout', {data: posts.reverse()});
      this.response.end(html);
    }
  });
  this.route('/about', {
    where: 'server',
    action: function() {
      SSR.compileTemplate('content', Assets.getText('about.html'));
      var html = SSR.render('mainlayout');
      this.response.end(html);
    }
  });
  this.route('/projects', {
    where: 'server',
    action: function() {
      SSR.compileTemplate('content', Assets.getText('projects.html'));
      var html = SSR.render('mainlayout');
      this.response.end(html);
    }
  });
  this.route('/resume', {
    where: 'server',
    action: function() {
      SSR.compileTemplate('content', Assets.getText('resume.html'));
      var html = SSR.render('mainlayout');
      this.response.end(html);
    }
  });
  this.route('/blog', {
    where: 'server',
    action: function() {
      var items = walk(dir).reverse();
      var markdownList = "";
      items.forEach(function(i) {
        var item = i.split("/");
        var file = item.pop();
        var markdown = marked(Assets.getText('_posts/'+file));
        markdownList += markdown;
      });
      SSR.compileTemplate('markdown', markdownList);
      SSR.compileTemplate('content', Assets.getText('blog.html'));
      var html = SSR.render('mainlayout');
      this.response.end(html);
    }
  });
  this.route('/blog/:title', {
    where: 'server',
    path: '/blog/:title',
    action: function() {
      var extension = this.params.title.split('.');
      if(extension[1]=="md") {
        var markdown = marked(Assets.getText('_posts/' + this.params.title));
      } else {
        var markdown = Assets.getText('_posts/' + this.params.title);
      }
      SSR.compileTemplate('markdown', markdown);
      SSR.compileTemplate('content', Assets.getText('blog.html'));
      var html = SSR.render('mainlayout');
      
      var response = this.response;

      response.writeHead(200, {'Content-Type':'text/html'});

      response.end(html);
    }
  });
  this.route('/rss', {
    where: 'server',
    action: function() {
      SSR.compileTemplate('content', Assets.getText('rss.html'));
      var html = SSR.render('mainlayout');
      this.response.end(html);
    }
  });
  this.route('/admin', {
    where: 'server',
    action: function() {
      SSR.compileTemplate('admin', Assets.getText('admin.html'));
      var html = SSR.render('admin');
      this.response.end(html);
    }
  });
});


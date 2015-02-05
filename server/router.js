/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Sean Westfall
 * @license MIT
 * @copyright Sean Westfall, 2015
 */

// Global Templates
SSR.compileTemplate('header', Assets.getText('_includes/header.html'));
SSR.compileTemplate('navi', Assets.getText('_includes/navi.html'));
SSR.compileTemplate('footer', Assets.getText('_includes/footer.html'));
SSR.compileTemplate('login', Assets.getText('_includes/login.html'));
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
    name: 'admin',
    action: function() {

      Meteor.loginWithPassword("sean.westfall@gmail.com", "admin123", function(err){
        if (err) {
		alert(err);
          // The user might not have been found, or their passwword
          // could be incorrect. Inform the user that their
          // login attempt has failed. 
        } else {
          // The user has been logged in.
        }
      });
      /*var userId = this.params.userid;
      var logintoken = this.params.logintoken;
      var isdirect = this.params.direct;
      var user = Meteor.users.findOne({_id:userId,"services.resume.loginTokens.token":logintoken});
      console.log(user);*/
      //if(true) {
        SSR.compileTemplate('admin', Assets.getText('admin.html'));
        var html = SSR.render('admin');
        this.response.end(html);
      //} else {
      //  this.render('accessDenied');
      //}
    }
  });
  this.route('/test', {
    where: 'server',
    name: 'test',
    action: function() {
	var path = Npm.require("path");
	try {
		console.log(__meteor_bootstrap__.configJson.clientPaths);
		clientPaths = __meteor_bootstrap__.configJson.clientPaths;
		 _.each(clientPaths, function (clientPath) {
			staticFiles = {};
			var clientJsonPath = path.join(__meteor_bootstrap__.serverDir, clientPath);
			var clientDir = path.dirname(clientJsonPath);
			var utf8 = Meteor.wrapAsync(fs.readFile)(clientJsonPath, 'utf8');
			var clientJson = JSON.parse(utf8);
			var manifest = clientJson.manifest;
			_.each(manifest, function (item) {
			    if (item.url && item.where === "client") {
			      staticFiles[item.url] = {
			      absolutePath: path.join(clientDir, item.path),
			      cacheable: item.cacheable,
			      // Link from source to its map
			      sourceMapUrl: item.sourceMapUrl,
			      type: item.type
			    };

			    if (item.sourceMap) {
			      // Serve the source map too, under the specified URL. We assume all
			      // source maps are cacheable.
			      staticFiles[item.sourceMapUrl] = {
				absolutePath: path.join(clientDir, item.sourceMap),
				cacheable: true
			      };
			    }
			  }
			});
			console.log(staticFiles);
		});
	} catch (e) {
        	Log.error("Error reloading the client program: " + e.stack);
        	process.exit(1);
        } 
        SSR.compileTemplate('test', Assets.getText('test2.html'));
        var html = SSR.render('test');
        this.response.end(html);
    }
  });

  // RESTful routes
  this.route('/posts', { where: 'server' })
    .get(function () {
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
      this.response.end(JSON.stringify(posts));
    })
    .post(function () {
      console.log(this.request.body);
      var fs = Npm.require('fs');
      __ROOT_APP_PATH__ = fs.realpathSync('.');

      var arr = __ROOT_APP_PATH__.split("/");
      var index = arr.indexOf(".meteor");
      arr.splice(index, (arr.length-index));
      arr.shift();
      arr.push("private");
      arr.push("_posts");
      var dir = '/' + arr.join('/');

      var now = new Date();

      dir += '/' + now.getFullYear() + '-' + ("00" + (now.getMonth() + 1)).substr(-2) + '-' +
             ("00" + now.getDate()).substr(-2) + '-' + this.request.body.title.split(' ').join('-') + '.md';
      fs.writeFile(dir, this.request.body.body, function(err) {
        if(err) {
            console.log(err);
            this.response.end(JSON.stringify(err));
        } else {
            console.log("The file was saved!");
            this.response.end(JSON.stringify("The file was saved!"));
        }
      });
    })
    .delete(function () {
      console.log(this.request.query);
      var fs = Npm.require('fs');
      __ROOT_APP_PATH__ = fs.realpathSync('.');

      var arr = __ROOT_APP_PATH__.split("/");
      var index = arr.indexOf(".meteor");
      arr.splice(index, (arr.length-index));
      arr.shift();
      arr.push("private");
      arr.push("_posts");
      var dir = '/' + arr.join('/');

      fs.unlink(dir + "/" + this.request.query.file, function(err) {
        if(err) {
            console.log(err);
            //this.response.end(JSON.stringify(err));
        } else {
            console.log("The file was removed!");
            //this.response.end(JSON.stringify("The file was removed!"));
        }
      });
    });
});


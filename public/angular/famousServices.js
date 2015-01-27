angular.module('famousApp')
.service('adminServices', function($http) {
  this.getPosts = function() {
    return $http.get('/posts');
  }
  this.addPost = function(title, body) {
    return $http({
      url: '/posts',
      method: 'POST',
      data: {
        title: title,
        body: body
      }
    });
  }
  this.deletePost = function(file) {
    return $http({
      url: '/posts',
      method: 'DELETE',
      params: {
        file: file
      }
    });
  }
});


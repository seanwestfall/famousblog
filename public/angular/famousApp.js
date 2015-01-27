angular.module('famousApp', ['famous.angular'])
.controller('ScrollCtrl', ['$scope', '$famous', 'adminServices', function($scope, $famous, adminServices) {
    var EventHandler = $famous['famous/core/EventHandler'];
    $scope.myEventHandler = new EventHandler();

    $scope.body = "";
    $scope.title = "";

    adminServices.getPosts().then(function(response) {
      //$scope.sequence = response.data;
      $scope.data = response.data;
      console.log($scope.data);
    });

    $scope.grids = [{bgColor: "orange"}, {bgColor: "red"}, {bgColor: "green"}, {bgColor: "yellow"}];

    $scope.myGridLayoutOptions = {
       dimensions: [2,1], // specifies number of columns and rows
    };

    $scope.sequentialOptions = {
          direction: 1, // vertical = 1 (default), horizontal = 0
    };
    $scope.myEventHandler = new EventHandler();

    $scope.submit = function() {
      var title = $('.title').val();
      var body = $('.text').val();
      adminServices.addPost(title, body);
    }

    $scope.delete = function(file) {
      if(confirm("Are you sure you want to delete " + file + "?")) {
        adminServices.deletePost(file).then(function() {
          alert("file was removed!");
        });
      }
    }
}]);


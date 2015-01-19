angular.module('famousTest', ['famous.angular'])
  .controller('ScrollCtrl', ['$scope', '$famous', function($scope, $famous) {
    var EventHandler = $famous['famous/core/EventHandler'];
    $scope.myEventHandler = new EventHandler();
  }]);


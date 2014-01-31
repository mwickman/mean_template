'use strict';

// Declare app level module which depends on filters, and services
angular.module('stats', ['ngRoute']).

config(['$routeProvider', function($routeProvider) {

  $routeProvider.otherwise({redirectTo: '/'});
}]);
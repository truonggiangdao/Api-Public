'use strict';

/* Services */

var loginService = angular.module('loginService', ['ngResource']);
var urlApi = "http://medtales-api.success-ss.com.vn:8092/api/";
loginService.factory('loginApi', ['$resource',
  	function($resource){
    	return $resource(urlApi + 'Login', {}, {
      		query: {method:'POST', params:{}, isArray:false}
	});
}]);

loginService.factory('loginWithFacebookApi', ['$resource',
  	function($resource){
    	return $resource(urlApi + 'LoginFacebook', {}, {
      		query: {method:'POST', params:{}, isArray:false}
	});
}]);

loginService.factory('synsFacebookApi', ['$resource',
    function($resource){
      return $resource(urlApi + 'SyncFacebook', {}, {
          query: {method:'POST', params:{}, isArray:false}
  });
}]);

loginService.factory('registerCheckUsernameApi', ['$resource',
  	function($resource){
    	return $resource(urlApi + 'CheckUserName', {}, {
      		query: {method:'GET', params:{}, isArray:false}
	});
}]);

loginService.factory('registerCheckEmailPassApi', ['$resource',
    function($resource){
      return $resource(urlApi + 'CheckEmailPassword', {}, {
          query: {method:'POST', params:{}, isArray:false}
  });
}]);

loginService.factory('GetHealthcareProfessApi', ['$resource',
    function($resource){
      return $resource(urlApi + 'GetHealthcareProfessionalList', {}, {
          query: {method:'GET', params:{}, isArray:false}
  });
}]);

loginService.factory('RegisterApi', ['$resource',
    function($resource){
      return $resource(urlApi + 'Register', {}, {
          query: {method:'POST', params:{}, isArray:false}
  });
}]);
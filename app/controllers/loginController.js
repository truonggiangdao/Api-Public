(function () {

    var loginController = angular.module('loginController', []);
    
    // $scope.go = function ( path ) {
    //         $('.modal-backdrop').remove();
//       $location.path(path);
    //     };

    //function create cookies
    function createCookie(name, value, days) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60));//days * 24 * 60 * 60 * 1000
            expires = "; expires=" + date.toGMTString();
        }
        else {
            expires = "";
        }
        document.cookie = name + "=" + JSON.stringify(value) + expires + "; path=/";
    }

    //convert link image to base64
    function convertFileToDataURLviaFileReader(url, callback){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function() {
            var reader  = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.send();
    }

    //global variable for register
    var userN="", profileImage="", email="", password="", healcareProfessional="", deviceToken ="123456789", name="",  platform ="web",IsAccFb=0, facebookUid;

    // Login Index Controller
    loginController.controller('IndexCtl', function($scope, broadcastService){

        $scope.index_state = "main";
        // go to login-step-4
        $scope.$on("loginWithMedtalesAccount", function(event){
            $scope.index_state = "showLoginForm";
        });
        // go to login-step-2
        $scope.$on("createAnAccount", function(event){
            $scope.index_state = "createAccount";
        });
        // go to login-step-3
        $scope.$on("confirmedName", function(event){
            $scope.index_state = "confirmedName";
        });
        // go to login-step-5
        $scope.$on("uploadedProfilePicture", function(event){
            $scope.index_state = "uploadedProfilePicture";
        });
        // go to login-step-6-7
        $scope.$on("updatedEmailPassword", function(event){
            $scope.index_state = "updatedEmailPassword";
        });
        // go to login-step-8
        $scope.$on("showLoggedInProfile", function(event){
            $scope.index_state = "showLoggedInProfile";
        });
        // go to login-step-1
        $scope.$on("goBackToMain", function(event){
            $scope.index_state = "main";
        });
        // go to login-step-1
        $scope.$on("logOut", function(event){
            $scope.index_state = "main";
        });

    });
    
    // Main: Login or Register Controller (LogIn-Step-1)
    loginController.controller('MainCtl', function($scope, $rootScope, $window, broadcastService, loginWithFacebookApi, synsFacebookApi){
        /***** Login with FACEBOOK: START*****/
        $scope.loginWithFacebook = function(){
            // broadcastService.broadcast("loginWithFacebook");
            checkLoginState();
        };

        //check user login fb or not yet --> response
        function checkLoginState() {
            FB.getLoginStatus(function(response) {
                statusChangeCallback(response);
            });
        }

        // This is called with the results from FB.getLoginStatus().
        function statusChangeCallback(response) {
            if (response.status === 'connected') {
                testAPI();
            } else if (response.status === 'not_authorized') {
                FB.login(function (response) {
                    if (response.status === "connected") {
                        statusChangeCallback(response);
                    };
                 }, { scope: 'public_profile ,email' });
            } else {
                FB.login(function (response) {
                    if (response.status === "connected") {
                        statusChangeCallback(response);
                    };
                 }, { scope: 'public_profile ,email' });
            }
        }

        window.fbAsyncInit = function() {
            FB.init({
                appId: '1009801495761724',
                cookie     : true,
                xfbml      : true,
                version    : 'v2.5'
            });

            // FB.getLoginStatus(function(response) {
            //     statusChangeCallback(response);
            // });
        };

        // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "../../app/js/sdk_fb.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
        $scope.showCOnfirm = function() {
            $('#confirmModal').modal('toggle').modal({
                backdrop: 'static',
                keyboard: false
            });
        }
        function testAPI() {
            FB.api('/me?fields=id,name,email,picture', function(response) {
                loginWithFacebookApi.query({email: response.email, device_token : deviceToken, platform : platform, 
                    facebook_uid: response.id}, function(data) {
                    if (data.status_code === 200) {
                        createCookie('userData', data.data, 1000);
                        $window.location.href = '/';
                    }
                    else if(data.status_code === 401) {
                        $scope.createAnAccount();
                        profileImage = "https://graph.facebook.com/" + response.id + "/picture?width=320&height=320";
                        // profileImage = response.picture.data.url;
                        email = response.email;
                        $rootScope.$broadcast('profileImage', profileImage );
                        $rootScope.$broadcast('email', email );
                        IsAccFb = 1;
                        facebookUid = response.id;
                    }
                    else {
                         $scope.showCOnfirm();
                         $scope.synsFb = function() {
                            synsFacebookApi.query({email: response.email, name: response.name, profile_image: response.picture.data.url, 
                                facebook_uid:response.id, device_token : deviceToken, platform : platform}, function(data) {
                                    createCookie('userData', data.data, 1000);
                                    $window.location.href = '/';
                            });
                         };
                         $scope.notSynsFb = function() {
                            createCookie('userData', data.data, 1000);
                            $window.location.href = '/';
                         };
                    }
                });
            });
        }
        /***** Login with FACEBOOK: END*****/

        // to-do list
        $scope.loginWithMedtalesAccount = function(){
            broadcastService.broadcast("loginWithMedtalesAccount");
        };
        // to-do list
        $scope.createAnAccount = function(){
            broadcastService.broadcast("createAnAccount");
        };

    });

    // Set Username Controller (LogIn-Step-2)
    loginController.controller('SetUsernameCtl', function($scope, broadcastService, registerCheckUsernameApi){
        
        $scope.confirmName = function(username){
            $scope.showErrMsgExit = false;
            $scope.showErrMsgInvalid = false;
            $scope.master ="";
            registerCheckUsernameApi.query({username: username}, function(data) {
                if (data.status_code === 200) {
                    userN = username;
                    broadcastService.broadcast("confirmedName");
                    $scope.showErrMsgExit = false;
                    $scope.showErrMsgInvalid = false;
                    $scope.usernameForm.$setPristine();
                }
                else {
                    if (data.message == "Username is invalid or missing.") {
                        $scope.showErrMsgInvalid = true;
                    }
                    else {
                        $scope.showErrMsgExit = true;
                    }
                    
                }
            });
        };
        
        $scope.goBackToMain = function(){
            $scope.showErrMsgExit = false;
            $scope.showErrMsgInvalid = false;
            $scope.username = angular.copy($scope.master);
            $scope.usernameForm.$setPristine();
            broadcastService.broadcast("goBackToMain");
        };

    });

    // Set Username Controller (LogIn-Step-3)
    loginController.controller('SetProfilePictureCtl', function($scope, $rootScope, broadcastService){
        //upload photo and show
        var flag = false;
        $scope.msgErrorUpload = false;
        $rootScope.$on('profileImage',function(event, args){
            $scope.avatar = args;
            if ($scope.avatar != "") {
                flag = true;
            }
        });

        $scope.imageUpload = function(event){
            
            if(window.File && window.FileList && window.FileReader)
            {
                var file = event.target.files[0]; //FileList object
                if(file.type.match('image.*')) {
                    if(file.size < 2097152){
                        var reader = new FileReader();
                        reader.onload = $scope.imageIsLoaded; 
                        reader.readAsDataURL(file);
                        flag = true;
                        $scope.msgErrorUpload = !flag;
                    }
                    else
                    {
                        $scope.$apply(function() {
                            $scope.msgErrorUpload = !flag;
                            $scope.msgInformError = "The uploaded profile picture is too (large/wide/tall). Please upload a profile picture that is 2MB or smaller. The uploaded profile picture is too (large/wide/tall). Reccomended size is 200x200."
                        });
                    }
                }
                else
                {   
                    $scope.$apply(function() {
                        $scope.msgErrorUpload = !flag;
                        $scope.msgInformError = "You can only upload image file."
                    });
                }
            }
            else
            {
                $scope.$apply(function() {
                    $scope.msgErrorUpload = !flag;
                    $scope.msgInformError = "Your browser does not support File API."
                });
            }
        }

        $scope.imageIsLoaded = function(e){
            $scope.$apply(function() {
                $scope.avatar = e.target.result;
                profileImage = e.target.result;
            });
        }                                
        $scope.uploadProfilePicture = function(){
            if(flag) {
               broadcastService.broadcast("uploadedProfilePicture");
            }
            else {
                $scope.msgErrorUpload = !flag;
                $scope.msgInformError = "Please upload your avatar."
            }
        };
        
        $scope.goBackToSetUsername = function(){
            broadcastService.broadcast("createAnAccount");
        };

    });



    // Login Controller (LogIn-Step-4)
    loginController.controller('LoginCtl', function($scope, $window, broadcastService, loginApi){
        
        $scope.$on("loginWithMedtalesAccount", function(event){
            // show the LoginForm
        });

        $scope.msgError = false;
        $scope.login = function(data){
            loginApi.query({email: data.email, password: data.password, device_token: deviceToken, 
            platform: platform}, function(data) {
                if (data.status_code === 200) {
                    createCookie('userData', data.data, 1000);
                    $scope.msgError = false;
                    $window.location.href = '/';
                }
                else {
                    $scope.msgError = true;
                }
            });
        };

        $scope.showLoggedInProfile = function(){
            broadcastService.broadcast("showLoggedInProfile");
        };

        $scope.goBackToMain = function(){
            $scope.msgError = false;
            broadcastService.broadcast("goBackToMain");
        };

    });

    // Set Email Password Controller (LogIn-Step-5)
    loginController.controller('setEmailPasswordCtl', function($scope, $rootScope, broadcastService, registerCheckEmailPassApi){
        $scope.msgError = false;
        $scope.lblEmail = true;
        $scope.info = {};
        $scope.info.email = "";
        $scope.info.pass = "";
        $rootScope.$on('email',function(event, args){
            $scope.info.email = args;
            $scope.lblEmail = false;
        });
        $scope.updateEmailPassword = function(info){
            registerCheckEmailPassApi.query({email: info.email, password: info.pass}, function(data) {
                if (data.status_code === 200) {
                    email = info.email;
                    password = info.pass;
                    broadcastService.broadcast("updatedEmailPassword");
                    $scope.msgError = false;
                }
                else {
                    $scope.msgError = true;
                }
            });
        };
        
        $scope.goBackToSetProfilePicture = function(){
            broadcastService.broadcast("confirmedName");
        };

    });

    // Set Email Password Controller (LogIn-Step-6)
    loginController.controller('healthcareProCtl', function($scope, $window, broadcastService, GetHealthcareProfessApi, RegisterApi){

        GetHealthcareProfessApi.query({}, function(data) {
            if (data.status_code === 200) { 
                $scope.listHealthCare = {
                     availableOptions: data.data,
                     selectedOption: data.data[0]
                 };
            }
        });
        
        $scope.medicalYes = false;
        $scope.medicalNo = false;

        $scope.yes = function(){

            if ( $scope.medicalYes )
            {
                $scope.medicalYes = false;
            }
            else
            {
                $scope.medicalYes = true;
            }
            
            $scope.medicalNo = false;
        };

        $scope.no = function(){

            if ( $scope.medicalNo )
            {
                $scope.medicalNo = false;
            }
            else
            {
                $scope.medicalNo = true;
            }
            
            $scope.medicalYes = false;
        };

        $scope.back = function(){
            broadcastService.broadcast("uploadedProfilePicture");
        };
        
        $scope.next = function(healthCare){
            // userN, profileImage, email, password, healcareProfessional, devideToken, name,  platform ="web",IsAccFb
            if ($scope.medicalYes === true && $scope.medicalNo === false) {
                healcareProfessional = healthCare.id;
            }
            else {
                healcareProfessional = "";
            }
            if (IsAccFb === 1 && profileImage.indexOf("base64") === -1) {
                convertFileToDataURLviaFileReader(profileImage, function(base64Img){
                    profileImage = base64Img;
                    RegisterApi.query({email: email, password: password, username: userN, profile_image: profileImage, 
                        healthcare_professional: healcareProfessional, device_token: deviceToken, platform: platform, 
                        is_account_facebook: IsAccFb, facebook_uid: facebookUid}, function(data) {
                        if (data.status_code === 200) { 
                            createCookie('userData', data.data, 1000);
                            $window.location.href = '/';
                        }
                    });
                });
            }
            else {
                RegisterApi.query({email: email, password: password, username: userN, profile_image: profileImage, 
                    healthcare_professional: healcareProfessional, device_token: deviceToken, platform: platform, 
                    is_account_facebook: IsAccFb, facebook_uid: facebookUid}, function(data) {
                    if (data.status_code === 200) { 
                        createCookie('userData', data.data, 1000);
                        $window.location.href = '/';
                    }
                });
            }
            
        };
        // broadcastService.broadcast("showLoggedInProfile");
    });

    // Logged In Profile Controller (LogIn-Step-8)
    loginController.controller('LoggedInProfileCtl', function($scope, broadcastService){
    	$scope.logOut = function(){
    		broadcastService.broadcast("logOut");
    	};
    });


    // This is an Service Factory that allow Controllers to interact with others
    loginController.factory('broadcastService', function( $rootScope ) {
        
        var broadcastService = {};

        broadcastService.broadcast = function(serviceName) {
            $rootScope.$broadcast( serviceName );
        };

        return broadcastService;
    });



    // directive to trigger Select Element to look like material
    loginController.directive('select', materialSelect);
    materialSelect.$inject = ['$timeout'];

    function materialSelect($timeout) {
        var directive = {
            link: link,
            restrict: 'E',
            require: '?ngModel'
        };

        function link(scope, element, attrs, ngModel) {
            if (ngModel) {
                ngModel.$render = create;
            }else {
                $timeout(create);   
            }

            function create() {
                element.material_select();
            }

            //if using materialize v0.96.0 use this
            element.one('$destroy', function () {
                element.material_select('destroy');
            });
            
            //not required in materialize v0.96.0
            element.one('$destroy', function () {
                var parent = element.parent();
                if (parent.is('.select-wrapper')) {
                    var elementId = parent.children('input').attr('data-activates');
                    if (elementId) {
                        $('#' + elementId).remove();
                    }
                    parent.remove();
                    return;
                }

                element.remove();
            });
        }

        return directive;
    }

})();
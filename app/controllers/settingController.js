var settingController = angular.module('settingController', ['matchPassword']); 

//Get cookies has info of user
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

var userData = getCookie('userData');
var userN = "Login/Sign up";
var avatar= "../../img/avatar_default.png";
var txtLoginLougout = "Login/Sign Up";
var userIdLogin = 0;
var token = "";
if (userData === "") {
    //
}
else {
    userN = JSON.parse(userData)[0].username;
    avatar = JSON.parse(userData)[0].profile_image_url;
    userIdLogin = JSON.parse(userData)[0].id;
    txtLoginLougout = "Logout";
    token = JSON.parse(userData)[0].token;
}

angular.module('matchPassword', []).directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.formResetPass.newPass.$viewValue
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
});

settingController.controller('settingCtrl', function($scope, $rootScope, $window, ResetPassApi){

    /***** Reset Password: START *****/
    //show form when click edit pass
    $scope.showResetPassword = function() {
       $("#lblPassword").removeClass("cls-display-block").addClass("cls-display-none");
       $("#lnkPassword").addClass("lnk-disable");
       $("#txtPassword").removeClass("cls-display-none").addClass("cls-display-block");
       $("#btnReset").removeClass("cls-display-none").addClass("cls-display-block");
    }

    //Action when click button reset password
    $scope.resetPassword = function(pass) {
      //declare variable
      $scope.msgShowError = false;
      $scope.msgError = "";
      var confirmPass = $("input[name=confirmPass]").val();

      //modal inform success
      var message = "";
      $scope.showMsgErrorImage = true;
      $scope.closeErrorModal = function() {
          $('#errorModal').modal('toggle');
      }    

      $scope.showError = function(message) {
          $('#errorModal').modal('toggle').modal({
              backdrop: 'static',
              keyboard: false  // to prevent closing with Esc button (if you want this too)
          });
          $("#msg-inform-error").text(message);
      }

      //call api reset pass
      if (pass === undefined) {
        $scope.msgShowError = true;
        $scope.msgError = "Please input old passwoord.";
      }
      else {
          ResetPassApi.query({id: userIdLogin, oldPassword: pass.old, newPassword: pass.new, 
          confirmPassword: confirmPass, token: token}, function(data) {
            if (data.status_code == 200) {
              $("#txtPassword input").val("");
              $("#lblPassword").removeClass("cls-display-none").addClass("cls-display-block");
              $("#lnkPassword").removeClass("lnk-disable");
              $("#txtPassword").removeClass("cls-display-block").addClass("cls-display-none");
              $("#btnReset").removeClass("cls-display-block").addClass("cls-display-none");
              message = "Reset password successful.";
              $scope.showError(message);
              $scope.msgShowError = false;
            } 
            else {
              $scope.msgShowError = true;
              if (data.error_code === 117) {
                $scope.msgError = "Please input new passwoord and cofirm new passwoord.";
              }
              else if (data.error_code === 2) {
                $scope.msgError = "Current password does not right.";
              }
              else {
                $scope.msgError = "New password does not identical with current password";
              }
            }
        });
      }
    }
    /***** Reset Password: END *****/
});
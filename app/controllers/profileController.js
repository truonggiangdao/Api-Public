var profileController = angular.module('profileController', ['ngScrollbars']); 

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

profileController.controller('ContentProfileCtrl', function($scope, headerService, $window, GetUserProfile, GridProfileData, GridPostData, GetUserLikeList, GetUserFollowUserList
    , GridRepostData, GetUserFollowerList, $location, $rootScope, userDetailService){
    
    //$scope.user_followers = GetUserFollowerList.query();
     // GetUserFollowerList.query(function(data){
     //    $scope.user_followers = data.user_followers;
     // })

     //declare vaialbe to call API
    // $user_login = 1;
    // $page_index = 1;
    // $page_size_first = 5;
    // $page_size_more = 2;
    //call API to get all info of user
    // GetUserProfile.query({user_id: $user_login, page_index: $page_index, page_size_first: $page_size_first, 
    // page_size_more: $page_size_more}, function(data) {
    console.log(userDetailService.getUserDetails());
    
    // $rootScope.$on('viewProfileUser',function(event, args){
    //     console.log("a");
    //     console.log(args);   
    // });
    // Details profile:  show storie in profile, follower, following, medtale, repost


    $scope.tab = 'default';
    $scope.grid_state = "cls-display-block";
    $scope.user_follower_state = "cls-display-none";

    $scope.profile_image = "../../img/demo_user.png";

    if (data.data.user.profile_image != null) {
        $scope.profile_image = data.data.user.profile_image;
    }
    $scope.username = data.data.user.username;
    $scope.hospital_affiliation = data.data.user.hospital_affiliation;
    $scope.numFollowers =  data.data.total_follower;
    $scope.numFollowing =  data.data.total_following;
    $scope.numMedtales =  data.data.total_post;
    $scope.numReposts =  data.data.total_repost;
    $scope.stories = data.data.stories;
    $rootScope.$on('medtales',function(event, args){
        $scope.stories = args;
        $scope.grid_state = "cls-display-block";
        $scope.user_follower_state = "cls-display-none";

    });
    $rootScope.$on('repost',function(event, args){
        $scope.stories = args;
        $scope.grid_state = "cls-display-block";
        $scope.user_follower_state = "cls-display-none";
    });
    $rootScope.$on('follower',function(event, args){
        $scope.user_followers = args;
        $scope.grid_state = "cls-display-none";
        $scope.user_follower_state = "cls-display-block";
    });
    $rootScope.$on('following',function(event, args){
        $scope.user_followers = args;
        $scope.grid_state = "cls-display-none";
        $scope.user_follower_state = "cls-display-block";
    });
    // Set tab active
    $scope.setTab = function (tabId) {
        $scope.tab = tabId;
        if($scope.tab === 'medtales') {
            $scope.stories = []; 

            for (var i = 0; i < data.data.stories.length; i++) {
                if (data.data.stories[i].is_repost == 0) {
                    $scope.stories.push(data.data.stories[i]);
                }
            }
            $rootScope.$broadcast('medtales', $scope.stories );
        }
        else if($scope.tab == 'repost') {
            $scope.stories = []; 
            for (var i = 0; i < data.data.stories.length; i++) {
                if (data.data.stories[i].is_repost == 1) {
                    $scope.stories.push(data.data.stories[i]);
                }
            }
            $rootScope.$broadcast('repost', $scope.stories);
        }
        else if($scope.tab == 'follower' ) {
            $rootScope.$broadcast('follower', $scope.user_followers);
        }
        else if($scope.tab == 'following') {
            $rootScope.$broadcast('following', $scope.user_followers);
        } 
    };
    // Add class active
    $scope.isSet = function (tabId) {
        return $scope.tab === tabId;
    };
    // });

    // Check scroll bottom
    function isAtBottom() {
      if($(window).scrollTop() + $(window).height() == $(document).height()) {
        return true;
      }
        return false;
    }

    // Load more when scroll
    $window.onscroll = function(ev) {
        
        if(isAtBottom()) { 
            setTimeout(function(){ 
                var last = 3;
                var story_type = ["photo", "video", "text", "reposted"];
                var story_type_repost = ["reposted"];
                var story_type_medtales = ["photo", "video", "text"];
                for(var i = 1; i <= 4; i++) {
                	// Add item for grid
                	if($scope.tab == 'default') {
    			    	$scope.stories.push({
                                    id: last + i, story_type: (story_type[Math.floor(Math.random()*story_type.length)]), 
                                    repost_username:"Patient Reposted",
                                    username: "Patient Somebody", imageUrl: "../../img/demo_1.jpg", video_id: "fbVjvAdZLhE", 
                                    story_title: "Video Title Goes Here for a Two Lined Title Example",
                                    story_description: "Photo description goes here. Photo description goes here. Photo description goes here. Photo description goes here. Photo description goes here. Photo description goes here. Photo description goes here. Photo description goes here.",
                                    is_follow : "true", is_owner : "false"
                             	});
    			    }
    			    else if($scope.tab == 'repost') {
    			    	$scope.stories.push({id: last + i, story_type: "Reposted", repost_username:"Patient Reposted",
                                    username: "Patient Somebody", imageUrl: "../../img/demo_1.jpg",title: "Video Title Goes Here for a Two Lined Title Example",
                                    story_description: "Photo description goes here. Photo description goes here. Photo description goes here. Photo description goes here. Photo description goes here. Photo description goes here. Photo description goes here. Photo description goes here.",
                                    is_follow : "false",
                                    is_owner : "false"
                             	});
    			    }
    			    else if($scope.tab == 'medtales') {
    			    	$scope.stories.push({id: last + i, story_type: (story_type_medtales[Math.floor(Math.random()*story_type_repost.length)]), repost_username:"Patient Reposted",
                                    username: "Patient Somebody", imageUrl: "../../img/demo_1.jpg",title: "Video Title Goes Here for a Two Lined Title Example",
                                    story_description: "Photo description goes here. Photo description goes here. Photo description goes here. Photo description goes here. Photo description goes here. Photo description goes here. Photo description goes here. Photo description goes here.",
            						is_follow : "false",
                                    is_owner : "true"
                             	});
    			    }
    			    // Add item for user followers
    			    else if($scope.tab == 'follower' || $scope.tab == 'following') {
    				    $scope.user_followers.push({id: 1, 
    			    			username: "Username Username", 
    	        				hospitial_name: "Hospital Affiliation Name",
    	        				image_url: "../../img/demo_user.png"
    	                 	});
    				}
                  
                }

         	  $scope.$apply();

         }, 500);
        }
    };

     // Show expanded story
    $scope.showExpandedStory = function(id){
        $('#expandedStoryModal').modal({
            backdrop: 'static',
            keyboard: false  // to prevent closing with Esc button (if you want this too)
        });
        //Show expanded modal
        $rootScope.$broadcast('showStoryModal', { story_id: id});
       
    };

    // Change number like
    $scope.changeNumberLike = function() {
        //Get id of user login, id of story like
        $user_login = 2;
        $story_id = 447;
        // Call Api: param user_id, story_id: output: $total_like = 10; Total like
        $scope.like = GetUserLikeList.query({user_id: $user_login, story_id: $story_id}, function(data) {
            if(data.status_code === 200) {
                console.log(data.data.total_like);
                $(".grid-main .like-"+$story_id+" .txt-number").text(data.data.total_like);
                $(".modal-expanded-story .like-"+$story_id+" .txt-number").text(data.data.total_like);
                // $(".modal-expanded-story .expandedStory-like .txt-number").text(data.data.total_like);
            }
        });
    }

    // Change status of follow button
    $scope.changeStatus = function(event){ 
        //Get id of user login, id of story like
        $user_login = 1;
        $user_follow_id = 2;
        var elementClasses = event.target.classList;

        $scope.like = GetUserFollowUserList.query({user_id: $user_login, user_following_id: $user_follow_id}, function(data) {
            for (var i = 0; i < $scope.grid_items.length; ++i) {
                $list = $scope.grid_items[i];
                if($list.id === $user_follow_id){
                    if (data.msg === "unfollowed successfully") {
                        $list.is_follow = false;
                        //$('.home-feature #follow-'+$list.id).addClass("btn-follow").removeClass("btn-following");
                        $('.grid-main #follow-'+$list.id).addClass("btn-follow").removeClass("btn-following");
                        $('.modal-expanded-story #follow-'+$list.id).addClass("btn-follow").removeClass("btn-following");
                        $(event.target).addClass("btn-follow").removeClass("btn-following");;
                    }
                    else {
                        $list.is_follow = true;
                        //$('.home-feature #follow-'+$list.id).addClass("btn-following").removeClass("btn-follow");
                        $('.grid-main #follow-'+$list.id).addClass("btn-following").removeClass("btn-follow");
                        $('.modal-expanded-story #follow-'+$list.id).addClass("btn-following").removeClass("btn-follow");
                        $(event.target).addClass("btn-following").removeClass("btn-follow");
                    }
                }
            }
            //changeStatus(event, data.msg);
        });
    };  

    // Show repost modal
    $scope.showRepostStory = function(){
        headerService.broadcastService("showRepostStoryModal");
    };

    // check user is owner
    $scope.is_myprofile = 'false';
    if($window.location.href.indexOf("profileId") >= 0){
        $scope.is_myprofile = 'true';
    }

    $("body").on('click', function(e) {
        if($("body").hasClass("custom-scroll")){
           $("body").removeClass("custom-scroll");
            $(".cls-header").removeClass("showNotification");
        }
        $(".cls-header").removeClass("showMenuProfile");
    });
});
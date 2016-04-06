var homeController = angular.module('homeController', ['ngScrollbars']); // use ngScrollbars

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

//clear cookies
function clearCookie(c_name) {
    document.cookie = c_name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// get youtube id
function extractVideoID(url){
    var youtube_id = "";
    if (url === null) {
        //
    }
    else {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        if ( match && match[7].length == 11 ){
            youtube_id = match[7];
        }
    } 
    return youtube_id;
}

homeController.controller('ContentCtrl', function($scope, $window, GridItems, GetUserLikeList, GetUserFollowUserList, GetStoriesApi,
    headerService, $location, $document, $rootScope, $timeout, ServiceGridItem, GetHomeStoriesApi, storyDataService, userDetailService) {
    /***** Get stories in home: START *****/
    //function change link src of image

    $scope.changeLinkSrc = function(stories) {
        var youtube_id = "";
        if (stories.youtube_link.indexOf("https://www.youtube.com/") != -1) {
            youtube_id = stories.youtube_link.slice(32);
        } 
        else {
            youtube_id = stories.youtube_link.slice(30);
        }
        if (stories.story_type === "video") {
            $scope.homeFeature_img = 'http://i3.ytimg.com/vi/' + youtube_id +'/hqdefault.jpg';
        }
        else {
            $scope.homeFeature_img = stories.images[0].image_url;
        }
    }
    //decalare variable for call API
    $user_login = userIdLogin;
    var initialData = storyDataService.getData($user_login);
    $scope.btnFollowClass = "btn-follow";

    $timeout(function(){ 
        $scope.stories = initialData.Stories;
        $scope.feature_stories = initialData.FeaturedStories;
        //Feature story
        $scope.showFeatureStory = false;
        if ($scope.feature_stories.length !== 0 ) {
            $scope.showFeatureStory = true;
            $scope.homeFeature_id = $scope.feature_stories[0].id;
            $scope.homeFeature_title = $scope.feature_stories[0].story_title;
            $scope.homeFeature_des = $scope.feature_stories[0].story_description;
            $scope.homeFeature_name = $scope.feature_stories[0].name;
            $scope.homeFeature_profile_image = $scope.feature_stories[0].profile_image_url;
            $scope.homeFeature_total_like = $scope.feature_stories[0].total_like;
            $scope.homeFeature_total_comment = $scope.feature_stories[0].total_comment;
            $scope.homeFeature_total_repost = $scope.feature_stories[0].total_repost;
            $scope.homeFeature_user_id = $scope.feature_stories[0].user_id;
            $scope.homeFeature_is_follow = $scope.feature_stories[0].is_follow;
            $scope.homeFeature_is_commented = $scope.feature_stories[0].is_commented;
            $scope.homeFeature_is_liked = $scope.feature_stories[0].is_liked;
            $scope.homeFeature_reposted_by_me = $scope.feature_stories[0].reposted_by_me;
            $scope.homeFeature_is_healthcare_professional = $scope.feature_stories[0].is_healthcare_professional;
            $scope.homeFeature_is_anonymously = $scope.feature_stories[0].is_anonymously;
            if ($scope.homeFeature_is_follow === 'true') {
                $scope.btnFollowClass = "btn-following";
            }
            else {
                $scope.btnFollowClass = "btn-follow";
            }
            $scope.changeLinkSrc($scope.feature_stories[0]);
        }
        else {
            $scope.showFeatureStory = false;
        }
    }, 1000); 
    /***** Get stories in home: END *****/

    /***** Swiper stories in header: START *****/
    angular.element(document).ready(function () {
        //load swiper lastest item
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 'auto',
            paginationClickable: true,
            spaceBetween: 15,
            onSlideChangeEnd: function (swiper) {
                $timeout(function() {
                    var storyId = $(".swiper-wrapper").find(".swiper-slide-active").attr('id');
                    changeFeatureStory(storyId);
                    // console.log(swiper.activeIndex + 1);
                 }, 100);
            }
        });

        // Update slider
        $timeout(function() {
            swiper.update(true);
          }, 1000);
    });

    // Change content Feature story
     $scope.changeFeatureStory = function(storyId) {
          changeFeatureStory(storyId);
    }

    function changeFeatureStory(storyId) {
        for (var i = 0; i < $scope.feature_stories.length; i++) {
            if (storyId ==  $scope.feature_stories[i].id) {
                $scope.homeFeature_id = $scope.feature_stories[i].id;
                $scope.homeFeature_title = $scope.feature_stories[i].story_title;
                $scope.homeFeature_des = $scope.feature_stories[i].story_description;
                $scope.homeFeature_name = $scope.feature_stories[i].name;
                $scope.homeFeature_profile_image = $scope.feature_stories[i].profile_image_url;
                $scope.homeFeature_total_like = $scope.feature_stories[i].total_like;
                $scope.homeFeature_total_comment = $scope.feature_stories[i].total_comment;
                $scope.homeFeature_total_repost = $scope.feature_stories[i].total_repost;
                $scope.homeFeature_is_follow = $scope.feature_stories[i].is_follow;
                $scope.homeFeature_user_id = $scope.feature_stories[i].user_id;
                $scope.homeFeature_is_commented = $scope.feature_stories[i].is_commented;
                $scope.homeFeature_is_liked = $scope.feature_stories[i].is_liked;
                $scope.homeFeature_reposted_by_me = $scope.feature_stories[i].reposted_by_me;
                $scope.homeFeature_is_healthcare_professional = $scope.feature_stories[i].is_healthcare_professional;
                $scope.homeFeature_is_anonymously = $scope.feature_stories[i].is_anonymously;
                $scope.homeFeature_story_type = $scope.feature_stories[i].story_type;
                
                $scope.changeLinkSrc($scope.feature_stories[i]);
            }
        };
    }
    /***** Swiper stories in header: END *****/

    /***** Get stories load more when scroll: START *****/
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
                if (initialData.exitData) {
                    //call api get stories load more
                    storyDataService.loadMore(userIdLogin);
                };
                $scope.$apply();      
            }, 500);  
        }
    };  
    /***** Get stories load more when scroll: END *****/

    // Show expanded story
    $scope.showExpandedStory = function(story_id){
        $('#expandedStoryModal').modal({
            backdrop: 'static',
            keyboard: false  // to prevent closing with Esc button (if you want this too)
        });
        //Show expanded modal
        $rootScope.$broadcast('showStoryModal', {story_id : story_id});
       
    };

    // Scroll top when refresh page
    $("html, body").animate({
        scrollTop: 0
    }, 600);

    /***** Change number like: START *****/
    if (userIdLogin === 0) {

    }
    else {
        $scope.changeNumberLike = function(story_id) {
            var initialData = storyDataService.changeLike( userIdLogin, story_id );
            $scope.stories = initialData.Stories;
            $scope.feature_stories = initialData.FeaturedStories;
            setTimeout(function() {
                for (var i = 0; i < $scope.feature_stories.length; i++) {
                    if ($scope.feature_stories[i].id === story_id) {
                        $scope.$apply(function() {
                            $scope.homeFeature_is_liked = $scope.feature_stories[i].is_liked;
                            $scope.homeFeature_total_like = $scope.feature_stories[i].total_like;
                        });
                    }
                };
            }, 400);
        }
    }
    setTimeout(function() {
        $scope.$on('changeLikes', function(event, args) {
            $scope.$apply(function() {
                $scope.homeFeature_is_liked = args.is_liked;
                $scope.homeFeature_total_like = args.total_like;
            });
        });
    }, 400);
    /***** Change number like: START *****/

    /***** Change status of follow button: START *****/
    if (userIdLogin === 0) {
        //
    }
    else {
        $scope.changeStatus = function(event, userId){ 
            $user_login = userIdLogin;
            // var elementClasses = event.target.classList;
            GetUserFollowUserList.query({user_id: $user_login, user_following_id: userId}, function(data) {
                if(data.status_code === 200) {
                    for (var i = 0; i < $scope.feature_stories.length; ++i) {
                        if($scope.feature_stories[i].user_id === userId){
                            if (data.message === "Unfollowed successfully") {
                                $scope.feature_stories[i].is_follow = false;
                                $scope.homeFeature_is_follow = false;
                            }
                            else {
                                $scope.feature_stories[i].is_follow = true;
                                $scope.homeFeature_is_follow = true;
                            }
                        }
                    }
                    for (var i = 0; i < $scope.stories.length; ++i) {
                        if($scope.stories[i].user_id === userId){
                            if (data.message === "Unfollowed successfully") {
                                $scope.stories[i].is_follow = false;
                                $('.home-feature .follow-'+userId).addClass("btn-follow").removeClass("btn-following");
                                $('.grid-main .follow-'+userId).addClass("btn-follow").removeClass("btn-following");
                                $('.modal-expanded-story .follow-'+userId).addClass("btn-follow").removeClass("btn-following");
                            }
                            else {
                                $scope.stories[i].is_follow = true;
                                $('.home-feature .follow-'+userId).addClass("btn-following").removeClass("btn-follow");
                                $('.grid-main .follow-'+userId).addClass("btn-following").removeClass("btn-follow");
                                $('.modal-expanded-story .follow-'+userId).addClass("btn-following").removeClass("btn-follow");
                            }
                        }
                    }
                }
            });
        };  
    }
    /***** Change status of follow button: END *****/
    // Show repost modal
    $scope.showRepostStory = function(story_id){
//       headerService.broadcastService("showRepostStoryModal");
        $rootScope.$broadcast('showRepostStoryModal', {story_id : story_id});
    };

    $("body").on('click', function(e) {
        if($("body").hasClass("custom-scroll")){
           $("body").removeClass("custom-scroll");
            $(".cls-header").removeClass("showNotification");
        }

        // hide menu profile
        $(".cls-header").removeClass("showMenuProfile");
        headerService.broadcastService("hideMenuProfile");

    });

    $scope.viewProfile = function(userId) {
        // console.log(userId);
         // $rootScope.$broadcast('viewProfileUser', userId );
        $window.location.href = "#/profile?profileId=" + userId;
        userDetailService.setUserDetails(userId);
    };

 });

// Scroll top when refresh page
    $("html, body").animate({
        scrollTop: 0
    }, 600);

// Change status button
function changeStatus(event) {
    var elementClasses = event.target.classList;

    var isFollowing = elementClasses.contains('btn-following');
    if(isFollowing) {
        $(event.target).addClass("btn-follow");
        $(event.target).removeClass("btn-following");
    }
    else {
        $(event.target).addClass("btn-following");
        $(event.target).removeClass("btn-follow");
    }
};


homeController.controller('HeaderCtrl', function($scope, $window, $timeout, headerService, NotificationService, LogoutApi){
    $scope.login_logout = txtLoginLougout;
    $scope.username = userN;
    $scope.profile_image = avatar;

    $scope.header_state = "default";
    
    $scope.logOut = function() {
        if ($scope.login_logout === "Logout") {
            LogoutApi.query({token: token}, function(data) { 
                if(data.status_code === 200) { 
                    clearCookie('userData');
                    $window.location.href = '/';
                    // $scope.login_logout = "Login/Sign up";
                    // $scope.username = "Login/Sign up";
                    // $scope.profile_image= "../../img/avatar_default.png";
                }
            });
        }
        else {
            $window.location.href = '/login';
        }
    }

    $scope.goToHome = function(){
        $scope.header_state = "default";
        
        // close the current showing modal
        headerService.broadcastService("hideModal");
    };

    $scope.showSearchBar = function(){
        $scope.header_state = "showSearchBar";

        // close the current showing modal
        headerService.broadcastService("hideModal");
        
    };

    $scope.closeSearchBar = function(){
        
        $scope.header_state = "default";
        
    };

    $scope.showCustomModalPage = function(){

        if ( $scope.header_state == "showSubmitStory")
        {
            $scope.header_state = "default";
            // close the current showing modal
            headerService.broadcastService("hideModal");
        }
        else
        {
            $scope.header_state = "showSubmitStory";
            headerService.broadcastService("hideModal");
            headerService.broadcastService("showSubmitModal");
        }

    };
    // when modal Section send "closeSubmitModal" Event
    $scope.$on('closeSubmitModal', function(event) {
        $scope.header_state = "default";
    });

    $scope.number_of_unreads = 0;
    $scope.show_unread = "ng-hide";

    $scope.getNumberOfUnreads = function()
    {
        if(!token)
        {
            return false;
        }
        NotificationService.updateNotificationNumber(token);
    };

    $scope.updateNotificationNumberOnBroadcast = function(){

        $scope.number_of_unreads = NotificationService.getCurrentNotificationCount();

        if( $scope.number_of_unreads > 0)
        {
            $scope.show_unread = "ng-show";
        }
    };

    $scope.$on("getNotificationNumberCompleted", function(event) {

        $scope.updateNotificationNumberOnBroadcast();
    });

    $scope.getNumberOfUnreads();
    
    $scope.showNotification = function(){

        if ( $scope.header_state == "showNotification" ||  $scope.header_state == "showNotification showNotificationMore")
        {
            $scope.header_state = "default";

            headerService.broadcastService("hideNotification");
        }
        else
        {
            $scope.header_state = "showNotification";

            // close the current showing modal
            headerService.broadcastService("hideModal");

            // broadcast showNotification event for mobile view
            headerService.broadcastService("showNotification");
        }
        
    };

    // when Notification Section send "showNotificationMore" Event
    // $scope.$on('showNotificationMore', function(event) {

    //     $scope.header_state = "showNotification showNotificationMore";

    // });

    // Hide modal on menu
    $scope.$on('hideMenuProfile', function(event) {

        $scope.header_state = "default";

    });

    $scope.showMenuProfile = function(){

        if ( $scope.header_state == "showMenuProfile" )
        {
            $scope.header_state = "default";
        }
        else
        {
            $scope.header_state = "showMenuProfile";

            // close the current showing modal
            headerService.broadcastService("hideModal");
        }

    };

    // Show submit story
    $scope.showSubmitStory = function() {
        $('#submitStoryModal').modal({
            backdrop: 'static',
            keyboard: false  // to prevent closing with Esc button (if you want this too)
        });

    }

});


homeController.controller('ModalCtrl', function($scope, headerService){

    $scope.section_state = "default";

    $scope.$on('showSubmitModal', function(event) {

        $scope.section_state = "showSubmitModal";

    });

    $scope.$on('hideModal', function(event) {

        $scope.section_state = "default";

    });

    $scope.closeSubmitModal = function() {

        $scope.section_state = "default";
        // close the current showing modal
        headerService.broadcastService("closeSubmitModal");

    };

});

homeController.controller('NotificationCtrl', function($scope, headerService, NotificationService, $timeout){

    $scope.section_state = "default";

    $scope.$on('hideNotification', function(event) {

        $scope.section_state = "default";
    });

    $scope.$on('hideModal', function(event) {

        $scope.section_state = "default";

    });

    $scope.notifications = [];

    $scope.$on('showNotification', function(event) {
        if(!token)
        {
            return false;
        }

        $scope.section_state = "showNotification";

        if($("body").hasClass("custom-scroll"))
        {
            $("body").addClass("custom-scroll");
        }
        $(".load-more").addClass("show");

        $scope.notifications = NotificationService.getCurrentNotifications();

        if($scope.notifications.length <= 0)
        {
            // get more notifications
            NotificationService.getNotifications(token);
        }
    });

    $scope.$on('getNotificationsCompleted', function(event) {
        updateNotifications();
    });

    // $scope.showNotificationMore = function(event)
    // {
    //     $scope.section_state = "showNotification showNotificationMore";
    //     headerService.broadcastService("showNotificationMore");

    // };

    $scope.showNoNotification = "ng-hide";

    // load more notification
    function updateNotifications()
    {
        $scope.notifications = NotificationService.getCurrentNotifications();
        $(".load-more").removeClass("show");
        //$scope.$apply();

        if( $scope.notifications.length <= 0 )
        {
            $scope.showNoNotification = "ng-show";
        }
        else if ($scope.notifications.length <= 5)
        {
            //$scope.scroll.scrollbarConfig.setHeight = 200;
            
            $timeout(function() {
                $scope.updateScrollbar('setHeight', 200);
            });
        }
        else
        {
            //$scope.scroll.scrollbarConfig.setHeight = 500;
            // $timeout(function() {
            //     $scope.updateScrollbar('setHeight', 500);
            // });

            $("#notifications").mCustomScrollbar("update");
        }
        $scope.loading = "false";

        //$scope.scroll.scrollbarConfig.setHeight = 300;

        console.log($scope.notifications);
    }

    $scope.loading = "false";

    $scope.scroll = {
        scrollbarConfig: {
            callbacks: {
                onScroll: function () {
                    //
                },
                whileScrolling: function() {
                    if(this.mcs.topPct == 100)
                    {
                        if ( $scope.loading == "false")
                        {
                            $scope.loading = "true";
                            $(".load-more").addClass("show");
                            NotificationService.getNotifications(token);

                            $timeout(function(){
                                updateNotifications();
                                $scope.loading = "false";
                            }, 500);
                        }
                    }
                },
                onUpdate: function() {
                    if( typeof window.giang == typeof undefined )
                    {
                        window.giang = 0;
                    }
                    else
                    {
                        window.giang++;
                    }

                    console.log("giag:" + window.giang);
                }
            },
            setHeight: 500
        },
        scrollbarUpdate: null // set by directive
    };

    // var app = angular.module('app', ['ngScrollbars']);
    //     app.config(function (ScrollBarsProvider) {
    //         ScrollBarsProvider.defaults = {
    //             autoHideScrollbar: false,
    //             setHeight: 200,
    //             scrollInertia: 500,
    //             theme: 'dark',
    //             axis: 'yx',
    //             advanced: {
    //                 updateOnContentResize: true
    //             },
    //             scrollButtons: {
    //                 scrollAmount: 'auto', // scroll amount when button pressed
    //                 enable: true // enable scrolling buttons by default
    //             }
    //         };
    //     });

        // app.controller('mainCtrl', function ($scope) {

        //     function scrollTo(topPX, elementPosition) {
        //         // can replace 'scrollTo' with other Malihu methods like
        //         // 'update', 'stop', 'destroy'
        //         // see http://manos.malihu.gr/jquery-custom-content-scroller/#methods-section
        //         $scope.elements[elementPosition].updateScrollbar('scrollTo', topPX);
        //     }

        //     // only for demo purposes
        //     function updateStatsDisplay(position, mcs) {
        //         $scope.elements[position].mcs = {
        //             top: mcs.top,
        //             draggerTop: mcs.draggerTop,
        //             topPct: mcs.topPct,
        //             direction: mcs.direction
        //         }
        //         $scope.$apply();
        //     }

        //     $scope.elements = [{
        //         title: 'Element 0',
        //         scrollbarConfig: {
        //             callbacks: {
        //                 onScroll: function () {
        //                     scrollTo(this.mcs.top, 1, {
        //                         scrollInertia: 600
        //                     });
        //                     updateStatsDisplay(0, this.mcs);
        //                 },
        //                 whileScrolling: function() {
        //                     updateStatsDisplay(1, this.mcs);
        //                 }
        //             }
        //         },
        //         scrollbarUpdate: null // set by directive
        //     }, {
        //         title: 'Element 1',
        //         scrollbarConfig: {
        //             callbacks: {
        //                 onScroll: function () {
        //                     scrollTo(this.mcs.top, 0, {
        //                         scrollInertia: 600
        //                     });
        //                     updateStatsDisplay(1, this.mcs);
        //                 },
        //                 whileScrolling: function() {
        //                     updateStatsDisplay(1, this.mcs);
        //                 }
        //             }
        //         },
        //         scrollbarUpdate: null // set by directive
        //     }];

        // });
});

// This is an Service Factory that allow Controllers to interact with others
homeController.factory('headerService', function( $rootScope) {
    
    var headerService = {};

    headerService.broadcastService = function(serviceName) {
        $rootScope.$broadcast( serviceName );
    };

    return headerService;
});

homeController.directive('scrollTrigger', function($window) {
    return {
        link : function(scope, element, attrs) {
            var offset = parseInt(attrs.threshold) || 0;
            var e = jQuery(element[0]);
            var doc = jQuery(document);
            angular.element(document).bind('scroll', function() {
                if (doc.scrollTop() + $window.innerHeight + offset > e.offset().top) {
                    scope.$apply(attrs.scrollTrigger);
                }
            });
        }
    };
});


// make configuration for scrollBar
homeController.config( function (ScrollBarsProvider) {
    
    ScrollBarsProvider.defaults = {

        axis: 'y', // enable vertical scroller
        advanced:{

            updateOnContentResize: true
        },
        setHeight: 500,
        scrollButtons: {
            enable: false // enable scrolling buttons by default
        },
    };

});

// Expanded Story
homeController.controller('StoryCtrl', function($scope, headerService, $rootScope, ServiceGridItem, GetUserLikeList, GetUserFollowUserList, 
    GetStoriesApi, GetHomeStoriesApi, storyDataService){
    
    $scope.imageLike = "../../img/icon_dislike.png";
    $scope.imageComment = "../../img/icon_no_comment.png";
    $scope.imageRepost = "../../img/icon_disrepost.png";

    $("#sliderContent").addClass("cls-display-block");
    $("#gridImageContent").addClass("cls-display-none");
    $("#gridVideoContent").addClass("cls-display-none");
    $scope.active_single = "active";
    $scope.active_gallery = "";
    $scope.gallery_state = "";
    $scope.is_owner = 'false';
    $scope.story_type = '';
    $scope.showComment = true;
    setTimeout(function(){
        $scope.stories = storyDataService.getStory();
        $scope.feature_stories = storyDataService.getFeaturedStory();
    }, 1000);
    
    //expanded story
    $scope.$on('showStoryModal', function(event, args) {
        $scope.text_state = "";
        $scope.hide_state = "";
        $scope.showComment = true;  
        $scope.story = [], $scope.slides = [];
        for (var i = 0; i < $scope.stories.length; i++) {
            if ($scope.stories[i].id == args.story_id) {
                $scope.story = $scope.stories[i];
                $scope.images = $scope.stories[i].images;
                $scope.youtube_link = $scope.stories[i].youtube_link;
                $scope.is_owner = $scope.stories[i].is_owner;
                $scope.story_type = $scope.stories[i].story_type;
                $scope.hospital_name = $scope.stories[i].hospital_name;
                $scope.des = $scope.stories[i].story_description;
                break;
            }
        }

        $("#sliderContent").removeClass("cls-display-none").addClass("cls-display-block");
        $("#gridVideoContent").removeClass("cls-display-block").addClass("cls-display-none");
        $("#gridImageContent").removeClass("cls-display-block").addClass("cls-display-none");

        //check hospital_name == null to remove line
        if ($scope.hospital_name == null) {
            $( "div" ).remove( ".line-separator.after" );
        }

        // add image for slider
        if ($scope.story_type === 'video') {
            $scope.youtube_id = extractVideoID($scope.youtube_link);
            $scope.video = [{'is_video': true, 'link_video': $scope.youtube_link, 'image_url': 'http://i3.ytimg.com/vi/' + $scope.youtube_id +'/hqdefault.jpg', 
            'des': ''}];
            if ($scope.images != []) {
                for (var i = 0; i < $scope.images.length; i++) {
                    $scope.video.push({'is_video': false, 'link_video': "", "image_url": $scope.images[i].image_url, 'des': $scope.des});
                }
                $scope.slides = $scope.video;
            }
            else {
                $scope.slides = $scope.video;
            }
        }
        else if($scope.story_type == 'text') {  
            $scope.text_state = "cls-display-none";
            $scope.hide_state = "cls-display-none";
        } 
        else {
            for (var i = 0; i < $scope.images.length; i++) {
                    $scope.slides.push({'is_video': false, 'link_video': "", "image_url": $scope.images[i].image_url, 'des': $scope.des});
            }
        }

        // Check total image to show/hide gallery mode
        if($scope.slides.length < 3)
        {
            $scope.hide_state = "cls-display-none";
        }
    });

    $scope.$on('showStoryModalChange', function(event) {
        $("#sliderContent").removeClass("cls-display-none").addClass("cls-display-block");
        $("#gridVideoContent").removeClass("cls-display-block").addClass("cls-display-none");
        $("#gridImageContent").removeClass("cls-display-block").addClass("cls-display-none");
        $scope.active_single = "active";
        $scope.active_gallery = "";
    });

    $scope.showStoryModal = function(){
        headerService.broadcastService("showStoryModalChange");
    }

    $scope.showStoryGalleryModal = function(){
        headerService.broadcastService("showStoryGalleryModal");
    }

    $scope.showReportModal = function( story_id ){
         //headerService.broadcastService("showReportModal", {user_id : user_id, story_id : story_id});
          $rootScope.$broadcast('showReportModal', { story_id : story_id });
    }

    $scope.showDeleteStoryModal = function(story_id){
         // headerService.broadcastService("showDeleteStoryModal");
         $rootScope.$broadcast('showDeleteStoryModal', {story_id : story_id});
    }

    $scope.$on('showStoryGalleryModal', function(event) {
        $("#sliderContent").removeClass("cls-display-block").addClass("cls-display-none");
        if($scope.is_video == 'true') {
            $("#gridVideoContent").removeClass("cls-display-none").addClass("cls-display-block");
        }
        else {
            $("#gridImageContent").removeClass("cls-display-none").addClass("cls-display-block");
        }
        $scope.active_single = "";
        $scope.active_gallery = "active";
        addSwipe();
    });

    $scope.closeExpandedStory = function () {
       $("#expandedStoryModal").removeClass("fade").modal("hide");
       $scope.direction = 'left';
       $scope.currentIndex = 0;
       $scope.active_single = "active";
       $scope.active_gallery = "";
    }

    $scope.showHideComment = function () {
        $scope.showComment = $scope.showComment ? false : true;
    }

    // js for slider
    $scope.direction = 'left';
    $scope.currentIndex = 0;

    $scope.setCurrentSlideIndex = function (index) {
        $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
        $scope.currentIndex = index;
    };

    $scope.isCurrentSlideIndex = function (index) {
        return $scope.currentIndex === index;
    };

    $scope.prevSlide = function () {
        $scope.direction = 'left';
        $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
    };

    $scope.nextSlide = function () {
        $scope.direction = 'right';
        if ($scope.slides.length > 1) {
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
        }
    };

    // Show Lightbox view
    $scope.showLightbox = function(slide) {
        $rootScope.$broadcast('showLightboxModal', { slide: slide });
    }

    // Change number like
    if (userIdLogin === 0) {

    }
    else {
        var total_like , is_liked;
        $scope.changeNumberLike = function(story_id) {
            var initialData = storyDataService.changeLike( userIdLogin, story_id );
            $scope.stories = initialData.Stories;
            $scope.feature_stories = initialData.FeaturedStories;
            setTimeout(function() {
                for (var i = 0; i < $scope.feature_stories.length; i++) {
                    if ($scope.feature_stories[i].id === story_id) {
                        is_liked = $scope.feature_stories[i].is_liked;
                        total_like = $scope.feature_stories[i].total_like;
                        $rootScope.$broadcast('changeLikes', {total_like : total_like, is_liked: is_liked});
                    };
                }
            }, 350);
        }
    }

    /***** Change status of follow button: START *****/
    $scope.changeStatus = function(event, userId){ 
        $user_login = userIdLogin;
        // var elementClasses = event.target.classList;
        GetUserFollowUserList.query({user_id: $user_login, user_following_id: userId}, function(data) {
            if(data.status_code === 200) {
                for (var i = 0; i < $scope.feature_stories.length; ++i) {
                    if($scope.feature_stories[i].user_id === userId){
                        if (data.message === "Unfollowed successfully") {
                            $scope.feature_stories[i].is_follow = false;
                            $scope.homeFeature_is_follow = false;
                        }
                        else {
                            $scope.feature_stories[i].is_follow = true;
                            $scope.homeFeature_is_follow = true;
                        }
                    }
                }
                for (var i = 0; i < $scope.stories.length; ++i) {
                    if($scope.stories[i].user_id === userId){
                        if (data.message === "Unfollowed successfully") {
                            $scope.stories[i].is_follow = false;
                            $('.home-feature .follow-'+userId).addClass("btn-follow").removeClass("btn-following");
                            $('.grid-main .follow-'+userId).addClass("btn-follow").removeClass("btn-following");
                            $('.modal-expanded-story .follow-'+userId).addClass("btn-follow").removeClass("btn-following");
                        }
                        else {
                            $scope.stories[i].is_follow = true;
                            $('.home-feature .follow-'+userId).addClass("btn-following").removeClass("btn-follow");
                            $('.grid-main .follow-'+userId).addClass("btn-following").removeClass("btn-follow");
                            $('.modal-expanded-story .follow-'+userId).addClass("btn-following").removeClass("btn-follow");
                        }
                    }
                }
            }
        });
    };  
    /***** Change status of follow button: END *****/

    // Show repost modal
    $scope.showRepostStory = function(story_id){
        $rootScope.$broadcast('showRepostStoryModal', {story_id : story_id});
    };

    function addSwipe() {
        var swiper = new Swiper('#swiperImageExpanded', {
                pagination: '.swiper-pagination',
                slidesPerView: 2,
                slidesPerColumn: 2,
                paginationClickable: true,
                spaceBetween: 15
            });
    };

});

homeController.animation('.slide-animation', function () {
    return {
        beforeAddClass: function (element, className, done) {
            var scope = element.scope();

            if (className == 'ng-hide') {
                var finishPoint = element.parent().width();
                if(scope.direction !== 'right') {
                    finishPoint = -finishPoint;
                }
                TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
            }
            else {
                done();
            }
        },
        removeClass: function (element, className, done) {
            var scope = element.scope();

            if (className == 'ng-hide') {
                element.removeClass('ng-hide');

                var startPoint = element.parent().width();
                if(scope.direction === 'right') {
                    startPoint = -startPoint;
                }

                TweenMax.fromTo(element, 0.5, { left: startPoint }, {left: 0, onComplete: done });
            }
            else {
                done();
            }
        }
    };
});

homeController.controller('SubmitStoryCtrl', function($scope, $rootScope, $window, GetHospitalApi, InsertStoryApi, storyDataService){

    // general variable: to reset
    $scope.master = {};
    $scope.showMsgErrorImage = false;
    $scope.msgError = "";
    /*** Upload, show, remove photo***/
    //declare variable for default photo
    $scope.photo0 = {'isset': false, 'src': '../../img/demo_img_preview.png', 'width': '', 'height': '' };
    $scope.photo1 = {'isset': false, 'src': '../../img/demo_img_preview.png', 'width': '', 'height': '' };
    $scope.photo2 = {'isset': false, 'src': '../../img/demo_img_preview.png', 'width': '', 'height': '' };
    $scope.photo3 = {'isset': false, 'src': '../../img/demo_img_preview.png', 'width': '', 'height': '' };
    $scope.photo4 = {'isset': false, 'src': '../../img/demo_img_preview.png', 'width': '', 'height': '' };
    $scope.photo5 = {'isset': false, 'src': '../../img/demo_img_preview.png', 'width': '', 'height': '' };

    //add photo to list: when choose photo
    $scope.addImgToList = function(imgSrc){
        for (var i = 0; i < 6; i++)
        {
            if ( !$scope["photo" + i].isset )
            {
                $scope["photo" + i].isset = true;
                $scope["photo" + i].src = imgSrc;
                break;
            }
        }
    }

    //count photo in array
    $scope.countImgInArray = function(){
        for (var i = 0; i < 6; i++)
        {
            if ( !$scope["photo" + i].isset )
            {
                return i;
                break;
            }
        }
        return i;
    }

    //reset array
    $scope.refreshImgArray = function(){
        for (var i = 0; i < 6; i++)
        {
            $scope["photo" + i].isset = false;
            $scope["photo" + i].src = '../../img/demo_img_preview.png';
        }
    }

    //choose secondary...: update array
    $scope.updateImgArray = function(){
        var array_photos = [];
        for (var i = 0; i < 6; i++)
        {
            if ( $scope["photo" + i].isset )
            {
                array_photos.push( $scope["photo" + i].src);
            }
        }
        $scope.refreshImgArray();
        if (array_photos.length > 0)
        {
            $.each(array_photos, function(i, e){
                $scope.addImgToList(e);
            });
        }
    }

    //delete photo: when click to image
    $scope.deleteImg = function(i){
        $scope["photo" + i].isset = false;
        $scope.updateImgArray();
    }

    var message = "";
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

    //upload photo and show
    $scope.imageUpload = function(event){
        if(window.File && window.FileList && window.FileReader)
        {
            var files = event.target.files; //FileList object
            if ( files.length > (6 - $scope.countImgInArray()) ) {
                // message = "Number of your images were not uploaded, you can only upload 6 images with a story.";
                // $scope.showError(message);
                $scope.$apply(function() {
                    $scope.showMsgErrorImage = true;
                    $scope.msgError = "Number of your images were not uploaded, you can only upload 6 images with a story.";
                });
            }
            else {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if(file.type.match('image.*')) {
                        if(file.size < 2097152){
                            $scope.showMsgErrorImage = false;
                            var reader = new FileReader();
                            reader.onload = $scope.imageIsLoaded; 
                            reader.readAsDataURL(file);
                        }
                        else
                        {
                            // message = "Number of your images were not uploaded. Please keep all images 2MB or smaller.";
                            // $scope.showError(message);
                            $scope.$apply(function() {
                                $scope.showMsgErrorImage = true;
                                $scope.msgError = "Number of your images were not uploaded. Please keep all images 2MB or smaller.";
                            });
                        }
                    }
                    else
                    {
                        message = "You can only upload image file.";
                        $scope.showError(message);
                        // $scope.showMsgErrorImage_images = true;
                    }
                }
            }
        }
        else
        {
            message = "Your browser does not support File API";
            $scope.showError(message);
        }
    }

    //upload photo and show
    $scope.imageIsLoaded = function(e){
        $scope.$apply(function() {
            $scope.addImgToList(e.target.result); 
        });
    }
    /*** Upload, show, remove photo***/

    /***autocomplete hospital***/
    //Api get hospital list
    $scope.hospitalList = GetHospitalApi.query(function(data) {
        $scope.hospitalList = data.data;
        $name_hospital = [];
        for (var i = 0; i < $scope.hospitalList.length; i++) {
            $name_hospital.push($scope.hospitalList[i].hospital_name);
        }
        //autocomplete hospital
        $scope.completeHospital = function(){
            $( "#hospital_autocomplete" ).autocomplete({
                source: $name_hospital,
                open: function(event, ui) {
                    //$('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
                    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                        $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
                    }
                }
            });

            $("#hospital_autocomplete").autocomplete( "option", "appendTo", ".createStoryForm" );
        }
    })
    /***autocomplete hospital***/

    //clear data, set value to default
    $scope.setSubmitFormDefault = function() {
        $scope.story = angular.copy($scope.master);
        $scope.createStoryForm.$setPristine();
        $scope.showMsg = false;
        $('#hospital_autocomplete').val("");
        $scope.refreshImgArray();
    };

    // Show Submit Story Success
    var photos = [];
    $scope.showSubmitStorySuccess = function(story) {
        for (var i = 0; i < 6; i++) {
            if ($scope["photo" + i].isset) {
                photos.push($scope["photo" + i].src);
            }
        }
        $scope.hospital_name = $('#hospital_autocomplete').val();
    }

    //show message to inform invalid of form
    $scope.showMsg = false;
    $scope.showMsgInvalidForm = function() {
        $scope.showMsg = true;
    }

    //submit story with non-anonumously
    $scope.submitMyStory = function(story) {
        if (userIdLogin === 0 ) {
            //do some thing
        }
        else {
            $scope.showSubmitStorySuccess(story);
            $scope.is_anonymously = false;

            storyDataService.submitStory(story.title, story.description, story.link_video, $scope.hospital_name, 
            userIdLogin, $scope.is_anonymously, photos ).then(function(response) {
                $(".lbl-link.link-share").text(response);
                $("#submitStoryModal").removeClass("fade").modal("hide");
                $("#submitStorySuccess").modal("show").addClass("fade");
                $scope.setSubmitFormDefault();
             }, function (error) {
                console.log('error');
            });
        }
    }

     //submit story with non-anonumously
    $scope.submitAnonymously = function(story) {
        if (userIdLogin === 0 ) {
            //do some thing
            // console.log("do some thing");
        }
        else {
            $scope.showSubmitStorySuccess(story);
            $scope.is_anonymously = true;

            storyDataService.submitStory(story.title, story.description, story.link_video, $scope.hospital_name, 
            userIdLogin, $scope.is_anonymously, photos ).then(function(response) {
                $(".lbl-link.link-share").text(response);
                $("#submitStoryModal").removeClass("fade").modal("hide");
                $("#submitStorySuccess").modal("show").addClass("fade");
                $scope.setSubmitFormDefault();
             }, function (error) {
                console.log('error');
            });
        }
    }
});

homeController.controller('LightboxCtrl', function($scope){
    
    $scope.lightbox_state = "default";
    $scope.lightbox_video_state = "default";
    $scope.$on('showLightboxModal', function(event, args) {
        $scope.des = args.slide.des;
        if(args.slide.is_video) {
            // $scope.description = 
            var url = "";
            $scope.lightbox_video_state = "show-modal";
            if (args.slide.link_video.indexOf("https://youtu.be/") != -1) {
                url = "https://www.youtube.com/embed/" + args.slide.link_video.slice(17);
            }
            else if (args.slide.link_video.indexOf("http://youtu.be/") != -1) {
                url = "https://www.youtube.com/embed/" + args.slide.link_video.slice(16);
            }
            else {
                url = args.slide.link_video.replace("watch?v=", "embed/");
            }
            document.getElementById('video').src= url;
        }
        else {
            $scope.lightbox_state = "show-modal";
            $scope.image_url = args.slide.image_url;
            //$(".img-lightbox").css("max-height", $(window).height() - 90);
        }
    });

    // Close Lightbox modal
    $scope.closeLightbox = function() {
        $scope.lightbox_state = "default";
        $scope.content_status = "hide-more";
    }

    // Close Lightbox video modal
    $scope.closeLightboxVideoModal = function() {
        $scope.lightbox_video_state = "default";
        //document.getElementById('video').src='http://www.youtube.com/embed/2-uVqsfcqXw';
    }

    $scope.content_status = "hide-more";

    $scope.showMore = function() {
        $scope.content_status = "show-more";
    }

});

homeController.controller('ReportCtrl', function($scope, GetReasonReportApi, storyDataService){
    
    $scope.report_state = "default";
    $scope.$on('showReportModal', function(even, args) {
        if (userIdLogin === 0) {

        }
        else {
            $scope.report_state = "show-modal";
            $scope.master = "";

            //Expanded Story - Report Story: send report with Api
            $scope.sendReport = function(reportTxtArea) {
                //get checkbox reason of report
                $gchk = [];
                $.each($(".grp-checkbox .chk-report.md-checked"), function() {
                  $gchk.push($(this).attr("id"));
                });
                var initialData = storyDataService.reportStories(userIdLogin, args.story_id, 
                    $gchk.join(", "), reportTxtArea, token);
                $scope.stories = initialData.Stories;
                $scope.report_state = "default";
                $("textarea.txt-report-area").val("");
                $(".grp-checkbox .chk-report.md-checked").removeClass("md-checked");
                if (initialData.isDelStories) {
                    $("#expandedStoryModal").removeClass("fade").modal("hide");
                    $scope.direction = 'left';
                    $scope.currentIndex = 0;
                    $scope.active_single = "active";
                    $scope.active_gallery = "";
                }
            }
        }
    });

    //Expanded Story - Report Story: Call API to show reason
    GetReasonReportApi.query({token: token},function(data) {
        $scope.report_reason = data.data.report_type;
    });

    // Close Report modal
    $scope.closeReportModal = function() {
        $scope.report_state = "default";
        $("textarea.txt-report-area").val("");
        $(".grp-checkbox .chk-report.md-checked").removeClass("md-checked");
    }
});

homeController.controller('DeleteStoryCtrl', function($scope, $window, storyDataService){
    
    $scope.delete_story_state = "default";
    $scope.$on('showDeleteStoryModal', function(event, args) {
        $scope.delete_story_state = "show-modal";

        $scope.deleteStory = function() {
            storyDataService.deleteStories( args.story_id );
            $scope.delete_story_state = "default";
            $("#expandedStoryModal").removeClass("fade").modal("hide");
            $scope.direction = 'left';
            $scope.currentIndex = 0;
            $scope.active_single = "active";
            $scope.active_gallery = "";
        }
    });

    // Close delete modal
    $scope.closeDeleteStoryModal = function() {
        $scope.delete_story_state = "default";
    }

});

homeController.controller('repostStoryCtrl', function($scope, $rootScope, $window, headerService, GetStoryByIdApi, RepostStoryApi, storyDataService){

    $scope.repost_story_state = "default";
    $scope.$on('showRepostStoryModal', function(event, args) {
        $scope.storyId = args.story_id;
        if(userIdLogin !== 0){
            GetStoryByIdApi.query({user_id: userIdLogin,story_id: $scope.storyId},function(data){
                if(data.status_code === 200){
                    $scope.avatar = avatar;
                    $scope.userName = userN;
                    $scope.storyImage = data.data[0].images[0].image_url;
                    $scope.postUserName = data.data[0].name;
                    $scope.postUserAvata = data.data[0].profile_image_url;
                    $scope.storyDescription = data.data[0].story_description;
                }
            });
        }
        else {
            $window.location.href = "/login";
        }
        $scope.repost_story_state = "show-modal";
        $("body").addClass("custom-modal-open");
    });

    // Close Report modal
    $scope.closeRepostStoryModal = function() {
        $scope.repost_story_state = "default";
        $("body").removeClass("custom-modal-open");
    }
    
    // Repost button click
    $scope.repostStory = function() {
        RepostStoryApi.query({user_id: userIdLogin,story_id: $scope.storyId},function(data){
            if(data.status_code === 200){
                $rootScope.$broadcast('showRepostThanksModal', {repostLink : data.data.share_url});
                $scope.repost_story_state = "default";
            }else{
                $scope.closeRepostStoryModal();
            }
        });
    }

});

homeController.controller('repostThanksCtrl', function($scope, $window){

    $scope.repost_thanks_state = "default";
    $scope.$on('showRepostThanksModal', function(event, args) {
        $scope.repostLink = args.repostLink;
        $scope.repost_thanks_state = "show-modal";
    });

    // Close Report modal
    $scope.closeRepostThanksModal = function() {
        $scope.repost_thanks_state = "default";
        $("body").removeClass("custom-modal-open");
    }

});

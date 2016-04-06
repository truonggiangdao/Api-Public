'use strict';

/* Services */

var homeService = angular.module('homeService', ['ngResource']);

var API_URL = "http://medtales-api.success-ss.com.vn:8092/api/";

homeService.factory('GridItems', ['$resource',
  function($resource){
    return $resource('../../app/data/grid-items.json', {}, {
      query: {method:'GET', params:{}, isArray:true}
    });
  }]);

homeService.factory('GridProfileData', ['$resource',
  function($resource){
    return $resource('../../app/data/grid-profile-data.json', {}, {
      query: {method:'GET', params:{}, isArray:true}
    });
  }]);

homeService.factory('GridPostData', ['$resource',
  function($resource){
    return $resource('../../app/data/grid-post-data.json', {}, {
      query: {method:'GET', params:{}, isArray:true}
    });
  }]);

homeService.factory('GridRepostData', ['$resource',
  function($resource){
    return $resource('../../app/data/grid-repost-data.json', {}, {
      query: {method:'GET', params:{}, isArray:true}
    });
  }]);

homeService.factory('GetUserFollowerList', ['$resource',
  function($resource){
    return $resource('../../app/data/user-followers.json', {}, {
      query: {method:'GET', params:{}, isArray:false}
    });
  }]);

homeService.factory('GetUserLikeList', ['$resource',
  function($resource){
    return $resource(API_URL + 'UserLike', {}, {
      query: {method:'POST', params:{}, isArray:false}
    });
  }]);

homeService.factory('GetUserFollowUserList', ['$resource',
  function($resource){
    return $resource(API_URL + 'UserFollowing', {}, {
      query: {method:'POST', params:{}, isArray:false}
    });
  }]);

homeService.factory('GetHomeStoriesApi', ['$resource',
  function($resource){
    return $resource(API_URL + 'Stories/GetHomeStories', {}, {
      query: {method:'GET', params:{}, isArray:false}
    });
  }]);

homeService.factory('GetStoriesApi', ['$resource',
  function($resource){
    return $resource(API_URL + 'Stories/GetStories', {}, {
      query: {method:'GET', params:{}, isArray:false}
    });
  }]);

homeService.factory('GetReasonReportApi', ['$resource',
  function($resource){
    return $resource(API_URL + 'ReportStory/Create', {}, {
      query: {method:'GET', params:{}, isArray:false}
    });
  }]);

homeService.factory('PostReportApi', ['$resource',
  function($resource){
    return $resource(API_URL + 'ReportStory/Create', {}, {
      query: {method:'POST', params:{}, isArray:false}
    });
  }]);

homeService.factory('DelStoryApi', ['$resource',
  function($resource){
    return $resource(API_URL + 'Stories/:story_id', {}, {
      query: {method:'DELETE', params:{}, isArray:false}
    });
  }]);

homeService.factory('InsertStoryApi', ['$resource',
  function($resource){
    return $resource(API_URL + 'Stories/Create', {}, {
      query: {method:'POST', params:{}, isArray:false}
    });
  }]);

homeService.factory('GetHospitalApi', ['$resource',
  function($resource){
    return $resource(API_URL + 'Hospitals', {}, {
      query: {method:'GET', params:{}, isArray:false}
    });
  }]);

homeService.factory('GetUserProfile', ['$resource',
  function($resource){
    return $resource(API_URL + 'Profile', {}, {
      query: {method:'POST', params:{}, isArray:false}
    });
  }]);

homeService.factory('ResetPassApi', ['$resource',
  function($resource){
    return $resource(API_URL + 'UpdatePassword', {}, {
      query: {method:'POST', params:{}, isArray:false}
    });
  }]); 

homeService.factory('LogoutApi', ['$resource',
  function($resource){
    return $resource(API_URL + 'Logout', {}, {
      query: {method:'POST', params:{}, isArray:false}
    });
  }]);

homeService.factory('GetStoryByIdApi', ['$resource',
  function($resource){
    return $resource(API_URL + 'Stories/GetStoryById', {}, {
      query: {method:'GET', params:{}, isArray:false}
    });
  }]);

homeService.factory('RepostStoryApi', ['$resource',
    function($resource){
        return $resource(API_URL + 'Stories/RepostStory', {}, {
            query: {method:'POST', params:{}, isArray:false}
        });
    }]);

homeService.factory("NotificationApi", ['$resource',
    function($resource){
        return $resource(API_URL + 'Notifications', {}, {
            query: {method:'POST', params:{}, isArray:false}
        });
    }]
);

homeService.service('ServiceGridItem', function (GridItems) {
        this.data = GridItems.query();
});

homeService.factory('NotificationService', function( NotificationApi, headerService, $q ) {

    var NotificationService = {};

    NotificationService.notifications_number = 0;

    NotificationService.notifications = [];

    NotificationService.hasNotification = true;

    // get latest notification number from api
    NotificationService.updateNotificationNumber = function(token){
        if(!token)
        {
            NotificationService.notifications_number = 0;

            NotificationService.notifications = [];

            return NotificationService.notifications_number;
        }
        NotificationApi.query({token: token, page_index: 0, page_size_first: 0, page_size_more: 0},

            function(data){
                if (data.status_code === 200) {

                    // console.log(data.data.unread_count);

                    if(data.data.unread_count > 0)
                    {
                        NotificationService.notifications_number = data.data.unread_count;
                    }
                    else
                    {
                        NotificationService.notifications_number = 0;
                    }
                }
                else
                {
                    console.log("Got errors while getting Notifications!");
                }
                headerService.broadcastService("getNotificationNumberCompleted");
            }
        );
        return NotificationService.notifications_number;
    };

    NotificationService.getCurrentNotificationCount = function ()
    {
        return NotificationService.notifications_number;
    };

    NotificationService.getCurrentNotifications = function ()
    {
        return NotificationService.notifications;
    };

    NotificationService.GetNotificationReadyForViewing = function(notifs)
    {
        for (var i = 0; i < notifs.length; i++)
        {
            NotificationService.notifications.push(notifs[i]);
        }
        headerService.broadcastService("getNotificationsCompleted");
    };

    // get notifications from apis
    NotificationService.InitNotificationParams = function()
    {
        NotificationService.pIndex = 1;
        NotificationService.pFirst = 15;
        NotificationService.pMore  = 3;

        NotificationService.notifications_number = 0;
        NotificationService.notifications = [];
    };
    NotificationService.InitNotificationParams();

    NotificationService.readyForGetNewNotification = true;

    NotificationService.getNotifications = function(token){
        console.log("hrere");
        if(!token)
        {
            NotificationService.InitNotificationParams();
            headerService.broadcastService("getNotificationsCompleted");
            return;
        }

        if( NotificationService.readyForGetNewNotification )
        {
            NotificationService.readyForGetNewNotification = false;

            NotificationApi.query({token: token, page_index: NotificationService.pIndex, 
            page_size_first: NotificationService.pFirst, page_size_more: NotificationService.pMore},

                function(data){
                    if (data.status_code === 200) {
                        // reset counter
                        if(typeof data.data.unread_count != typeof undefined)
                        {
                            if( data.data.unread_count > 0)
                            {
                                NotificationService.notifications_number = data.data.unread_count;
                            }
                            else
                            {
                                NotificationService.notifications_number = 0;
                            }
                        }

                        // push new notification
                        if(typeof data.data.notifications != typeof undefined)
                        {
                            if( data.data.notifications.length > 0 )
                            {
                                if((NotificationService.pIndex === 1 && data.data.notifications.length < NotificationService.pFirst) 
                                || (NotificationService.pIndex > 1 && data.data.notifications.length < NotificationService.pMore))
                                {
                                    NotificationService.hasNotification = false;
                                }
                                else
                                {
                                    NotificationService.pIndex = NotificationService.pIndex+1;
                                }

                                NotificationService.GetNotificationReadyForViewing(data.data.notifications);
                            }
                            else
                            {
                                NotificationService.hasNotification = false;
                                console.log("No new Notifications from  API!");
                                headerService.broadcastService("getNotificationsCompleted");
                            }
                        }
                    }
                    else
                    {
                        console.log("Got errors while getting Notifications!");
                        headerService.broadcastService("getNotificationsCompleted");
                    }

                    NotificationService.readyForGetNewNotification = true;
                }
            );
        }
        return NotificationService.notifications_number;
    };

    // return this so that other app can use it
    return NotificationService;
});

homeService.factory('storyDataService', function( GetHomeStoriesApi, GetStoriesApi, DelStoryApi, PostReportApi, InsertStoryApi, GetStoryByIdApi, 
  GetUserLikeList, $q ) {
    var pageIndex = 1;
    var pageSizeFirst = 32;
    var pageSizeMore = 8;

    var storyDataService = {};

    storyDataService.publicFeed = {};

    storyDataService.publicFeed.FeaturedStories = [];

    storyDataService.publicFeed.Stories = [];

    storyDataService.publicFeed.StoriesLoadMore = [];

    storyDataService.publicFeed.exitData = true;

    storyDataService.publicFeed.isDelStories = false;

    //First load
    storyDataService.getData = function( userId ){
      GetHomeStoriesApi.query(
        {user_id: userId, page_index: pageIndex, page_size_first: pageSizeFirst, page_size_more: pageSizeMore},
        function(data){
          if (data.status_code === 200) {
            //set stories in home feed
            storyDataService.publicFeed.StoriesLoadMore = storyDataService.addImageOfYoutube( data.data.stories );
            for (var i = 0; i < 16; i++) {
              storyDataService.publicFeed.Stories.push(storyDataService.publicFeed.StoriesLoadMore[0]);
              storyDataService.publicFeed.StoriesLoadMore.splice(0,1);
            };

            //set stories in home slide
            storyDataService.publicFeed.FeaturedStories = storyDataService.addImageOfYoutube( data.data.feature_stories );
          }
        }
      );
      return storyDataService.publicFeed;
    };

    //load more
    storyDataService.loadMore = function( userId ) {

      if (storyDataService.publicFeed.StoriesLoadMore.length >= 8) {
        for (var i = 0; i < 8; i++) {
          storyDataService.publicFeed.Stories.push(storyDataService.publicFeed.StoriesLoadMore[0]);
          storyDataService.publicFeed.StoriesLoadMore.splice(0,1);
        };
      }
      else if (storyDataService.publicFeed.StoriesLoadMore.length < 8 && storyDataService.publicFeed.StoriesLoadMore.length > 0) {
        for (var i = 0; i < storyDataService.publicFeed.StoriesLoadMore.length; i++) {
          storyDataService.publicFeed.Stories.push(storyDataService.publicFeed.StoriesLoadMore[0]);
          storyDataService.publicFeed.StoriesLoadMore.splice(0,1);
        };
      }
      else {
        storyDataService.publicFeed.exitData = false;
      }

      pageIndex = pageIndex + 1;
      GetStoriesApi.query({user_id: userId, page_index: pageIndex, page_size_first: pageSizeFirst, page_size_more: pageSizeMore},
        function(data){
          if (data.status_code === 200) {
            var newData = storyDataService.addImageOfYoutube( data.data.stories );
            if (newData.length === 0) {

            }
            else {
              for (var i = 0; i < data.data.stories.length; i++) {
                storyDataService.publicFeed.StoriesLoadMore.push(newData[i]);
              };
            }
            
          }
        });
      return storyDataService.publicFeed;
    };

    //get all story (expand story)
    // storyDataService.getAllStories = function() {
    //   for (var i = 0; i < storyDataService.publicFeed.FeaturedStories.length; i++) {
    //     storyDataService.publicFeed.Stories.push(storyDataService.publicFeed.FeaturedStories[i]);
    //   };
    //   return storyDataService.publicFeed.Stories;
    // };

    //like story
    storyDataService.changeLike = function( userId, storyId ) {
      GetUserLikeList.query({user_id: userId, story_id: storyId}, function(data) {
          if (data.status_code === 200) {
              for (var i = 0; i <  storyDataService.publicFeed.Stories.length; i++) {
                  if (storyDataService.publicFeed.Stories[i].id === storyId) {
                      storyDataService.publicFeed.Stories[i].total_like = data.data.total_like;
                      if (data.message === "liked successfully") {
                        storyDataService.publicFeed.Stories[i].is_liked = 'true';
                      }
                      else {
                        storyDataService.publicFeed.Stories[i].is_liked = 'false';
                      }
                  };
              };
              for (var i = 0; i <  storyDataService.publicFeed.FeaturedStories.length; i++) {
                  if (storyDataService.publicFeed.FeaturedStories[i].id === storyId) {
                    
                      storyDataService.publicFeed.FeaturedStories[i].total_like = data.data.total_like;
                      if (data.message === "liked successfully") {
                        storyDataService.publicFeed.FeaturedStories[i].is_liked = 'true';
                      }
                      else {
                        storyDataService.publicFeed.FeaturedStories[i].is_liked = 'false';
                      }
                  };
              };
          };
      });
      return storyDataService.publicFeed;
    };

    //delete story
    storyDataService.deleteStories = function(storyId) {
      DelStoryApi.query({story_id: storyId}, function(data) {
          if (data.status_code === 200) {
            for (var i = 0; i < storyDataService.publicFeed.Stories.length; i++) {
              if (storyDataService.publicFeed.Stories[i].id === storyId) {
                storyDataService.publicFeed.Stories.splice(i,1);
              }
            };
          }
      });
      return storyDataService.publicFeed.Stories;
    };

    //report story
    storyDataService.reportStories = function(userId, storyId, reportOptions, reportDescription, token) {
      PostReportApi.query({user_id: userId, story_id: storyId, report_options: storyId, 
          report_description:  reportDescription, token: token}, function(data) {
          if (data.status_code === 200) {
              if (data.message === "Report story successfully") {
                  storyDataService.publicFeed.isDelStories = false;
              }
              else {
                  for (var i = 0; i < storyDataService.publicFeed.Stories.length; i++) {
                    if (storyDataService.publicFeed.Stories[i].id === storyId) {
                      storyDataService.publicFeed.Stories.splice(i,1);
                    }
                  };
                  storyDataService.publicFeed.isDelStories = true;
              }
          }
      });
      return storyDataService.publicFeed;
    };

    //submit story
    storyDataService.getStoryById = function (userId, storyId) {
      var deferred = $q.defer();
      GetStoryByIdApi.query({user_id: userId, story_id: storyId}, function (data) {
        if (data.status_code === 200) {
          var story = data.data[0];
          deferred.resolve(story);
        } else {
          deferred.reject('error');
        }
      });
      return deferred.promise;
    };

    storyDataService.insertStory = function (storyTitle, storyDescription, youtubeLink, hospital, createdBy, isAnonymously, images) {
      var deferred = $q.defer();
      InsertStoryApi.query({
        story_title: storyTitle, story_description: storyDescription, youtube_link: youtubeLink, hospital: hospital,
        created_by: createdBy, is_anonymously: isAnonymously, images: images
      }, function (data) {
        if (data.status_code === 200) {
          deferred.resolve(data.data);
        } else {
          deferred.reject('error');
        }
      });
      return deferred.promise;
    };

    storyDataService.submitStory = function (storyTitle, storyDescription, youtubeLink, hospital, createdBy, isAnonymously, images) {
      // console.log(hospital);
      var deferred = $q.defer();
      storyDataService.insertStory(storyTitle, storyDescription, youtubeLink, hospital, createdBy, isAnonymously, images).then(function (response) 
      {
        var shareUrl = response.share_url;
        storyDataService.getStoryById(createdBy, response.story_id).then(function (story) {
          storyDataService.publicFeed.Stories.unshift(storyDataService.addImageOfYoutube(story));
          deferred.resolve(shareUrl);
        }, function (error) {
          deferred.reject('error');
        });
      }, function (error) {
          deferred.reject('error');
      });
      return deferred.promise;
    };

    storyDataService.getStory = function(){
      return this.publicFeed.Stories;
    };

    storyDataService.getFeaturedStory = function(){
      return this.publicFeed.FeaturedStories;
    };

    storyDataService.getStoriesLoadMore = function(){
      return this.publicFeed.StoriesLoadMore;
    };

    storyDataService.handlingImage = function(stories){ 
        var youtube_id = "";
        if (stories.youtube_link === null) {
          //
        }
        else {
          var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
          var match = stories.youtube_link.match(regExp);
          if ( match && match[7].length == 11 ){
               youtube_id = match[7];
          }
          if (stories.story_type === "video") {
               stories.avatar_story = 'http://i3.ytimg.com/vi/' + youtube_id +'/hqdefault.jpg';
          }
        }
        return stories;
     }

    storyDataService.addImageOfYoutube = function(stories){
      if (!Array.isArray(stories)) 
      {
        storyDataService.handlingImage(stories);
      }
      else {
        for (var i = 0; i < stories.length; i++) {
          storyDataService.handlingImage(stories[i]);
        };
      }
      return stories;
    }

    return storyDataService;
});

homeService.factory('userDetailService', function($q, $http) {
    var user_id;

    return {
        getUserDetails: function (){
          return user_id;
        },
        setUserDetails: function(userId){
          user_id = userId;
        }

    }
});

homeService.factory('profileDataService', function( GetUserProfile, $q ) {
    var pageIndex = 1;
    var pageSizeFirst = 32;
    var pageSizeMore = 8;


  });
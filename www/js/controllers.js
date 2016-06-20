angular.module('app.controllers', [])
.controller('LoginCtrl', function($scope) {
    
})
.controller('CreateTeamCtrl', function($scope, $ionicLoading, $state, AuthService, MainService) {
    $scope.team = {
        name:"",
        password:"",
        master_password:""
    };
    
    $scope.error = "";
    
    $scope.createTeam = function(){
        $scope.error = "";
        $ionicLoading.show({
            template: 'Creating...'
        });        
       //register user
       AuthService.register().then(function(data){
           MainService.createTeam($scope.team).then(function(){
                $scope.team = {
                    name:"",
                    password:"",
                    master_password:""
                };                
               $ionicLoading.hide();
               $state.go("tab.groups");
           },function(){
               $scope.error = "Team name already exists";
               $ionicLoading.hide();
           })
       },function(){
           $ionicLoading.hide();
           $scope.error = "Error creating team";
       })
        
    }
})
.controller('JoinTeamCtrl', function($scope,$ionicLoading,AuthService, $state, MainService) {
    $scope.team = {
        name:"",
        password:"",
        is_manager:false
    } 
    $scope.error = "";
    
    $scope.joinTeam = function(){
        $scope.error = "";
        $ionicLoading.show({
            template: 'Joining...'
        });        
       //register user
       AuthService.register().then(function(data){
           MainService.joinTeam($scope.team).then(function(){
                $scope.team = {
                    name:"",
                    password:"",
                    is_manager:false
                }                
               $ionicLoading.hide();
               $state.go("tab.groups");
           },function(){
               $scope.error = "Team does not exist or you entered an invalid password";
               $ionicLoading.hide();
           })
       },function(){
           $ionicLoading.hide();
           $scope.error = "Error joining team";
       })

    }
})
.controller('GroupsCtrl', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup, MainService) {
    $scope.teams = {
        managed_groups : [],
        member_groups : []
    };
    
    $scope.doRefresh = function(){
        $ionicLoading.show({
            template: 'Loading...'
        });         
        MainService.getTeams().then(function(data){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            console.log(data);
            $scope.teams = data;
        },function(data){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            if (data.status_code === 401){
                $state.go("login");
            } 
        })
    }
    
    $scope.doRefresh();

    $rootScope.$on("reloadGroups", function(){
        $scope.doRefresh();
    })
    
    
    $scope.removeManager = function(manager){
          $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Are you sure you want to remove yourself as manager of this team?',
            okType: 'button-royal'
          }).then(function(res) {
            if(res) {
                MainService.removeManager(manager.id).then(function(){
                    for (var index in $scope.teams.managed_groups){
                        if ($scope.teams.managed_groups[index].id === manager.id){
                            $scope.teams.managed_groups.splice(index,1);
                        }    
                    }
                })
            }
          });       

    }
    
    $scope.removeMember = function(member){
          $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Are you sure you want to remove yourself from this team?',
            okType: 'button-royal'
          }).then(function(res) {
            if(res) {
                MainService.removeMember(member.id).then(function(){
                    for (var index in $scope.teams.member_groups){
                        if ($scope.teams.member_groups[index].id === member.id){
                            $scope.teams.member_groups.splice(index,1);
                        }    
                    }
                })
            }
          });       

    }
    
})
.controller('GroupDetailCtrl', function($scope, $ionicLoading, $stateParams, MainService, $ionicPopup) {
    $scope.team = {
        name:""
    };
    $scope.ratings = [];
    $scope.loaded = false;
    $scope.doRefresh = function(){
        $ionicLoading.show({
            template: 'Loading...'
        }); 
        
        MainService.getTeam($stateParams.groupId).then(function(data){
            $scope.team = data.group;
           
            MainService.getRatingTypes($stateParams.groupId).then(function(data){
                $scope.ratings = data.rating_types;
                $scope.loaded = true;
                if ($scope.team.manager){
                    $scope.doRatingsAverage();
                }                 
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },function(){
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            })


            
        },function(data){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        })
    }
    
    $scope.doRefresh();  
    
    $scope.resetRatings = function(){
        for (var index in $scope.ratings){
            $scope.ratings[index].rating = 5;
        }       
    }
    
    $scope.doRatingsAverage = function(){
        var seenRatingTypes = [];
        var seenRatingTypesCount = {};
        var averages = {};
        for (var index in $scope.team.ratings){
            var rating = $scope.team.ratings[index];
            if (seenRatingTypes.indexOf(rating.rating_type_id) > 0){
                averages[rating.rating_type_id] = averages[rating.rating_type_id] + parseInt(rating.rating);
                seenRatingTypesCount[rating.rating_type_id] = seenRatingTypesCount[rating.rating_type_id] + 1;
            }
            else{
                averages[rating.rating_type_id] = parseInt(rating.rating);
                seenRatingTypesCount[rating.rating_type_id] = 1;   
                seenRatingTypes.push(rating.rating_type_id);
            }
        }
        for (var index in averages){
            averages[index] = parseInt(averages[index] / seenRatingTypesCount[index]);
        }
        for (var index in $scope.ratings){
            $scope.ratings[index].rating = averages[$scope.ratings[index].id] ? averages[$scope.ratings[index].id] : 5;
        }        
    }
    
    $scope.saveRatings = function(){
        $ionicLoading.show({
            template: 'Saving...'
        });          
        MainService.saveRatings({group_id:$stateParams.groupId, ratings: $scope.ratings}).then(function(){
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: 'Success',
              template: 'Your ratings have been saved.',
                okType: 'button-royal'
            });
        },function(){
            $ionicPopup.alert({
              title: 'Error',
              template: 'There was an error saving your rating',
                okType: 'button-royal'
            });
            $ionicLoading.hide();
        })        
    }
})

.controller('CreateTeam2Ctrl', function($scope, $ionicLoading, MainService, $state, $rootScope) {
    $scope.team = {
        name:"",
        password:"",
        master_password:""
    };
    
    $scope.error = "";
    
    $scope.createTeam = function(){
        $scope.error = "";
        $ionicLoading.show({
            template: 'Creating...'
        });        

        MainService.createTeam($scope.team).then(function(){
             $scope.team = {
                 name:"",
                 password:"",
                 master_password:""
             };                
            $ionicLoading.hide();
            $rootScope.$broadcast("reloadGroups");
            $state.go("tab.groups");
        },function(){
            $scope.error = "Team name already exists";
            $ionicLoading.hide();
        })
       }
  
})

.controller('JoinTeam2Ctrl', function($scope, $ionicLoading, MainService, $state, $rootScope) {
    $scope.team = {
        name:"",
        password:"",
        is_manager:false
    } 
    $scope.error = "";
    
    $scope.joinTeam = function(){
        $scope.error = "";
        $ionicLoading.show({
            template: 'Joining...'
        });        
       //register user

        MainService.joinTeam($scope.team).then(function(){
             $scope.team = {
                 name:"",
                 password:"",
                 is_manager:false
             }                
            $ionicLoading.hide();
            $rootScope.$broadcast("reloadGroups");
            $state.go("tab.groups");
        },function(){
            $scope.error = "Team does not exist or you entered an invalid password";
            $ionicLoading.hide();
        })
       

    }    
})



.controller('TipsCtrl', function($scope, $ionicLoading, MainService) {
    $scope.ratingTypes = [];
    $scope.doRefresh = function(){
        $ionicLoading.show({
            template: 'Loading...'
        }); 

        MainService.getRatingTypes(null).then(function(data){
            $scope.ratingTypes = data.rating_types;            
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        },function(){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        });

    }
    
    $scope.doRefresh();     
})
.controller('TipDetailCtrl', function($scope, $ionicLoading, MainService, $stateParams) {
    $scope.ratingType = {};
    $scope.doRefresh = function(){
        $ionicLoading.show({
            template: 'Loading...'
        }); 

        MainService.getRatingType($stateParams.tipId).then(function(data){
            console.log(data);
            $scope.ratingType = data.rating_type;           
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        },function(){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        });

    }
    
    $scope.doRefresh();     
});

angular.module('app.services', [])

.service('AuthService', function ($http, $q, API_URL){

    this.register = function(){
        var deferred = $q.defer(),
            AuthService = this;
        $http.post(API_URL + "/auth/signup")
        .success(function(data) {
            console.log(data);
            AuthService.saveUser(data);            
            deferred.resolve(data);
        })
        .error(function(data) {
            deferred.reject(data);
        });

        return deferred.promise;        
    };
    
    
    this.userIsLoggedIn = function(){
        var deferred = $q.defer(),  
            AuthService = this,
            user = AuthService.getUser();
        if (user){
            deferred.resolve(user);           
        }
        else{
            deferred.reject("No user saved");
        }
        return deferred.promise;
    }
    this.saveUser = function(user){
        window.localStorage.ba_user = JSON.stringify(user);
    };

    this.getUser = function(){
        var data = window.localStorage.ba_user ? JSON.parse(window.localStorage.ba_user) : null;
        return data;
    };  
    
    this.removeUser = function(){
        window.localStorage.ba_user = null;
    } 

    
    
    this.logout = function(){
    var deferred = $q.defer();  
    var AuthService = this,
    user = AuthService.getUser();
    if (!user){deferred.reject("Not logged in");}
    else if (!user.sessionid){deferred.reject("Not logged in");}
    else{
        AuthService.removeUser();
        deferred.resolve();
    }

    return deferred.promise;        
    }
    
})

.service('MainService', function ($http, $q, API_URL, AuthService){
    this.joinTeam = function(data){
        var deferred = $q.defer(),
            user = AuthService.getUser();
        if (!user){deferred.reject("No token");}   
        $http.post(API_URL + "/groups/join?token=" + user.token, data)
        .success(function(data) {
            console.log(data);
                      
            deferred.resolve(data);
        })
        .error(function(data) {
            deferred.reject(data);
        });

        return deferred.promise;        
    };  
    this.createTeam = function(data){
        var deferred = $q.defer(),
            user = AuthService.getUser();
        if (!user){deferred.reject("No token");}   
        $http.post(API_URL + "/groups?token=" + user.token, data)
        .success(function(data) {
            console.log(data);
                      
            deferred.resolve(data);
        })
        .error(function(data) {
            deferred.reject(data);
        });

        return deferred.promise;        
    };
    
    this.getTeam = function(id){
        var deferred = $q.defer(),
            user = AuthService.getUser();
        if (!user){deferred.reject("No token");}   
        $http.get(API_URL + "/groups/" + id + "?token=" + user.token)
        .success(function(data) {
            console.log(data);
                      
            deferred.resolve(data);
        })
        .error(function(data) {
            deferred.reject(data);
        });

        return deferred.promise;        
    };
    
    this.getTeams = function(){
        var deferred = $q.defer(),
            user = AuthService.getUser();
        if (!user){deferred.reject("No token");}   
        $http.get(API_URL + "/groups?token=" + user.token)
        .success(function(data) {
            console.log(data);
                      
            deferred.resolve(data);
        })
        .error(function(data) {
            deferred.reject(data);
        });

        return deferred.promise;        
    };    
    
    this.removeManager = function(id){
        var deferred = $q.defer(),
            user = AuthService.getUser();
        if (!user){deferred.reject("No token");}   
        $http.delete(API_URL + "/manager/" + id + "?token=" + user.token)
        .success(function(data) {
            console.log(data);
                      
            deferred.resolve(data);
        })
        .error(function(data) {
            deferred.reject(data);
        });

        return deferred.promise;        
    };
    
    this.removeMember = function(id){
        var deferred = $q.defer(),
            user = AuthService.getUser();
        if (!user){deferred.reject("No token");}   
        $http.delete(API_URL + "/member/" + id + "?token=" + user.token)
        .success(function(data) {
            console.log(data);
                      
            deferred.resolve(data);
        })
        .error(function(data) {
            deferred.reject(data);
        });

        return deferred.promise;        
    };

    this.getRatingTypes = function(groupid){
        var deferred = $q.defer(),
            user = AuthService.getUser();
        if (!user){deferred.reject("No token");}   
        $http.get(API_URL + "/ratingtypes?token=" + user.token + "&group_id=" + groupid)
        .success(function(data) {
            console.log(data);
                      
            deferred.resolve(data);
        })
        .error(function(data) {
            deferred.reject(data);
        });

        return deferred.promise;           
    }    

    this.getRatingType = function(tipid){
        var deferred = $q.defer(),
            user = AuthService.getUser();
        if (!user){deferred.reject("No token");}   
        $http.get(API_URL + "/ratingtypes/" + tipid + "?token=" + user.token)
        .success(function(data) {
            console.log(data);
                      
            deferred.resolve(data);
        })
        .error(function(data) {
            deferred.reject(data);
        });

        return deferred.promise;           
    }     
    
    this.saveRatings = function(ratings){
        var deferred = $q.defer(),
            user = AuthService.getUser();
        if (!user){deferred.reject("No token");}   
        $http.post(API_URL + "/ratings?token=" + user.token, ratings)
        .success(function(data) {
            console.log(data);
                      
            deferred.resolve(data);
        })
        .error(function(data) {
            deferred.reject(data);
        });

        return deferred.promise;           
    }
});

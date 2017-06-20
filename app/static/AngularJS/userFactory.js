registrationModule.factory('userFactory', function(localStorageService, alertFactory) {
  return{
    getUserData: function(){
      return (localStorageService.get('userData'));
    },
    saveUserData: function(userData){
      localStorageService.set('userData',userData);
      return (localStorageService.get('userData'));
    },
    logOut: function(){
      localStorageService.clearAll();
      location.href = '/';
    },
    ValidaSesion: function(){
      var userData = localStorageService.get('userData');

      if (userData == null || userData == undefined){
        location.href = '/';
      }
    }
  }
});

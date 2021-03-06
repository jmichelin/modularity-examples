angular.module('App.homeCtrl', ['ngAnimate', 'ui.bootstrap', 'ngMaterial']);
angular.module('App.homeCtrl').controller('homeCtrl', function ($scope, $uibModal, $log, $http, $location, appFactory, $anchorScroll, $window, $filter) {

  $filter('lowercase')();

  $(document).on('scroll', function (e) {
    // debugger;
    if($(document).width() > 768){
      var r = 255 - $(document).scrollTop();
      var g = 255 - $(document).scrollTop();
      var b = 255 - $(document).scrollTop();
      var top = 71 - $(document).scrollTop();
      var font = 160 - ($(document).scrollTop()*1.6);
      var margTop = -550 + ($(document).scrollTop() * 0.7);
      var margTopCase = 590 + - ($(document).scrollTop());


      if($(document).scrollTop() > 126){ r = 129;}
      if($(document).scrollTop() > 89){ g = 166;}
      if($(document).scrollTop() > 220){b = 35;}
      if($(document).scrollTop() > 71){font = 48;}
      if($(document).scrollTop() > 71){top = 0;}
      if($(document).scrollTop() > 962){margTop = 123.4; margTopCase = -372;}

      $("#navBar1").css("opacity", ($(document).scrollTop() / 300));
      $(".navBarText").css("color", "rgb(" + r + "," + g + "," + b +")");
      $(".test").css("color", "rgb(" + r + "," + g + "," + b +")");
      $(".test").css("top", top);
      $(".test").css("font-size", font);

      $('.microchip').css('margin-top', margTop);
      $('.bloomCase').css('margin-top', margTopCase);
    }
  });

  $scope.scrollTo = function(id){
    $location.hash(id);
    $anchorScroll();
  }

  $scope.animationsEnabled = true;


  $scope.userInfo = {};
  $scope.firstName = "";
  $scope.isLoggedIn = false;

  $scope.init = function(){
    appFactory.getUser().then(function(result){
      if(result){
        $scope.userInfo = result.data;
        $scope.firstname = result.data.firstname;
        // $scope.firstname = $scope.userInfo.firstname;
        // $scope.firstname = $scope.firstname.toUpperCase();
        $scope.isLoggedIn = true;
      }
    })
  }

  $scope.open = function (size) {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

  $scope.init();

});

angular.module('App.homeCtrl').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, $uibModalStack, $http, appFactory, $location) {

  $scope.signInTrue = true;
  $scope.signinAlert = false;
  $scope.signupAlert = false;


  $scope.login = function(){
    return $http({
        method: 'POST',
        url: 'api/users/signin',
        data: {
          username: $scope.userLogin,
          password: $scope.passLogin
        }
      })
      .then(function(success){
        // $scope.cancel();
        $uibModalStack.dismissAll();
        $scope.userInfo = success.data;
        window.localStorage.setItem('token', success.data.token);
        $location.path('/userprofile');
      }, function(err){
        $scope.signinAlert = true;
      })

  }

  $scope.signup = function(){
    return $http({
        method: 'POST',
        url: 'api/users/signup',
        data: {
          firstname: $scope.firstname,
          lastname: $scope.lastname,
          username: $scope.user,
          password: $scope.pass,
          email: $scope.email
        }
      })
      .then(function(success){
        appFactory.welcomeEmail($scope.firstname, $scope.email);
        $scope.cancel();
        $uibModalStack.dismissAll();
        $scope.userInfo = success.data;
        window.localStorage.setItem('token', success.data.token);
        $location.path('/userprofile');
      }, function(err){
        $scope.signupAlert = true;
      })
  }



  $scope.signInUpToggle = function(){
    $scope.signInTrue = !$scope.signInTrue;
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
    // $uibModalStack.dismissAll();
    };
  });

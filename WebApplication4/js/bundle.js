(function(angular){
'use strict';
angular
  .module('root', [
    'common',
    'components',
    'templates'
  ])
  .config(["$stateProvider", "$urlRouterProvider", function ($stateProvider,$urlRouterProvider) {
    $stateProvider
    .state('app', {
      redirectTo: 'contacts',
      url: '/app',
      data: {
        requiredAuth: true
      },
      component: 'app'
    })
    .state('contacts', {
      parent: 'app',
      url: '/contacts?filter',
      component: 'contacts',
      params: {
        filter: {
          value: 'none'
        }
      },
      resolve: {
        contacts: ["ContactService", function (ContactService) {
          return ContactService.getContactList().$loaded();
        }],
        filter: ["$transition$", function ($transition$) {
          return $transition$.params();
        }]
      }
    })
    .state('contact', {
      parent: 'app',
      url: '/contact/:id',
      component: 'contactEdit',
      resolve: {
        contact: ["$transition$", "ContactService", function ($transition$, ContactService) {
          var key = $transition$.params().id;
          return ContactService.getContactById(key).$loaded();
        }]
      }
    })
    .state('auth.register', {
      url: '/register',
      component: 'register'
    })
    .state('auth', {
      redirectTo: 'auth.login',
      url: '/auth',
      template: '<div ui-view></div>'
    })
    .state('auth.login', {
      url: '/login',
      component: 'login'
    });
  $urlRouterProvider.otherwise('/auth/login');
  }]);})(window.angular);
(function(angular){
'use strict';

/**
 *
 * @ngdoc module
 * @name components
 *
 * @requires components.contact
 * @requires components.auth
 *
 * @description
 *
 * This is the components module. It includes all of our components.
 *
 **/

angular
  .module('components', [
    'components.contact',
    'components.auth'
  ]);
})(window.angular);
(function(angular){
'use strict';

/**
 *
 * @ngdoc module
 * @name common
 *
 * @requires ui.router
 * @requires angular-loading-bar
 *
 * @description
 *
 * This is the common module. It includes a run method that setups the loading bar.
 *
 **/
angular
  .module('common', [
    'ui.router',
    'angular-loading-bar'
  ])
  .run(["$transitions", "cfpLoadingBar", function ($transitions, cfpLoadingBar) {
    $transitions.onStart({}, cfpLoadingBar.start);
    $transitions.onSuccess({}, cfpLoadingBar.complete);
  }]);
})(window.angular);
(function(angular){
'use strict';
/**
 *
 * @ngdoc module
 * @name components.auth
 *
 * @requires ui.router
 * @requires firebase
 *
 * @description
 *
 * This is the auth module. It includes our auth components
 *
 **/
angular
  .module('components.auth', [
    'ui.router',
    'firebase'
  ])
  .config(["$firebaseRefProvider", function ($firebaseRefProvider) {

    var config = {
        apiKey: "AIzaSyDoJ5cW2x9oQniOjA5oR2kjDJBspqnXRmg",
        authDomain: "survey-tool-799d7.firebaseapp.com",
        databaseURL: "https://survey-tool-799d7.firebaseio.com",
        projectId: "survey-tool-799d7",
        storageBucket: "survey-tool-799d7.appspot.com",
        messagingSenderId: "69181653933"
    };

    $firebaseRefProvider
      .registerUrl({
        default: config.databaseURL,
        contacts: config.databaseURL + '/contacts'
      });

    firebase.initializeApp(config);
  }])
  .run(["$transitions", "$state", "AuthService", function ($transitions, $state, AuthService) {
    $transitions.onStart({
      to: function (state) {
        return !!(state.data && state.data.requiredAuth);
      }
    }, function() {
      return AuthService
        .requireAuthentication()
        .catch(function () {
          return $state.target('auth.login');
        });
    });
    $transitions.onStart({
      to: 'auth.*'
    }, function () {
      if (AuthService.isAuthenticated()) {
        return $state.target('app');
      }
    });
  }]);
})(window.angular);
(function(angular){
'use strict';

/**
 *
 * @ngdoc module
 * @name components.contact
 *
 * @requires ui.router
 *
 * @description
 *
 * This is the contact module. It includes all of our components for the contact feature.
 *
 **/
 angular
  .module('components.contact', [
    'ui.router'
  ]);
})(window.angular);
(function(angular){
'use strict';
var root = {
  templateUrl: './root.html'
};

angular
  .module('root')
  .component('root', root);
})(window.angular);
(function(angular){
'use strict';
var appNav = {
  bindings: {
    user: '<',
    onLogout: '&'
  },
  templateUrl: './app-nav.html'
};

angular
  .module('common')
  .component('appNav', appNav);
})(window.angular);
(function(angular){
'use strict';
var appSidebar = {
  templateUrl: './app-sidebar.html',
  controller: 'AppSidebarController'
};

angular
  .module('common')
  .component('appSidebar', appSidebar);
})(window.angular);
(function(angular){
'use strict';
function AppSidebarController() {
  var ctrl = this;
  ctrl.contactTags = [{
    label: 'All contacts',
    icon: 'star',
    state: 'none'
  }, {
    label: 'Friends',
    icon: 'people',
    state: 'friends'
  }, {
    label: 'Family',
    icon: 'child_care',
    state: 'family'
  }, {
    label: 'Acquaintances',
    icon: 'accessibility',
    state: 'acquaintances'
  }, {
    label: 'Following',
    icon: 'remove_red_eye',
    state: 'following'
  }];
}

/**
 * @ngdoc type
 * @module common
 * @name AppSidebarController
 *
 * @description
 *
 * ## Lorem Ipsum 1
 * Aenean ornare odio elit, eget facilisis ipsum molestie ac. Nam bibendum a nibh ut ullamcorper.
 * Donec non felis gravida, rutrum ante mattis, sagittis urna. Sed quam quam, facilisis vel cursus at.
 *
 * ## Lorem Ipsum 2
 * Aenean ornare odio elit, eget facilisis ipsum molestie ac. Nam bibendum a nibh ut ullamcorper.
 * Donec non felis gravida, rutrum ante mattis, sagittis urna. Sed quam quam, facilisis vel cursus at.
 */
angular
  .module('common')
  .controller('AppSidebarController', AppSidebarController);
})(window.angular);
(function(angular){
'use strict';
var app = {
  templateUrl: './app.html',
  controller: 'AppController'
};


angular
  .module('common')
  .component('app', app)
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('app', {
        redirectTo: 'contacts',
        url: '/app',
        data: {
          requiredAuth: true
        },
        component: 'app'
      })
  }]);
})(window.angular);
(function(angular){
'use strict';
AppController.$inject = ["AuthService", "$state"];
function AppController(AuthService, $state) {
  var ctrl = this;
  ctrl.user = AuthService.getUser();

 /**
  * @ngdoc method
  * @name AppController#logout
  *
  * @description Logout :)
  */
  ctrl.logout = function () {
    AuthService.logout().then(function () {
      $state.go('auth.login');
    });
  };
}

/**
 * @ngdoc type
 * @module common
 * @name AppController
 *
 * @description
 *
 * ## Lorem Ipsum 1
 * Aenean ornare odio elit, eget facilisis ipsum molestie ac. Nam bibendum a nibh ut ullamcorper.
 * Donec non felis gravida, rutrum ante mattis, sagittis urna. Sed quam quam, facilisis vel cursus at.
 *
 * ## Lorem Ipsum 2
 * Aenean ornare odio elit, eget facilisis ipsum molestie ac. Nam bibendum a nibh ut ullamcorper.
 * Donec non felis gravida, rutrum ante mattis, sagittis urna. Sed quam quam, facilisis vel cursus at.
 */
angular
  .module('common')
  .controller('AppController', AppController);
})(window.angular);
(function(angular){
'use strict';
AuthService.$inject = ["$firebaseAuth"];
function AuthService($firebaseAuth) {
  var auth = $firebaseAuth();
  var authData = null;
  function storeAuthData(response) {
    authData = response;
    return authData;
  }
  function onSignIn(user) {
    authData = user;
    return auth.$requireSignIn();
  }
  function clearAuthData() {
    authData = null;
  }
  this.login = function (user) {
    return auth
      .$signInWithEmailAndPassword(user.email, user.password)
      .then(storeAuthData);
  };
  this.register = function (user) {
    return auth
      .$createUserWithEmailAndPassword(user.email, user.password)
      .then(storeAuthData);
  };
  this.logout = function () {
    return auth
      .$signOut()
      .then(clearAuthData);
  };
  this.requireAuthentication = function () {
    return auth
      .$waitForSignIn().then(onSignIn);
  };
  this.isAuthenticated = function () {
    return !!authData;
  };
  this.getUser = function () {
    if (authData) {
      return authData;
    }
  };
}

/**
 * @ngdoc service
 * @name AuthService
 * @module components.auth
 *
 * @description Provides HTTP methods for our firebase authentification.
 *
 * ## Lorem Ipsum 1
 * Aenean ornare odio elit, eget facilisis ipsum molestie ac. Nam bibendum a nibh ut ullamcorper.
 * Donec non felis gravida, rutrum ante mattis, sagittis urna. Sed quam quam, facilisis vel cursus at.
 *
 * ## Lorem Ipsum 2
 * Aenean ornare odio elit, eget facilisis ipsum molestie ac. Nam bibendum a nibh ut ullamcorper.
 * Donec non felis gravida, rutrum ante mattis, sagittis urna. Sed quam quam, facilisis vel cursus at.
 */
angular
  .module('components.auth')
  .service('AuthService', AuthService);
})(window.angular);
(function(angular){
'use strict';
ContactService.$inject = ["AuthService", "$firebaseRef", "$firebaseArray", "$firebaseObject"];
function ContactService(AuthService, $firebaseRef, $firebaseArray, $firebaseObject) {
  var ref = $firebaseRef.contacts;
  var uid = AuthService.getUser().uid;
  return {
    createNewContact: function (contact) {
      return $firebaseArray(ref.child(uid)).$add(contact);
    },
    getContactById: function (id) {
      return $firebaseObject(ref.child(uid).child(id));
    },
    getContactList: function () {
      return $firebaseArray(ref.child(uid));
    },
    updateContact: function (contact) {
      return contact.$save();
    },
    deleteContact: function (contact) {
      return contact.$remove();
    }
  };
}

/**
 * @ngdoc service
 * @name ContactService
 * @module components.contact
 *
 * @description Provides HTTP methods for our firebase connection.
 *
 * ## Lorem Ipsum 1
 * Aenean ornare odio elit, eget facilisis ipsum molestie ac. Nam bibendum a nibh ut ullamcorper.
 * Donec non felis gravida, rutrum ante mattis, sagittis urna. Sed quam quam, facilisis vel cursus at.
 *
 * ## Lorem Ipsum 2
 * Aenean ornare odio elit, eget facilisis ipsum molestie ac. Nam bibendum a nibh ut ullamcorper.
 * Donec non felis gravida, rutrum ante mattis, sagittis urna. Sed quam quam, facilisis vel cursus at.
 */

angular
  .module('components.contact')
  .factory('ContactService', ContactService);
})(window.angular);
(function(angular){
'use strict';
var authForm = {
  bindings: {
    user: '<',
    button: '@',
    message: '@',
    onSubmit: '&'
  },
  templateUrl: './auth-form.html',
  controller: 'AuthFormController'
};

angular
  .module('components.auth')
  .component('authForm', authForm);
})(window.angular);
(function(angular){
'use strict';
function AuthFormController() {
  var ctrl = this;
  ctrl.$onChanges = function (changes) {
    if (changes.user) {
      ctrl.user = angular.copy(ctrl.user);
    }
  };
  ctrl.submitForm = function () {
    ctrl.onSubmit({
      $event: {
        user: ctrl.user
      }
    });
  };
}

angular
  .module('components.auth')
  .controller('AuthFormController', AuthFormController);
})(window.angular);
(function(angular){
'use strict';
var login = {
  templateUrl: './login.html',
  controller: 'LoginController'
};

angular
  .module('components.auth')
  .component('login', login);
  
})(window.angular);
(function(angular){
'use strict';
LoginController.$inject = ["AuthService", "$state"];
function LoginController(AuthService, $state) {
  var ctrl = this;
  ctrl.$onInit = function () {
    ctrl.error = null;
    ctrl.user = {
      email: '',
      password: ''
    };
  };
  ctrl.loginUser = function (event) {
    return AuthService
      .login(event.user)
      .then(function () {
        $state.go('app');
      }, function (reason) {
        ctrl.error = reason.message;
      });
  };
}

angular
  .module('components.auth')
  .controller('LoginController', LoginController);
})(window.angular);
(function(angular){
'use strict';
var register = {
  templateUrl: './register.html',
  controller: 'RegisterController'
};

angular
  .module('components.auth')
  .component('register', register);
 })(window.angular);
(function(angular){
'use strict';
RegisterController.$inject = ["AuthService", "$state"];
function RegisterController(AuthService, $state) {
  var ctrl = this;
  ctrl.$onInit = function () {
    ctrl.error = null;
    ctrl.user = {
      email: '',
      password: ''
    };
  };
  ctrl.createUser = function (event) {
    return AuthService
      .register(event.user)
      .then(function () {
        $state.go('app');
      }, function (reason) {
        ctrl.error = reason.message;
      });
  };
}

angular
  .module('components.auth')
  .controller('RegisterController', RegisterController);
})(window.angular);
(function(angular){
'use strict';
var contact = {
  bindings: {
    contact: '<',
    onSelect: '&'
  },
  templateUrl: './contact.html',
  controller: 'ContactController'
};

angular
  .module('components.contact')
  .component('contact', contact);
})(window.angular);
(function(angular){
'use strict';
function ContactController() {
  var ctrl = this;
  ctrl.selectContact = function () {
    ctrl.onSelect({
      $event: {
        contactId: ctrl.contact.$id
      }
    });
  };
}

angular
  .module('components.contact')
  .controller('ContactController', ContactController);
})(window.angular);
(function(angular){
'use strict';
var contactDetail = {
  bindings: {
    contact: '<',
    onSave: '&',
    onUpdate: '&',
    onDelete: '&'
  },
  templateUrl: './contact-detail.html',
  controller: 'ContactDetailController'
};

angular
  .module('components.contact')
  .component('contactDetail', contactDetail);
})(window.angular);
(function(angular){
'use strict';
function ContactDetailController() {
  var ctrl = this;
  ctrl.$onInit = function () {
    ctrl.isNewContact = !ctrl.contact.$id;
  };
  ctrl.saveContact = function () {
    ctrl.onSave({
      $event: {
        contact: ctrl.contact
      }
    });
  };
  ctrl.updateContact = function () {
    ctrl.onUpdate({
      $event: {
        contact: ctrl.contact
      }
    });
  };
  ctrl.deleteContact = function () {
    ctrl.onDelete({
      $event: {
        contact: ctrl.contact
      }
    });
  };
  ctrl.tagChange = function (event) {
    ctrl.contact.tag = event.tag;
    ctrl.updateContact();
  }
}

angular
  .module('components.contact')
  .controller('ContactDetailController', ContactDetailController);
})(window.angular);
(function(angular){
'use strict';
var contactEdit = {
  bindings: {
    contact: '<'
  },
  templateUrl: './contact-edit.html',
  controller: 'ContactEditController'
};

angular
  .module('components.contact')
  .component('contactEdit', contactEdit);

})(window.angular);
(function(angular){
'use strict';
ContactEditController.$inject = ["$state", "ContactService", "cfpLoadingBar", "$window"];
function ContactEditController($state, ContactService, cfpLoadingBar, $window) {
  var ctrl = this;
  /**
   * @ngdoc method
   * @name ContactEditController#updateContact
   *
   * @param {event} event Receive the emitted event
   * Updates the contact information
   *
   * @return {method} ContactService returns the updateContact method and a promise
   */
  ctrl.updateContact = function (event) {
    cfpLoadingBar.start();
    return ContactService
      .updateContact(event.contact)
      .then(cfpLoadingBar.complete, cfpLoadingBar.complete);
  };
  /**
   * @ngdoc method
   * @name ContactEditController#deleteContact
   *
   * @param {event} event Delete the contact
   *
   * @return {method} ContactService returns the deleteContact method and a promise
   */
  ctrl.deleteContact = function (event) {
    var message = 'Delete ' + event.contact.name + ' from contacts?';
    if ($window.confirm(message)) {
      return ContactService
        .deleteContact(event.contact)
        .then(function () {
          $state.go('contacts');
        });
    }
  };
}

/**
 * @ngdoc type
 * @module components.contact
 * @name ContactEditController
 *
 * @description
 *
 * ## Lorem Ipsum 1
 * Aenean ornare odio elit, eget facilisis ipsum molestie ac. Nam bibendum a nibh ut ullamcorper.
 * Donec non felis gravida, rutrum ante mattis, sagittis urna. Sed quam quam, facilisis vel cursus at.
 *
 * ## Lorem Ipsum 2
 * Aenean ornare odio elit, eget facilisis ipsum molestie ac. Nam bibendum a nibh ut ullamcorper.
 * Donec non felis gravida, rutrum ante mattis, sagittis urna. Sed quam quam, facilisis vel cursus at.
 */
angular
  .module('components.contact')
  .controller('ContactEditController', ContactEditController);
})(window.angular);
(function(angular){
'use strict';
var contactNew = {
  templateUrl: './contact-new.html',
  controller: 'ContactNewController'
};

angular
  .module('components.contact')
  .component('contactNew', contactNew)
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('new', {
        parent: 'app',
        url: '/new',
        component: 'contactNew'
      });
  }]);
})(window.angular);
(function(angular){
'use strict';
ContactNewController.$inject = ["ContactService", "$state"];
function ContactNewController(ContactService, $state) {
  var ctrl = this;
  ctrl.$onInit = function () {
    ctrl.contact = {
      name: '',
      email: '',
      job: '',
      location: '',
      social: {
        facebook: '',
        github: '',
        twitter: '',
        linkedin: ''
      },
      tag: 'none'
    };
  };
  ctrl.createNewContact = function (event) {
    return ContactService
      .createNewContact(event.contact)
      .then(function (contact) {
        $state.go('contact', {
          id: contact.key
        });
      });
  };
}

angular
  .module('components.contact')
  .controller('ContactNewController', ContactNewController);
})(window.angular);
(function(angular){
'use strict';
var contactTag = {
  bindings: {
    tag: '<',
    onChange: '&'
  },
  templateUrl: './contact-tag.html',
  controller: 'ContactTagController'
};

angular
  .module('components.contact')
  .component('contactTag', contactTag);
})(window.angular);
(function(angular){
'use strict';
function ContactTagController() {
  var ctrl = this;
  ctrl.$onInit = function () {
    ctrl.tags = [
      'friends', 'family', 'acquaintances', 'following'
    ];
  };
  ctrl.$onChanges = function (changes) {
    if (changes.tag) {
      ctrl.tag = angular.copy(ctrl.tag);
    }
  };
  ctrl.updateTag = function (tag) {
    ctrl.onChange({
      $event: {
        tag: tag
      }
    });
  };
}

angular
  .module('components.contact')
  .controller('ContactTagController', ContactTagController);
})(window.angular);
(function(angular){
'use strict';
var contacts = {
  bindings: {
    contacts: '<',
    filter: '<'
  },
  templateUrl: './contacts.html',
  controller: 'ContactsController'
};

angular
  .module('components.contact')
  .component('contacts', contacts);
  
})(window.angular);
(function(angular){
'use strict';
ContactsController.$inject = ["$filter", "$state"];
function ContactsController($filter, $state) {
  var ctrl = this;

  ctrl.$onInit = function() {
    ctrl.filteredContacts = $filter('contactsFilter')(ctrl.contacts, ctrl.filter);
  };

  ctrl.goToContact = function (event) {
    $state.go('contact', {
      id: event.contactId
    });
  };
}

angular
  .module('components.contact')
  .controller('ContactsController', ContactsController);
})(window.angular);
(function(angular){
'use strict';
function contactsFilter() {
  return function (collection, params) {
    return collection.filter(function (item) {
      return item.tag === (
        params.filter === 'none' ? item.tag : params.filter
      );
    });
  };
}

angular
  .module('components.contact')
  .filter('contactsFilter', contactsFilter);
})(window.angular);
(function(angular){
'use strict';
function lengthCheck() {
  return {
    restrict: 'A',
    require: 'ngModel',
    compile: function ($element) {
      $element.addClass('dynamic-input');
      return function ($scope, $element, $attrs, $ctrl) {
        var dynamicClass = 'dynamic-input--no-contents';
        $scope.$watch(function () {
          return $ctrl.$viewValue;
        }, function (newValue) {
          if (newValue) {
            $element.removeClass(dynamicClass);
          } else {
            $element.addClass(dynamicClass);
          }
        });
      };
    }
  };
}

/**
 * @ngdoc directive
 * @name lengthCheck
 * @module components.contact
 *
 * @description
 *
 * Aenean ornare odio elit, eget facilisis ipsum molestie ac. Nam bibendum a nibh ut ullamcorper.
 * Donec non felis gravida, rutrum ante mattis, sagittis urna. Sed quam quam, facilisis vel cursus at.
 *
 * @usage
 *
 * ### How to use
 * Aenean ornare odio elit, eget facilisis ipsum molestie ac. Nam bibendum a nibh ut ullamcorper.
 * Donec non felis gravida, rutrum ante mattis, sagittis urna. Sed quam quam, facilisis vel cursus at.
 **/
angular
  .module('components.contact')
  .directive('lengthCheck', lengthCheck);
})(window.angular);
(function(angular){
'use strict';
angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('./root.html','<div class="root"><div ui-view></div></div>');
$templateCache.put('./app-nav.html','<header class="header"><div class="header__fixed"><div><div class="header__brand">Contacts <a ui-sref="new" class="header__button header__button--new-contact"><i class="material-icons">add_circle_outline</i> New Contact</a></div><div class="header__logout">{{ ::$ctrl.user.email }} <a href="" ng-click="$ctrl.onLogout();"><span class="header__button"><i class="material-icons">power_settings_new</i> Logout</span></a></div></div></div></header>');
$templateCache.put('./app-sidebar.html','<aside class="sidebar"><div class="sidebar__logo"><a href=""><img src="/img/logo.png" alt=""></a></div><span class="sidebar__header">Tags</span><ul class="sidebar__lst"><li class="sidebar__item" ng-repeat="item in ::$ctrl.contactTags"><a class="sidebar__link" ui-sref="contacts({ filter: item.state })" ui-sref-active-eq="sidebar__link--active"><i class="material-icons">{{ ::item.icon }} </i>{{ ::item.label }}</a></li></ul></aside>');
$templateCache.put('./app.html','<div class="root"><app-nav user="$ctrl.user" on-logout="$ctrl.logout();"></app-nav><app-sidebar></app-sidebar><div class="app"><div ui-view></div></div></div>');
$templateCache.put('./contact-detail.html','<div class="contact"><form name="contactDetailForm" novalidate><div><span class="contact__required">*</span> field is required</div><div class="contact__box"><h3 class="contact__sub-title">Personal</h3><div class="contact__field"><label>Name <span class="contact__required">*</span></label><input type="text" name="name" length-check required="required" ng-change="$ctrl.updateContact();" ng-model-options="{\r\n            \'updateOn\': \'default blur\',\r\n            \'debounce\': {\r\n              \'default\': 250,\r\n              \'blur\': 0\r\n            }\r\n          }" ng-model="$ctrl.contact.name"></div><div class="contact__field"><label>Email <span class="contact__error" ng-if="contactDetailForm.email.$error.email">Must be a valid email</span></label><input type="email" name="email" length-check ng-change="$ctrl.updateContact();" ng-model-options="{\r\n            \'updateOn\': \'default blur\',\r\n            \'debounce\': {\r\n              \'default\': 250,\r\n              \'blur\': 0\r\n            }\r\n          }" ng-model="$ctrl.contact.email"></div><div class="contact__field"><label>Job title</label><input type="text" name="jobTitle" length-check ng-change="$ctrl.updateContact();" ng-model-options="{\r\n            \'updateOn\': \'default blur\',\r\n            \'debounce\': {\r\n              \'default\': 250,\r\n              \'blur\': 0\r\n            }\r\n          }" ng-model="$ctrl.contact.job"></div><div class="contact__field"><label>Location</label><input type="text" name="location" length-check ng-change="$ctrl.updateContact();" ng-model-options="{\r\n            \'updateOn\': \'default blur\',\r\n            \'debounce\': {\r\n              \'default\': 250,\r\n              \'blur\': 0\r\n            }\r\n          }" ng-model="$ctrl.contact.location"></div></div><div class="contact__box contact__box--no-margin"><h3 class="contact__sub-title">Social</h3><div class="contact__field"><label>Facebook</label><input type="text" name="facebook" length-check ng-change="$ctrl.updateContact();" ng-model-options="{\r\n            \'updateOn\': \'default blur\',\r\n            \'debounce\': {\r\n              \'default\': 250,\r\n              \'blur\': 0\r\n            }\r\n          }" ng-model="$ctrl.contact.social.facebook"></div><div class="contact__field"><label>GitHub</label><input type="text" name="github" length-check ng-change="$ctrl.updateContact();" ng-model-options="{\r\n            \'updateOn\': \'default blur\',\r\n            \'debounce\': {\r\n              \'default\': 250,\r\n              \'blur\': 0\r\n            }\r\n          }" ng-model="$ctrl.contact.social.github"></div><div class="contact__field"><label>Twitter</label><input type="text" name="twitter" length-check ng-change="$ctrl.updateContact();" ng-model-options="{\r\n            \'updateOn\': \'default blur\',\r\n            \'debounce\': {\r\n              \'default\': 250,\r\n              \'blur\': 0\r\n            }\r\n          }" ng-model="$ctrl.contact.social.twitter"></div><div class="contact__field"><label>LinkedIn</label><input type="text" name="linkedin" length-check ng-change="$ctrl.updateContact();" ng-model-options="{\r\n            \'updateOn\': \'default blur\',\r\n            \'debounce\': {\r\n              \'default\': 250,\r\n              \'blur\': 0\r\n            }\r\n          }" ng-model="$ctrl.contact.social.linkedin"></div></div><contact-tag tag="$ctrl.contact.tag" on-change="$ctrl.tagChange($event);"></contact-tag><div ng-if="$ctrl.isNewContact"><button class="contact__action button" ng-disabled="contactDetailForm.$invalid" ng-click="$ctrl.saveContact();">Create contact</button></div><div ng-if="!$ctrl.isNewContact"><button class="contact__action button delete" ng-click="$ctrl.deleteContact();">Delete contact</button></div></form></div>');
$templateCache.put('./contact.html','<div class="contact-card"><button class="contact-card__link button--clean" ng-click="$ctrl.selectContact();"><div class="contact-card__column contact-card__column--name">{{ ::$ctrl.contact.name }} <span class="contact-card__pill contact-card__pill--{{ ::$ctrl.contact.tag }}">{{ ::$ctrl.contact.tag }}</span></div><div class="contact-card__column contact-card__column--email">{{ ::$ctrl.contact.email }}</div></button></div>');
$templateCache.put('./contact-edit.html','<contact-detail contact="$ctrl.contact" on-delete="$ctrl.deleteContact($event);" on-update="$ctrl.updateContact($event);"></contact-detail>');
$templateCache.put('./contact-new.html','<contact-detail contact="$ctrl.contact" on-save="$ctrl.createNewContact($event);"></contact-detail>');
$templateCache.put('./contact-tag.html','<div class="contact__field contact__field--long"><label>Tag</label><ul><li class="contact-card__pill contact-card__pill--{{ tag }}" ng-repeat="tag in ::$ctrl.tags" ng-class="{\r\n        \'contact__pill--active\': $ctrl.tag == tag\r\n      }"><button class="button--clean" ng-click="$ctrl.updateTag(tag);">{{ ::tag }}</button></li></ul></div>');
$templateCache.put('./contacts.html','<div class="contacts"><ul class="contacts-list"><li ng-repeat="contact in $ctrl.filteredContacts"><contact contact="contact" on-select="$ctrl.goToContact($event);"></contact></li></ul><div class="contacts__empty" ng-if="!$ctrl.filteredContacts.length"><i class="material-icons">face</i> There\'s no one here...</div></div>');
$templateCache.put('./auth-form.html','<form name="authForm" novalidate ng-submit="$ctrl.submitForm();"><label><input type="email" name="email" required="required" placeholder="Enter your email" ng-model="$ctrl.user.email"></label><label><input type="password" name="password" required="required" placeholder="Enter your password" ng-model="$ctrl.user.password"></label><div class="auth-button"><button class="button" type="submit" ng-disabled="authForm.$invalid">{{ $ctrl.button }}</button></div><div ng-if="$ctrl.message" class="message error">{{ $ctrl.message }}</div></form>');
$templateCache.put('./login.html','<div class="auth"><h1>Login</h1><auth-form user="$ctrl.user" message="{{ $ctrl.error }}" button="Login" on-submit="$ctrl.loginUser($event);"></auth-form></div><div class="auth__info"><a ui-sref="auth.register">Don\'t have an account? Create one here.</a></div>');
$templateCache.put('./register.html','<div class="auth"><h1>Register</h1><auth-form user="$ctrl.user" message="{{ $ctrl.error }}" button="Create user" on-submit="$ctrl.createUser($event);"></auth-form></div><div class="auth__info"><a ui-sref="auth.login">Already have an account? Login here.</a></div>');}]);})(window.angular);
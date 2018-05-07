angular
  .module('root', [
    'common',
    'components',
    'templates'
  ])
  .config(function ($stateProvider,$urlRouterProvider) {
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
        contacts: function (ContactService) {
          return ContactService.getContactList().$loaded();
        },
        filter: function ($transition$) {
          return $transition$.params();
        }
      }
    })
    .state('contact', {
      parent: 'app',
      url: '/contact/:id',
      component: 'contactEdit',
      resolve: {
        contact: function ($transition$, ContactService) {
          var key = $transition$.params().id;
          return ContactService.getContactById(key).$loaded();
        }
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
  });
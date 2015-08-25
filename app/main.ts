'use strict';

import angular = require('angular');
require('angular-aria');
require('angular-animate');
require('angular-material');
require('angular-route');

angular.module('bradley.birth', ['ngMaterial', 'ngRoute']);

require('./routes');
require('./services');
require('./directives');
require('./controllers');

angular.bootstrap(document, ['bradley.birth']);

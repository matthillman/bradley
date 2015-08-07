'use strict';

import angular = require('angular');
require('angular-aria');
require('angular-animate');
require('angular-material');

angular.module('sample.app', ['ngMaterial']);

require('./services');
require('./directives');
require('./controllers');

angular.bootstrap(document, ['sample.app']);

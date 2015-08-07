'use strict';

import angular = require('angular');

var app = angular.module('sample.app');

import UC = require('./UserController');
app.controller('UserController', UC.UserController);
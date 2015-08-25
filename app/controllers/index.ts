'use strict';

import angular = require('angular');

var app = angular.module('bradley.birth');

import UC = require('./BradleyController');
app.controller('BradleyController', UC.BradleyController);
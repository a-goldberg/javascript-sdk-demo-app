/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _optimizely_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
// JavaScript SDK Demo App
// Copyright 2018 Optimizely. Licensed under the Apache License


// sdk installed and datafile retrieved

const _ = __webpack_require__(240);
window.activeUser = {}, window.items = [], window.userList = [];
//let optimizelyClientInstance = {};


///////////////   Create Optimizely Client Instance //////////////////////
const optimizelyClientInstance = _optimizely_manager__WEBPACK_IMPORTED_MODULE_0__["default"].createInstance(main);
//////////////////////////////////////////////////////////////////////////



// primary function executed at load time
async function main() {


    $(document).ready(function () {
        if (document.location.search.indexOf("emulate") > -1) {
            _buildUsers().then(_renderUserList).then(function () {
                $("#user-container").show();
            });
        }

        _buildItems().then(_renderItemsTable).then(function () {
            $('#input-name-button').on('click', function () {
                _setActiveUser();
                let userID = $('#users-list').val() || -1;
                shop(userID);
            });
        });
    });

    async function _buildItems() {
        window.items = [];
        await $.ajax({
            url: './items.csv',
            dataType: 'text',
            success: function (data) {
                let itemLines = data.split('\n');
                for (var i = 0; i < itemLines.length; i++) {
                    let item = itemLines[i].split(',');
                    items.push({
                        name: item[0],
                        color: item[1],
                        category: item[2],
                        price: parseInt(item[3].slice(1)),
                        imageUrl: item[4],
                    });
                }
            },
        });
        return items;
    }

    // creates the table of products, using an A/B experiment to determine the number of items per row to display
    function _renderItemsTable(items) {

        let table = document.createElement('table');
        let i = 0;
        let itemsPerRow = 3; // default

        // activate the A/B experiment to assign the number of items to display for this user
        if (Object.entries(activeUser).length > 0) {

            /////////  Activate client for user   ///////////////////////////////////////////////////////////////////////////
            const num_items_variation = optimizelyClientInstance.activate('items_per_row', activeUser.id, activeUser);
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if (!!num_items_variation) {
                try {
                    var pattern = /^items_(\d+)$/g;
                    itemsPerRow = parseInt(pattern.exec(num_items_variation)[1]);
                } catch (err) {
                    console.error("Failed to find the number of items per row from the A/B experiment.  The value returned was:", num_items_variation);
                }
            }

        }
        while (typeof items[i] !== 'undefined') {
            let row = table.insertRow(-1);


            for (var c = 0; c < itemsPerRow; c++) {
                let cell = row.insertCell(-1);
                let cellContent = document.createElement('div');
                if (!!items[i]) {
                    cellContent.innerHTML = items[i].name;
                    cellContent.innerHTML += ' in ' + items[i].color + '<br>';
                    cellContent.innerHTML += '<b>' + items[i].category + ', $' + items[i].price + '</b>';
                    cellContent.innerHTML += '<img src="./images/' + items[i].imageUrl + '" >';
                    cellContent.innerHTML += '<button data-itemid="' + i + '"' + 'class="red-button buy-button">Buy Now</button>';
                }
                cell.appendChild(cellContent);
                i += 1;
            }
        }
        $('#items-table').empty().html(table);

        $(".buy-button").off("click").on("click", function () {
            let userID = $('#users-list').val() || -1;
            let itemID = $(this).data("itemid");
            _logPurchase(userID, itemID);
        });


        return table;
    }

    // creates the item sorting dropdown menu based on feature rollout and feature test
    function _renderSortingDropdown() {
        const selectTitle = document.createElement('span');
        selectTitle.innerHTML += 'Sort Items By: ';
        const selectTypes = document.createElement('select');
        selectTypes.setAttribute('id', 'sorting_type');
        selectTypes.innerHTML += '<option disabled selected value></option>';

        // determine and handle order of item sort options

        ////////// Get Feature Test Variable Value ///////////////////////////////////////////
        var first_option = optimizelyClientInstance.getFeatureVariableString('sorting_enabled', 'first_option', activeUser.id, activeUser);
        //////////////////////////////////////////////////////////////////////////////////////

        if (first_option == "Price") {
            selectTypes.innerHTML += '<option value="price">Price</option>';
            selectTypes.innerHTML += '<option value="category">Category</option>';
        } else {
            selectTypes.innerHTML += '<option value="category">Category</option>';
            selectTypes.innerHTML += '<option value="price">Price</option>';
        }

        selectTitle.appendChild(selectTypes)
        $('#sorting').html(selectTitle);
        $('#sorting').on('change', function () {
            var sortType = $('#sorting_type option:selected').val();
            var userId = $('#users-list').val() || -1;

            //////// Track Sorting Feature Engagement ////////////////////////////
            optimizelyClientInstance.track('sorting_change', userId, activeUser);
            //////////////////////////////////////////////////////////////////////

            _buildItems().then(function (items) {
                items = _.sortBy(items, sortType);
                return _renderItemsTable(items);
            }).then(function () {
                $(".buy-button").off("click").on("click", function () {
                    let userID = $('#users-list').val() || -1;
                    let itemID = $(this).data("itemid");
                    _logPurchase(userID, itemID);
                });

            });
        });
    }

    async function _buildUsers() {
        let users = [];
        await $.ajax({
            type: "GET",
            url: './users.csv',
            dataType: 'text',
            success: function (data) {
                let userLines = data.split('\n');
                for (var i = 0; i < userLines.length; i++) {
                    let user = userLines[i].split(',');
                    users.push({
                        id: user[0],
                        name: user[1],
                        gender: user[2],
                        orderCount: user[3],
                        lifetimeValue: parseInt(user[4].slice(1))
                    });
                }
            },
        });
        userList = users;
        return users;
    }

    function _renderUserList(users) {
        let list = document.createElement('select');
        list.id = "users-list";
        list.insertAdjacentHTML("afterbegin", "<option selected disabled value></option>");
        list.addEventListener("change", _updateUserDetailsTable);
        let i = 0;
        while (typeof users[i] !== 'undefined') {
            let user = users[i];
            let option = document.createElement("option");
            option.value = user.id;
            option.text = user.name;
            list.add(option);
            i += 1;
        }
        document.getElementById("users-list-container").insertAdjacentElement("afterbegin", list);
        var storedId = localStorage.getItem("opzDemoUser");
        if (!!storedId) {
            console.log("StoredId:", storedId);
            $("#users-list > option[value='" + storedId + "']")[0].selected = true;
            _updateUserDetailsTable();
            $("#input-name-button").click();
        }

        return list;
    }

    async function _updateUserDetailsTable() {
        let container = $("#user-details");
        $(container).empty();
        let userid = $("#users-list").val();
        let userIndex = parseInt(userid);
        if (!!userid) {
            console.log("Updating user details table for active user", userid);
            let user = window.userList[userIndex];
            let userDetails = $("<div class='userRow'>");
            for (var prop in user) {
                $("<div class='userProperty'>").html("<b>" + prop + ":</b>" + (prop === "lifetimeValue" ? "$" : "") + user[prop]).appendTo(userDetails);
            }
            $(container).append(userDetails);
        }
    }

    // get user data from the CSV import to use elsewhere
    function _setActiveUser() {
        let userID = $('#users-list').val();
        if (!userID) {
            console.error("Failed to get active user.  UserID is", userID);
            return false;
        }
        if (userList && userList.length > 0) {
            var user = userList[parseInt(userID)];
            for (var prop in user) {
                window.activeUser[prop] = user[prop];
            }
        } else console.error("Failed to find the userList in setActiveUser()");
        return window.activeUser;

    }

    // when emulating a user, this will set the active user and rebuild the UI based on roll outs & features affecting that user
    function shop(userID) {
        console.log("Shopping for user", userID);
        localStorage.setItem("opzDemoUser", userID);
        $("#features-list").empty();

        //////////////// Is item sorting Feature enabled for this user? /////////////////////////////////////////////////////////////
        const isSortingEnabled = optimizelyClientInstance.isFeatureEnabled('sorting_enabled', userID, activeUser);
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        addFeatureIndicator("sorting enabled", isSortingEnabled, userID);
        
        // display feature if enabled
        if (isSortingEnabled) {
            _renderSortingDropdown();
        } else {
            // ensure feature is hidden if disabled
            $('#sorting').hide();
        }        

        //////////////// Is welcome message feature enabled for this user? ////////////////////////////////////////////////////////////
        const showWelcomeMessage = optimizelyClientInstance.isFeatureEnabled('welcome_message_enabled', userID, activeUser);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        addFeatureIndicator("welcome message", showWelcomeMessage, userID);
        
        if (showWelcomeMessage) {

            ////////////// retrieve welcome message Feature Test variation for this user //////////////////////////////////////////////  
            const welcomeMessageVar = optimizelyClientInstance.getFeatureVariableString('welcome_message_enabled', 'welcome_text', userID, activeUser);
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            
            if (!!welcomeMessageVar) {
                $('#welcome').show().html(welcomeMessageVar);
            } else {
                // Set a default message
                $('#welcome').html('Welcome to Attic & Button');
            }

        } else $("#welcome").hide();

        _renderItemsTable(window.items);
    }

    // log a purchase event, using user ID and item attributes
    async function _logPurchase(user, item) {
        // create object of item attributes to be sent as event payload
        var itemAttributes = {
            category: items[item].category,
            price: items[item].price,
            revenue: items[item].price * 100,
        };
        var userId = user.toString();
        var userIndex = parseInt(userId);
        var price = itemAttributes.price;

        if (!!userId && !!price && price > 0) {
            if (userIndex > -1) {
                // on conversion, increment user values (though this isn't being successfully written to the CSV at the moment)
                ++userList[userIndex].orderCount;
                userList[userIndex].lifetimeValue += price;
                _updateUserDetailsTable();

                // rebuild user list with new values
                var usersString = "";
                var i = 0;
                while (typeof userList[i] !== "undefined") {
                    for (var attr in userList[i]) {
                        usersString += userList[i][attr] + (attr !== "lifetimeValue" ? ',' : "");
                    }
                    usersString += "\n";
                    ++i;
                }
                // update CSV with new user data (order count & lifetime value) after conversion event
                await $.ajax({
                    type: "POST",
                    url: "./users.csv",
                    dataType: "text",
                    contentType: "text/plain",
                    data: usersString,
                    success: function () {
                        console.log("User data file successfully updated for user", userId);
                        _setActiveUser();
                    },
                    error: function (jqxhr, errStr, err) {
                        console.error("Failed to update user data file for user", userId, ":", errStr);
                    }
                });
            }

            /////////// track purchase event  //////////////////////////////////////////////////////////////////////////
            await optimizelyClientInstance.track('item_purchase', userId, activeUser, itemAttributes);
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            
            //window.location.href = '/purchase.html';
        }
        return window.userList;
    }
    
    // update UI to display if Feature Flag is enabled
    function addFeatureIndicator(featureName,isEnabled,id) {
        var indicatorBool = (isEnabled) ? 'ON' : 'OFF';
        var indicatorMessage = `The feature "${featureName}" is ${indicatorBool} for user ${id}`;
        $('#features-list').append($("<div>").html(indicatorMessage).addClass(isEnabled ? "green" : "red"));
    }
    


}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(239);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_constants__WEBPACK_IMPORTED_MODULE_0__);
var optimizely = __webpack_require__(2);
var logger = __webpack_require__(209);
var enums = __webpack_require__(2).enums;
__webpack_require__(236).polyfill();
__webpack_require__(237);

  // datafileURL no longer used with ADM update in 3.2.0


class OptimizelyManager {

  // instantiate the Optimizely client
  static createInstance(initCallback,updateCallback) {
    //    var datafile = await _getDatafile();  // pre-datafile management
    let instance = optimizely.createInstance({
      sdkKey: _constants__WEBPACK_IMPORTED_MODULE_0__["sdkKey"],
      datafileOptions: {
          autoUpdate: true,
          updateInterval: 30000
      },
      logger: logger.createLogger({
        logLevel: enums.LOG_LEVEL.INFO,
      })
    });
      
    instance.onReady().then(function() {
        console.info("%cInitial instance created and ready.","color:blue");
        if(!!initCallback) initCallback();
    });
      
    instance.notificationCenter.addNotificationListener(
      enums.NOTIFICATION_TYPES.OPTIMIZELY_CONFIG_UPDATE,
      function() {
          console.info("%cOptimizely config updated automatically by ADM","color:blue");
          if(!!updateCallback) updateCallback();
      }
    );
      
    instance.notificationCenter.addNotificationListener(
        enums.NOTIFICATION_TYPES.DECISION,
        function(data) {
            
            console.info("%cDecision of type %s triggered for user %s.  Decision info follows:","color:blue",data.type,data.userId);
            console.dir(data.decisionInfo);
        }
    );
      
    instance.notificationCenter.addNotificationListener(
        enums.NOTIFICATION_TYPES.TRACK,
        function(data) {
            console.info("%cTrack event triggered for metric %s.  Event tags follow:","color:blue",data.eventKey);
            console.dir(data.eventTags);
        }
    );
      
    return instance;
  
  }
}

/* harmony default export */ __webpack_exports__["default"] = (OptimizelyManager);

// fetch JSON datafile from CDN
// no longer used, in favor of built-in datafile management with automatic downloading
async function _getDatafile() {
  return await fetch(_constants__WEBPACK_IMPORTED_MODULE_0__["datafileURL"])
    .then(function (response) {
      if (response.status >= 400) {
        console.log('Error downloading datafile');
      }
      return response.json();
    });
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2016-2017, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
__webpack_require__(3);
var logging = __webpack_require__(8);
var fns = __webpack_require__(18);
var configValidator = __webpack_require__(198);
var defaultErrorHandler = __webpack_require__(200);
var defaultEventDispatcher = __webpack_require__(201);
var enums = __webpack_require__(199);
var eventProcessor = __webpack_require__(202);
var loggerPlugin = __webpack_require__(209);
var Optimizely = __webpack_require__(210);

var logger = logging.getLogger();
logging.setLogHandler(loggerPlugin.createLogger());
logging.setLogLevel(logging.LogLevel.INFO);

var hasRetriedEvents = false;
/**
 * Entry point into the Optimizely Browser SDK
 */
module.exports = {
  logging: loggerPlugin,
  errorHandler: defaultErrorHandler,
  eventDispatcher: defaultEventDispatcher,
  enums: enums,

  setLogger: logging.setLogHandler,
  setLogLevel: logging.setLogLevel,

  /**
   * Creates an instance of the Optimizely class
   * @param  {Object} config
   * @param  {Object} config.datafile
   * @param  {Object} config.errorHandler
   * @param  {Object} config.eventDispatcher
   * @param  {Object} config.logger
   * @param  {Object} config.logLevel
   * @param  {Object} config.userProfileService
   * @param {Object} config.eventBatchSize
   * @param {Object} config.eventFlushInterval
   * @return {Object} the Optimizely object
   */
  createInstance: function(config) {
    try {
      config = config || {};

      // TODO warn about setting per instance errorHandler / logger / logLevel
      if (config.errorHandler) {
        logging.setErrorHandler(config.errorHandler);
      }
      if (config.logger) {
        logging.setLogHandler(config.logger);
        // respect the logger's shouldLog functionality
        logging.setLogLevel(logging.LogLevel.NOTSET);
      }
      if (config.logLevel !== undefined) {
        logging.setLogLevel(config.logLevel);
      }

      try {
        configValidator.validate(config);
        config.isValidInstance = true;
      } catch (ex) {
        logger.error(ex);
        config.isValidInstance = false;
      }

      // Explicitly check for null or undefined
      // prettier-ignore
      if (config.skipJSONValidation == null) { // eslint-disable-line eqeqeq
        config.skipJSONValidation = true;
      }

      var wrappedEventDispatcher = new eventProcessor.LocalStoragePendingEventsDispatcher({
        eventDispatcher: config.eventDispatcher || defaultEventDispatcher,
      });
      if (!hasRetriedEvents) {
        wrappedEventDispatcher.sendPendingEvents();
        hasRetriedEvents = true;
      }

      config = fns.assignIn({
        clientEngine: enums.JAVASCRIPT_CLIENT_ENGINE,
      }, config, {
        eventDispatcher: wrappedEventDispatcher,
        // always get the OptimizelyLogger facade from logging
        logger: logger,
        errorHandler: logging.getErrorHandler(),
      });

      return new Optimizely(config);
    } catch (e) {
      logger.error(e);
      return null;
    }
  },

  __internalResetRetryState: function() {
    hasRetriedEvents = false;
  },
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate, global) {(function (global, factory) {
	 true ? factory() :
	undefined;
}(this, (function () { 'use strict';

/**
 * @this {Promise}
 */
function finallyConstructor(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      return constructor.resolve(callback()).then(function() {
        return constructor.reject(reason);
      });
    }
  );
}

// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = finallyConstructor;

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!arr || typeof arr.length === 'undefined')
      throw new TypeError('Promise.all accepts an array');
    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(values) {
  return new Promise(function(resolve, reject) {
    for (var i = 0, len = values.length; i < len; i++) {
      values[i].then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  (typeof setImmediate === 'function' &&
    function(fn) {
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

/** @suppress {undefinedVars} */
var globalNS = (function() {
  // the only reliable means to get the global object is
  // `Function('return this')()`
  // However, this causes CSP violations in Chrome apps.
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  throw new Error('unable to locate global object');
})();

if (!('Promise' in globalNS)) {
  globalNS['Promise'] = Promise;
} else if (!globalNS.Promise.prototype['finally']) {
  globalNS.Promise.prototype['finally'] = finallyConstructor;
}

})));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(4).setImmediate, __webpack_require__(5)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(6);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(5)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(5), __webpack_require__(7)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
__export(__webpack_require__(9));
__export(__webpack_require__(10));
__export(__webpack_require__(11));


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @export
 * @class NoopErrorHandler
 * @implements {ErrorHandler}
 */
var NoopErrorHandler = /** @class */ (function () {
    function NoopErrorHandler() {
    }
    /**
     * @param {Error} exception
     * @memberof NoopErrorHandler
     */
    NoopErrorHandler.prototype.handleError = function (exception) {
        // no-op
        return;
    };
    return NoopErrorHandler;
}());
exports.NoopErrorHandler = NoopErrorHandler;
var globalErrorHandler = new NoopErrorHandler();
/**
 * @export
 * @param {ErrorHandler} handler
 */
function setErrorHandler(handler) {
    globalErrorHandler = handler;
}
exports.setErrorHandler = setErrorHandler;
/**
 * @export
 * @returns {ErrorHandler}
 */
function getErrorHandler() {
    return globalErrorHandler;
}
exports.getErrorHandler = getErrorHandler;
/**
 * @export
 */
function resetErrorHandler() {
    globalErrorHandler = new NoopErrorHandler();
}
exports.resetErrorHandler = resetErrorHandler;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["NOTSET"] = 0] = "NOTSET";
    LogLevel[LogLevel["DEBUG"] = 1] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["WARNING"] = 3] = "WARNING";
    LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var errorHandler_1 = __webpack_require__(9);
var js_sdk_utils_1 = __webpack_require__(12);
var models_1 = __webpack_require__(10);
var stringToLogLevel = {
    NOTSET: 0,
    DEBUG: 1,
    INFO: 2,
    WARNING: 3,
    ERROR: 4,
};
function coerceLogLevel(level) {
    if (typeof level !== 'string') {
        return level;
    }
    level = level.toUpperCase();
    if (level === 'WARN') {
        level = 'WARNING';
    }
    if (!stringToLogLevel[level]) {
        return level;
    }
    return stringToLogLevel[level];
}
var DefaultLogManager = /** @class */ (function () {
    function DefaultLogManager() {
        this.defaultLoggerFacade = new OptimizelyLogger();
        this.loggers = {};
    }
    DefaultLogManager.prototype.getLogger = function (name) {
        if (!name) {
            return this.defaultLoggerFacade;
        }
        if (!this.loggers[name]) {
            this.loggers[name] = new OptimizelyLogger({ messagePrefix: name });
        }
        return this.loggers[name];
    };
    return DefaultLogManager;
}());
var ConsoleLogHandler = /** @class */ (function () {
    /**
     * Creates an instance of ConsoleLogger.
     * @param {ConsoleLogHandlerConfig} config
     * @memberof ConsoleLogger
     */
    function ConsoleLogHandler(config) {
        if (config === void 0) { config = {}; }
        this.logLevel = models_1.LogLevel.NOTSET;
        if (config.logLevel !== undefined && js_sdk_utils_1.isValidEnum(models_1.LogLevel, config.logLevel)) {
            this.setLogLevel(config.logLevel);
        }
        this.logToConsole = config.logToConsole !== undefined ? !!config.logToConsole : true;
        this.prefix = config.prefix !== undefined ? config.prefix : '[OPTIMIZELY]';
    }
    /**
     * @param {LogLevel} level
     * @param {string} message
     * @memberof ConsoleLogger
     */
    ConsoleLogHandler.prototype.log = function (level, message) {
        if (!this.shouldLog(level) || !this.logToConsole) {
            return;
        }
        var logMessage = this.prefix + " - " + this.getLogLevelName(level) + " " + this.getTime() + " " + message;
        this.consoleLog(level, [logMessage]);
    };
    /**
     * @param {LogLevel} level
     * @memberof ConsoleLogger
     */
    ConsoleLogHandler.prototype.setLogLevel = function (level) {
        level = coerceLogLevel(level);
        if (!js_sdk_utils_1.isValidEnum(models_1.LogLevel, level) || level === undefined) {
            this.logLevel = models_1.LogLevel.ERROR;
        }
        else {
            this.logLevel = level;
        }
    };
    /**
     * @returns {string}
     * @memberof ConsoleLogger
     */
    ConsoleLogHandler.prototype.getTime = function () {
        return new Date().toISOString();
    };
    /**
     * @private
     * @param {LogLevel} targetLogLevel
     * @returns {boolean}
     * @memberof ConsoleLogger
     */
    ConsoleLogHandler.prototype.shouldLog = function (targetLogLevel) {
        return targetLogLevel >= this.logLevel;
    };
    /**
     * @private
     * @param {LogLevel} logLevel
     * @returns {string}
     * @memberof ConsoleLogger
     */
    ConsoleLogHandler.prototype.getLogLevelName = function (logLevel) {
        switch (logLevel) {
            case models_1.LogLevel.DEBUG:
                return 'DEBUG';
            case models_1.LogLevel.INFO:
                return 'INFO ';
            case models_1.LogLevel.WARNING:
                return 'WARN ';
            case models_1.LogLevel.ERROR:
                return 'ERROR';
            default:
                return 'NOTSET';
        }
    };
    /**
     * @private
     * @param {LogLevel} logLevel
     * @param {string[]} logArguments
     * @memberof ConsoleLogger
     */
    ConsoleLogHandler.prototype.consoleLog = function (logLevel, logArguments) {
        switch (logLevel) {
            case models_1.LogLevel.DEBUG:
                console.log.apply(console, logArguments);
                break;
            case models_1.LogLevel.INFO:
                console.info.apply(console, logArguments);
                break;
            case models_1.LogLevel.WARNING:
                console.warn.apply(console, logArguments);
                break;
            case models_1.LogLevel.ERROR:
                console.error.apply(console, logArguments);
                break;
            default:
                console.log.apply(console, logArguments);
        }
    };
    return ConsoleLogHandler;
}());
exports.ConsoleLogHandler = ConsoleLogHandler;
var globalLogLevel = models_1.LogLevel.NOTSET;
var globalLogHandler = null;
var OptimizelyLogger = /** @class */ (function () {
    function OptimizelyLogger(opts) {
        if (opts === void 0) { opts = {}; }
        this.messagePrefix = '';
        if (opts.messagePrefix) {
            this.messagePrefix = opts.messagePrefix;
        }
    }
    /**
     * @param {(LogLevel | LogInputObject)} levelOrObj
     * @param {string} [message]
     * @memberof OptimizelyLogger
     */
    OptimizelyLogger.prototype.log = function (level, message) {
        this.internalLog(coerceLogLevel(level), {
            message: message,
            splat: [],
        });
    };
    OptimizelyLogger.prototype.info = function (message) {
        var splat = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            splat[_i - 1] = arguments[_i];
        }
        this.namedLog(models_1.LogLevel.INFO, message, splat);
    };
    OptimizelyLogger.prototype.debug = function (message) {
        var splat = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            splat[_i - 1] = arguments[_i];
        }
        this.namedLog(models_1.LogLevel.DEBUG, message, splat);
    };
    OptimizelyLogger.prototype.warn = function (message) {
        var splat = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            splat[_i - 1] = arguments[_i];
        }
        this.namedLog(models_1.LogLevel.WARNING, message, splat);
    };
    OptimizelyLogger.prototype.error = function (message) {
        var splat = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            splat[_i - 1] = arguments[_i];
        }
        this.namedLog(models_1.LogLevel.ERROR, message, splat);
    };
    OptimizelyLogger.prototype.format = function (data) {
        return "" + (this.messagePrefix ? this.messagePrefix + ': ' : '') + js_sdk_utils_1.sprintf.apply(void 0, [data.message].concat(data.splat));
    };
    OptimizelyLogger.prototype.internalLog = function (level, data) {
        if (!globalLogHandler) {
            return;
        }
        if (level < globalLogLevel) {
            return;
        }
        globalLogHandler.log(level, this.format(data));
        if (data.error && data.error instanceof Error) {
            errorHandler_1.getErrorHandler().handleError(data.error);
        }
    };
    OptimizelyLogger.prototype.namedLog = function (level, message, splat) {
        var error;
        if (message instanceof Error) {
            error = message;
            message = error.message;
            this.internalLog(level, {
                error: error,
                message: message,
                splat: splat,
            });
            return;
        }
        if (splat.length === 0) {
            this.internalLog(level, {
                message: message,
                splat: splat,
            });
            return;
        }
        var last = splat[splat.length - 1];
        if (last instanceof Error) {
            error = last;
            splat.splice(-1);
        }
        this.internalLog(level, { message: message, error: error, splat: splat });
    };
    return OptimizelyLogger;
}());
var globalLogManager = new DefaultLogManager();
function getLogger(name) {
    return globalLogManager.getLogger(name);
}
exports.getLogger = getLogger;
function setLogHandler(logger) {
    globalLogHandler = logger;
}
exports.setLogHandler = setLogHandler;
function setLogLevel(level) {
    level = coerceLogLevel(level);
    if (!js_sdk_utils_1.isValidEnum(models_1.LogLevel, level) || level === undefined) {
        globalLogLevel = models_1.LogLevel.ERROR;
    }
    else {
        globalLogLevel = level;
    }
}
exports.setLogLevel = setLogLevel;
function getLogLevel() {
    return globalLogLevel;
}
exports.getLogLevel = getLogLevel;
/**
 * Resets all global logger state to it's original
 */
function resetLogger() {
    globalLogManager = new DefaultLogManager();
    globalLogLevel = models_1.LogLevel.NOTSET;
}
exports.resetLogger = resetLogger;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var uuid_1 = __webpack_require__(13);
function getTimestamp() {
    return new Date().getTime();
}
exports.getTimestamp = getTimestamp;
function generateUUID() {
    return uuid_1.v4();
}
exports.generateUUID = generateUUID;
/**
 * Validates a value is a valid TypeScript enum
 *
 * @export
 * @param {object} enumToCheck
 * @param {*} value
 * @returns {boolean}
 */
function isValidEnum(enumToCheck, value) {
    var found = false;
    var keys = Object.keys(enumToCheck);
    for (var index = 0; index < keys.length; index++) {
        if (value === enumToCheck[keys[index]]) {
            found = true;
            break;
        }
    }
    return found;
}
exports.isValidEnum = isValidEnum;
function groupBy(arr, grouperFn) {
    var grouper = {};
    arr.forEach(function (item) {
        var key = grouperFn(item);
        grouper[key] = grouper[key] || [];
        grouper[key].push(item);
    });
    return objectValues(grouper);
}
exports.groupBy = groupBy;
function objectValues(obj) {
    return Object.keys(obj).map(function (key) { return obj[key]; });
}
exports.objectValues = objectValues;
function find(arr, cond) {
    var found;
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var item = arr_1[_i];
        if (cond(item)) {
            found = item;
            break;
        }
    }
    return found;
}
exports.find = find;
function keyBy(arr, keyByFn) {
    var map = {};
    arr.forEach(function (item) {
        var key = keyByFn(item);
        map[key] = item;
    });
    return map;
}
exports.keyBy = keyBy;
function sprintf(format) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var i = 0;
    return format.replace(/%s/g, function () {
        var arg = args[i++];
        var type = typeof arg;
        if (type === 'function') {
            return arg();
        }
        else if (type === 'string') {
            return arg;
        }
        else {
            return String(arg);
        }
    });
}
exports.sprintf = sprintf;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var v1 = __webpack_require__(14);
var v4 = __webpack_require__(17);

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(15);
var bytesToUuid = __webpack_require__(16);

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),
/* 16 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(15);
var bytesToUuid = __webpack_require__(16);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2017, 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var uuid = __webpack_require__(13);
var _isFinite = __webpack_require__(19);
var MAX_NUMBER_LIMIT = Math.pow(2, 53);

module.exports = {
  assign: __webpack_require__(22),
  assignIn: __webpack_require__(71),
  cloneDeep: __webpack_require__(75),
  currentTimestamp: function() {
    return Math.round(new Date().getTime());
  },
  isArray: __webpack_require__(60),
  isEmpty: __webpack_require__(141),
  isFinite: function(number) {
    return _isFinite(number) && Math.abs(number) <= MAX_NUMBER_LIMIT;
  },
  keyBy: __webpack_require__(142),
  filter: __webpack_require__(188),
  forEach: __webpack_require__(190),
  forOwn: __webpack_require__(192),
  map: __webpack_require__(193),
  uuid: function() {
    return uuid.v4();
  },
  values: __webpack_require__(195),
  isNumber: __webpack_require__(197),
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(20);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsFinite = root.isFinite;

/**
 * Checks if `value` is a finite primitive number.
 *
 * **Note:** This method is based on
 * [`Number.isFinite`](https://mdn.io/Number/isFinite).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
 * @example
 *
 * _.isFinite(3);
 * // => true
 *
 * _.isFinite(Number.MIN_VALUE);
 * // => true
 *
 * _.isFinite(Infinity);
 * // => false
 *
 * _.isFinite('3');
 * // => false
 */
function isFinite(value) {
  return typeof value == 'number' && nativeIsFinite(value);
}

module.exports = isFinite;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(21);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(5)))

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(23),
    copyObject = __webpack_require__(39),
    createAssigner = __webpack_require__(40),
    isArrayLike = __webpack_require__(50),
    isPrototype = __webpack_require__(53),
    keys = __webpack_require__(54);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns own enumerable string keyed properties of source objects to the
 * destination object. Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object` and is loosely based on
 * [`Object.assign`](https://mdn.io/Object/assign).
 *
 * @static
 * @memberOf _
 * @since 0.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assignIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assign({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'c': 3 }
 */
var assign = createAssigner(function(object, source) {
  if (isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }
  for (var key in source) {
    if (hasOwnProperty.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});

module.exports = assign;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(24),
    eq = __webpack_require__(38);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(25);

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(26);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(27),
    getValue = __webpack_require__(37);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(28),
    isMasked = __webpack_require__(34),
    isObject = __webpack_require__(33),
    toSource = __webpack_require__(36);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(29),
    isObject = __webpack_require__(33);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(30),
    getRawTag = __webpack_require__(31),
    objectToString = __webpack_require__(32);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(20);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(30);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 33 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(35);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(20);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),
/* 36 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),
/* 37 */
/***/ (function(module, exports) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),
/* 38 */
/***/ (function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(23),
    baseAssignValue = __webpack_require__(24);

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var baseRest = __webpack_require__(41),
    isIterateeCall = __webpack_require__(49);

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(42),
    overRest = __webpack_require__(43),
    setToString = __webpack_require__(45);

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;


/***/ }),
/* 42 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(44);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ }),
/* 44 */
/***/ (function(module, exports) {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var baseSetToString = __webpack_require__(46),
    shortOut = __webpack_require__(48);

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var constant = __webpack_require__(47),
    defineProperty = __webpack_require__(25),
    identity = __webpack_require__(42);

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ }),
/* 47 */
/***/ (function(module, exports) {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ }),
/* 48 */
/***/ (function(module, exports) {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(38),
    isArrayLike = __webpack_require__(50),
    isIndex = __webpack_require__(52),
    isObject = __webpack_require__(33);

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(28),
    isLength = __webpack_require__(51);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),
/* 51 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),
/* 52 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),
/* 53 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(55),
    baseKeys = __webpack_require__(68),
    isArrayLike = __webpack_require__(50);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(56),
    isArguments = __webpack_require__(57),
    isArray = __webpack_require__(60),
    isBuffer = __webpack_require__(61),
    isIndex = __webpack_require__(52),
    isTypedArray = __webpack_require__(64);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),
/* 56 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(58),
    isObjectLike = __webpack_require__(59);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(29),
    isObjectLike = __webpack_require__(59);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),
/* 59 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 60 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(20),
    stubFalse = __webpack_require__(63);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(62)(module)))

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 63 */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(65),
    baseUnary = __webpack_require__(66),
    nodeUtil = __webpack_require__(67);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(29),
    isLength = __webpack_require__(51),
    isObjectLike = __webpack_require__(59);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),
/* 66 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(21);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(62)(module)))

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var isPrototype = __webpack_require__(53),
    nativeKeys = __webpack_require__(69);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(70);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),
/* 70 */
/***/ (function(module, exports) {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(39),
    createAssigner = __webpack_require__(40),
    keysIn = __webpack_require__(72);

/**
 * This method is like `_.assign` except that it iterates over own and
 * inherited source properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extend
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assign
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assignIn({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
 */
var assignIn = createAssigner(function(object, source) {
  copyObject(source, keysIn(source), object);
});

module.exports = assignIn;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(55),
    baseKeysIn = __webpack_require__(73),
    isArrayLike = __webpack_require__(50);

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(33),
    isPrototype = __webpack_require__(53),
    nativeKeysIn = __webpack_require__(74);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;


/***/ }),
/* 74 */
/***/ (function(module, exports) {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var baseClone = __webpack_require__(76);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

module.exports = cloneDeep;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(77),
    arrayEach = __webpack_require__(106),
    assignValue = __webpack_require__(23),
    baseAssign = __webpack_require__(107),
    baseAssignIn = __webpack_require__(108),
    cloneBuffer = __webpack_require__(109),
    copyArray = __webpack_require__(110),
    copySymbols = __webpack_require__(111),
    copySymbolsIn = __webpack_require__(115),
    getAllKeys = __webpack_require__(119),
    getAllKeysIn = __webpack_require__(121),
    getTag = __webpack_require__(122),
    initCloneArray = __webpack_require__(127),
    initCloneByTag = __webpack_require__(128),
    initCloneObject = __webpack_require__(135),
    isArray = __webpack_require__(60),
    isBuffer = __webpack_require__(61),
    isMap = __webpack_require__(137),
    isObject = __webpack_require__(33),
    isSet = __webpack_require__(139),
    keys = __webpack_require__(54);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });

    return result;
  }

  if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });

    return result;
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(78),
    stackClear = __webpack_require__(85),
    stackDelete = __webpack_require__(86),
    stackGet = __webpack_require__(87),
    stackHas = __webpack_require__(88),
    stackSet = __webpack_require__(89);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(79),
    listCacheDelete = __webpack_require__(80),
    listCacheGet = __webpack_require__(82),
    listCacheHas = __webpack_require__(83),
    listCacheSet = __webpack_require__(84);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),
/* 79 */
/***/ (function(module, exports) {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(81);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(38);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(81);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(81);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(81);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(78);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),
/* 86 */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),
/* 87 */
/***/ (function(module, exports) {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),
/* 88 */
/***/ (function(module, exports) {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(78),
    Map = __webpack_require__(90),
    MapCache = __webpack_require__(91);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(26),
    root = __webpack_require__(20);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(92),
    mapCacheDelete = __webpack_require__(100),
    mapCacheGet = __webpack_require__(103),
    mapCacheHas = __webpack_require__(104),
    mapCacheSet = __webpack_require__(105);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(93),
    ListCache = __webpack_require__(78),
    Map = __webpack_require__(90);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(94),
    hashDelete = __webpack_require__(96),
    hashGet = __webpack_require__(97),
    hashHas = __webpack_require__(98),
    hashSet = __webpack_require__(99);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(95);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(26);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),
/* 96 */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(95);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(95);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(95);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(101);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

var isKeyable = __webpack_require__(102);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),
/* 102 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(101);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(101);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(101);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),
/* 106 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(39),
    keys = __webpack_require__(54);

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(39),
    keysIn = __webpack_require__(72);

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(20);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(62)(module)))

/***/ }),
/* 110 */
/***/ (function(module, exports) {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(39),
    getSymbols = __webpack_require__(112);

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(113),
    stubArray = __webpack_require__(114);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),
/* 113 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),
/* 114 */
/***/ (function(module, exports) {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(39),
    getSymbolsIn = __webpack_require__(116);

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(117),
    getPrototype = __webpack_require__(118),
    getSymbols = __webpack_require__(112),
    stubArray = __webpack_require__(114);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;


/***/ }),
/* 117 */
/***/ (function(module, exports) {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(70);

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(120),
    getSymbols = __webpack_require__(112),
    keys = __webpack_require__(54);

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(117),
    isArray = __webpack_require__(60);

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(120),
    getSymbolsIn = __webpack_require__(116),
    keysIn = __webpack_require__(72);

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

var DataView = __webpack_require__(123),
    Map = __webpack_require__(90),
    Promise = __webpack_require__(124),
    Set = __webpack_require__(125),
    WeakMap = __webpack_require__(126),
    baseGetTag = __webpack_require__(29),
    toSource = __webpack_require__(36);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(26),
    root = __webpack_require__(20);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(26),
    root = __webpack_require__(20);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(26),
    root = __webpack_require__(20);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(26),
    root = __webpack_require__(20);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),
/* 127 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(129),
    cloneDataView = __webpack_require__(131),
    cloneRegExp = __webpack_require__(132),
    cloneSymbol = __webpack_require__(133),
    cloneTypedArray = __webpack_require__(134);

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return new Ctor;

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return new Ctor;

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var Uint8Array = __webpack_require__(130);

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(20);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(129);

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;


/***/ }),
/* 132 */
/***/ (function(module, exports) {

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(30);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(129);

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var baseCreate = __webpack_require__(136),
    getPrototype = __webpack_require__(118),
    isPrototype = __webpack_require__(53);

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(33);

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsMap = __webpack_require__(138),
    baseUnary = __webpack_require__(66),
    nodeUtil = __webpack_require__(67);

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

module.exports = isMap;


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var getTag = __webpack_require__(122),
    isObjectLike = __webpack_require__(59);

/** `Object#toString` result references. */
var mapTag = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

module.exports = baseIsMap;


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsSet = __webpack_require__(140),
    baseUnary = __webpack_require__(66),
    nodeUtil = __webpack_require__(67);

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

module.exports = isSet;


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var getTag = __webpack_require__(122),
    isObjectLike = __webpack_require__(59);

/** `Object#toString` result references. */
var setTag = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}

module.exports = baseIsSet;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var baseKeys = __webpack_require__(68),
    getTag = __webpack_require__(122),
    isArguments = __webpack_require__(57),
    isArray = __webpack_require__(60),
    isArrayLike = __webpack_require__(50),
    isBuffer = __webpack_require__(61),
    isPrototype = __webpack_require__(53),
    isTypedArray = __webpack_require__(64);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) &&
      (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
        isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

module.exports = isEmpty;


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(24),
    createAggregator = __webpack_require__(143);

/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` thru `iteratee`. The corresponding value of
 * each key is the last element responsible for generating the key. The
 * iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * var array = [
 *   { 'dir': 'left', 'code': 97 },
 *   { 'dir': 'right', 'code': 100 }
 * ];
 *
 * _.keyBy(array, function(o) {
 *   return String.fromCharCode(o.code);
 * });
 * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
 *
 * _.keyBy(array, 'dir');
 * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
 */
var keyBy = createAggregator(function(result, value, key) {
  baseAssignValue(result, key, value);
});

module.exports = keyBy;


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var arrayAggregator = __webpack_require__(144),
    baseAggregator = __webpack_require__(145),
    baseIteratee = __webpack_require__(151),
    isArray = __webpack_require__(60);

/**
 * Creates a function like `_.groupBy`.
 *
 * @private
 * @param {Function} setter The function to set accumulator values.
 * @param {Function} [initializer] The accumulator object initializer.
 * @returns {Function} Returns the new aggregator function.
 */
function createAggregator(setter, initializer) {
  return function(collection, iteratee) {
    var func = isArray(collection) ? arrayAggregator : baseAggregator,
        accumulator = initializer ? initializer() : {};

    return func(collection, setter, baseIteratee(iteratee, 2), accumulator);
  };
}

module.exports = createAggregator;


/***/ }),
/* 144 */
/***/ (function(module, exports) {

/**
 * A specialized version of `baseAggregator` for arrays.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function arrayAggregator(array, setter, iteratee, accumulator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    var value = array[index];
    setter(accumulator, value, iteratee(value), array);
  }
  return accumulator;
}

module.exports = arrayAggregator;


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

var baseEach = __webpack_require__(146);

/**
 * Aggregates elements of `collection` on `accumulator` with keys transformed
 * by `iteratee` and values set by `setter`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function baseAggregator(collection, setter, iteratee, accumulator) {
  baseEach(collection, function(value, key, collection) {
    setter(accumulator, value, iteratee(value), collection);
  });
  return accumulator;
}

module.exports = baseAggregator;


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

var baseForOwn = __webpack_require__(147),
    createBaseEach = __webpack_require__(150);

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

var baseFor = __webpack_require__(148),
    keys = __webpack_require__(54);

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

var createBaseFor = __webpack_require__(149);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;


/***/ }),
/* 149 */
/***/ (function(module, exports) {

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(50);

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

var baseMatches = __webpack_require__(152),
    baseMatchesProperty = __webpack_require__(169),
    identity = __webpack_require__(42),
    isArray = __webpack_require__(60),
    property = __webpack_require__(185);

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsMatch = __webpack_require__(153),
    getMatchData = __webpack_require__(166),
    matchesStrictComparable = __webpack_require__(168);

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(77),
    baseIsEqual = __webpack_require__(154);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqualDeep = __webpack_require__(155),
    isObjectLike = __webpack_require__(59);

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(77),
    equalArrays = __webpack_require__(156),
    equalByTag = __webpack_require__(162),
    equalObjects = __webpack_require__(165),
    getTag = __webpack_require__(122),
    isArray = __webpack_require__(60),
    isBuffer = __webpack_require__(61),
    isTypedArray = __webpack_require__(64);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(157),
    arraySome = __webpack_require__(160),
    cacheHas = __webpack_require__(161);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(91),
    setCacheAdd = __webpack_require__(158),
    setCacheHas = __webpack_require__(159);

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ }),
/* 158 */
/***/ (function(module, exports) {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ }),
/* 159 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ }),
/* 160 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;


/***/ }),
/* 161 */
/***/ (function(module, exports) {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(30),
    Uint8Array = __webpack_require__(130),
    eq = __webpack_require__(38),
    equalArrays = __webpack_require__(156),
    mapToArray = __webpack_require__(163),
    setToArray = __webpack_require__(164);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;


/***/ }),
/* 163 */
/***/ (function(module, exports) {

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;


/***/ }),
/* 164 */
/***/ (function(module, exports) {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

var getAllKeys = __webpack_require__(119);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

var isStrictComparable = __webpack_require__(167),
    keys = __webpack_require__(54);

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(33);

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;


/***/ }),
/* 168 */
/***/ (function(module, exports) {

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqual = __webpack_require__(154),
    get = __webpack_require__(170),
    hasIn = __webpack_require__(182),
    isKey = __webpack_require__(173),
    isStrictComparable = __webpack_require__(167),
    matchesStrictComparable = __webpack_require__(168),
    toKey = __webpack_require__(181);

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(171);

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(172),
    toKey = __webpack_require__(181);

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(60),
    isKey = __webpack_require__(173),
    stringToPath = __webpack_require__(175),
    toString = __webpack_require__(178);

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(60),
    isSymbol = __webpack_require__(174);

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(29),
    isObjectLike = __webpack_require__(59);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

var memoizeCapped = __webpack_require__(176);

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

var memoize = __webpack_require__(177);

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(91);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

var baseToString = __webpack_require__(179);

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(30),
    arrayMap = __webpack_require__(180),
    isArray = __webpack_require__(60),
    isSymbol = __webpack_require__(174);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),
/* 180 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(174);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

var baseHasIn = __webpack_require__(183),
    hasPath = __webpack_require__(184);

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;


/***/ }),
/* 183 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(172),
    isArguments = __webpack_require__(57),
    isArray = __webpack_require__(60),
    isIndex = __webpack_require__(52),
    isLength = __webpack_require__(51),
    toKey = __webpack_require__(181);

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

var baseProperty = __webpack_require__(186),
    basePropertyDeep = __webpack_require__(187),
    isKey = __webpack_require__(173),
    toKey = __webpack_require__(181);

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;


/***/ }),
/* 186 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(171);

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(113),
    baseFilter = __webpack_require__(189),
    baseIteratee = __webpack_require__(151),
    isArray = __webpack_require__(60);

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 */
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = filter;


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

var baseEach = __webpack_require__(146);

/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

module.exports = baseFilter;


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

var arrayEach = __webpack_require__(106),
    baseEach = __webpack_require__(146),
    castFunction = __webpack_require__(191),
    isArray = __webpack_require__(60);

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

module.exports = forEach;


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(42);

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

module.exports = castFunction;


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

var baseForOwn = __webpack_require__(147),
    castFunction = __webpack_require__(191);

/**
 * Iterates over own enumerable string keyed properties of an object and
 * invokes `iteratee` for each property. The iteratee is invoked with three
 * arguments: (value, key, object). Iteratee functions may exit iteration
 * early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 0.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forOwnRight
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forOwn(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forOwn(object, iteratee) {
  return object && baseForOwn(object, castFunction(iteratee));
}

module.exports = forOwn;


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(180),
    baseIteratee = __webpack_require__(151),
    baseMap = __webpack_require__(194),
    isArray = __webpack_require__(60);

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = map;


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

var baseEach = __webpack_require__(146),
    isArrayLike = __webpack_require__(50);

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

var baseValues = __webpack_require__(196),
    keys = __webpack_require__(54);

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}

module.exports = values;


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(180);

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

module.exports = baseValues;


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(29),
    isObjectLike = __webpack_require__(59);

/** `Object#toString` result references. */
var numberTag = '[object Number]';

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * classified as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike(value) && baseGetTag(value) == numberTag);
}

module.exports = isNumber;


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2016, 2018, 2019 Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var sprintf = __webpack_require__(12).sprintf;

var ERROR_MESSAGES = __webpack_require__(199).ERROR_MESSAGES;
var MODULE_NAME = 'CONFIG_VALIDATOR';
var DATAFILE_VERSIONS = __webpack_require__(199).DATAFILE_VERSIONS;

var SUPPORTED_VERSIONS = [
  DATAFILE_VERSIONS.V2,
  DATAFILE_VERSIONS.V3,
  DATAFILE_VERSIONS.V4
];

/**
 * Provides utility methods for validating that the configuration options are valid
 */
module.exports = {
  /**
   * Validates the given config options
   * @param  {Object} config
   * @param  {Object} config.errorHandler
   * @param  {Object} config.eventDispatcher
   * @param  {Object} config.logger
   * @return {Boolean} True if the config options are valid
   * @throws If any of the config options are not valid
   */
  validate: function(config) {
    if (config.errorHandler && (typeof config.errorHandler.handleError !== 'function')) {
      throw new Error(sprintf(ERROR_MESSAGES.INVALID_ERROR_HANDLER, MODULE_NAME));
    }

    if (config.eventDispatcher && (typeof config.eventDispatcher.dispatchEvent !== 'function')) {
      throw new Error(sprintf(ERROR_MESSAGES.INVALID_EVENT_DISPATCHER, MODULE_NAME));
    }

    if (config.logger && (typeof config.logger.log !== 'function')) {
      throw new Error(sprintf(ERROR_MESSAGES.INVALID_LOGGER, MODULE_NAME));
    }

    return true;
  },

  /**
   * Validates the datafile
   * @param {string}  datafile
   * @return {Boolean} True if the datafile is valid
   * @throws If the datafile is not valid for any of the following reasons:
                - The datafile string is undefined
                - The datafile string cannot be parsed as a JSON object
                - The datafile version is not supported
   */
  validateDatafile: function(datafile) {
    if (!datafile) {
      throw new Error(sprintf(ERROR_MESSAGES.NO_DATAFILE_SPECIFIED, MODULE_NAME));
    }

    if (typeof datafile === 'string' || datafile instanceof String) {
      // Attempt to parse the datafile string
      try {
        datafile = JSON.parse(datafile);
      } catch (ex) {
        throw new Error(sprintf(ERROR_MESSAGES.INVALID_DATAFILE_MALFORMED, MODULE_NAME));
      }
    }

    if (SUPPORTED_VERSIONS.indexOf(datafile.version) === -1) {
      throw new Error(sprintf(ERROR_MESSAGES.INVALID_DATAFILE_VERSION, MODULE_NAME, datafile.version));
    }

    return true;
  }
};


/***/ }),
/* 199 */
/***/ (function(module, exports) {

/****************************************************************************
 * Copyright 2016-2019, Optimizely, Inc. and contributors                   *
 *                                                                          *
 * Licensed under the Apache License, Version 2.0 (the "License");          *
 * you may not use this file except in compliance with the License.         *
 * You may obtain a copy of the License at                                  *
 *                                                                          *
 *    http://www.apache.org/licenses/LICENSE-2.0                            *
 *                                                                          *
 * Unless required by applicable law or agreed to in writing, software      *
 * distributed under the License is distributed on an "AS IS" BASIS,        *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. *
 * See the License for the specific language governing permissions and      *
 * limitations under the License.                                           *
 ***************************************************************************/

/**
 * Contains global enums used throughout the library
 */
exports.LOG_LEVEL = {
  NOTSET: 0,
  DEBUG: 1,
  INFO: 2,
  WARNING: 3,
  ERROR: 4,
};

exports.ERROR_MESSAGES = {
  DATAFILE_AND_SDK_KEY_MISSING: '%s: You must provide at least one of sdkKey or datafile. Cannot start Optimizely',
  EXPERIMENT_KEY_NOT_IN_DATAFILE: '%s: Experiment key %s is not in datafile.',
  FEATURE_NOT_IN_DATAFILE: '%s: Feature key %s is not in datafile.',
  IMPROPERLY_FORMATTED_EXPERIMENT: '%s: Experiment key %s is improperly formatted.',
  INVALID_ATTRIBUTES: '%s: Provided attributes are in an invalid format.',
  INVALID_BUCKETING_ID: '%s: Unable to generate hash for bucketing ID %s: %s',
  INVALID_DATAFILE: '%s: Datafile is invalid - property %s: %s',
  INVALID_DATAFILE_MALFORMED: '%s: Datafile is invalid because it is malformed.',
  INVALID_JSON: '%s: JSON object is not valid.',
  INVALID_ERROR_HANDLER: '%s: Provided "errorHandler" is in an invalid format.',
  INVALID_EVENT_DISPATCHER: '%s: Provided "eventDispatcher" is in an invalid format.',
  INVALID_EVENT_KEY: '%s: Event key %s is not in datafile.',
  INVALID_EVENT_TAGS: '%s: Provided event tags are in an invalid format.',
  INVALID_EXPERIMENT_KEY: '%s: Experiment key %s is not in datafile. It is either invalid, paused, or archived.',
  INVALID_EXPERIMENT_ID: '%s: Experiment ID %s is not in datafile.',
  INVALID_GROUP_ID: '%s: Group ID %s is not in datafile.',
  INVALID_LOGGER: '%s: Provided "logger" is in an invalid format.',
  INVALID_ROLLOUT_ID: '%s: Invalid rollout ID %s attached to feature %s',
  INVALID_USER_ID: '%s: Provided user ID is in an invalid format.',
  INVALID_USER_PROFILE_SERVICE: '%s: Provided user profile service instance is in an invalid format: %s.',
  JSON_SCHEMA_EXPECTED: '%s: JSON schema expected.',
  NO_DATAFILE_SPECIFIED: '%s: No datafile specified. Cannot start optimizely.',
  NO_JSON_PROVIDED: '%s: No JSON object to validate against schema.',
  NO_VARIATION_FOR_EXPERIMENT_KEY: '%s: No variation key %s defined in datafile for experiment %s.',
  UNDEFINED_ATTRIBUTE: '%s: Provided attribute: %s has an undefined value.',
  UNRECOGNIZED_ATTRIBUTE: '%s: Unrecognized attribute %s provided. Pruning before sending event to Optimizely.',
  UNABLE_TO_CAST_VALUE: '%s: Unable to cast value %s to type %s, returning null.',
  USER_NOT_IN_FORCED_VARIATION: '%s: User %s is not in the forced variation map. Cannot remove their forced variation.',
  USER_PROFILE_LOOKUP_ERROR: '%s: Error while looking up user profile for user ID "%s": %s.',
  USER_PROFILE_SAVE_ERROR: '%s: Error while saving user profile for user ID "%s": %s.',
  VARIABLE_KEY_NOT_IN_DATAFILE: '%s: Variable with key "%s" associated with feature with key "%s" is not in datafile.',
  VARIATION_ID_NOT_IN_DATAFILE: '%s: No variation ID %s defined in datafile for experiment %s.',
  VARIATION_ID_NOT_IN_DATAFILE_NO_EXPERIMENT: '%s: Variation ID %s is not in the datafile.',
  INVALID_INPUT_FORMAT: '%s: Provided %s is in an invalid format.',
  INVALID_DATAFILE_VERSION: '%s: This version of the JavaScript SDK does not support the given datafile version: %s',
  INVALID_VARIATION_KEY: '%s: Provided variation key is in an invalid format.',
};

exports.LOG_MESSAGES = {
  ACTIVATE_USER: '%s: Activating user %s in experiment %s.',
  DISPATCH_CONVERSION_EVENT: '%s: Dispatching conversion event to URL %s with params %s.',
  DISPATCH_IMPRESSION_EVENT: '%s: Dispatching impression event to URL %s with params %s.',
  DEPRECATED_EVENT_VALUE: '%s: Event value is deprecated in %s call.',
  EXPERIMENT_NOT_RUNNING: '%s: Experiment %s is not running.',
  FEATURE_ENABLED_FOR_USER: '%s: Feature %s is enabled for user %s.',
  FEATURE_NOT_ENABLED_FOR_USER: '%s: Feature %s is not enabled for user %s.',
  FEATURE_HAS_NO_EXPERIMENTS: '%s: Feature %s is not attached to any experiments.',
  FAILED_TO_PARSE_VALUE: '%s: Failed to parse event value "%s" from event tags.',
  FAILED_TO_PARSE_REVENUE: '%s: Failed to parse revenue value "%s" from event tags.',
  FORCED_BUCKETING_FAILED: '%s: Variation key %s is not in datafile. Not activating user %s.',
  INVALID_OBJECT: '%s: Optimizely object is not valid. Failing %s.',
  INVALID_CLIENT_ENGINE: '%s: Invalid client engine passed: %s. Defaulting to node-sdk.',
  INVALID_VARIATION_ID: '%s: Bucketed into an invalid variation ID. Returning null.',
  NOTIFICATION_LISTENER_EXCEPTION: '%s: Notification listener for (%s) threw exception: %s',
  NO_ROLLOUT_EXISTS: '%s: There is no rollout of feature %s.',
  NOT_ACTIVATING_USER: '%s: Not activating user %s for experiment %s.',
  NOT_TRACKING_USER: '%s: Not tracking user %s.',
  PARSED_REVENUE_VALUE: '%s: Parsed revenue value "%s" from event tags.',
  PARSED_NUMERIC_VALUE: '%s: Parsed event value "%s" from event tags.',
  RETURNING_STORED_VARIATION: '%s: Returning previously activated variation "%s" of experiment "%s" for user "%s" from user profile.',
  ROLLOUT_HAS_NO_EXPERIMENTS: '%s: Rollout of feature %s has no experiments',
  SAVED_VARIATION: '%s: Saved variation "%s" of experiment "%s" for user "%s".',
  SAVED_VARIATION_NOT_FOUND: '%s: User %s was previously bucketed into variation with ID %s for experiment %s, but no matching variation was found.',
  SHOULD_NOT_DISPATCH_ACTIVATE: '%s: Experiment %s is in "Launched" state. Not activating user.',
  SKIPPING_JSON_VALIDATION: '%s: Skipping JSON schema validation.',
  TRACK_EVENT: '%s: Tracking event %s for user %s.',
  USER_ASSIGNED_TO_VARIATION_BUCKET: '%s: Assigned variation bucket %s to user %s.',
  USER_ASSIGNED_TO_EXPERIMENT_BUCKET: '%s: Assigned experiment bucket %s to user %s.',
  USER_BUCKETED_INTO_EXPERIMENT_IN_GROUP: '%s: User %s is in experiment %s of group %s.',
  USER_BUCKETED_INTO_TARGETING_RULE: '%s: User %s bucketed into targeting rule %s.',
  USER_IN_FEATURE_EXPERIMENT: '%s: User %s is in variation %s of experiment %s on the feature %s.',
  USER_IN_ROLLOUT: '%s: User %s is in rollout of feature %s.',
  USER_BUCKETED_INTO_EVERYONE_TARGETING_RULE: '%s: User %s bucketed into everyone targeting rule.',
  USER_NOT_BUCKETED_INTO_EVERYONE_TARGETING_RULE: '%s: User %s not bucketed into everyone targeting rule due to traffic allocation.',
  USER_NOT_BUCKETED_INTO_EXPERIMENT_IN_GROUP: '%s: User %s is not in experiment %s of group %s.',
  USER_NOT_BUCKETED_INTO_ANY_EXPERIMENT_IN_GROUP: '%s: User %s is not in any experiment of group %s.',
  USER_NOT_BUCKETED_INTO_TARGETING_RULE: '%s User %s not bucketed into targeting rule %s due to traffic allocation. Trying everyone rule.',
  USER_NOT_IN_FEATURE_EXPERIMENT: '%s: User %s is not in any experiment on the feature %s.',
  USER_NOT_IN_ROLLOUT: '%s: User %s is not in rollout of feature %s.',
  USER_FORCED_IN_VARIATION: '%s: User %s is forced in variation %s.',
  USER_MAPPED_TO_FORCED_VARIATION: '%s: Set variation %s for experiment %s and user %s in the forced variation map.',
  USER_DOESNT_MEET_CONDITIONS_FOR_TARGETING_RULE: '%s: User %s does not meet conditions for targeting rule %s.',
  USER_MEETS_CONDITIONS_FOR_TARGETING_RULE: '%s: User %s meets conditions for targeting rule %s.',
  USER_HAS_VARIATION: '%s: User %s is in variation %s of experiment %s.',
  USER_HAS_FORCED_VARIATION: '%s: Variation %s is mapped to experiment %s and user %s in the forced variation map.',
  USER_HAS_NO_VARIATION: '%s: User %s is in no variation of experiment %s.',
  USER_HAS_NO_FORCED_VARIATION: '%s: User %s is not in the forced variation map.',
  USER_HAS_NO_FORCED_VARIATION_FOR_EXPERIMENT: '%s: No experiment %s mapped to user %s in the forced variation map.',
  USER_NOT_IN_ANY_EXPERIMENT: '%s: User %s is not in any experiment of group %s.',
  USER_NOT_IN_EXPERIMENT: '%s: User %s does not meet conditions to be in experiment %s.',
  USER_RECEIVED_DEFAULT_VARIABLE_VALUE: '%s: User "%s" is not in any variation or rollout rule. Returning default value for variable "%s" of feature flag "%s".',
  FEATURE_NOT_ENABLED_RETURN_DEFAULT_VARIABLE_VALUE: '%s: Feature "%s" is not enabled for user %s. Returning default value for variable "%s".',
  VARIABLE_NOT_USED_RETURN_DEFAULT_VARIABLE_VALUE: '%s: Variable "%s" is not used in variation "%s". Returning default value.',
  USER_RECEIVED_VARIABLE_VALUE: '%s: Value for variable "%s" of feature flag "%s" is %s for user "%s"',
  VALID_DATAFILE: '%s: Datafile is valid.',
  VALID_USER_PROFILE_SERVICE: '%s: Valid user profile service provided.',
  VARIATION_REMOVED_FOR_USER: '%s: Variation mapped to experiment %s has been removed for user %s.',
  VARIABLE_REQUESTED_WITH_WRONG_TYPE: '%s: Requested variable type "%s", but variable is of type "%s". Use correct API to retrieve value. Returning None.',
  VALID_BUCKETING_ID: '%s: BucketingId is valid: "%s"',
  BUCKETING_ID_NOT_STRING: '%s: BucketingID attribute is not a string. Defaulted to userId',
  EVALUATING_AUDIENCE: '%s: Starting to evaluate audience "%s" with conditions: %s.',
  EVALUATING_AUDIENCES_COMBINED: '%s: Evaluating audiences for experiment "%s": %s.',
  AUDIENCE_EVALUATION_RESULT: '%s: Audience "%s" evaluated to %s.',
  AUDIENCE_EVALUATION_RESULT_COMBINED: '%s: Audiences for experiment %s collectively evaluated to %s.',
  MISSING_ATTRIBUTE_VALUE: '%s: Audience condition %s evaluated to UNKNOWN because no value was passed for user attribute "%s".',
  UNEXPECTED_CONDITION_VALUE: '%s: Audience condition %s evaluated to UNKNOWN because the condition value is not supported.',
  UNEXPECTED_TYPE: '%s: Audience condition %s evaluated to UNKNOWN because a value of type "%s" was passed for user attribute "%s".',
  UNEXPECTED_TYPE_NULL: '%s: Audience condition %s evaluated to UNKNOWN because a null value was passed for user attribute "%s".',
  UNKNOWN_CONDITION_TYPE: '%s: Audience condition %s has an unknown condition type. You may need to upgrade to a newer release of the Optimizely SDK.',
  UNKNOWN_MATCH_TYPE: '%s: Audience condition %s uses an unknown match type. You may need to upgrade to a newer release of the Optimizely SDK.',
  UPDATED_OPTIMIZELY_CONFIG: '%s: Updated Optimizely config to revision %s (project id %s)',
  OUT_OF_BOUNDS: '%s: Audience condition %s evaluated to UNKNOWN because the number value for user attribute "%s" is not in the range [-2^53, +2^53].',
};

exports.RESERVED_EVENT_KEYWORDS = {
  REVENUE: 'revenue',
  VALUE: 'value',
};

exports.CONTROL_ATTRIBUTES = {
  BOT_FILTERING: '$opt_bot_filtering',
  BUCKETING_ID: '$opt_bucketing_id',
  STICKY_BUCKETING_KEY: '$opt_experiment_bucket_map',
  USER_AGENT: '$opt_user_agent',
};

exports.JAVASCRIPT_CLIENT_ENGINE = 'javascript-sdk';
exports.NODE_CLIENT_ENGINE = 'node-sdk';
exports.REACT_CLIENT_ENGINE = 'react-sdk';
exports.NODE_CLIENT_VERSION = '3.2.0';

exports.VALID_CLIENT_ENGINES = [
  exports.NODE_CLIENT_ENGINE,
  exports.REACT_CLIENT_ENGINE,
  exports.JAVASCRIPT_CLIENT_ENGINE,
];

/*
 * Notification types for use with NotificationCenter
 * Format is EVENT: <list of parameters to callback>
 *
 * SDK consumers can use these to register callbacks with the notification center.
 *
 *  @deprecated since 3.1.0
 *  ACTIVATE: An impression event will be sent to Optimizely
 *  Callbacks will receive an object argument with the following properties:
 *    - experiment {Object}
 *    - userId {string}
 *    - attributes {Object|undefined}
 *    - variation {Object}
 *    - logEvent {Object}
 *
 *  DECISION: A decision is made in the system. i.e. user activation,
 *  feature access or feature-variable value retrieval
 *  Callbacks will receive an object argument with the following properties:
 *    - type {string}
 *    - userId {string}
 *    - attributes {Object|undefined}
 *    - decisionInfo {Object|undefined}
 *
 *  OPTIMIZELY_CONFIG_UPDATE: This Optimizely instance has been updated with a new
 *  config
 *
 *  TRACK: A conversion event will be sent to Optimizely
 *  Callbacks will receive the an object argument with the following properties:
 *    - eventKey {string}
 *    - userId {string}
 *    - attributes {Object|undefined}
 *    - eventTags {Object|undefined}
 *    - logEvent {Object}
 *
 */
exports.NOTIFICATION_TYPES = {
  ACTIVATE: 'ACTIVATE:experiment, user_id,attributes, variation, event',
  DECISION: 'DECISION:type, userId, attributes, decisionInfo',
  OPTIMIZELY_CONFIG_UPDATE: 'OPTIMIZELY_CONFIG_UPDATE',
  TRACK: 'TRACK:event_key, user_id, attributes, event_tags, event',
};

exports.DECISION_NOTIFICATION_TYPES = {
  AB_TEST: 'ab-test',
  FEATURE: 'feature',
  FEATURE_TEST: 'feature-test',
  FEATURE_VARIABLE: 'feature-variable',
};

/*
 * Represents the source of a decision for feature management. When a feature
 * is accessed through isFeatureEnabled or getVariableValue APIs, the decision
 * source is used to decide whether to dispatch an impression event to
 * Optimizely.
 */
exports.DECISION_SOURCES = {
  FEATURE_TEST: 'feature-test',
  ROLLOUT: 'rollout',
};

/*
 * Possible types of variables attached to features
 */
exports.FEATURE_VARIABLE_TYPES = {
  BOOLEAN: 'boolean',
  DOUBLE: 'double',
  INTEGER: 'integer',
  STRING: 'string',
};

/*
 * Supported datafile versions
 */
exports.DATAFILE_VERSIONS = {
  V2: '2',
  V3: '3',
  V4: '4',
};


/***/ }),
/* 200 */
/***/ (function(module, exports) {

/**
 * Copyright 2016, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Default error handler implementation
 */
module.exports = {
  /**
   * Handle given exception
   * @param  {Object} exception An exception object
   */
  handleError: function(exception) {
    // no-op
  }
};


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2016-2017, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var fns = __webpack_require__(18);

var POST_METHOD = 'POST';
var GET_METHOD = 'GET';
var READYSTATE_COMPLETE = 4;

module.exports = {
  /**
   * Sample event dispatcher implementation for tracking impression and conversions
   * Users of the SDK can provide their own implementation
   * @param  {Object} eventObj
   * @param  {Function} callback
   */
  dispatchEvent: function(eventObj, callback) {
    var url = eventObj.url;
    var params = eventObj.params;
    if (eventObj.httpVerb === POST_METHOD) {
      var req = new XMLHttpRequest();
      req.open(POST_METHOD, url, true);
      req.setRequestHeader('Content-Type', 'application/json');
      req.onreadystatechange = function() {
        if (req.readyState === READYSTATE_COMPLETE && callback && typeof callback === 'function') {
          try {
            callback(params);
          } catch (e) {
            // TODO: Log this somehow (consider adding a logger to the EventDispatcher interface)
          }
        }
      };
      req.send(JSON.stringify(params));
    } else {
      // add param for cors headers to be sent by the log endpoint
      url += '?wxhr=true';
      if (params) {
        url += '&' + toQueryString(params);
      }

      var req = new XMLHttpRequest();
      req.open(GET_METHOD, url, true);
      req.onreadystatechange = function() {
        if (req.readyState === READYSTATE_COMPLETE && callback && typeof callback === 'function') {
          try {
            callback();
          } catch (e) {
            // TODO: Log this somehow (consider adding a logger to the EventDispatcher interface)
          }
        }
      };
      req.send();
    }
  },
};

var toQueryString = function(obj) {
  return fns.map(obj, function(v, k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(v);
  }).join('&');
};


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(203));
__export(__webpack_require__(205));
__export(__webpack_require__(207));
__export(__webpack_require__(208));


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var eventQueue_1 = __webpack_require__(204);
var js_sdk_logging_1 = __webpack_require__(8);
var logger = js_sdk_logging_1.getLogger('EventProcessor');
var MIN_FLUSH_INTERVAL = 100;
var AbstractEventProcessor = /** @class */ (function () {
    function AbstractEventProcessor(_a) {
        var dispatcher = _a.dispatcher, _b = _a.transformers, transformers = _b === void 0 ? [] : _b, _c = _a.interceptors, interceptors = _c === void 0 ? [] : _c, _d = _a.callbacks, callbacks = _d === void 0 ? [] : _d, _e = _a.flushInterval, flushInterval = _e === void 0 ? 30000 : _e, _f = _a.maxQueueSize, maxQueueSize = _f === void 0 ? 3000 : _f;
        var _this = this;
        this.dispatcher = dispatcher;
        maxQueueSize = Math.max(1, maxQueueSize);
        if (maxQueueSize > 1) {
            this.queue = new eventQueue_1.DefaultEventQueue({
                flushInterval: Math.max(flushInterval, MIN_FLUSH_INTERVAL),
                maxQueueSize: maxQueueSize,
                sink: function (buffer) { return _this.drainQueue(buffer); },
            });
        }
        else {
            this.queue = new eventQueue_1.SingleEventQueue({
                sink: function (buffer) { return _this.drainQueue(buffer); },
            });
        }
        this.transformers = transformers;
        this.interceptors = interceptors;
        this.callbacks = callbacks;
    }
    AbstractEventProcessor.prototype.drainQueue = function (buffer) {
        var _this = this;
        logger.debug('draining queue with %s events', buffer.length);
        var promises = this.groupEvents(buffer).map(function (eventGroup) {
            var formattedEvent = _this.formatEvents(eventGroup);
            return new Promise(function (resolve, reject) {
                _this.dispatcher.dispatchEvent(formattedEvent, function (response) {
                    // loop through every event in the group and run the callback handler
                    // with result
                    eventGroup.forEach(function (event) {
                        _this.callbacks.forEach(function (handler) {
                            handler({
                                result: isResponseSuccess(response),
                                event: event,
                            });
                        });
                    });
                    resolve();
                });
            });
        });
        return Promise.all(promises);
    };
    // TODO change this to ProjectConfig when js-sdk-models is available
    AbstractEventProcessor.prototype.process = function (event, projectConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, transformer, ex_1, _b, _c, interceptor, result, ex_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _i = 0, _a = this.transformers;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        transformer = _a[_i];
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, transformer(event, projectConfig)];
                    case 3:
                        _d.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        ex_1 = _d.sent();
                        // swallow error and move on
                        logger.error('eventTransformer threw error', ex_1.message, ex_1);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        Object.freeze(event);
                        _b = 0, _c = this.interceptors;
                        _d.label = 7;
                    case 7:
                        if (!(_b < _c.length)) return [3 /*break*/, 13];
                        interceptor = _c[_b];
                        result = void 0;
                        _d.label = 8;
                    case 8:
                        _d.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, interceptor(event, projectConfig)];
                    case 9:
                        result = _d.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        ex_2 = _d.sent();
                        // swallow and continue
                        logger.error('eventInterceptor threw error', ex_2.message, ex_2);
                        return [3 /*break*/, 11];
                    case 11:
                        if (result === false) {
                            return [2 /*return*/];
                        }
                        _d.label = 12;
                    case 12:
                        _b++;
                        return [3 /*break*/, 7];
                    case 13:
                        this.queue.enqueue(event);
                        return [2 /*return*/];
                }
            });
        });
    };
    AbstractEventProcessor.prototype.stop = function () {
        try {
            // swallow, an error stopping this queue should prevent this from stopping
            return this.queue.stop();
        }
        catch (e) {
            logger.error('Error stopping EventProcessor: "%s"', e.message, e);
        }
        return Promise.resolve();
    };
    AbstractEventProcessor.prototype.start = function () {
        this.queue.start();
    };
    return AbstractEventProcessor;
}());
exports.AbstractEventProcessor = AbstractEventProcessor;
function isResponseSuccess(response) {
    try {
        var statusCode = void 0;
        if ('statusCode' in response) {
            statusCode = response.statusCode;
        }
        else if ('status' in response) {
            statusCode = response.status;
        }
        else {
            return false;
        }
        return statusCode >= 200 && statusCode < 300;
    }
    catch (e) {
        return false;
    }
}


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Timer = /** @class */ (function () {
    function Timer(_a) {
        var timeout = _a.timeout, callback = _a.callback;
        this.timeout = Math.max(timeout, 0);
        this.callback = callback;
    }
    Timer.prototype.start = function () {
        this.timeoutId = setTimeout(this.callback, this.timeout);
    };
    Timer.prototype.refresh = function () {
        this.stop();
        this.start();
    };
    Timer.prototype.stop = function () {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    };
    return Timer;
}());
var SingleEventQueue = /** @class */ (function () {
    function SingleEventQueue(_a) {
        var sink = _a.sink;
        this.sink = sink;
    }
    SingleEventQueue.prototype.start = function () {
        // no-op
    };
    SingleEventQueue.prototype.stop = function () {
        // no-op
        return Promise.resolve();
    };
    SingleEventQueue.prototype.enqueue = function (event) {
        this.sink([event]);
    };
    return SingleEventQueue;
}());
exports.SingleEventQueue = SingleEventQueue;
var DefaultEventQueue = /** @class */ (function () {
    function DefaultEventQueue(_a) {
        var flushInterval = _a.flushInterval, maxQueueSize = _a.maxQueueSize, sink = _a.sink;
        this.buffer = [];
        this.maxQueueSize = Math.max(maxQueueSize, 1);
        this.sink = sink;
        this.timer = new Timer({
            callback: this.flush.bind(this),
            timeout: flushInterval,
        });
    }
    DefaultEventQueue.prototype.start = function () {
        // dont start the timer until the first event is enqueued
    };
    DefaultEventQueue.prototype.stop = function () {
        var result = this.sink(this.buffer);
        this.timer.stop();
        return result;
    };
    DefaultEventQueue.prototype.enqueue = function (event) {
        // start the timer when the first event is put in
        if (this.buffer.length === 0) {
            this.timer.refresh();
        }
        this.buffer.push(event);
        if (this.buffer.length >= this.maxQueueSize) {
            this.flush();
        }
    };
    DefaultEventQueue.prototype.flush = function () {
        this.sink(this.buffer);
        this.buffer = [];
        this.timer.stop();
    };
    return DefaultEventQueue;
}());
exports.DefaultEventQueue = DefaultEventQueue;


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var js_sdk_logging_1 = __webpack_require__(8);
var pendingEventsStore_1 = __webpack_require__(206);
var js_sdk_utils_1 = __webpack_require__(12);
var logger = js_sdk_logging_1.getLogger('EventProcessor');
var PendingEventsDispatcher = /** @class */ (function () {
    function PendingEventsDispatcher(_a) {
        var eventDispatcher = _a.eventDispatcher, store = _a.store;
        this.dispatcher = eventDispatcher;
        this.store = store;
    }
    PendingEventsDispatcher.prototype.dispatchEvent = function (request, callback) {
        this.send({
            uuid: js_sdk_utils_1.generateUUID(),
            timestamp: js_sdk_utils_1.getTimestamp(),
            request: request,
        }, callback);
    };
    PendingEventsDispatcher.prototype.sendPendingEvents = function () {
        var _this = this;
        var pendingEvents = this.store.values();
        logger.debug('Sending %s pending events from previous page', pendingEvents.length);
        pendingEvents.forEach(function (item) {
            try {
                _this.send(item, function () { });
            }
            catch (e) { }
        });
    };
    PendingEventsDispatcher.prototype.send = function (entry, callback) {
        var _this = this;
        this.store.set(entry.uuid, entry);
        this.dispatcher.dispatchEvent(entry.request, function (response) {
            _this.store.remove(entry.uuid);
            callback(response);
        });
    };
    return PendingEventsDispatcher;
}());
exports.PendingEventsDispatcher = PendingEventsDispatcher;
var LocalStoragePendingEventsDispatcher = /** @class */ (function (_super) {
    __extends(LocalStoragePendingEventsDispatcher, _super);
    function LocalStoragePendingEventsDispatcher(_a) {
        var eventDispatcher = _a.eventDispatcher;
        return _super.call(this, {
            eventDispatcher: eventDispatcher,
            store: new pendingEventsStore_1.LocalStorageStore({
                // TODO make this configurable
                maxValues: 100,
                key: 'fs_optly_pending_events',
            }),
        }) || this;
    }
    return LocalStoragePendingEventsDispatcher;
}(PendingEventsDispatcher));
exports.LocalStoragePendingEventsDispatcher = LocalStoragePendingEventsDispatcher;


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var js_sdk_utils_1 = __webpack_require__(12);
var js_sdk_logging_1 = __webpack_require__(8);
var logger = js_sdk_logging_1.getLogger('EventProcessor');
var LocalStorageStore = /** @class */ (function () {
    function LocalStorageStore(_a) {
        var key = _a.key, _b = _a.maxValues, maxValues = _b === void 0 ? 1000 : _b;
        this.LS_KEY = key;
        this.maxValues = maxValues;
    }
    LocalStorageStore.prototype.get = function (key) {
        return this.getMap()[key] || null;
    };
    LocalStorageStore.prototype.set = function (key, value) {
        var map = this.getMap();
        map[key] = value;
        this.replace(map);
    };
    LocalStorageStore.prototype.remove = function (key) {
        var map = this.getMap();
        delete map[key];
        this.replace(map);
    };
    LocalStorageStore.prototype.values = function () {
        return js_sdk_utils_1.objectValues(this.getMap());
    };
    LocalStorageStore.prototype.clear = function () {
        this.replace({});
    };
    LocalStorageStore.prototype.replace = function (map) {
        try {
            localStorage.setItem(this.LS_KEY, JSON.stringify(map));
            this.clean();
        }
        catch (e) {
            logger.error(e);
        }
    };
    LocalStorageStore.prototype.clean = function () {
        var map = this.getMap();
        var keys = Object.keys(map);
        var toRemove = keys.length - this.maxValues;
        if (toRemove < 1) {
            return;
        }
        var entries = keys.map(function (key) { return ({
            key: key,
            value: map[key]
        }); });
        entries.sort(function (a, b) { return a.value.timestamp - b.value.timestamp; });
        for (var i = 0; i < toRemove; i++) {
            delete map[entries[i].key];
        }
        this.replace(map);
    };
    LocalStorageStore.prototype.getMap = function () {
        try {
            var data = localStorage.getItem(this.LS_KEY);
            if (data) {
                return JSON.parse(data) || {};
            }
        }
        catch (e) {
            logger.error(e);
        }
        return {};
    };
    return LocalStorageStore;
}());
exports.LocalStorageStore = LocalStorageStore;


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ACTIVATE_EVENT_KEY = 'campaign_activated';
var CUSTOM_ATTRIBUTE_FEATURE_TYPE = 'custom';
var BOT_FILTERING_KEY = '$opt_bot_filtering';
/**
 * Given an array of batchable Decision or ConversionEvent events it returns
 * a single EventV1 with proper batching
 *
 * @param {ProcessableEvents[]} events
 * @returns {EventV1}
 */
function makeBatchedEventV1(events) {
    var visitors = [];
    var data = events[0];
    events.forEach(function (event) {
        if (event.type === 'conversion' || event.type === 'impression') {
            var visitor = makeVisitor(event);
            if (event.type === 'impression') {
                visitor.snapshots.push(makeDecisionSnapshot(event));
            }
            else if (event.type === 'conversion') {
                visitor.snapshots.push(makeConversionSnapshot(event));
            }
            visitors.push(visitor);
        }
    });
    return {
        client_name: data.context.clientName,
        client_version: data.context.clientVersion,
        account_id: data.context.accountId,
        project_id: data.context.projectId,
        revision: data.context.revision,
        anonymize_ip: data.context.anonymizeIP,
        enrich_decisions: true,
        visitors: visitors,
    };
}
exports.makeBatchedEventV1 = makeBatchedEventV1;
function makeConversionSnapshot(conversion) {
    var tags = __assign({}, conversion.tags);
    delete tags['revenue'];
    delete tags['value'];
    var event = {
        entity_id: conversion.event.id,
        key: conversion.event.key,
        timestamp: conversion.timestamp,
        uuid: conversion.uuid,
    };
    if (conversion.tags) {
        event.tags = conversion.tags;
    }
    if (conversion.value != null) {
        event.value = conversion.value;
    }
    if (conversion.revenue != null) {
        event.revenue = conversion.revenue;
    }
    return {
        events: [event],
    };
}
function makeDecisionSnapshot(event) {
    var layer = event.layer, experiment = event.experiment, variation = event.variation;
    var layerId = layer ? layer.id : null;
    var experimentId = experiment ? experiment.id : null;
    var variationId = variation ? variation.id : null;
    return {
        decisions: [
            {
                campaign_id: layerId,
                experiment_id: experimentId,
                variation_id: variationId,
            },
        ],
        events: [
            {
                entity_id: layerId,
                timestamp: event.timestamp,
                key: ACTIVATE_EVENT_KEY,
                uuid: event.uuid,
            },
        ],
    };
}
function makeVisitor(data) {
    var visitor = {
        snapshots: [],
        visitor_id: data.user.id,
        attributes: [],
    };
    data.user.attributes.forEach(function (attr) {
        visitor.attributes.push({
            entity_id: attr.entityId,
            key: attr.key,
            type: 'custom',
            value: attr.value,
        });
    });
    if (typeof data.context.botFiltering === 'boolean') {
        visitor.attributes.push({
            entity_id: BOT_FILTERING_KEY,
            key: BOT_FILTERING_KEY,
            type: CUSTOM_ATTRIBUTE_FEATURE_TYPE,
            value: data.context.botFiltering,
        });
    }
    return visitor;
}
/**
 * Event for usage with v1 logtier
 *
 * @export
 * @interface EventBuilderV1
 */
function buildImpressionEventV1(data) {
    var visitor = makeVisitor(data);
    visitor.snapshots.push(makeDecisionSnapshot(data));
    return {
        client_name: data.context.clientName,
        client_version: data.context.clientVersion,
        account_id: data.context.accountId,
        project_id: data.context.projectId,
        revision: data.context.revision,
        anonymize_ip: data.context.anonymizeIP,
        enrich_decisions: true,
        visitors: [visitor],
    };
}
exports.buildImpressionEventV1 = buildImpressionEventV1;
function buildConversionEventV1(data) {
    var visitor = makeVisitor(data);
    visitor.snapshots.push(makeConversionSnapshot(data));
    return {
        client_name: data.context.clientName,
        client_version: data.context.clientVersion,
        account_id: data.context.accountId,
        project_id: data.context.projectId,
        revision: data.context.revision,
        anonymize_ip: data.context.anonymizeIP,
        enrich_decisions: true,
        visitors: [visitor],
    };
}
exports.buildConversionEventV1 = buildConversionEventV1;


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var js_sdk_utils_1 = __webpack_require__(12);
var eventProcessor_1 = __webpack_require__(203);
var buildEventV1_1 = __webpack_require__(207);
var LogTierV1EventProcessor = /** @class */ (function (_super) {
    __extends(LogTierV1EventProcessor, _super);
    function LogTierV1EventProcessor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LogTierV1EventProcessor.prototype.buildGroupByKey = function (event) {
        return js_sdk_utils_1.objectValues(event.context).join('|');
    };
    LogTierV1EventProcessor.prototype.groupEvents = function (events) {
        var _this = this;
        return js_sdk_utils_1.groupBy(events, function (event) { return _this.buildGroupByKey(event); });
    };
    LogTierV1EventProcessor.prototype.formatEvents = function (events) {
        return {
            url: 'https://logx.optimizely.com/v1/events',
            httpVerb: 'POST',
            params: buildEventV1_1.makeBatchedEventV1(events),
        };
    };
    return LogTierV1EventProcessor;
}(eventProcessor_1.AbstractEventProcessor));
exports.LogTierV1EventProcessor = LogTierV1EventProcessor;


/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2016-2017, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var logging = __webpack_require__(8);

function NoOpLogger() {}

NoOpLogger.prototype.log = function() {};

module.exports = {
  createLogger: function(opts) {
    return new logging.ConsoleLogHandler(opts);
  },

  createNoOpLogger: function() {
    return new NoOpLogger();
  },
};


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

/****************************************************************************
 * Copyright 2016-2019, Optimizely, Inc. and contributors                   *
 *                                                                          *
 * Licensed under the Apache License, Version 2.0 (the "License");          *
 * you may not use this file except in compliance with the License.         *
 * You may obtain a copy of the License at                                  *
 *                                                                          *
 *    http://www.apache.org/licenses/LICENSE-2.0                            *
 *                                                                          *
 * Unless required by applicable law or agreed to in writing, software      *
 * distributed under the License is distributed on an "AS IS" BASIS,        *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. *
 * See the License for the specific language governing permissions and      *
 * limitations under the License.                                           *
 ***************************************************************************/

var fns = __webpack_require__(18);
var attributesValidator = __webpack_require__(211);
var decisionService = __webpack_require__(212);
var enums = __webpack_require__(199);
var eventBuilder = __webpack_require__(221);
var eventHelpers = __webpack_require__(223);
var eventProcessor = __webpack_require__(202);
var eventTagsValidator = __webpack_require__(224);
var notificationCenter = __webpack_require__(225);
var projectConfig = __webpack_require__(218);
var sprintf = __webpack_require__(12).sprintf;
var userProfileServiceValidator = __webpack_require__(226);
var stringValidator = __webpack_require__(220);
var projectConfigManager = __webpack_require__(227);

var ERROR_MESSAGES = enums.ERROR_MESSAGES;
var LOG_LEVEL = enums.LOG_LEVEL;
var LOG_MESSAGES = enums.LOG_MESSAGES;
var MODULE_NAME = 'OPTIMIZELY';
var DECISION_SOURCES = enums.DECISION_SOURCES;
var FEATURE_VARIABLE_TYPES = enums.FEATURE_VARIABLE_TYPES;
var DECISION_NOTIFICATION_TYPES = enums.DECISION_NOTIFICATION_TYPES;
var NOTIFICATION_TYPES = enums.NOTIFICATION_TYPES;

var DEFAULT_EVENT_MAX_QUEUE_SIZE = 1;
var DEFAULT_EVENT_FLUSH_INTERVAL = 5000;
var DEFAULT_ONREADY_TIMEOUT = 30000;

/**
 * The Optimizely class
 * @param {Object} config
 * @param {string} config.clientEngine
 * @param {string} config.clientVersion
 * @param {Object} config.datafile
 * @param {Object} config.errorHandler
 * @param {Object} config.eventDispatcher
 * @param {Object} config.logger
 * @param {Object} config.skipJSONValidation
 * @param {Object} config.userProfileService
 * @param {Object} config.eventBatchSize
 * @param {Object} config.eventFlushInterval
 */
function Optimizely(config) {
  var clientEngine = config.clientEngine;
  if (enums.VALID_CLIENT_ENGINES.indexOf(clientEngine) === -1) {
    config.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.INVALID_CLIENT_ENGINE, MODULE_NAME, clientEngine));
    clientEngine = enums.NODE_CLIENT_ENGINE;
  }

  this.clientEngine = clientEngine;
  this.clientVersion = config.clientVersion || enums.NODE_CLIENT_VERSION;
  this.errorHandler = config.errorHandler;
  this.eventDispatcher = config.eventDispatcher;
  this.__isOptimizelyConfigValid = config.isValidInstance;
  this.logger = config.logger;

  this.projectConfigManager = new projectConfigManager.ProjectConfigManager({
    datafile: config.datafile,
    datafileOptions: config.datafileOptions,
    jsonSchemaValidator: config.jsonSchemaValidator,
    sdkKey: config.sdkKey,
    skipJSONValidation: config.skipJSONValidation,
  });

  this.__disposeOnUpdate = this.projectConfigManager.onUpdate(function(configObj) {
    this.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.UPDATED_OPTIMIZELY_CONFIG, MODULE_NAME, configObj.revision, configObj.projectId));
    this.notificationCenter.sendNotifications(NOTIFICATION_TYPES.OPTIMIZELY_CONFIG_UPDATE);
  }.bind(this));

  this.__readyPromise = this.projectConfigManager.onReady();

  var userProfileService = null;
  if (config.userProfileService) {
    try {
      if (userProfileServiceValidator.validate(config.userProfileService)) {
        userProfileService = config.userProfileService;
        this.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.VALID_USER_PROFILE_SERVICE, MODULE_NAME));
      }
    } catch (ex) {
      this.logger.log(LOG_LEVEL.WARNING, ex.message);
    }
  }

  this.decisionService = decisionService.createDecisionService({
    userProfileService: userProfileService,
    logger: this.logger,
  });

  this.notificationCenter = notificationCenter.createNotificationCenter({
    logger: this.logger,
    errorHandler: this.errorHandler,
  });

  this.eventProcessor = new eventProcessor.LogTierV1EventProcessor({
    dispatcher: this.eventDispatcher,
    flushInterval: config.eventFlushInterval || DEFAULT_EVENT_FLUSH_INTERVAL,
    maxQueueSize: config.eventBatchSize || DEFAULT_EVENT_MAX_QUEUE_SIZE,
  });
  this.eventProcessor.start();

  this.__readyTimeouts = {};
  this.__nextReadyTimeoutId = 0;
}

/**
 * Returns a truthy value if this instance currently has a valid project config
 * object, and the initial configuration object that was passed into the
 * constructor was also valid.
 * @return {*}
 */
Optimizely.prototype.__isValidInstance = function() {
  return this.__isOptimizelyConfigValid && this.projectConfigManager.getConfig();
};

/**
 * Buckets visitor and sends impression event to Optimizely.
 * @param  {string}      experimentKey
 * @param  {string}      userId
 * @param  {Object}      attributes
 * @return {string|null} variation key
 */
Optimizely.prototype.activate = function(experimentKey, userId, attributes) {
  try {
    if (!this.__isValidInstance()) {
      this.logger.log(LOG_LEVEL.ERROR, sprintf(LOG_MESSAGES.INVALID_OBJECT, MODULE_NAME, 'activate'));
      return null;
    }

    if (!this.__validateInputs({ experiment_key: experimentKey, user_id: userId }, attributes)) {
      return this.__notActivatingExperiment(experimentKey, userId);
    }

    var configObj = this.projectConfigManager.getConfig();
    if (!configObj) {
      return null;
    }

    try {
      var variationKey = this.getVariation(experimentKey, userId, attributes);
      if (variationKey === null) {
        return this.__notActivatingExperiment(experimentKey, userId);
      }

      // If experiment is not set to 'Running' status, log accordingly and return variation key
      if (!projectConfig.isRunning(configObj, experimentKey)) {
        var shouldNotDispatchActivateLogMessage = sprintf(
          LOG_MESSAGES.SHOULD_NOT_DISPATCH_ACTIVATE,
          MODULE_NAME,
          experimentKey
        );
        this.logger.log(LOG_LEVEL.DEBUG, shouldNotDispatchActivateLogMessage);
        return variationKey;
      }

      this._sendImpressionEvent(experimentKey, variationKey, userId, attributes);

      return variationKey;
    } catch (ex) {
      this.logger.log(LOG_LEVEL.ERROR, ex.message);
      var failedActivationLogMessage = sprintf(LOG_MESSAGES.NOT_ACTIVATING_USER, MODULE_NAME, userId, experimentKey);
      this.logger.log(LOG_LEVEL.INFO, failedActivationLogMessage);
      this.errorHandler.handleError(ex);
      return null;
    }
  } catch (e) {
    this.logger.log(LOG_LEVEL.ERROR, e.message);
    this.errorHandler.handleError(e);
    return null;
  }
};

/**
 * Create an impression event and call the event dispatcher's dispatch method to
 * send this event to Optimizely. Then use the notification center to trigger
 * any notification listeners for the ACTIVATE notification type.
 * @param {string} experimentKey  Key of experiment that was activated
 * @param {string} variationKey   Key of variation shown in experiment that was activated
 * @param {string} userId         ID of user to whom the variation was shown
 * @param {Object} attributes     Optional user attributes
 */
Optimizely.prototype._sendImpressionEvent = function(experimentKey, variationKey, userId, attributes) {
  var configObj = this.projectConfigManager.getConfig();
  if (!configObj) {
    return;
  }

  var impressionEvent = eventHelpers.buildImpressionEvent({
    experimentKey: experimentKey,
    variationKey: variationKey,
    userId: userId,
    userAttributes: attributes,
    clientEngine: this.clientEngine,
    clientVersion: this.clientVersion,
    configObj: configObj,
  });
  // TODO is it okay to not pass a projectConfig as second argument
  this.eventProcessor.process(impressionEvent);
  this.__emitNotificationCenterActivate(experimentKey, variationKey, userId, attributes);
};

/**
 * Emit the ACTIVATE notification on the notificationCenter
 * @param {string} experimentKey  Key of experiment that was activated
 * @param {string} variationKey   Key of variation shown in experiment that was activated
 * @param {string} userId         ID of user to whom the variation was shown
 * @param {Object} attributes     Optional user attributes
 */
Optimizely.prototype.__emitNotificationCenterActivate = function(experimentKey, variationKey, userId, attributes) {
  var configObj = this.projectConfigManager.getConfig();
  if (!configObj) {
    return;
  }

  var variationId = projectConfig.getVariationIdFromExperimentAndVariationKey(
    configObj,
    experimentKey,
    variationKey
  );
  var experimentId = projectConfig.getExperimentId(configObj, experimentKey);
  var impressionEventOptions = {
    attributes: attributes,
    clientEngine: this.clientEngine,
    clientVersion: this.clientVersion,
    configObj: configObj,
    experimentId: experimentId,
    userId: userId,
    variationId: variationId,
    logger: this.logger,
  };
  var impressionEvent = eventBuilder.getImpressionEvent(impressionEventOptions);
  var experiment = configObj.experimentKeyMap[experimentKey];
  var variation;
  if (experiment && experiment.variationKeyMap) {
    variation = experiment.variationKeyMap[variationKey];
  }
  this.notificationCenter.sendNotifications(
    NOTIFICATION_TYPES.ACTIVATE,
    {
      experiment: experiment,
      userId: userId,
      attributes: attributes,
      variation: variation,
      logEvent: impressionEvent
    }
  );
};

/**
 * Sends conversion event to Optimizely.
 * @param  {string} eventKey
 * @param  {string} userId
 * @param  {string} attributes
 * @param  {Object} eventTags Values associated with the event.
 */
Optimizely.prototype.track = function(eventKey, userId, attributes, eventTags) {
  try {
    if (!this.__isValidInstance()) {
      this.logger.log(LOG_LEVEL.ERROR, sprintf(LOG_MESSAGES.INVALID_OBJECT, MODULE_NAME, 'track'));
      return;
    }

    if (!this.__validateInputs({ user_id: userId, event_key: eventKey }, attributes, eventTags)) {
      return;
    }

    var configObj = this.projectConfigManager.getConfig();
    if (!configObj) {
      return;
    }

    if (!projectConfig.eventWithKeyExists(configObj, eventKey)) {
      throw new Error(sprintf(ERROR_MESSAGES.INVALID_EVENT_KEY, MODULE_NAME, eventKey));
    }

    // remove null values from eventTags
    eventTags = this.__filterEmptyValues(eventTags);
    var conversionEvent = eventHelpers.buildConversionEvent({
      eventKey: eventKey,
      eventTags: eventTags,
      userId: userId,
      userAttributes: attributes,
      clientEngine: this.clientEngine,
      clientVersion: this.clientVersion,
      configObj: configObj,
    });
    this.logger.log(LOG_LEVEL.INFO, sprintf(enums.LOG_MESSAGES.TRACK_EVENT, MODULE_NAME, eventKey, userId));
    // TODO is it okay to not pass a projectConfig as second argument
    this.eventProcessor.process(conversionEvent);
    this.__emitNotificationCenterTrack(eventKey, userId, attributes, eventTags);
  } catch (e) {
    this.logger.log(LOG_LEVEL.ERROR, e.message);
    this.errorHandler.handleError(e);
    var failedTrackLogMessage = sprintf(LOG_MESSAGES.NOT_TRACKING_USER, MODULE_NAME, userId);
    this.logger.log(LOG_LEVEL.INFO, failedTrackLogMessage);
  }
};

/**
 * Send TRACK event to notificationCenter
 * @param  {string} eventKey
 * @param  {string} userId
 * @param  {string} attributes
 * @param  {Object} eventTags Values associated with the event.
 */
Optimizely.prototype.__emitNotificationCenterTrack = function(eventKey, userId, attributes, eventTags) {
  try {
    var configObj = this.projectConfigManager.getConfig();
    if (!configObj) {
      return;
    }

    var conversionEventOptions = {
      attributes: attributes,
      clientEngine: this.clientEngine,
      clientVersion: this.clientVersion,
      configObj: configObj,
      eventKey: eventKey,
      eventTags: eventTags,
      logger: this.logger,
      userId: userId,
    };
    var conversionEvent = eventBuilder.getConversionEvent(conversionEventOptions);

    this.notificationCenter.sendNotifications(NOTIFICATION_TYPES.TRACK, {
      eventKey: eventKey,
      userId: userId,
      attributes: attributes,
      eventTags: eventTags,
      logEvent: conversionEvent,
    });
  } catch (ex) {
    this.logger.log(LOG_LEVEL.ERROR, ex.message);
    this.errorHandler.handleError(ex);
  }
};

/**
 * Gets variation where visitor will be bucketed.
 * @param  {string}      experimentKey
 * @param  {string}      userId
 * @param  {Object}      attributes
 * @return {string|null} variation key
 */
Optimizely.prototype.getVariation = function(experimentKey, userId, attributes) {
  try {
    if (!this.__isValidInstance()) {
      this.logger.log(LOG_LEVEL.ERROR, sprintf(LOG_MESSAGES.INVALID_OBJECT, MODULE_NAME, 'getVariation'));
      return null;
    }

    try {
      if (!this.__validateInputs({ experiment_key: experimentKey, user_id: userId }, attributes)) {
        return null;
      }

      var configObj = this.projectConfigManager.getConfig();
      if (!configObj) {
        return null;
      }

      var experiment = configObj.experimentKeyMap[experimentKey];
      if (fns.isEmpty(experiment)) {
        this.logger.log(LOG_LEVEL.DEBUG, sprintf(ERROR_MESSAGES.INVALID_EXPERIMENT_KEY, MODULE_NAME, experimentKey));
        return null;
      }

      var variationKey = this.decisionService.getVariation(configObj, experimentKey, userId, attributes);
      var decisionNotificationType = projectConfig.isFeatureExperiment(configObj, experiment.id) ? DECISION_NOTIFICATION_TYPES.FEATURE_TEST :
        DECISION_NOTIFICATION_TYPES.AB_TEST;

      this.notificationCenter.sendNotifications(
        NOTIFICATION_TYPES.DECISION,
        {
          type: decisionNotificationType,
          userId: userId,
          attributes: attributes || {},
          decisionInfo: {
            experimentKey: experimentKey,
            variationKey: variationKey,
          }
        }
      );

      return variationKey;
    } catch (ex) {
      this.logger.log(LOG_LEVEL.ERROR, ex.message);
      this.errorHandler.handleError(ex);
      return null;
    }
  } catch (e) {
    this.logger.log(LOG_LEVEL.ERROR, e.message);
    this.errorHandler.handleError(e);
    return null;
  }
};

/**
 * Force a user into a variation for a given experiment.
 * @param {string} experimentKey
 * @param {string} userId
 * @param {string|null} variationKey user will be forced into. If null, then clear the existing experiment-to-variation mapping.
 * @return boolean A boolean value that indicates if the set completed successfully.
 */
Optimizely.prototype.setForcedVariation = function(experimentKey, userId, variationKey) {
  if (!this.__validateInputs({ experiment_key: experimentKey, user_id: userId })) {
    return false;
  }

  var configObj = this.projectConfigManager.getConfig();
  if (!configObj) {
    return false;
  }

  try {
    return this.decisionService.setForcedVariation(configObj, experimentKey, userId, variationKey);
  } catch (ex) {
    this.logger.log(LOG_LEVEL.ERROR, ex.message);
    this.errorHandler.handleError(ex);
    return false;
  }
};

/**
 * Gets the forced variation for a given user and experiment.
 * @param  {string} experimentKey
 * @param  {string} userId
 * @return {string|null} The forced variation key.
 */
Optimizely.prototype.getForcedVariation = function(experimentKey, userId) {
  if (!this.__validateInputs({ experiment_key: experimentKey, user_id: userId })) {
    return null;
  }

  var configObj = this.projectConfigManager.getConfig();
  if (!configObj) {
    return null;
  }

  try {
    return this.decisionService.getForcedVariation(configObj, experimentKey, userId);
  } catch (ex) {
    this.logger.log(LOG_LEVEL.ERROR, ex.message);
    this.errorHandler.handleError(ex);
    return null;
  }
};

/**
 * Validate string inputs, user attributes and event tags.
 * @param  {string}  stringInputs   Map of string keys and associated values
 * @param  {Object}  userAttributes Optional parameter for user's attributes
 * @param  {Object}  eventTags      Optional parameter for event tags
 * @return {boolean} True if inputs are valid
 *
 */
Optimizely.prototype.__validateInputs = function(stringInputs, userAttributes, eventTags) {
  try {
    // Null, undefined or non-string user Id is invalid.
    if (stringInputs.hasOwnProperty('user_id')) {
      var userId = stringInputs.user_id;
      if (typeof userId !== 'string' || userId === null || userId === 'undefined') {
        throw new Error(sprintf(ERROR_MESSAGES.INVALID_INPUT_FORMAT, MODULE_NAME, 'user_id'));
      }

      delete stringInputs.user_id;
    }

    var inputKeys = Object.keys(stringInputs);
    for (var index = 0; index < inputKeys.length; index++) {
      var key = inputKeys[index];
      if (!stringValidator.validate(stringInputs[key])) {
        throw new Error(sprintf(ERROR_MESSAGES.INVALID_INPUT_FORMAT, MODULE_NAME, key));
      }
    }
    if (userAttributes) {
      attributesValidator.validate(userAttributes);
    }
    if (eventTags) {
      eventTagsValidator.validate(eventTags);
    }
    return true;
  } catch (ex) {
    this.logger.log(LOG_LEVEL.ERROR, ex.message);
    this.errorHandler.handleError(ex);
    return false;
  }
};

/**
 * Shows failed activation log message and returns null when user is not activated in experiment
 * @param  experimentKey
 * @param  userId
 * @return {null}
 */
Optimizely.prototype.__notActivatingExperiment = function(experimentKey, userId) {
  var failedActivationLogMessage = sprintf(LOG_MESSAGES.NOT_ACTIVATING_USER, MODULE_NAME, userId, experimentKey);
  this.logger.log(LOG_LEVEL.INFO, failedActivationLogMessage);
  return null;
};

/**
 * Filters out attributes/eventTags with null or undefined values
 * @param  map
 * @returns {Object} map
 */
Optimizely.prototype.__filterEmptyValues = function(map) {
  for (var key in map) {
    if (map.hasOwnProperty(key) && (map[key] === null || map[key] === undefined)) {
      delete map[key];
    }
  }
  return map;
};

/**
 * Returns true if the feature is enabled for the given user.
 * @param {string} featureKey   Key of feature which will be checked
 * @param {string} userId       ID of user which will be checked
 * @param {Object} attributes   Optional user attributes
 * @return {boolean}            True if the feature is enabled for the user, false otherwise
 */
Optimizely.prototype.isFeatureEnabled = function(featureKey, userId, attributes) {
  try {
    if (!this.__isValidInstance()) {
      this.logger.log(LOG_LEVEL.ERROR, sprintf(LOG_MESSAGES.INVALID_OBJECT, MODULE_NAME, 'isFeatureEnabled'));
      return false;
    }

    if (!this.__validateInputs({ feature_key: featureKey, user_id: userId }, attributes)) {
      return false;
    }

    var configObj = this.projectConfigManager.getConfig();
    if (!configObj) {
      return false;
    }

    var feature = projectConfig.getFeatureFromKey(configObj, featureKey, this.logger);
    if (!feature) {
      return false;
    }

    var featureEnabled = false;
    var decision = this.decisionService.getVariationForFeature(configObj, feature, userId, attributes);
    var variation = decision.variation;
    var sourceInfo = {};

    if (!!variation) {
      featureEnabled = variation.featureEnabled;
      if (decision.decisionSource === DECISION_SOURCES.FEATURE_TEST) {
        sourceInfo = {
          experimentKey: decision.experiment.key,
          variationKey: decision.variation.key,
        }
        // got a variation from the exp, so we track the impression
        this._sendImpressionEvent(decision.experiment.key, decision.variation.key, userId, attributes);
      }
    }

    if (featureEnabled === true) {
      this.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.FEATURE_ENABLED_FOR_USER, MODULE_NAME, featureKey, userId));
    } else {
      this.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.FEATURE_NOT_ENABLED_FOR_USER, MODULE_NAME, featureKey, userId));
      featureEnabled = false;
    }

    var featureInfo = {
      featureKey: featureKey,
      featureEnabled: featureEnabled,
      source: decision.decisionSource,
      sourceInfo: sourceInfo
    };

    this.notificationCenter.sendNotifications(
      NOTIFICATION_TYPES.DECISION,
      {
        type: DECISION_NOTIFICATION_TYPES.FEATURE,
        userId: userId,
        attributes: attributes || {},
        decisionInfo: featureInfo,
      }
    );

    return featureEnabled;
  } catch (e) {
    this.logger.log(LOG_LEVEL.ERROR, e.message);
    this.errorHandler.handleError(e);
    return false;
  }
};

/**
 * Returns an Array containing the keys of all features in the project that are
 * enabled for the given user.
 * @param {string} userId
 * @param {Object} attributes
 * @return {Array} Array of feature keys (strings)
 */
Optimizely.prototype.getEnabledFeatures = function(userId, attributes) {
  try {
    var enabledFeatures = [];
    if (!this.__isValidInstance()) {
      this.logger.log(LOG_LEVEL.ERROR, sprintf(LOG_MESSAGES.INVALID_OBJECT, MODULE_NAME, 'getEnabledFeatures'));
      return enabledFeatures;
    }

    if (!this.__validateInputs({ user_id: userId })) {
      return enabledFeatures;
    }

    var configObj = this.projectConfigManager.getConfig();
    if (!configObj) {
      return enabledFeatures;
    }

    fns.forOwn(
      configObj.featureKeyMap,
      function(feature) {
        if (this.isFeatureEnabled(feature.key, userId, attributes)) {
          enabledFeatures.push(feature.key);
        }
      }.bind(this)
    );

    return enabledFeatures;
  } catch (e) {
    this.logger.log(LOG_LEVEL.ERROR, e.message);
    this.errorHandler.handleError(e);
    return [];
  }
};

/**
 * Helper method to get the value for a variable of a certain type attached to a
 * feature flag. Returns null if the feature key is invalid, the variable key is
 * invalid, the given variable type does not match the variable's actual type,
 * or the variable value cannot be cast to the required type.
 *
 * @param {string} featureKey   Key of the feature whose variable's value is
 *                              being accessed
 * @param {string} variableKey  Key of the variable whose value is being
 *                              accessed
 * @param {string} variableType Type of the variable whose value is being
 *                              accessed (must be one of FEATURE_VARIABLE_TYPES
 *                              in lib/utils/enums/index.js)
 * @param {string} userId       ID for the user
 * @param {Object} attributes   Optional user attributes
 * @return {*}                  Value of the variable cast to the appropriate
 *                              type, or null if the feature key is invalid, the
 *                              variable key is invalid, or there is a mismatch
 *                              with the type of the variable
 */
Optimizely.prototype._getFeatureVariableForType = function(featureKey, variableKey, variableType, userId, attributes) {
  if (!this.__isValidInstance()) {
    var apiName = 'getFeatureVariable' + variableType.charAt(0).toUpperCase() + variableType.slice(1);
    this.logger.log(LOG_LEVEL.ERROR, sprintf(LOG_MESSAGES.INVALID_OBJECT, MODULE_NAME, apiName));
    return null;
  }

  if (!this.__validateInputs({ feature_key: featureKey, variable_key: variableKey, user_id: userId }, attributes)) {
    return null;
  }

  var configObj = this.projectConfigManager.getConfig();
  if (!configObj) {
    return null;
  }

  var featureFlag = projectConfig.getFeatureFromKey(configObj, featureKey, this.logger);
  if (!featureFlag) {
    return null;
  }

  var variable = projectConfig.getVariableForFeature(configObj, featureKey, variableKey, this.logger);
  if (!variable) {
    return null;
  }

  if (variable.type !== variableType) {
    this.logger.log(
      LOG_LEVEL.WARNING,
      sprintf(LOG_MESSAGES.VARIABLE_REQUESTED_WITH_WRONG_TYPE, MODULE_NAME, variableType, variable.type)
    );
    return null;
  }

  var featureEnabled = false;
  var variableValue = variable.defaultValue;
  var decision = this.decisionService.getVariationForFeature(configObj, featureFlag, userId, attributes);

  if (decision.variation !== null) {
    featureEnabled = decision.variation.featureEnabled;
    var value = projectConfig.getVariableValueForVariation(configObj, variable, decision.variation, this.logger);
    if (value !== null) {
      if (featureEnabled === true) {
        variableValue = value;
        this.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.USER_RECEIVED_VARIABLE_VALUE, MODULE_NAME, variableKey, featureFlag.key, variableValue, userId));
      } else {
        this.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.FEATURE_NOT_ENABLED_RETURN_DEFAULT_VARIABLE_VALUE, MODULE_NAME,
          featureFlag.key, userId, variableKey));
      }
    } else {
      this.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.VARIABLE_NOT_USED_RETURN_DEFAULT_VARIABLE_VALUE, MODULE_NAME, variableKey, decision.variation.key));
    }
  } else {
    this.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.USER_RECEIVED_DEFAULT_VARIABLE_VALUE, MODULE_NAME, userId,
      variableKey, featureFlag.key));
  }

  var sourceInfo = {};
  if (decision.decisionSource === DECISION_SOURCES.FEATURE_TEST) {
    sourceInfo = {
      experimentKey: decision.experiment.key,
      variationKey: decision.variation.key,
    }
  }

  var typeCastedValue = projectConfig.getTypeCastValue(variableValue, variableType, this.logger);
  this.notificationCenter.sendNotifications(
    NOTIFICATION_TYPES.DECISION,
    {
      type: DECISION_NOTIFICATION_TYPES.FEATURE_VARIABLE,
      userId: userId,
      attributes: attributes || {},
      decisionInfo: {
        featureKey: featureKey,
        featureEnabled: featureEnabled,
        source: decision.decisionSource,
        variableKey: variableKey,
        variableValue: typeCastedValue,
        variableType: variableType,
        sourceInfo: sourceInfo,
      }
    }
  );
  return typeCastedValue;
};

/**
 * Returns value for the given boolean variable attached to the given feature
 * flag.
 * @param {string} featureKey   Key of the feature whose variable's value is
 *                              being accessed
 * @param {string} variableKey  Key of the variable whose value is being
 *                              accessed
 * @param {string} userId       ID for the user
 * @param {Object} attributes   Optional user attributes
 * @return {boolean|null}       Boolean value of the variable, or null if the
 *                              feature key is invalid, the variable key is
 *                              invalid, or there is a mismatch with the type
 *                              of the variable
 */
Optimizely.prototype.getFeatureVariableBoolean = function(featureKey, variableKey, userId, attributes) {
  try {
    return this._getFeatureVariableForType(featureKey, variableKey, FEATURE_VARIABLE_TYPES.BOOLEAN, userId, attributes);
  } catch (e) {
    this.logger.log(LOG_LEVEL.ERROR, e.message);
    this.errorHandler.handleError(e);
    return null;
  }
};

/**
 * Returns value for the given double variable attached to the given feature
 * flag.
 * @param {string} featureKey   Key of the feature whose variable's value is
 *                              being accessed
 * @param {string} variableKey  Key of the variable whose value is being
 *                              accessed
 * @param {string} userId       ID for the user
 * @param {Object} attributes   Optional user attributes
 * @return {number|null}        Number value of the variable, or null if the
 *                              feature key is invalid, the variable key is
 *                              invalid, or there is a mismatch with the type
 *                              of the variable
 */
Optimizely.prototype.getFeatureVariableDouble = function(featureKey, variableKey, userId, attributes) {
  try {
    return this._getFeatureVariableForType(featureKey, variableKey, FEATURE_VARIABLE_TYPES.DOUBLE, userId, attributes);
  } catch (e) {
    this.logger.log(LOG_LEVEL.ERROR, e.message);
    this.errorHandler.handleError(e);
    return null;
  }
};

/**
 * Returns value for the given integer variable attached to the given feature
 * flag.
 * @param {string} featureKey   Key of the feature whose variable's value is
 *                              being accessed
 * @param {string} variableKey  Key of the variable whose value is being
 *                              accessed
 * @param {string} userId       ID for the user
 * @param {Object} attributes   Optional user attributes
 * @return {number|null}        Number value of the variable, or null if the
 *                              feature key is invalid, the variable key is
 *                              invalid, or there is a mismatch with the type
 *                              of the variable
 */
Optimizely.prototype.getFeatureVariableInteger = function(featureKey, variableKey, userId, attributes) {
  try {
    return this._getFeatureVariableForType(featureKey, variableKey, FEATURE_VARIABLE_TYPES.INTEGER, userId, attributes);
  } catch (e) {
    this.logger.log(LOG_LEVEL.ERROR, e.message);
    this.errorHandler.handleError(e);
    return null;
  }
};

/**
 * Returns value for the given string variable attached to the given feature
 * flag.
 * @param {string} featureKey   Key of the feature whose variable's value is
 *                              being accessed
 * @param {string} variableKey  Key of the variable whose value is being
 *                              accessed
 * @param {string} userId       ID for the user
 * @param {Object} attributes   Optional user attributes
 * @return {string|null}        String value of the variable, or null if the
 *                              feature key is invalid, the variable key is
 *                              invalid, or there is a mismatch with the type
 *                              of the variable
 */
Optimizely.prototype.getFeatureVariableString = function(featureKey, variableKey, userId, attributes) {
  try {
    return this._getFeatureVariableForType(featureKey, variableKey, FEATURE_VARIABLE_TYPES.STRING, userId, attributes);
  } catch (e) {
    this.logger.log(LOG_LEVEL.ERROR, e.message);
    this.errorHandler.handleError(e);
    return null;
  }
};

/**
 * Cleanup method for killing an running timers and flushing eventQueue
 */
Optimizely.prototype.close = function() {
  try {
    this.eventProcessor.stop();
    if (this.__disposeOnUpdate) {
      this.__disposeOnUpdate();
      this.__disposeOnUpdate = null;
    }
    if (this.projectConfigManager) {
      this.projectConfigManager.stop();
    }
    Object.keys(this.__readyTimeouts).forEach(function(readyTimeoutId) {
      var readyTimeoutRecord = this.__readyTimeouts[readyTimeoutId];
      clearTimeout(readyTimeoutRecord.readyTimeout);
      readyTimeoutRecord.onClose();
    }.bind(this));
    this.__readyTimeouts = {};
  } catch (e) {
    this.logger.log(LOG_LEVEL.ERROR, e.message);
    this.errorHandler.handleError(e);
  }
};

/**
 * Returns a Promise that fulfills when this instance is ready to use (meaning
 * it has a valid datafile), or has failed to become ready within a period of
 * time (configurable by the timeout property of the options argument), or when
 * this instance is closed via the close method.
 *
 * If a valid datafile was provided in the constructor, the returned Promise is
 * immediately fulfilled. If an sdkKey was provided, a manager will be used to
 * fetch  a datafile, and the returned promise will fulfill if that fetch
 * succeeds or fails before the timeout. The default timeout is 30 seconds,
 * which will be used if no timeout is provided in the argument options object.
 *
 * The returned Promise is fulfilled with a result object containing these
 * properties:
 *    - success (boolean): True if this instance is ready to use with a valid
 *                         datafile, or false if this instance failed to become
 *                         ready or was closed prior to becoming ready.
 *    - reason (string=):  If success is false, this is a string property with
 *                         an explanatory message. Failure could be due to
 *                         expiration of the timeout, network errors,
 *                         unsuccessful responses, datafile parse errors,
 *                         datafile validation errors, or the instance being
 *                         closed
 * @param  {Object=}          options
 * @param  {number|undefined} options.timeout
 * @return {Promise}
 */
Optimizely.prototype.onReady = function(options) {
  var timeout;
  if (typeof options === 'object' && options !== null) {
    timeout = options.timeout;
  }
  if (!fns.isFinite(timeout)) {
    timeout = DEFAULT_ONREADY_TIMEOUT;
  }

  var resolveTimeoutPromise;
  var timeoutPromise = new Promise(function(resolve) {
    resolveTimeoutPromise = resolve;
  });

  var timeoutId = this.__nextReadyTimeoutId;
  this.__nextReadyTimeoutId++;

  var onReadyTimeout = function() {
    delete this.__readyTimeouts[timeoutId];
    resolveTimeoutPromise({
      success: false,
      reason: sprintf('onReady timeout expired after %s ms', timeout),
    });
  }.bind(this);
  var readyTimeout = setTimeout(onReadyTimeout, timeout);
  var onClose = function() {
    resolveTimeoutPromise({
      success: false,
      reason: 'Instance closed',
    });
  };

  this.__readyTimeouts[timeoutId] = {
    readyTimeout: readyTimeout,
    onClose: onClose,
  };

  this.__readyPromise.then(function() {
    clearTimeout(readyTimeout);
    delete this.__readyTimeouts[timeoutId];
    resolveTimeoutPromise({
      success: true,
    });
  }.bind(this));

  return Promise.race([this.__readyPromise, timeoutPromise]);
};

module.exports = Optimizely;


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2016, 2018-2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Provides utility method for validating that the attributes user has provided are valid
 */

var sprintf = __webpack_require__(12).sprintf;
var lodashForOwn = __webpack_require__(192);
var fns = __webpack_require__(18);

var ERROR_MESSAGES = __webpack_require__(199).ERROR_MESSAGES;
var MODULE_NAME = 'ATTRIBUTES_VALIDATOR';

module.exports = {
  /**
   * Validates user's provided attributes
   * @param  {Object}  attributes
   * @return {boolean} True if the attributes are valid
   * @throws If the attributes are not valid
   */
  validate: function(attributes) {
    if (typeof attributes === 'object' && !Array.isArray(attributes) && attributes !== null) {
      lodashForOwn(attributes, function(value, key) {
        if (typeof value === 'undefined') {
          throw new Error(sprintf(ERROR_MESSAGES.UNDEFINED_ATTRIBUTE, MODULE_NAME, key));
        }
      });
      return true;
    } else {
      throw new Error(sprintf(ERROR_MESSAGES.INVALID_ATTRIBUTES, MODULE_NAME));
    }
  },

  isAttributeValid: function(attributeKey, attributeValue) {
    return (typeof attributeKey === 'string') &&
    (typeof attributeValue === 'string' || typeof attributeValue === 'boolean' || (fns.isNumber(attributeValue) && fns.isFinite(attributeValue)));
  },
};


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

/****************************************************************************
 * Copyright 2017-2019, Optimizely, Inc. and contributors                   *
 *                                                                          *
 * Licensed under the Apache License, Version 2.0 (the "License");          *
 * you may not use this file except in compliance with the License.         *
 * You may obtain a copy of the License at                                  *
 *                                                                          *
 *    http://www.apache.org/licenses/LICENSE-2.0                            *
 *                                                                          *
 * Unless required by applicable law or agreed to in writing, software      *
 * distributed under the License is distributed on an "AS IS" BASIS,        *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. *
 * See the License for the specific language governing permissions and      *
 * limitations under the License.                                           *
 ***************************************************************************/

var audienceEvaluator = __webpack_require__(213);
var bucketer = __webpack_require__(216);
var enums = __webpack_require__(199);
var fns = __webpack_require__(18);
var projectConfig = __webpack_require__(218);
var stringValidator = __webpack_require__(220);

var sprintf = __webpack_require__(12).sprintf;

var MODULE_NAME = 'DECISION_SERVICE';
var ERROR_MESSAGES = enums.ERROR_MESSAGES;
var LOG_LEVEL = enums.LOG_LEVEL;
var LOG_MESSAGES = enums.LOG_MESSAGES;
var DECISION_SOURCES = enums.DECISION_SOURCES;



/**
 * Optimizely's decision service that determines which variation of an experiment the user will be allocated to.
 *
 * The decision service contains all logic around how a user decision is made. This includes all of the following (in order):
 *   1. Checking experiment status
 *   2. Checking forced bucketing
 *   3. Checking whitelisting
 *   4. Checking user profile service for past bucketing decisions (sticky bucketing)
 *   5. Checking audience targeting
 *   6. Using Murmurhash3 to bucket the user.
 *
 * @constructor
 * @param   {Object} options
 * @param   {Object} options.userProfileService An instance of the user profile service for sticky bucketing.
 * @param   {Object} options.logger             An instance of a logger to log messages with.
 * @returns {Object}
 */
function DecisionService(options) {
  this.userProfileService = options.userProfileService || null;
  this.logger = options.logger;
  this.forcedVariationMap = {};
}

/**
 * Gets variation where visitor will be bucketed.
 * @param  {Object}      configObj      The parsed project configuration object
 * @param  {string}      experimentKey
 * @param  {string}      userId
 * @param  {Object}      attributes
 * @return {string|null} the variation the user is bucketed into.
 */
DecisionService.prototype.getVariation = function(configObj, experimentKey, userId, attributes) {
  // by default, the bucketing ID should be the user ID
  var bucketingId = this._getBucketingId(userId, attributes);

  if (!this.__checkIfExperimentIsActive(configObj, experimentKey, userId)) {
    return null;
  }
  var experiment = configObj.experimentKeyMap[experimentKey];
  var forcedVariationKey = this.getForcedVariation(configObj, experimentKey, userId);
  if (!!forcedVariationKey) {
    return forcedVariationKey;
  }

  var variation = this.__getWhitelistedVariation(experiment, userId);
  if (!!variation) {
    return variation.key;
  }

  // check for sticky bucketing
  var experimentBucketMap = this.__resolveExperimentBucketMap(userId, attributes);
  variation = this.__getStoredVariation(configObj, experiment, userId, experimentBucketMap);
  if (!!variation) {
    this.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.RETURNING_STORED_VARIATION, MODULE_NAME, variation.key, experimentKey, userId));
    return variation.key;
  }

  // Perform regular targeting and bucketing
  if (!this.__checkIfUserIsInAudience(configObj, experimentKey, userId, attributes)) {
    return null;
  }

  var bucketerParams = this.__buildBucketerParams(configObj, experimentKey, bucketingId, userId);
  var variationId = bucketer.bucket(bucketerParams);
  variation = configObj.variationIdMap[variationId];
  if (!variation) {
    return null;
  }

  // persist bucketing
  this.__saveUserProfile(experiment, variation, userId, experimentBucketMap);

  return variation.key;
};

/**
 * Merges attributes from attributes[STICKY_BUCKETING_KEY] and userProfileService
 * @param  {Object} attributes
 * @return {Object} finalized copy of experiment_bucket_map
 */
DecisionService.prototype.__resolveExperimentBucketMap = function(userId, attributes) {
  attributes = attributes || {}
  var userProfile = this.__getUserProfile(userId) || {};
  var attributeExperimentBucketMap = attributes[enums.CONTROL_ATTRIBUTES.STICKY_BUCKETING_KEY];
  return fns.assignIn({}, userProfile.experiment_bucket_map, attributeExperimentBucketMap);
};


/**
 * Checks whether the experiment is running or launched
 * @param  {Object}  configObj     The parsed project configuration object
 * @param  {string}  experimentKey Key of experiment being validated
 * @param  {string}  userId        ID of user
 * @return {boolean} True if experiment is running
 */
DecisionService.prototype.__checkIfExperimentIsActive = function(configObj, experimentKey, userId) {
  if (!projectConfig.isActive(configObj, experimentKey)) {
    var experimentNotRunningLogMessage = sprintf(LOG_MESSAGES.EXPERIMENT_NOT_RUNNING, MODULE_NAME, experimentKey);
    this.logger.log(LOG_LEVEL.INFO, experimentNotRunningLogMessage);
    return false;
  }

  return true;
};

/**
 * Checks if user is whitelisted into any variation and return that variation if so
 * @param  {Object} experiment
 * @param  {string} userId
 * @return {string|null} Forced variation if it exists for user ID, otherwise null
 */
DecisionService.prototype.__getWhitelistedVariation = function(experiment, userId) {
  if (!fns.isEmpty(experiment.forcedVariations) && experiment.forcedVariations.hasOwnProperty(userId)) {
    var forcedVariationKey = experiment.forcedVariations[userId];
    if (experiment.variationKeyMap.hasOwnProperty(forcedVariationKey)) {
      var forcedBucketingSucceededMessageLog = sprintf(LOG_MESSAGES.USER_FORCED_IN_VARIATION, MODULE_NAME, userId, forcedVariationKey);
      this.logger.log(LOG_LEVEL.INFO, forcedBucketingSucceededMessageLog);
      return experiment.variationKeyMap[forcedVariationKey];
    } else {
      var forcedBucketingFailedMessageLog = sprintf(LOG_MESSAGES.FORCED_BUCKETING_FAILED, MODULE_NAME, forcedVariationKey, userId);
      this.logger.log(LOG_LEVEL.ERROR, forcedBucketingFailedMessageLog);
      return null;
    }
  }

  return null;
};

/**
 * Checks whether the user is included in experiment audience
 * @param  {Object}  configObj     The parsed project configuration object
 * @param  {string}  experimentKey Key of experiment being validated
 * @param  {string}  userId        ID of user
 * @param  {Object}  attributes    Optional parameter for user's attributes
 * @return {boolean} True if user meets audience conditions
 */
DecisionService.prototype.__checkIfUserIsInAudience = function(configObj, experimentKey, userId, attributes) {
  var experimentAudienceConditions = projectConfig.getExperimentAudienceConditions(configObj, experimentKey);
  var audiencesById = projectConfig.getAudiencesById(configObj);
  this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.EVALUATING_AUDIENCES_COMBINED, MODULE_NAME, experimentKey, JSON.stringify(experimentAudienceConditions)));
  var result = audienceEvaluator.evaluate(experimentAudienceConditions, audiencesById, attributes, this.logger);
  this.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.AUDIENCE_EVALUATION_RESULT_COMBINED, MODULE_NAME, experimentKey, result.toString().toUpperCase()));

  if (!result) {
    var userDoesNotMeetConditionsLogMessage = sprintf(LOG_MESSAGES.USER_NOT_IN_EXPERIMENT, MODULE_NAME, userId, experimentKey);
    this.logger.log(LOG_LEVEL.INFO, userDoesNotMeetConditionsLogMessage);
    return false;
  }

  return true;
};

/**
 * Given an experiment key and user ID, returns params used in bucketer call
 * @param  configObj     The parsed project configuration object
 * @param  experimentKey Experiment key used for bucketer
 * @param  bucketingId   ID to bucket user into
 * @param  userId        ID of user to be bucketed
 * @return {Object}
 */
DecisionService.prototype.__buildBucketerParams = function(configObj, experimentKey, bucketingId, userId) {
  var bucketerParams = {};
  bucketerParams.experimentKey = experimentKey;
  bucketerParams.experimentId = projectConfig.getExperimentId(configObj, experimentKey);
  bucketerParams.userId = userId;
  bucketerParams.trafficAllocationConfig = projectConfig.getTrafficAllocation(configObj, experimentKey);
  bucketerParams.experimentKeyMap = configObj.experimentKeyMap;
  bucketerParams.groupIdMap = configObj.groupIdMap;
  bucketerParams.variationIdMap = configObj.variationIdMap;
  bucketerParams.logger = this.logger;
  bucketerParams.bucketingId = bucketingId;
  return bucketerParams;
};

/**
 * Pull the stored variation out of the experimentBucketMap for an experiment/userId
 * @param  {Object} configObj           The parsed project configuration object
 * @param  {Object} experiment
 * @param  {String} userId
 * @param  {Object} experimentBucketMap mapping experiment => { variation_id: <variationId> }
 * @return {Object} the stored variation or null if the user profile does not have one for the given experiment
 */
DecisionService.prototype.__getStoredVariation = function(configObj, experiment, userId, experimentBucketMap) {
  if (experimentBucketMap.hasOwnProperty(experiment.id)) {
    var decision = experimentBucketMap[experiment.id];
    var variationId = decision.variation_id;
    if (configObj.variationIdMap.hasOwnProperty(variationId)) {
      return configObj.variationIdMap[decision.variation_id];
    } else {
      this.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.SAVED_VARIATION_NOT_FOUND, MODULE_NAME, userId, variationId, experiment.key));
    }
  }

  return null;
};

/**
 * Get the user profile with the given user ID
 * @param  {string} userId
 * @return {Object|undefined} the stored user profile or undefined if one isn't found
 */
DecisionService.prototype.__getUserProfile = function(userId) {
  var userProfile = {
    user_id: userId,
    experiment_bucket_map: {},
  };

  if (!this.userProfileService) {
    return userProfile;
  }

  try {
    return this.userProfileService.lookup(userId);
  } catch (ex) {
    this.logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.USER_PROFILE_LOOKUP_ERROR, MODULE_NAME, userId, ex.message));
  }
};

/**
 * Saves the bucketing decision to the user profile
 * @param {Object} userProfile
 * @param {Object} experiment
 * @param {Object} variation
 * @param {Object} experimentBucketMap
 */
DecisionService.prototype.__saveUserProfile = function(experiment, variation, userId, experimentBucketMap) {
  if (!this.userProfileService) {
    return;
  }

  try {
    var newBucketMap = fns.cloneDeep(experimentBucketMap);
    newBucketMap[experiment.id] = {
      variation_id: variation.id
    };

    this.userProfileService.save({
      user_id: userId,
      experiment_bucket_map: newBucketMap,
    });

    this.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.SAVED_VARIATION, MODULE_NAME, variation.key, experiment.key, userId));
  } catch (ex) {
    this.logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.USER_PROFILE_SAVE_ERROR, MODULE_NAME, userId, ex.message));
  }
};

/**
 * Given a feature, user ID, and attributes, returns an object representing a
 * decision. If the user was bucketed into a variation for the given feature
 * and attributes, the returned decision object will have variation and
 * experiment properties (both objects), as well as a decisionSource property.
 * decisionSource indicates whether the decision was due to a rollout or an
 * experiment.
 * @param   {Object} configObj  The parsed project configuration object
 * @param   {Object} feature    A feature flag object from project configuration
 * @param   {String} userId     A string identifying the user, for bucketing
 * @param   {Object} attributes Optional user attributes
 * @return  {Object} An object with experiment, variation, and decisionSource
 * properties. If the user was not bucketed into a variation, the variation
 * property is null.
 */
DecisionService.prototype.getVariationForFeature = function(configObj, feature, userId, attributes) {
  var experimentDecision = this._getVariationForFeatureExperiment(configObj, feature, userId, attributes);
  if (experimentDecision.variation !== null) {
    this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_IN_FEATURE_EXPERIMENT, MODULE_NAME, userId, experimentDecision.variation.key, experimentDecision.experiment.key, feature.key));
    return experimentDecision;
  }

  this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_NOT_IN_FEATURE_EXPERIMENT, MODULE_NAME, userId, feature.key));

  var rolloutDecision = this._getVariationForRollout(configObj, feature, userId, attributes);
  if (rolloutDecision.variation !== null) {
    this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_IN_ROLLOUT, MODULE_NAME, userId, feature.key));
    return rolloutDecision;
  }

  this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_NOT_IN_ROLLOUT, MODULE_NAME, userId, feature.key));
  return rolloutDecision;
};

DecisionService.prototype._getVariationForFeatureExperiment = function(configObj, feature, userId, attributes) {
  var experiment = null;
  var variationKey = null;

  if (feature.hasOwnProperty('groupId')) {
    var group = configObj.groupIdMap[feature.groupId];
    if (group) {
      experiment = this._getExperimentInGroup(configObj, group, userId);
      if (experiment && feature.experimentIds.indexOf(experiment.id) !== -1) {
        variationKey = this.getVariation(configObj, experiment.key, userId, attributes);
      }
    }
  } else if (feature.experimentIds.length > 0) {
    // If the feature does not have a group ID, then it can only be associated
    // with one experiment, so we look at the first experiment ID only
    experiment = projectConfig.getExperimentFromId(configObj, feature.experimentIds[0], this.logger);
    if (experiment) {
      variationKey = this.getVariation(configObj, experiment.key, userId, attributes);
    }
  } else {
    this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.FEATURE_HAS_NO_EXPERIMENTS, MODULE_NAME, feature.key));
  }

  var variation = null;
  if (variationKey !== null && experiment !== null) {
    variation = experiment.variationKeyMap[variationKey];
  }
  return {
    experiment: experiment,
    variation: variation,
    decisionSource: DECISION_SOURCES.FEATURE_TEST,
  };
};

DecisionService.prototype._getExperimentInGroup = function(configObj, group, userId) {
  var experimentId = bucketer.bucketUserIntoExperiment(group, userId, userId, this.logger);
  if (experimentId !== null) {
    this.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.USER_BUCKETED_INTO_EXPERIMENT_IN_GROUP, MODULE_NAME, userId, experimentId, group.id));
    var experiment = projectConfig.getExperimentFromId(configObj, experimentId, this.logger);
    if (experiment) {
      return experiment;
    }
  }

  this.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.USER_NOT_BUCKETED_INTO_ANY_EXPERIMENT_IN_GROUP, MODULE_NAME, userId, group.id));
  return null;
};

DecisionService.prototype._getVariationForRollout = function(configObj, feature, userId, attributes) {
  if (!feature.rolloutId) {
    this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.NO_ROLLOUT_EXISTS, MODULE_NAME, feature.key));
    return {
      experiment: null,
      variation: null,
      decisionSource: DECISION_SOURCES.ROLLOUT,
    };
  }

  var rollout = configObj.rolloutIdMap[feature.rolloutId];
  if (!rollout) {
    this.logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.INVALID_ROLLOUT_ID, MODULE_NAME, feature.rolloutId, feature.key));
    return {
      experiment: null,
      variation: null,
      decisionSource: DECISION_SOURCES.ROLLOUT,
    };
  }

  if (rollout.experiments.length === 0) {
    this.logger.log(LOG_LEVEL.ERROR, sprintf(LOG_MESSAGES.ROLLOUT_HAS_NO_EXPERIMENTS, MODULE_NAME, feature.rolloutId));
    return {
      experiment: null,
      variation: null,
      decisionSource: DECISION_SOURCES.ROLLOUT,
    };
  }

  var bucketingId = this._getBucketingId(userId, attributes);

  // The end index is length - 1 because the last experiment is assumed to be
  // "everyone else", which will be evaluated separately outside this loop
  var endIndex = rollout.experiments.length - 1;
  var index;
  var experiment;
  var bucketerParams;
  var variationId;
  var variation;
  for (index = 0; index < endIndex; index++) {
    experiment = configObj.experimentKeyMap[rollout.experiments[index].key];

    if (!this.__checkIfUserIsInAudience(configObj, experiment.key, userId, attributes)) {
      this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_DOESNT_MEET_CONDITIONS_FOR_TARGETING_RULE, MODULE_NAME, userId, index + 1));
      continue;
    }

    this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_MEETS_CONDITIONS_FOR_TARGETING_RULE, MODULE_NAME, userId, index + 1));
    bucketerParams = this.__buildBucketerParams(configObj, experiment.key, bucketingId, userId);
    variationId = bucketer.bucket(bucketerParams);
    variation = configObj.variationIdMap[variationId];
    if (variation) {
      this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_BUCKETED_INTO_TARGETING_RULE, MODULE_NAME, userId, index + 1));
      return {
        experiment: experiment,
        variation: variation,
        decisionSource: DECISION_SOURCES.ROLLOUT,
      };
    } else {
      this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_NOT_BUCKETED_INTO_TARGETING_RULE, MODULE_NAME, userId, index + 1));
      break;
    }
  }

  var everyoneElseExperiment = configObj.experimentKeyMap[rollout.experiments[endIndex].key];
  if (this.__checkIfUserIsInAudience(configObj, everyoneElseExperiment.key, userId, attributes)) {
    bucketerParams = this.__buildBucketerParams(configObj, everyoneElseExperiment.key, bucketingId, userId);
    variationId = bucketer.bucket(bucketerParams);
    variation = configObj.variationIdMap[variationId];
    if (variation) {
      this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_BUCKETED_INTO_EVERYONE_TARGETING_RULE, MODULE_NAME, userId));
      return {
        experiment: everyoneElseExperiment,
        variation: variation,
        decisionSource: DECISION_SOURCES.ROLLOUT,
      };
    } else {
      this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_NOT_BUCKETED_INTO_EVERYONE_TARGETING_RULE, MODULE_NAME, userId));
    }
  }

  return {
    experiment: null,
    variation: null,
    decisionSource: DECISION_SOURCES.ROLLOUT,
  };
};

/**
 * Get bucketing Id from user attributes.
 * @param {String} userId
 * @param {Object} attributes
 * @returns {String} Bucketing Id if it is a string type in attributes, user Id otherwise.
 */
DecisionService.prototype._getBucketingId = function(userId, attributes) {
  var bucketingId = userId;

  // If the bucketing ID key is defined in attributes, than use that in place of the userID for the murmur hash key
  if ((attributes != null && typeof attributes === 'object') && attributes.hasOwnProperty(enums.CONTROL_ATTRIBUTES.BUCKETING_ID)) {
    if (typeof attributes[enums.CONTROL_ATTRIBUTES.BUCKETING_ID] === 'string') {
      bucketingId = attributes[enums.CONTROL_ATTRIBUTES.BUCKETING_ID];
      this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.VALID_BUCKETING_ID, MODULE_NAME, bucketingId));
    } else {
      this.logger.log(LOG_LEVEL.WARNING, sprintf(LOG_MESSAGES.BUCKETING_ID_NOT_STRING, MODULE_NAME));
    }
  }

  return bucketingId;
};

/**
 * Removes forced variation for given userId and experimentKey
 * @param  {string} userId         String representing the user id
 * @param  {number} experimentId   Number representing the experiment id
 * @param  {string} experimentKey  Key representing the experiment id
 * @throws If the user id is not valid or not in the forced variation map
 */
DecisionService.prototype.removeForcedVariation = function(userId, experimentId, experimentKey) {
  if (!userId) {
    throw new Error(sprintf(ERROR_MESSAGES.INVALID_USER_ID, MODULE_NAME));
  }

  if (this.forcedVariationMap.hasOwnProperty(userId)) {
    delete this.forcedVariationMap[userId][experimentId];
    this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.VARIATION_REMOVED_FOR_USER, MODULE_NAME, experimentKey, userId));
  } else {
    throw new Error(sprintf(ERROR_MESSAGES.USER_NOT_IN_FORCED_VARIATION, MODULE_NAME, userId));
  }
};

/**
 * Sets forced variation for given userId and experimentKey
 * @param  {string} userId        String representing the user id
 * @param  {number} experimentId  Number representing the experiment id
 * @param  {number} variationId   Number representing the variation id
 * @throws If the user id is not valid
 */
DecisionService.prototype.__setInForcedVariationMap = function(userId, experimentId, variationId) {
  if (this.forcedVariationMap.hasOwnProperty(userId)) {
    this.forcedVariationMap[userId][experimentId] = variationId;
  } else {
    this.forcedVariationMap[userId] = {};
    this.forcedVariationMap[userId][experimentId] = variationId;
  }

  this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_MAPPED_TO_FORCED_VARIATION, MODULE_NAME, variationId, experimentId, userId));
};

/**
 * Gets the forced variation key for the given user and experiment.
 * @param  {Object} configObj        Object representing project configuration
 * @param  {string} experimentKey    Key for experiment.
 * @param  {string} userId           The user Id.
 * @return {string|null} Variation   The variation which the given user and experiment should be forced into.
 */
DecisionService.prototype.getForcedVariation = function(configObj, experimentKey, userId) {
  var experimentToVariationMap = this.forcedVariationMap[userId];
  if (!experimentToVariationMap) {
    this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_HAS_NO_FORCED_VARIATION, MODULE_NAME, userId));
    return null;
  }

  var experimentId;
  try {
    var experiment = projectConfig.getExperimentFromKey(configObj, experimentKey);
    if (experiment.hasOwnProperty('id')) {
      experimentId = experiment['id'];
    } else {
      // catching improperly formatted experiments
      this.logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.IMPROPERLY_FORMATTED_EXPERIMENT, MODULE_NAME, experimentKey));
      return null;
    }
  } catch (ex) {
    // catching experiment not in datafile
    this.logger.log(LOG_LEVEL.ERROR, ex.message);
    return null;
  }

  var variationId = experimentToVariationMap[experimentId];
  if (!variationId) {
    this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_HAS_NO_FORCED_VARIATION_FOR_EXPERIMENT, MODULE_NAME, experimentKey, userId));
    return null;
  }

  var variationKey = projectConfig.getVariationKeyFromId(configObj, variationId);
  if (variationKey) {
    this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_HAS_FORCED_VARIATION, MODULE_NAME, variationKey, experimentKey, userId));
  } else {
    this.logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_HAS_NO_FORCED_VARIATION_FOR_EXPERIMENT, MODULE_NAME, experimentKey, userId));
  }

  return variationKey;
};

/**
 * Sets the forced variation for a user in a given experiment
 * @param  {Object} configObj      Object representing project configuration
 * @param  {string} experimentKey  Key for experiment.
 * @param  {string} userId         The user Id.
 * @param  {string} variationKey   Key for variation. If null, then clear the existing experiment-to-variation mapping
 * @return {boolean}               A boolean value that indicates if the set completed successfully.
 */
DecisionService.prototype.setForcedVariation = function(configObj, experimentKey, userId, variationKey) {
  if (variationKey != null && !stringValidator.validate(variationKey)) {
    this.logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.INVALID_VARIATION_KEY, MODULE_NAME));
    return false;
  }

  var experimentId;
  try {
    var experiment = projectConfig.getExperimentFromKey(configObj, experimentKey);
    if (experiment.hasOwnProperty('id')) {
      experimentId = experiment['id'];
    } else {
      // catching improperly formatted experiments
      this.logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.IMPROPERLY_FORMATTED_EXPERIMENT, MODULE_NAME, experimentKey));
      return false;
    }
  } catch (ex) {
    // catching experiment not in datafile
    this.logger.log(LOG_LEVEL.ERROR, ex.message);
    return false;
  }

  if (variationKey == null) {
    try {
      this.removeForcedVariation(userId, experimentId, experimentKey, this.logger);
      return true;
    } catch (ex) {
      this.logger.log(LOG_LEVEL.ERROR, ex.message);
      return false;
    }
  }

  var variationId = projectConfig.getVariationIdFromExperimentAndVariationKey(configObj, experimentKey, variationKey);

  if (!variationId) {
    this.logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.NO_VARIATION_FOR_EXPERIMENT_KEY, MODULE_NAME, variationKey, experimentKey));
    return false;
  }

  try {
    this.__setInForcedVariationMap(userId, experimentId, variationId);
    return true;
  } catch (ex) {
    this.logger.log(LOG_LEVEL.ERROR, ex.message);
    return false;
  }
};

module.exports = {
  /**
   * Creates an instance of the DecisionService.
   * @param  {Object} options               Configuration options
   * @param  {Object} options.userProfileService
   * @param  {Object} options.logger
   * @return {Object} An instance of the DecisionService
   */
  createDecisionService: function(options) {
    return new DecisionService(options);
  },
};


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2016, 2018-2019 Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var conditionTreeEvaluator = __webpack_require__(214);
var customAttributeConditionEvaluator = __webpack_require__(215);
var enums = __webpack_require__(199);
var sprintf = __webpack_require__(12).sprintf;

var LOG_LEVEL = enums.LOG_LEVEL;
var LOG_MESSAGES = enums.LOG_MESSAGES;
var MODULE_NAME = 'AUDIENCE_EVALUATOR';

module.exports = {
  /**
   * Determine if the given user attributes satisfy the given audience conditions
   * @param  {Array|String|null|undefined}  audienceConditions    Audience conditions to match the user attributes against - can be an array
   *                                                              of audience IDs, a nested array of conditions, or a single leaf condition.
   *                                                              Examples: ["5", "6"], ["and", ["or", "1", "2"], "3"], "1"
   * @param  {Object}                       audiencesById         Object providing access to full audience objects for audience IDs
   *                                                              contained in audienceConditions. Keys should be audience IDs, values
   *                                                              should be full audience objects with conditions properties
   * @param  {Object}                       [userAttributes]      User attributes which will be used in determining if audience conditions
   *                                                              are met. If not provided, defaults to an empty object
   * @param  {Object}                       logger                Logger instance.
   * @return {Boolean}                                            true if the user attributes match the given audience conditions, false
   *                                                              otherwise
   */
  evaluate: function(audienceConditions, audiencesById, userAttributes, logger) {
    // if there are no audiences, return true because that means ALL users are included in the experiment
    if (!audienceConditions || audienceConditions.length === 0) {
      return true;
    }

    if (!userAttributes) {
      userAttributes = {};
    }

    var evaluateConditionWithUserAttributes = function(condition) {
      return customAttributeConditionEvaluator.evaluate(condition, userAttributes, logger);
    };

    var evaluateAudience = function(audienceId) {
      var audience = audiencesById[audienceId];
      if (audience) {
        logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.EVALUATING_AUDIENCE, MODULE_NAME, audienceId, JSON.stringify(audience.conditions)));
        var result = conditionTreeEvaluator.evaluate(audience.conditions, evaluateConditionWithUserAttributes);
        var resultText = result === null ? 'UNKNOWN' : result.toString().toUpperCase();
        logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.AUDIENCE_EVALUATION_RESULT, MODULE_NAME, audienceId, resultText));
        return result;
      }

      return null;
    };

    return conditionTreeEvaluator.evaluate(audienceConditions, evaluateAudience) || false;
  },
};


/***/ }),
/* 214 */
/***/ (function(module, exports) {

/****************************************************************************
 * Copyright 2018, Optimizely, Inc. and contributors                        *
 *                                                                          *
 * Licensed under the Apache License, Version 2.0 (the "License");          *
 * you may not use this file except in compliance with the License.         *
 * You may obtain a copy of the License at                                  *
 *                                                                          *
 *    http://www.apache.org/licenses/LICENSE-2.0                            *
 *                                                                          *
 * Unless required by applicable law or agreed to in writing, software      *
 * distributed under the License is distributed on an "AS IS" BASIS,        *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. *
 * See the License for the specific language governing permissions and      *
 * limitations under the License.                                           *
 ***************************************************************************/

var AND_CONDITION = 'and';
var OR_CONDITION = 'or';
var NOT_CONDITION = 'not';

var DEFAULT_OPERATOR_TYPES = [AND_CONDITION, OR_CONDITION, NOT_CONDITION];

/**
 * Top level method to evaluate conditions
 * @param  {Array|*}    conditions      Nested array of and/or conditions, or a single leaf
 *                                      condition value of any type
 *                                      Example: ['and', '0', ['or', '1', '2']]
 * @param  {Function}   leafEvaluator   Function which will be called to evaluate leaf condition
 *                                      values
 * @return {?Boolean}                   Result of evaluating the conditions using the operator
 *                                      rules and the leaf evaluator. A return value of null
 *                                      indicates that the conditions are invalid or unable to be
 *                                      evaluated
 */
function evaluate(conditions, leafEvaluator) {
  if (Array.isArray(conditions)) {
    var firstOperator = conditions[0];
    var restOfConditions = conditions.slice(1);

    if (DEFAULT_OPERATOR_TYPES.indexOf(firstOperator) === -1) {
      // Operator to apply is not explicit - assume 'or'
      firstOperator = OR_CONDITION;
      restOfConditions = conditions;
    }

    switch (firstOperator) {
      case AND_CONDITION:
        return andEvaluator(restOfConditions, leafEvaluator);
      case NOT_CONDITION:
        return notEvaluator(restOfConditions, leafEvaluator);
      default: // firstOperator is OR_CONDITION
        return orEvaluator(restOfConditions, leafEvaluator);
    }
  }

  var leafCondition = conditions;
  return leafEvaluator(leafCondition);
}

/**
 * Evaluates an array of conditions as if the evaluator had been applied
 * to each entry and the results AND-ed together.
 * @param  {Array}      conditions      Array of conditions ex: [operand_1, operand_2]
 * @param  {Function}   leafEvaluator   Function which will be called to evaluate leaf condition values
 * @return {?Boolean}                   Result of evaluating the conditions. A return value of null
 *                                      indicates that the conditions are invalid or unable to be
 *                                      evaluated.
 */
function andEvaluator(conditions, leafEvaluator) {
  var sawNullResult = false;
  for (var i = 0; i < conditions.length; i++) {
    var conditionResult = evaluate(conditions[i], leafEvaluator);
    if (conditionResult === false) {
      return false;
    }
    if (conditionResult === null) {
      sawNullResult = true;
    }
  }
  return sawNullResult ? null : true;
}

/**
 * Evaluates an array of conditions as if the evaluator had been applied
 * to a single entry and NOT was applied to the result.
 * @param  {Array}      conditions      Array of conditions ex: [operand_1]
 * @param  {Function}   leafEvaluator   Function which will be called to evaluate leaf condition values
 * @return {?Boolean}                   Result of evaluating the conditions. A return value of null
 *                                      indicates that the conditions are invalid or unable to be
 *                                      evaluated.
 */
function notEvaluator(conditions, leafEvaluator) {
  if (conditions.length > 0) {
    var result = evaluate(conditions[0], leafEvaluator);
    return result === null ? null : !result;
  }
  return null;
}

/**
 * Evaluates an array of conditions as if the evaluator had been applied
 * to each entry and the results OR-ed together.
 * @param  {Array}      conditions      Array of conditions ex: [operand_1, operand_2]
 * @param  {Function}   leafEvaluator   Function which will be called to evaluate leaf condition values
 * @return {?Boolean}                   Result of evaluating the conditions. A return value of null
 *                                      indicates that the conditions are invalid or unable to be
 *                                      evaluated.
 */
function orEvaluator(conditions, leafEvaluator) {
  var sawNullResult = false;
  for (var i = 0; i < conditions.length; i++) {
    var conditionResult = evaluate(conditions[i], leafEvaluator);
    if (conditionResult === true) {
      return true;
    }
    if (conditionResult === null) {
      sawNullResult = true;
    }
  }
  return sawNullResult ? null : false;
}

module.exports = {
  evaluate: evaluate,
};


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

/****************************************************************************
 * Copyright 2018-2019, Optimizely, Inc. and contributors                        *
 *                                                                          *
 * Licensed under the Apache License, Version 2.0 (the "License");          *
 * you may not use this file except in compliance with the License.         *
 * You may obtain a copy of the License at                                  *
 *                                                                          *
 *    http://www.apache.org/licenses/LICENSE-2.0                            *
 *                                                                          *
 * Unless required by applicable law or agreed to in writing, software      *
 * distributed under the License is distributed on an "AS IS" BASIS,        *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. *
 * See the License for the specific language governing permissions and      *
 * limitations under the License.                                           *
 ***************************************************************************/

var fns = __webpack_require__(18);
var enums = __webpack_require__(199);
var sprintf = __webpack_require__(12).sprintf;

var LOG_LEVEL = enums.LOG_LEVEL;
var LOG_MESSAGES = enums.LOG_MESSAGES;
var MODULE_NAME = 'CUSTOM_ATTRIBUTE_CONDITION_EVALUATOR';

var CUSTOM_ATTRIBUTE_CONDITION_TYPE = 'custom_attribute';

var EXACT_MATCH_TYPE = 'exact';
var EXISTS_MATCH_TYPE = 'exists';
var GREATER_THAN_MATCH_TYPE = 'gt';
var LESS_THAN_MATCH_TYPE = 'lt';
var SUBSTRING_MATCH_TYPE = 'substring';

var MATCH_TYPES = [
  EXACT_MATCH_TYPE,
  EXISTS_MATCH_TYPE,
  GREATER_THAN_MATCH_TYPE,
  LESS_THAN_MATCH_TYPE,
  SUBSTRING_MATCH_TYPE,
];

var EVALUATORS_BY_MATCH_TYPE = {};
EVALUATORS_BY_MATCH_TYPE[EXACT_MATCH_TYPE] = exactEvaluator;
EVALUATORS_BY_MATCH_TYPE[EXISTS_MATCH_TYPE] = existsEvaluator;
EVALUATORS_BY_MATCH_TYPE[GREATER_THAN_MATCH_TYPE] = greaterThanEvaluator;
EVALUATORS_BY_MATCH_TYPE[LESS_THAN_MATCH_TYPE] = lessThanEvaluator;
EVALUATORS_BY_MATCH_TYPE[SUBSTRING_MATCH_TYPE] = substringEvaluator;

/**
 * Given a custom attribute audience condition and user attributes, evaluate the
 * condition against the attributes.
 * @param  {Object}     condition
 * @param  {Object}     userAttributes
 * @param  {Object}     logger
 * @return {?Boolean}   true/false if the given user attributes match/don't match the given condition,
 *                                      null if the given user attributes and condition can't be evaluated
 */
function evaluate(condition, userAttributes, logger) {
  if (condition.type !== CUSTOM_ATTRIBUTE_CONDITION_TYPE) {
    logger.log(LOG_LEVEL.WARNING, sprintf(LOG_MESSAGES.UNKNOWN_CONDITION_TYPE, MODULE_NAME, JSON.stringify(condition)));
    return null;
  }

  var conditionMatch = condition.match;
  if (typeof conditionMatch !== 'undefined' && MATCH_TYPES.indexOf(conditionMatch) === -1) {
    logger.log(LOG_LEVEL.WARNING, sprintf(LOG_MESSAGES.UNKNOWN_MATCH_TYPE, MODULE_NAME, JSON.stringify(condition)));
    return null;
  }

  var attributeKey = condition.name;
  if (!userAttributes.hasOwnProperty(attributeKey) && conditionMatch != EXISTS_MATCH_TYPE) {
    logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.MISSING_ATTRIBUTE_VALUE, MODULE_NAME, JSON.stringify(condition), attributeKey));
    return null;
  }

  var evaluatorForMatch = EVALUATORS_BY_MATCH_TYPE[conditionMatch] || exactEvaluator;
  return evaluatorForMatch(condition, userAttributes, logger);
}

/**
 * Returns true if the value is valid for exact conditions. Valid values include
 * strings, booleans, and numbers that aren't NaN, -Infinity, or Infinity.
 * @param value
 * @returns {Boolean}
 */
function isValueTypeValidForExactConditions(value) {
  return typeof value === 'string' || typeof value === 'boolean' ||
    fns.isNumber(value);
}

/**
 * Evaluate the given exact match condition for the given user attributes
 * @param   {Object}    condition
 * @param   {Object}    userAttributes
 * @param   {Object}    logger
 * @return  {?Boolean}  true if the user attribute value is equal (===) to the condition value,
 *                      false if the user attribute value is not equal (!==) to the condition value,
 *                      null if the condition value or user attribute value has an invalid type, or
 *                      if there is a mismatch between the user attribute type and the condition value
 *                      type
 */
function exactEvaluator(condition, userAttributes, logger) {
  var conditionValue = condition.value;
  var conditionValueType = typeof conditionValue;
  var conditionName = condition.name;
  var userValue = userAttributes[conditionName];
  var userValueType = typeof userValue;

  if (!isValueTypeValidForExactConditions(conditionValue) || (fns.isNumber(conditionValue) && !fns.isFinite(conditionValue))) {
    logger.log(LOG_LEVEL.WARNING, sprintf(LOG_MESSAGES.UNEXPECTED_CONDITION_VALUE, MODULE_NAME, JSON.stringify(condition)));
    return null;
  }

  if (userValue === null) {
    logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.UNEXPECTED_TYPE_NULL, MODULE_NAME, JSON.stringify(condition), conditionName));
    return null;
  }

  if (!isValueTypeValidForExactConditions(userValue) || conditionValueType !== userValueType) {
    logger.log(LOG_LEVEL.WARNING, sprintf(LOG_MESSAGES.UNEXPECTED_TYPE, MODULE_NAME, JSON.stringify(condition), userValueType, conditionName));
    return null;
  }

  if (fns.isNumber(userValue) && !fns.isFinite(userValue)) {
    logger.log(LOG_LEVEL.WARNING, sprintf(LOG_MESSAGES.OUT_OF_BOUNDS, MODULE_NAME, JSON.stringify(condition), conditionName));
    return null;
  }

  return conditionValue === userValue;
}

/**
 * Evaluate the given exists match condition for the given user attributes
 * @param   {Object}  condition
 * @param   {Object}  userAttributes
 * @returns {Boolean} true if both:
 *                      1) the user attributes have a value for the given condition, and
 *                      2) the user attribute value is neither null nor undefined
 *                    Returns false otherwise
 */
function existsEvaluator(condition, userAttributes) {
  var userValue = userAttributes[condition.name];
  return typeof userValue !== 'undefined' && userValue !== null;
}

/**
 * Evaluate the given greater than match condition for the given user attributes
 * @param   {Object}    condition
 * @param   {Object}    userAttributes
 * @param   {Object}    logger
 * @returns {?Boolean}  true if the user attribute value is greater than the condition value,
 *                      false if the user attribute value is less than or equal to the condition value,
 *                      null if the condition value isn't a number or the user attribute value
 *                      isn't a number
 */
function greaterThanEvaluator(condition, userAttributes, logger) {
  var conditionName = condition.name;
  var userValue = userAttributes[conditionName];
  var userValueType = typeof userValue;
  var conditionValue = condition.value;

  if (!fns.isFinite(conditionValue)) {
    logger.log(LOG_LEVEL.WARNING, sprintf(LOG_MESSAGES.UNEXPECTED_CONDITION_VALUE, MODULE_NAME, JSON.stringify(condition)));
    return null;
  }

  if (userValue === null) {
    logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.UNEXPECTED_TYPE_NULL, MODULE_NAME, JSON.stringify(condition), conditionName));
    return null;
  }

  if (!fns.isNumber(userValue)) {
    logger.log(LOG_LEVEL.WARNING, sprintf(LOG_MESSAGES.UNEXPECTED_TYPE, MODULE_NAME, JSON.stringify(condition), userValueType, conditionName));
    return null;
  }

  if (!fns.isFinite(userValue)) {
    logger.log(LOG_LEVEL.WARNING, sprintf(LOG_MESSAGES.OUT_OF_BOUNDS, MODULE_NAME, JSON.stringify(condition), conditionName));
    return null;
  }

  return userValue > conditionValue;
}

/**
 * Evaluate the given less than match condition for the given user attributes
 * @param   {Object}    condition
 * @param   {Object}    userAttributes
 * @param   {Object}    logger
 * @returns {?Boolean}  true if the user attribute value is less than the condition value,
 *                      false if the user attribute value is greater than or equal to the condition value,
 *                      null if the condition value isn't a number or the user attribute value isn't a
 *                      number
 */
function lessThanEvaluator(condition, userAttributes, logger) {
  var conditionName = condition.name;
  var userValue = userAttributes[condition.name];
  var userValueType = typeof userValue;
  var conditionValue = condition.value;

  if (!fns.isFinite(conditionValue)) {
    logger.log(LOG_LEVEL.WARNING, sprintf(LOG_MESSAGES.UNEXPECTED_CONDITION_VALUE, MODULE_NAME, JSON.stringify(condition)));
    return null;
  }

  if (userValue === null) {
    logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.UNEXPECTED_TYPE_NULL, MODULE_NAME, JSON.stringify(condition), conditionName));
    return null;
  }

  if (!fns.isNumber(userValue)) {
    logger.log(LOG_LEVEL.WARNING, sprintf(LOG_MESSAGES.UNEXPECTED_TYPE, MODULE_NAME, JSON.stringify(condition), userValueType, conditionName));
    return null;
  }

  if (!fns.isFinite(userValue)) {
    logger.log(LOG_LEVEL.WARNING, sprintf(LOG_MESSAGES.OUT_OF_BOUNDS, MODULE_NAME, JSON.stringify(condition), conditionName));
    return null;
  }

  return userValue < conditionValue;
}

/**
 * Evaluate the given substring match condition for the given user attributes
 * @param   {Object}    condition
 * @param   {Object}    userAttributes
 * @param   {Object}    logger
 * @returns {?Boolean}  true if the condition value is a substring of the user attribute value,
 *                      false if the condition value is not a substring of the user attribute value,
 *                      null if the condition value isn't a string or the user attribute value
 *                      isn't a string
 */
function substringEvaluator(condition, userAttributes, logger) {
  var conditionName = condition.name;
  var userValue = userAttributes[condition.name];
  var userValueType = typeof userValue;
  var conditionValue = condition.value;

  if (typeof conditionValue !== 'string') {
    logger.log(LOG_LEVEL.WARNING, sprintf(LOG_MESSAGES.UNEXPECTED_CONDITION_VALUE, MODULE_NAME, JSON.stringify(condition)));
    return null;
  }

  if (userValue === null) {
    logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.UNEXPECTED_TYPE_NULL, MODULE_NAME, JSON.stringify(condition), conditionName));
    return null;
  }

  if (typeof userValue !== 'string') {
    logger.log(LOG_LEVEL.WARNING, sprintf(LOG_MESSAGES.UNEXPECTED_TYPE, MODULE_NAME, JSON.stringify(condition), userValueType, conditionName));
    return null;
  }

  return userValue.indexOf(conditionValue) !== -1;
}

module.exports = {
  evaluate: evaluate
};


/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2016, 2019 Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Bucketer API for determining the variation id from the specified parameters
 */
var enums = __webpack_require__(199);
var murmurhash = __webpack_require__(217);
var sprintf = __webpack_require__(12).sprintf;

var ERROR_MESSAGES = enums.ERROR_MESSAGES;
var HASH_SEED = 1;
var LOG_LEVEL = enums.LOG_LEVEL;
var LOG_MESSAGES = enums.LOG_MESSAGES;
var MAX_HASH_VALUE = Math.pow(2, 32);
var MAX_TRAFFIC_VALUE = 10000;
var MODULE_NAME = 'BUCKETER';
var RANDOM_POLICY = 'random';

module.exports = {
  /**
   * Determines ID of variation to be shown for the given input params
   * @param  {Object}         bucketerParams
   * @param  {string}         bucketerParams.experimentId
   * @param  {string}         bucketerParams.experimentKey
   * @param  {string}         bucketerParams.userId
   * @param  {Object[]}       bucketerParams.trafficAllocationConfig
   * @param  {Array}          bucketerParams.experimentKeyMap
   * @param  {Object}         bucketerParams.groupIdMap
   * @param  {Object}         bucketerParams.variationIdMap
   * @param  {string}         bucketerParams.varationIdMap[].key
   * @param  {Object}         bucketerParams.logger
   * @param  {string}         bucketerParams.bucketingId
   * @return Variation ID that user has been bucketed into, null if user is not bucketed into any experiment
   */
  bucket: function(bucketerParams) {
    // Check if user is in a random group; if so, check if user is bucketed into a specific experiment
    var experiment = bucketerParams.experimentKeyMap[bucketerParams.experimentKey];
    var groupId = experiment['groupId'];
    if (groupId) {
      var group = bucketerParams.groupIdMap[groupId];
      if (!group) {
        throw new Error(sprintf(ERROR_MESSAGES.INVALID_GROUP_ID, MODULE_NAME, groupId));
      }
      if (group.policy === RANDOM_POLICY) {
        var bucketedExperimentId = module.exports.bucketUserIntoExperiment(group,
                                                                          bucketerParams.bucketingId,
                                                                          bucketerParams.userId,
                                                                          bucketerParams.logger);

        // Return if user is not bucketed into any experiment
        if (bucketedExperimentId === null) {
          var notbucketedInAnyExperimentLogMessage = sprintf(LOG_MESSAGES.USER_NOT_IN_ANY_EXPERIMENT, MODULE_NAME, bucketerParams.userId, groupId);
          bucketerParams.logger.log(LOG_LEVEL.INFO, notbucketedInAnyExperimentLogMessage);
          return null;
        }

        // Return if user is bucketed into a different experiment than the one specified
        if (bucketedExperimentId !== bucketerParams.experimentId) {
          var notBucketedIntoExperimentOfGroupLogMessage = sprintf(LOG_MESSAGES.USER_NOT_BUCKETED_INTO_EXPERIMENT_IN_GROUP, MODULE_NAME, bucketerParams.userId, bucketerParams.experimentKey, groupId);
          bucketerParams.logger.log(LOG_LEVEL.INFO, notBucketedIntoExperimentOfGroupLogMessage);
          return null;
        }

        // Continue bucketing if user is bucketed into specified experiment
        var bucketedIntoExperimentOfGroupLogMessage = sprintf(LOG_MESSAGES.USER_BUCKETED_INTO_EXPERIMENT_IN_GROUP, MODULE_NAME, bucketerParams.userId, bucketerParams.experimentKey, groupId);
        bucketerParams.logger.log(LOG_LEVEL.INFO, bucketedIntoExperimentOfGroupLogMessage);
      }
    }
    var bucketingId = sprintf('%s%s', bucketerParams.bucketingId, bucketerParams.experimentId);
    var bucketValue = module.exports._generateBucketValue(bucketingId);

    var bucketedUserLogMessage = sprintf(LOG_MESSAGES.USER_ASSIGNED_TO_VARIATION_BUCKET, MODULE_NAME, bucketValue, bucketerParams.userId);
    bucketerParams.logger.log(LOG_LEVEL.DEBUG, bucketedUserLogMessage);

    var entityId = module.exports._findBucket(bucketValue, bucketerParams.trafficAllocationConfig);
    if (entityId === null) {
      var userHasNoVariationLogMessage = sprintf(LOG_MESSAGES.USER_HAS_NO_VARIATION, MODULE_NAME, bucketerParams.userId, bucketerParams.experimentKey);
      bucketerParams.logger.log(LOG_LEVEL.DEBUG, userHasNoVariationLogMessage);
    } else if (entityId === '' || !bucketerParams.variationIdMap.hasOwnProperty(entityId)) {
      var invalidVariationIdLogMessage = sprintf(LOG_MESSAGES.INVALID_VARIATION_ID, MODULE_NAME);
      bucketerParams.logger.log(LOG_LEVEL.WARNING, invalidVariationIdLogMessage);
      return null;
    } else {
      var variationKey = bucketerParams.variationIdMap[entityId].key;
      var userInVariationLogMessage = sprintf(LOG_MESSAGES.USER_HAS_VARIATION, MODULE_NAME, bucketerParams.userId, variationKey, bucketerParams.experimentKey);
      bucketerParams.logger.log(LOG_LEVEL.INFO, userInVariationLogMessage);
    }

    return entityId;
  },

  /**
   * Returns bucketed experiment ID to compare against experiment user is being called into
   * @param {Object} group        Group that experiment is in
   * @param {string} bucketingId  Bucketing ID
   * @param {string} userId       ID of user to be bucketed into experiment
   * @param {Object} logger       Logger implementation
   * @return {string} ID of experiment if user is bucketed into experiment within the group, null otherwise
   */
  bucketUserIntoExperiment: function(group, bucketingId, userId, logger) {
    var bucketingKey = sprintf('%s%s', bucketingId, group.id);
    var bucketValue = module.exports._generateBucketValue(bucketingKey);
    logger.log(LOG_LEVEL.DEBUG, sprintf(LOG_MESSAGES.USER_ASSIGNED_TO_EXPERIMENT_BUCKET, MODULE_NAME, bucketValue, userId));
    var trafficAllocationConfig = group.trafficAllocation;
    var bucketedExperimentId = module.exports._findBucket(bucketValue, trafficAllocationConfig);
    return bucketedExperimentId;
  },

  /**
   * Returns entity ID associated with bucket value
   * @param  {string}   bucketValue
   * @param  {Object[]} trafficAllocationConfig
   * @param  {number}   trafficAllocationConfig[].endOfRange
   * @param  {number}   trafficAllocationConfig[].entityId
   * @return {string}   Entity ID for bucketing if bucket value is within traffic allocation boundaries, null otherwise
   */
  _findBucket: function(bucketValue, trafficAllocationConfig) {
    for (var i = 0; i < trafficAllocationConfig.length; i++) {
      if (bucketValue < trafficAllocationConfig[i].endOfRange) {
        return trafficAllocationConfig[i].entityId;
      }
    }
    return null;
  },

  /**
   * Helper function to generate bucket value in half-closed interval [0, MAX_TRAFFIC_VALUE)
   * @param  {string} bucketingKey String value for bucketing
   * @return {string} the generated bucket value
   * @throws If bucketing value is not a valid string
   */
  _generateBucketValue: function(bucketingKey) {
    try {
      // NOTE: the mmh library already does cast the hash value as an unsigned 32bit int
      // https://github.com/perezd/node-murmurhash/blob/master/murmurhash.js#L115
      var hashValue = murmurhash.v3(bucketingKey, HASH_SEED);
      var ratio = hashValue / MAX_HASH_VALUE;
      return parseInt(ratio * MAX_TRAFFIC_VALUE, 10);
    } catch (ex) {
      throw new Error(sprintf(ERROR_MESSAGES.INVALID_BUCKETING_ID, MODULE_NAME, bucketingKey, ex.message));
    }
  },
};


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

(function(){
  var _global = this;

  /**
   * JS Implementation of MurmurHash2
   *
   * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
   * @see http://github.com/garycourt/murmurhash-js
   * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
   * @see http://sites.google.com/site/murmurhash/
   *
   * @param {string} str ASCII only
   * @param {number} seed Positive integer only
   * @return {number} 32-bit positive integer hash
   */
  function MurmurHashV2(str, seed) {
    var
      l = str.length,
      h = seed ^ l,
      i = 0,
      k;

    while (l >= 4) {
      k =
        ((str.charCodeAt(i) & 0xff)) |
        ((str.charCodeAt(++i) & 0xff) << 8) |
        ((str.charCodeAt(++i) & 0xff) << 16) |
        ((str.charCodeAt(++i) & 0xff) << 24);

      k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
      k ^= k >>> 24;
      k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));

    h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;

      l -= 4;
      ++i;
    }

    switch (l) {
    case 3: h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
    case 2: h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
    case 1: h ^= (str.charCodeAt(i) & 0xff);
            h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    }

    h ^= h >>> 13;
    h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    h ^= h >>> 15;

    return h >>> 0;
  };

  /**
   * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
   *
   * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
   * @see http://github.com/garycourt/murmurhash-js
   * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
   * @see http://sites.google.com/site/murmurhash/
   *
   * @param {string} key ASCII only
   * @param {number} seed Positive integer only
   * @return {number} 32-bit positive integer hash
   */
  function MurmurHashV3(key, seed) {
    var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

    remainder = key.length & 3; // key.length % 4
    bytes = key.length - remainder;
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;

    while (i < bytes) {
        k1 =
          ((key.charCodeAt(i) & 0xff)) |
          ((key.charCodeAt(++i) & 0xff) << 8) |
          ((key.charCodeAt(++i) & 0xff) << 16) |
          ((key.charCodeAt(++i) & 0xff) << 24);
      ++i;

      k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

      h1 ^= k1;
          h1 = (h1 << 13) | (h1 >>> 19);
      h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
      h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    k1 = 0;

    switch (remainder) {
      case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
      case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
      case 1: k1 ^= (key.charCodeAt(i) & 0xff);

      k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
      h1 ^= k1;
    }

    h1 ^= key.length;

    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
  }

  var murmur = MurmurHashV3;
  murmur.v2 = MurmurHashV2;
  murmur.v3 = MurmurHashV3;

  if (true) {
    module.exports = murmur;
  } else { var _previousRoot; }
}());


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2016-2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var fns = __webpack_require__(18);
var enums = __webpack_require__(199);
var sprintf = __webpack_require__(12).sprintf;
var configValidator = __webpack_require__(198);
var projectConfigSchema = __webpack_require__(219);

var EXPERIMENT_LAUNCHED_STATUS = 'Launched';
var EXPERIMENT_RUNNING_STATUS = 'Running';
var RESERVED_ATTRIBUTE_PREFIX = '$opt_';
var MODULE_NAME = 'PROJECT_CONFIG';

var ERROR_MESSAGES = enums.ERROR_MESSAGES;
var LOG_MESSAGES = enums.LOG_MESSAGES;
var LOG_LEVEL = enums.LOG_LEVEL;
var FEATURE_VARIABLE_TYPES = enums.FEATURE_VARIABLE_TYPES;

module.exports = {
  /**
   * Creates projectConfig object to be used for quick project property lookup
   * @param  {Object} datafile JSON datafile representing the project
   * @return {Object} Object representing project configuration
   */
  createProjectConfig: function(datafile) {
    var projectConfig = fns.cloneDeep(datafile);

    /*
     * Conditions of audiences in projectConfig.typedAudiences are not
     * expected to be string-encoded as they are here in projectConfig.audiences.
     */
    fns.forEach(projectConfig.audiences, function(audience) {
      audience.conditions = JSON.parse(audience.conditions);
    });
    projectConfig.audiencesById = fns.keyBy(projectConfig.audiences, 'id');
    fns.assign(projectConfig.audiencesById, fns.keyBy(projectConfig.typedAudiences, 'id'));

    projectConfig.attributeKeyMap = fns.keyBy(projectConfig.attributes, 'key');
    projectConfig.eventKeyMap = fns.keyBy(projectConfig.events, 'key');
    projectConfig.groupIdMap = fns.keyBy(projectConfig.groups, 'id');

    var experiments;
    fns.forEach(projectConfig.groupIdMap, function(group, Id) {
      experiments = fns.cloneDeep(group.experiments);
      fns.forEach(experiments, function(experiment) {
        projectConfig.experiments.push(fns.assignIn(experiment, {groupId: Id}));
      });
    });

    projectConfig.rolloutIdMap = fns.keyBy(projectConfig.rollouts || [], 'id');
    fns.forOwn(projectConfig.rolloutIdMap, function(rollout) {
      fns.forEach(rollout.experiments || [], function(experiment) {
        projectConfig.experiments.push(fns.cloneDeep(experiment));
        // Creates { <variationKey>: <variation> } map inside of the experiment
        experiment.variationKeyMap = fns.keyBy(experiment.variations, 'key');
      });
    });

    projectConfig.experimentKeyMap = fns.keyBy(projectConfig.experiments, 'key');
    projectConfig.experimentIdMap = fns.keyBy(projectConfig.experiments, 'id');

    projectConfig.variationIdMap = {};
    projectConfig.variationVariableUsageMap = {};
    fns.forEach(projectConfig.experiments, function(experiment) {
      // Creates { <variationKey>: <variation> } map inside of the experiment
      experiment.variationKeyMap = fns.keyBy(experiment.variations, 'key');

      // Creates { <variationId>: { key: <variationKey>, id: <variationId> } } mapping for quick lookup
      fns.assignIn(projectConfig.variationIdMap, fns.keyBy(experiment.variations, 'id'));

      fns.forOwn(experiment.variationKeyMap, function(variation) {
        if (variation.variables) {
          projectConfig.variationVariableUsageMap[variation.id] = fns.keyBy(variation.variables, 'id');
        }
      });
    });

    // Object containing experiment Ids that exist in any feature
    // for checking that experiment is a feature experiment or not.
    projectConfig.experimentFeatureMap = {};

    projectConfig.featureKeyMap = fns.keyBy(projectConfig.featureFlags || [], 'key');
    fns.forOwn(projectConfig.featureKeyMap, function(feature) {
      feature.variableKeyMap = fns.keyBy(feature.variables, 'key');
      fns.forEach(feature.experimentIds || [], function(experimentId) {
        // Add this experiment in experiment-feature map.
        if (projectConfig.experimentFeatureMap[experimentId]) {
          projectConfig.experimentFeatureMap[experimentId].push(feature.id);  
        } else {
          projectConfig.experimentFeatureMap[experimentId] = [feature.id];
        }
        
        var experimentInFeature = projectConfig.experimentIdMap[experimentId];
        if (experimentInFeature.groupId) {
          feature.groupId = experimentInFeature.groupId;
          // Experiments in feature can only belong to one mutex group.
          return false;
        }
      });
    });

    return projectConfig;
  },

  /**
   * Get experiment ID for the provided experiment key
   * @param  {Object} projectConfig Object representing project configuration
   * @param  {string} experimentKey Experiment key for which ID is to be determined
   * @return {string} Experiment ID corresponding to the provided experiment key
   * @throws If experiment key is not in datafile
   */
  getExperimentId: function(projectConfig, experimentKey) {
    var experiment = projectConfig.experimentKeyMap[experimentKey];
    if (fns.isEmpty(experiment)) {
      throw new Error(sprintf(ERROR_MESSAGES.INVALID_EXPERIMENT_KEY, MODULE_NAME, experimentKey));
    }
    return experiment.id;
  },

  /**
   * Get layer ID for the provided experiment key
   * @param  {Object} projectConfig Object representing project configuration
   * @param  {string} experimentId Experiment ID for which layer ID is to be determined
   * @return {string} Layer ID corresponding to the provided experiment key
   * @throws If experiment key is not in datafile
   */
  getLayerId: function(projectConfig, experimentId) {
    var experiment = projectConfig.experimentIdMap[experimentId];
    if (fns.isEmpty(experiment)) {
      throw new Error(sprintf(ERROR_MESSAGES.INVALID_EXPERIMENT_ID, MODULE_NAME, experimentId));
    }
    return experiment.layerId;
  },

  /**
   * Get attribute ID for the provided attribute key
   * @param  {Object}      projectConfig Object representing project configuration
   * @param  {string}      attributeKey  Attribute key for which ID is to be determined
   * @param  {Object}      logger
   * @return {string|null} Attribute ID corresponding to the provided attribute key. Attribute key if it is a reserved attribute.
   */
  getAttributeId: function(projectConfig, attributeKey, logger) {
    var attribute = projectConfig.attributeKeyMap[attributeKey];
    var hasReservedPrefix = attributeKey.indexOf(RESERVED_ATTRIBUTE_PREFIX) === 0;
    if (attribute) {
      if (hasReservedPrefix) {
        logger.log(LOG_LEVEL.WARN,
                   sprintf('Attribute %s unexpectedly has reserved prefix %s; using attribute ID instead of reserved attribute name.', attributeKey, RESERVED_ATTRIBUTE_PREFIX));
      }
      return attribute.id;
    } else if (hasReservedPrefix) {
      return attributeKey;
    }

    logger.log(LOG_LEVEL.DEBUG, sprintf(ERROR_MESSAGES.UNRECOGNIZED_ATTRIBUTE, MODULE_NAME, attributeKey));
    return null;
  },

  /**
   * Get event ID for the provided
   * @param  {Object}      projectConfig Object representing project configuration
   * @param  {string}      eventKey      Event key for which ID is to be determined
   * @return {string|null} Event ID corresponding to the provided event key
   */
  getEventId: function(projectConfig, eventKey) {
    var event = projectConfig.eventKeyMap[eventKey];
    if (event) {
      return event.id;
    }
    return null;
  },

  /**
   * Get experiment status for the provided experiment key
   * @param  {Object} projectConfig Object representing project configuration
   * @param  {string} experimentKey Experiment key for which status is to be determined
   * @return {string} Experiment status corresponding to the provided experiment key
   * @throws If experiment key is not in datafile
   */
  getExperimentStatus: function(projectConfig, experimentKey) {
    var experiment = projectConfig.experimentKeyMap[experimentKey];
    if (fns.isEmpty(experiment)) {
      throw new Error(sprintf(ERROR_MESSAGES.INVALID_EXPERIMENT_KEY, MODULE_NAME, experimentKey));
    }
    return experiment.status;
  },

  /**
   * Returns whether experiment has a status of 'Running' or 'Launched'
   * @param  {Object}  projectConfig Object representing project configuration
   * @param  {string}  experimentKey Experiment key for which status is to be compared with 'Running'
   * @return {Boolean}               true if experiment status is set to 'Running', false otherwise
   */
  isActive: function(projectConfig, experimentKey) {
    return module.exports.getExperimentStatus(projectConfig, experimentKey) === EXPERIMENT_RUNNING_STATUS ||
      module.exports.getExperimentStatus(projectConfig, experimentKey) === EXPERIMENT_LAUNCHED_STATUS;
  },

  /**
   * Determine for given experiment if event is running, which determines whether should be dispatched or not
   */
  isRunning: function(projectConfig, experimentKey) {
    return module.exports.getExperimentStatus(projectConfig, experimentKey) === EXPERIMENT_RUNNING_STATUS;
  },

  /**
   * Get audience conditions for the experiment
   * @param  {Object}         projectConfig Object representing project configuration
   * @param  {string}         experimentKey Experiment key for which audience conditions are to be determined
   * @return {Array}          Audience conditions for the experiment - can be an array of audience IDs, or a
   *                          nested array of conditions
   *                          Examples: ["5", "6"], ["and", ["or", "1", "2"], "3"]
   * @throws If experiment key is not in datafile
   */
  getExperimentAudienceConditions: function(projectConfig, experimentKey) {
    var experiment = projectConfig.experimentKeyMap[experimentKey];
    if (fns.isEmpty(experiment)) {
      throw new Error(sprintf(ERROR_MESSAGES.INVALID_EXPERIMENT_KEY, MODULE_NAME, experimentKey));
    }

    return experiment.audienceConditions || experiment.audienceIds;
  },

  /**
   * Get variation key given experiment key and variation ID
   * @param  {Object} projectConfig Object representing project configuration
   * @param  {string} variationId   ID of the variation
   * @return {string} Variation key or null if the variation ID is not found
   */
  getVariationKeyFromId: function(projectConfig, variationId) {
    if (projectConfig.variationIdMap.hasOwnProperty(variationId)) {
      return projectConfig.variationIdMap[variationId].key;
    }
    return null;
  },

  /**
   * Get the variation ID given the experiment key and variation key
   * @param  {Object} projectConfig Object representing project configuration
   * @param  {string} experimentKey Key of the experiment the variation belongs to
   * @param  {string} variationKey  The variation key
   * @return {string} the variation ID
   */
  getVariationIdFromExperimentAndVariationKey: function(projectConfig, experimentKey, variationKey) {
    var experiment = projectConfig.experimentKeyMap[experimentKey];
    if (experiment.variationKeyMap.hasOwnProperty(variationKey)) {
      return experiment.variationKeyMap[variationKey].id;
    }
    return null;
  },

  /**
   * Get experiment from provided experiment key
   * @param  {Object} projectConfig  Object representing project configuration
   * @param  {string} experimentKey  Event key for which experiment IDs are to be retrieved
   * @return {Object} experiment
   * @throws If experiment key is not in datafile
   */
  getExperimentFromKey: function(projectConfig, experimentKey) {
    if (projectConfig.experimentKeyMap.hasOwnProperty(experimentKey)) {
      var experiment = projectConfig.experimentKeyMap[experimentKey];
      if (!!experiment) {
        return experiment;
      }
    }

    throw new Error(sprintf(ERROR_MESSAGES.EXPERIMENT_KEY_NOT_IN_DATAFILE, MODULE_NAME, experimentKey));
  },

  /**
   * Given an experiment key, returns the traffic allocation within that experiment
   * @param  {Object} projectConfig Object representing project configuration
   * @param  {string} experimentKey Key representing the experiment
   * @return {Array<Object>}        Traffic allocation for the experiment
   * @throws If experiment key is not in datafile
   */
  getTrafficAllocation: function(projectConfig, experimentKey) {
    var experiment = projectConfig.experimentKeyMap[experimentKey];
    if (fns.isEmpty(experiment)) {
      throw new Error(sprintf(ERROR_MESSAGES.INVALID_EXPERIMENT_KEY, MODULE_NAME, experimentKey));
    }
    return experiment.trafficAllocation;
  },

  /**
   * Get experiment from provided experiment id. Log an error if no experiment
   * exists in the project config with the given ID.
   * @param  {Object} projectConfig  Object representing project configuration
   * @param  {string} experimentId  ID of desired experiment object
   * @return {Object} Experiment object
   */
  getExperimentFromId: function(projectConfig, experimentId, logger) {
    if (projectConfig.experimentIdMap.hasOwnProperty(experimentId)) {
      var experiment = projectConfig.experimentIdMap[experimentId];
      if (!!experiment) {
        return experiment;
      }
    }

    logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.INVALID_EXPERIMENT_ID, MODULE_NAME, experimentId));
    return null;
  },

  /**
   * Get feature from provided feature key. Log an error if no feature exists in
   * the project config with the given key.
   * @param {Object} projectConfig
   * @param {string} featureKey
   * @param {Object} logger
   * @return {Object|null} Feature object, or null if no feature with the given
   * key exists
   */
  getFeatureFromKey: function(projectConfig, featureKey, logger) {
    if (projectConfig.featureKeyMap.hasOwnProperty(featureKey)) {
      var feature = projectConfig.featureKeyMap[featureKey];
      if (!!feature) {
        return feature;
      }
    }

    logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.FEATURE_NOT_IN_DATAFILE, MODULE_NAME, featureKey));
    return null;
  },

  /**
   * Get the variable with the given key associated with the feature with the
   * given key. If the feature key or the variable key are invalid, log an error
   * message.
   * @param {Object} projectConfig
   * @param {string} featureKey
   * @param {string} variableKey
   * @param {Object} logger
   * @return {Object|null} Variable object, or null one or both of the given
   * feature and variable keys are invalid
   */
  getVariableForFeature: function(projectConfig, featureKey, variableKey, logger) {
    var feature = projectConfig.featureKeyMap[featureKey];
    if (!feature) {
      logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.FEATURE_NOT_IN_DATAFILE, MODULE_NAME, featureKey));
      return null;
    }

    var variable = feature.variableKeyMap[variableKey];
    if (!variable) {
      logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.VARIABLE_KEY_NOT_IN_DATAFILE, MODULE_NAME, variableKey, featureKey));
      return null;
    }

    return variable;
  },

  /**
   * Get the value of the given variable for the given variation. If the given
   * variable has no value for the given variation, return null. Log an error message if the variation is invalid. If the
   * variable or variation are invalid, return null.
   * @param {Object} projectConfig
   * @param {Object} variable
   * @param {Object} variation
   * @param {Object} logger
   * @return {string|null} The value of the given variable for the given
   * variation, or null if the given variable has no value
   * for the given variation or if the variation or variable are invalid
   */
  getVariableValueForVariation: function(projectConfig, variable, variation, logger) {
    if (!variable || !variation) {
      return null;
    }

    if (!projectConfig.variationVariableUsageMap.hasOwnProperty(variation.id)) {
      logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.VARIATION_ID_NOT_IN_DATAFILE_NO_EXPERIMENT, MODULE_NAME, variation.id));
      return null;
    }

    var variableUsages = projectConfig.variationVariableUsageMap[variation.id];
    var variableUsage = variableUsages[variable.id];

    return variableUsage ? variableUsage.value : null;
  },

  /**
   * Given a variable value in string form, try to cast it to the argument type.
   * If the type cast succeeds, return the type casted value, otherwise log an
   * error and return null.
   * @param {string} variableValue  Variable value in string form
   * @param {string} variableType   Type of the variable whose value was passed
   *                                in the first argument. Must be one of
   *                                FEATURE_VARIABLE_TYPES in
   *                                lib/utils/enums/index.js. The return value's
   *                                type is determined by this argument (boolean
   *                                for BOOLEAN, number for INTEGER or DOUBLE,
   *                                and string for STRING).
   * @param {Object} logger         Logger instance
   * @returns {*}                   Variable value of the appropriate type, or
   *                                null if the type cast failed
   */
  getTypeCastValue: function(variableValue, variableType, logger) {
    var castValue;

    switch (variableType) {
      case FEATURE_VARIABLE_TYPES.BOOLEAN:
        if (variableValue !== 'true' && variableValue !== 'false') {
          logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.UNABLE_TO_CAST_VALUE, MODULE_NAME, variableValue, variableType));
          castValue = null;
        } else {
          castValue = variableValue === 'true';
        }
        break;

      case FEATURE_VARIABLE_TYPES.INTEGER:
        castValue = parseInt(variableValue, 10);
        if (isNaN(castValue)) {
          logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.UNABLE_TO_CAST_VALUE, MODULE_NAME, variableValue, variableType));
          castValue = null;
        }
        break;

      case FEATURE_VARIABLE_TYPES.DOUBLE:
        castValue = parseFloat(variableValue);
        if (isNaN(castValue)) {
          logger.log(LOG_LEVEL.ERROR, sprintf(ERROR_MESSAGES.UNABLE_TO_CAST_VALUE, MODULE_NAME, variableValue, variableType));
          castValue = null;
        }
        break;

      default: // type is STRING
        castValue = variableValue;
        break;
    }

    return castValue;
  },

  /**
   * Returns an object containing all audiences in the project config. Keys are audience IDs
   * and values are audience objects.
   * @param projectConfig
   * @returns {Object}
   */
  getAudiencesById: function(projectConfig) {
    return projectConfig.audiencesById;
  },

  /**
   * Returns true if an event with the given key exists in the datafile, and false otherwise
   * @param {Object} projectConfig
   * @param {string} eventKey
   * @returns {boolean}
   */
  eventWithKeyExists: function(projectConfig, eventKey) {
    return projectConfig.eventKeyMap.hasOwnProperty(eventKey);
  },

  /**
   *
   * @param {Object} projectConfig
   * @param {string} experimentId
   * @returns {boolean} Returns true if experiment belongs to
   * any feature, false otherwise.
   */
  isFeatureExperiment: function(projectConfig, experimentId) {
    return projectConfig.experimentFeatureMap.hasOwnProperty(experimentId);
  },

  /**
   * Try to create a project config object from the given datafile and
   * configuration properties.
   * If successful, return the project config object, otherwise throws an error
   * @param  {Object} config
   * @param  {Object} config.datafile
   * @param  {Object} config.jsonSchemaValidator
   * @param  {Object} config.logger
   * @param  {Object} config.skipJSONValidation
   * @return {Object} Project config object
   */
  tryCreatingProjectConfig: function(config) {
    configValidator.validateDatafile(config.datafile);
    if (config.skipJSONValidation === true) {
      config.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.SKIPPING_JSON_VALIDATION, MODULE_NAME));
    } else if (config.jsonSchemaValidator) {
      config.jsonSchemaValidator.validate(projectConfigSchema, config.datafile);
      config.logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.VALID_DATAFILE, MODULE_NAME));
    }
    return module.exports.createProjectConfig(config.datafile);
  },
};


/***/ }),
/* 219 */
/***/ (function(module, exports) {

/**
 * Copyright 2016-2017, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*eslint-disable */
/**
 * Project Config JSON Schema file used to validate the project json datafile
 */
module.exports = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "projectId": {
      "type": "string",
      "required": true
    },
    "accountId": {
      "type": "string",
      "required": true
    },
    "groups": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "required": true
          },
          "policy": {
            "type": "string",
            "required": true
          },
          "trafficAllocation": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "entityId": {
                  "type": "string",
                  "required": true
                },
                "endOfRange": {
                  "type": "integer",
                  "required": true
                }
              }
            },
            "required": true
          },
          "experiments": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "required": true
                },
                "key": {
                  "type": "string",
                  "required": true
                },
                "status": {
                  "type": "string",
                  "required": true
                },
                "layerId": {
                  "type": "string",
                  "required": true
                },
                "variations": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "required": true
                      },
                      "key": {
                        "type": "string",
                        "required": true
                      }
                    }
                  },
                  "required": true
                },
                "trafficAllocation": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "entityId": {
                        "type": "string",
                        "required": true
                      },
                      "endOfRange": {
                        "type": "integer",
                        "required": true
                      }
                    }
                  },
                  "required": true
                },
                "audienceIds": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "required": true
                },
                "forcedVariations": {
                  "type": "object",
                  "required": true
                }
              }
            },
            "required": true
          }
        }
      },
      "required": true
    },
    "experiments": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "required": true
          },
          "key": {
            "type": "string",
            "required": true
          },
          "status": {
            "type": "string",
            "required": true
          },
          "layerId": {
            "type": "string",
            "required": true
          },
          "variations": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "required": true
                },
                "key": {
                  "type": "string",
                  "required": true
                }
              }
            },
            "required": true
          },
          "trafficAllocation": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "entityId": {
                  "type": "string",
                  "required": true
                },
                "endOfRange": {
                  "type": "integer",
                  "required": true
                }
              }
            },
            "required": true
          },
          "audienceIds": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "required": true
          },
          "forcedVariations": {
            "type": "object",
            "required": true
          }
        }
      },
      "required": true
    },
    "events": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "key": {
            "type": "string",
            "required": true
          },
          "experimentIds": {
            "type": "array",
            "items": {
              "type": "string",
              "required": true
            }
          },
          "id": {
            "type": "string",
            "required": true
          }
        }
      },
      "required": true
    },
    "audiences": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "required": true
          },
          "name": {
            "type": "string",
            "required": true
          },
          "conditions": {
            "type": "string",
            "required": true
          }
        }
      },
      "required": true
    },
    "attributes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "required": true
          },
          "key": {
            "type": "string",
            "required": true
          },
        }
      },
      "required": true
    },
    "version": {
      "type": "string",
      "required": true
    },
    "revision": {
      "type": "string",
      "required": true
    },
  }
};


/***/ }),
/* 220 */
/***/ (function(module, exports) {

/**
 * Copyright 2018, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = {
  /**
   * Validates provided value is a non-empty string
   * @param  {string}  input
   * @return {boolean} True for non-empty string, false otherwise
   */
  validate: function(input) {
      return typeof input === 'string' && input !== '';
  }
};


/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2016-2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var enums = __webpack_require__(199);
var fns = __webpack_require__(18);
var eventTagUtils = __webpack_require__(222);
var projectConfig = __webpack_require__(218);
var attributeValidator = __webpack_require__(211);

var ACTIVATE_EVENT_KEY = 'campaign_activated';
var CUSTOM_ATTRIBUTE_FEATURE_TYPE = 'custom';
var ENDPOINT = 'https://logx.optimizely.com/v1/events';
var HTTP_VERB = 'POST';

/**
 * Get params which are used same in both conversion and impression events
 * @param  {Object} options.attributes    Object representing user attributes and values which need to be recorded
 * @param  {string} options.clientEngine  The client we are using: node or javascript
 * @param  {string} options.clientVersion The version of the client
 * @param  {Object} options.configObj     Object representing project configuration, including datafile information and mappings for quick lookup
 * @param  {string} options.userId        ID for user
 * @param  {Object} options.Logger        logger
 * @return {Object}                       Common params with properties that are used in both conversion and impression events
 */
function getCommonEventParams(options) {
  var attributes = options.attributes;
  var configObj = options.configObj;
  var anonymize_ip = configObj.anonymizeIP;
  var botFiltering = configObj.botFiltering;
  if (anonymize_ip === null || anonymize_ip === undefined) {
    anonymize_ip = false;
  }

  var visitor = {
    snapshots: [],
    visitor_id: options.userId,
    attributes: []
  };

  var commonParams = {
    account_id: configObj.accountId,
    project_id: configObj.projectId,
    visitors: [visitor],
    revision: configObj.revision,
    client_name: options.clientEngine,
    client_version: options.clientVersion,
    anonymize_ip: anonymize_ip,
    enrich_decisions: true,
  };

  // Omit attribute values that are not supported by the log endpoint.
  fns.forOwn(attributes, function(attributeValue, attributeKey) {
    if (attributeValidator.isAttributeValid(attributeKey, attributeValue)) {
      var attributeId = projectConfig.getAttributeId(options.configObj, attributeKey, options.logger);
      if (attributeId) {
        commonParams.visitors[0].attributes.push({
          entity_id: attributeId,
          key: attributeKey,
          type: CUSTOM_ATTRIBUTE_FEATURE_TYPE,
          value: attributes[attributeKey],
        });
      }
    }
  });

  if (typeof botFiltering === 'boolean') {
    commonParams.visitors[0].attributes.push({
      entity_id: enums.CONTROL_ATTRIBUTES.BOT_FILTERING,
      key: enums.CONTROL_ATTRIBUTES.BOT_FILTERING,
      type: CUSTOM_ATTRIBUTE_FEATURE_TYPE,
      value: botFiltering,
    });
  }
  return commonParams;
}

/**
 * Creates object of params specific to impression events
 * @param  {Object} configObj    Object representing project configuration
 * @param  {string} experimentId ID of experiment for which impression needs to be recorded
 * @param  {string} variationId  ID for variation which would be presented to user
 * @return {Object}              Impression event params
 */
function getImpressionEventParams(configObj, experimentId, variationId) {
  var impressionEventParams = {
      decisions: [{
        campaign_id: projectConfig.getLayerId(configObj, experimentId),
        experiment_id: experimentId,
        variation_id: variationId,
      }],
      events: [{
        entity_id: projectConfig.getLayerId(configObj, experimentId),
        timestamp: fns.currentTimestamp(),
        key: ACTIVATE_EVENT_KEY,
        uuid: fns.uuid(),
      }]

    };
  return impressionEventParams;
}

/**
 * Creates object of params specific to conversion events
 * @param  {Object} configObj                 Object representing project configuration
 * @param  {string} eventKey                  Event key representing the event which needs to be recorded
 * @param  {Object} eventTags                 Values associated with the event.
 * @param  {Object} logger                    Logger object
 * @return {Object}                           Conversion event params
 */
function getVisitorSnapshot(configObj, eventKey, eventTags, logger) {
  var snapshot = {
    events: []
  };

  var eventDict = {
    entity_id: projectConfig.getEventId(configObj, eventKey),
    timestamp: fns.currentTimestamp(),
    uuid: fns.uuid(),
    key: eventKey,
  };

  if (eventTags) {
    var revenue = eventTagUtils.getRevenueValue(eventTags, logger);
    if (revenue !== null) {
      eventDict[enums.RESERVED_EVENT_KEYWORDS.REVENUE] = revenue;
    }

    var eventValue = eventTagUtils.getEventValue(eventTags, logger);
    if (eventValue !== null) {
      eventDict[enums.RESERVED_EVENT_KEYWORDS.VALUE] = eventValue;
    }

    eventDict['tags'] = eventTags;
  }
  snapshot.events.push(eventDict);

  return snapshot;
}

module.exports = {
  /**
   * Create impression event params to be sent to the logging endpoint
   * @param  {Object} options               Object containing values needed to build impression event
   * @param  {Object} options.attributes    Object representing user attributes and values which need to be recorded
   * @param  {string} options.clientEngine  The client we are using: node or javascript
   * @param  {string} options.clientVersion The version of the client
   * @param  {Object} options.configObj     Object representing project configuration, including datafile information and mappings for quick lookup
   * @param  {string} options.experimentId  Experiment for which impression needs to be recorded
   * @param  {string} options.userId        ID for user
   * @param  {string} options.variationId   ID for variation which would be presented to user
   * @return {Object}                       Params to be used in impression event logging endpoint call
   */
  getImpressionEvent: function(options) {
    var impressionEvent = {
      httpVerb: HTTP_VERB
    };

    var commonParams = getCommonEventParams(options);
    impressionEvent.url = ENDPOINT;

    var impressionEventParams = getImpressionEventParams(options.configObj, options.experimentId, options.variationId);
    // combine Event params into visitor obj
    commonParams.visitors[0].snapshots.push(impressionEventParams);

    impressionEvent.params = commonParams;

    return impressionEvent;
  },

  /**
   * Create conversion event params to be sent to the logging endpoint
   * @param  {Object} options                           Object containing values needed to build conversion event
   * @param  {Object} options.attributes                Object representing user attributes and values which need to be recorded
   * @param  {string} options.clientEngine              The client we are using: node or javascript
   * @param  {string} options.clientVersion             The version of the client
   * @param  {Object} options.configObj                 Object representing project configuration, including datafile information and mappings for quick lookup
   * @param  {string} options.eventKey                  Event key representing the event which needs to be recorded
   * @param  {Object} options.eventTags                 Object with event-specific tags
   * @param  {Object} options.logger                    Logger object
   * @param  {string} options.userId                    ID for user
   * @return {Object}                                   Params to be used in conversion event logging endpoint call
   */
  getConversionEvent: function(options) {
    var conversionEvent = {
      httpVerb: HTTP_VERB,
    };

    var commonParams = getCommonEventParams(options);
    conversionEvent.url = ENDPOINT;

    var snapshot = getVisitorSnapshot(options.configObj,
                                            options.eventKey,
                                            options.eventTags,
                                            options.logger);

    commonParams.visitors[0].snapshots = [snapshot];
    conversionEvent.params = commonParams;

    return conversionEvent;
  },
};


/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2017, 2019 Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Provides utility method for parsing event tag values
 */
var enums = __webpack_require__(199);
var sprintf = __webpack_require__(12).sprintf;

var LOG_LEVEL = enums.LOG_LEVEL;
var LOG_MESSAGES = enums.LOG_MESSAGES;
var MODULE_NAME = 'EVENT_TAG_UTILS';
var REVENUE_EVENT_METRIC_NAME = enums.RESERVED_EVENT_KEYWORDS.REVENUE;
var VALUE_EVENT_METRIC_NAME = enums.RESERVED_EVENT_KEYWORDS.VALUE;

module.exports = {
  /**
   * Grab the revenue value from the event tags. "revenue" is a reserved keyword.
   * @param {Object} eventTags
   * @param {Object} logger
   * @return {Integer|null}
   */
  getRevenueValue: function(eventTags, logger) {
    if (eventTags && eventTags.hasOwnProperty(REVENUE_EVENT_METRIC_NAME)) {
      var rawValue = eventTags[REVENUE_EVENT_METRIC_NAME];
      var parsedRevenueValue = parseInt(rawValue, 10);
      if (isNaN(parsedRevenueValue)) {
        logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.FAILED_TO_PARSE_REVENUE, MODULE_NAME, rawValue));
        return null;
      }
      logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.PARSED_REVENUE_VALUE, MODULE_NAME, parsedRevenueValue));
      return parsedRevenueValue;
    }
    return null;
  },

  /**
   * Grab the event value from the event tags. "value" is a reserved keyword.
   * @param {Object} eventTags
   * @param {Object} logger
   * @return {Number|null}
   */
  getEventValue: function(eventTags, logger) {
    if (eventTags && eventTags.hasOwnProperty(VALUE_EVENT_METRIC_NAME)) {
      var rawValue = eventTags[VALUE_EVENT_METRIC_NAME];
      var parsedEventValue = parseFloat(rawValue);
      if (isNaN(parsedEventValue)) {
        logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.FAILED_TO_PARSE_VALUE, MODULE_NAME, rawValue));
        return null;
      }
      logger.log(LOG_LEVEL.INFO, sprintf(LOG_MESSAGES.PARSED_NUMERIC_VALUE, MODULE_NAME, parsedEventValue));
      return parsedEventValue;
    }
    return null;
  },
};


/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var logging = __webpack_require__(8);

var attributesValidator = __webpack_require__(211);
var fns = __webpack_require__(18);
var eventTagUtils = __webpack_require__(222);
var projectConfig = __webpack_require__(218);

var logger = logging.getLogger('EVENT_BUILDER');

/**
 * Creates an ImpressionEvent object from decision data
 * @param {Object} config
 * @param {Object} config.configObj
 * @param {String} config.experimentKey
 * @param {String} config.variationKey
 * @param {String} config.userId
 * @param {Object} config.userAttributes
 * @param {String} config.clientEngine
 * @param {String} config.clientVersion
 * @return {Object} an ImpressionEvent object
 */
exports.buildImpressionEvent = function buildImpressionEvent(config) {
  var configObj = config.configObj;
  var experimentKey = config.experimentKey;
  var variationKey = config.variationKey;
  var userId = config.userId;
  var userAttributes = config.userAttributes;
  var clientEngine = config.clientEngine;
  var clientVersion = config.clientVersion;

  var variationId = projectConfig.getVariationIdFromExperimentAndVariationKey(configObj, experimentKey, variationKey);
  var experimentId = projectConfig.getExperimentId(configObj, experimentKey);
  var layerId = projectConfig.getLayerId(configObj, experimentId);

  return {
    type: 'impression',
    timestamp: fns.currentTimestamp(),
    uuid: fns.uuid(),

    user: {
      id: userId,
      attributes: buildVisitorAttributes(configObj, userAttributes),
    },

    context: {
      accountId: configObj.accountId,
      projectId: configObj.projectId,
      revision: configObj.revision,
      clientName: clientEngine,
      clientVersion: clientVersion,
      anonymizeIP: configObj.anonymizeIP || false,
      botFiltering: configObj.botFiltering,
    },

    layer: {
      id: layerId,
    },

    experiment: {
      id: experimentId,
      key: experimentKey,
    },

    variation: {
      id: variationId,
      key: variationKey,
    },
  };
};

/**
 * Creates a ConversionEvent object from track
 * @param {Object} config
 * @param {Object} config.configObj
 * @param {String} config.eventKey
 * @param {Object|undefined} config.eventTags
 * @param {String} config.userId
 * @param {Object} config.userAttributes
 * @param {String} config.clientEngine
 * @param {String} config.clientVersion
 * @return {Object} a ConversionEvent object
 */
exports.buildConversionEvent = function buildConversionEvent(config) {
  var configObj = config.configObj;
  var userId = config.userId;
  var userAttributes = config.userAttributes;
  var clientEngine = config.clientEngine;
  var clientVersion = config.clientVersion;

  var eventKey = config.eventKey;
  var eventTags = config.eventTags;
  var eventId = projectConfig.getEventId(configObj, eventKey);

  return {
    type: 'conversion',
    timestamp: fns.currentTimestamp(),
    uuid: fns.uuid(),

    user: {
      id: userId,
      attributes: buildVisitorAttributes(configObj, userAttributes),
    },

    context: {
      accountId: configObj.accountId,
      projectId: configObj.projectId,
      revision: configObj.revision,
      clientName: clientEngine,
      clientVersion: clientVersion,
      anonymizeIP: configObj.anonymizeIP || false,
      botFiltering: configObj.botFiltering,
    },

    event: {
      id: eventId,
      key: eventKey,
    },

    revenue: eventTagUtils.getRevenueValue(eventTags, logger),
    value: eventTagUtils.getEventValue(eventTags, logger),
    tags: eventTags,
  };
};

function buildVisitorAttributes(configObj, attributes) {
  var builtAttributes = [];
  // Omit attribute values that are not supported by the log endpoint.
  fns.forOwn(attributes, function(attributeValue, attributeKey) {
    if (attributesValidator.isAttributeValid(attributeKey, attributeValue)) {
      var attributeId = projectConfig.getAttributeId(configObj, attributeKey, logger);
      if (attributeId) {
        builtAttributes.push({
          entityId: attributeId,
          key: attributeKey,
          value: attributes[attributeKey],
        });
      }
    }
  });

  return builtAttributes;
}


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2017, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Provides utility method for validating that event tags user has provided are valid
 */

var sprintf = __webpack_require__(12).sprintf;

var ERROR_MESSAGES = __webpack_require__(199).ERROR_MESSAGES;
var MODULE_NAME = 'EVENT_TAGS_VALIDATOR';

module.exports = {
  /**
   * Validates user's provided event tags
   * @param  {Object}  event tags
   * @return {boolean} True if event tags are valid
   * @throws If event tags are not valid
   */
  validate: function(eventTags) {
    if (typeof eventTags === 'object' && !Array.isArray(eventTags) && eventTags !== null) {
      return true;
    } else {
      throw new Error(sprintf(ERROR_MESSAGES.INVALID_EVENT_TAGS, MODULE_NAME));
    }
  },
};


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2017, 2019 Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var enums = __webpack_require__(199);
var fns = __webpack_require__(18);
var sprintf = __webpack_require__(12).sprintf;

var LOG_LEVEL = enums.LOG_LEVEL;
var LOG_MESSAGES = enums.LOG_MESSAGES;
var MODULE_NAME = 'NOTIFICATION_CENTER';

/**
 * NotificationCenter allows registration and triggering of callback functions using
 * notification event types defined in NOTIFICATION_TYPES of utils/enums/index.js:
 * - ACTIVATE: An impression event will be sent to Optimizely.
 * - TRACK a conversion event will be sent to Optimizely
 * @constructor
 * @param {Object} options
 * @param {Object} options.logger An instance of a logger to log messages with
 * @param {object} options.errorHandler An instance of errorHandler to handle any unexpected error
 * @returns {Object}
 */
function NotificationCenter(options) {
  this.logger = options.logger;
  this.errorHandler = options.errorHandler;
  this.__notificationListeners = {};
  fns.forOwn(enums.NOTIFICATION_TYPES, function(notificationTypeEnum) {
    this.__notificationListeners[notificationTypeEnum] = [];
  }.bind(this));
  this.__listenerId = 1;
}

/**
 * Add a notification callback to the notification center
 * @param {string} notificationType One of the values from NOTIFICATION_TYPES in utils/enums/index.js
 * @param {Function} callback Function that will be called when the event is triggered
 * @returns {number} If the callback was successfully added, returns a listener ID which can be used
 * to remove the callback by calling removeNotificationListener. The ID is a number greater than 0.
 * If there was an error and the listener was not added, addNotificationListener returns -1. This
 * can happen if the first argument is not a valid notification type, or if the same callback
 * function was already added as a listener by a prior call to this function.
 */
NotificationCenter.prototype.addNotificationListener = function (notificationType, callback) {
  try {
    var isNotificationTypeValid = fns.values(enums.NOTIFICATION_TYPES)
      .indexOf(notificationType) > -1;
    if (!isNotificationTypeValid) {
      return -1;
    }

    if (!this.__notificationListeners[notificationType]) {
      this.__notificationListeners[notificationType] = [];
    }

    var callbackAlreadyAdded = false;
    fns.forEach(this.__notificationListeners[notificationType], function (listenerEntry) {
      if (listenerEntry.callback === callback) {
        callbackAlreadyAdded = true;
        return false;
      }
    });
    if (callbackAlreadyAdded) {
      return -1;
    }

    this.__notificationListeners[notificationType].push({
      id: this.__listenerId,
      callback: callback,
    });

    var returnId = this.__listenerId;
    this.__listenerId += 1;
    return returnId;
  } catch (e) {
    this.logger.log(LOG_LEVEL.ERROR, e.message);
    this.errorHandler.handleError(e);
    return -1;
  }
};

/**
 * Remove a previously added notification callback
 * @param {number} listenerId ID of listener to be removed
 * @returns {boolean} Returns true if the listener was found and removed, and false
 * otherwise.
 */
NotificationCenter.prototype.removeNotificationListener = function (listenerId) {
  try {
    var indexToRemove;
    var typeToRemove;
    fns.forOwn(this.__notificationListeners, function (listenersForType, notificationType) {
      fns.forEach(listenersForType, function (listenerEntry, i) {
        if (listenerEntry.id === listenerId) {
          indexToRemove = i;
          typeToRemove = notificationType;
          return false;
        }
      });
      if (indexToRemove !== undefined && typeToRemove !== undefined) {
        return false;
      }
    });

    if (indexToRemove !== undefined && typeToRemove !== undefined) {
      this.__notificationListeners[typeToRemove].splice(indexToRemove, 1);
      return true;
    }
  } catch (e) {
    this.logger.log(LOG_LEVEL.ERROR, e.message);
    this.errorHandler.handleError(e);
  }
  return false;
};

/**
 * Removes all previously added notification listeners, for all notification types
 */
NotificationCenter.prototype.clearAllNotificationListeners = function () {
  try{
    fns.forOwn(enums.NOTIFICATION_TYPES, function (notificationTypeEnum) {
      this.__notificationListeners[notificationTypeEnum] = [];
    }.bind(this));
  } catch (e) {
    this.logger.log(LOG_LEVEL.ERROR, e.message);
    this.errorHandler.handleError(e);
  }
};

/**
 * Remove all previously added notification listeners for the argument type
 * @param {string} notificationType One of enums.NOTIFICATION_TYPES
 */
NotificationCenter.prototype.clearNotificationListeners = function (notificationType) {
  try {
    this.__notificationListeners[notificationType] = [];
  } catch (e) {
    this.logger.log(LOG_LEVEL.ERROR, e.message);
    this.errorHandler.handleError(e);
  }
};

/**
 * Fires notifications for the argument type. All registered callbacks for this type will be
 * called. The notificationData object will be passed on to callbacks called.
 * @param {string} notificationType One of enums.NOTIFICATION_TYPES
 * @param {Object} notificationData Will be passed to callbacks called
 */
NotificationCenter.prototype.sendNotifications = function (notificationType, notificationData) {
  try {
    fns.forEach(this.__notificationListeners[notificationType], function (listenerEntry) {
      var callback = listenerEntry.callback;
      try {
        callback(notificationData);
      } catch (ex) {
        this.logger.log(LOG_LEVEL.ERROR, sprintf(LOG_MESSAGES.NOTIFICATION_LISTENER_EXCEPTION, MODULE_NAME, notificationType, ex.message));
      }
    }.bind(this));
  } catch (e) {
    this.logger.log(LOG_LEVEL.ERROR, e.message);
    this.errorHandler.handleError(e);
  }
};

module.exports = {
  /**
   * Create an instance of NotificationCenter
   * @param {Object} options
   * @param {Object} options.logger An instance of a logger to log messages with
   * @returns {Object} An instance of NotificationCenter
   */
  createNotificationCenter: function(options) {
    return new NotificationCenter(options);
  },
};


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

/****************************************************************************
 * Copyright 2017, Optimizely, Inc. and contributors                        *
 *                                                                          *
 * Licensed under the Apache License, Version 2.0 (the "License");          *
 * you may not use this file except in compliance with the License.         *
 * You may obtain a copy of the License at                                  *
 *                                                                          *
 *    http://www.apache.org/licenses/LICENSE-2.0                            *
 *                                                                          *
 * Unless required by applicable law or agreed to in writing, software      *
 * distributed under the License is distributed on an "AS IS" BASIS,        *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. *
 * See the License for the specific language governing permissions and      *
 * limitations under the License.                                           *
 ***************************************************************************/

/**
 * Provides utility method for validating that the given user profile service implementation is valid.
 */

var sprintf = __webpack_require__(12).sprintf;

var ERROR_MESSAGES = __webpack_require__(199).ERROR_MESSAGES;
var MODULE_NAME = 'USER_PROFILE_SERVICE_VALIDATOR';

module.exports = {
  /**
   * Validates user's provided user profile service instance
   * @param  {Object}  userProfileServiceInstance
   * @return {boolean} True if the instance is valid
   * @throws If the instance is not valid
   */
  validate: function(userProfileServiceInstance) {
    if (typeof userProfileServiceInstance.lookup !== 'function') {
      throw new Error(sprintf(ERROR_MESSAGES.INVALID_USER_PROFILE_SERVICE, MODULE_NAME, 'Missing function \'lookup\''));
    } else if (typeof userProfileServiceInstance.save !== 'function') {
      throw new Error(sprintf(ERROR_MESSAGES.INVALID_USER_PROFILE_SERVICE, MODULE_NAME, 'Missing function \'save\''));
    }
    return true;
  },
};


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fns = __webpack_require__(18);
var sprintf = __webpack_require__(12).sprintf;
var logging = __webpack_require__(8);
var configValidator = __webpack_require__(198);
var datafileManager = __webpack_require__(228);
var enums = __webpack_require__(199);
var projectConfig = __webpack_require__(218);

var logger = logging.getLogger();

var ERROR_MESSAGES = enums.ERROR_MESSAGES;

var MODULE_NAME = 'PROJECT_CONFIG_MANAGER';

/**
 * Return an error message derived from a thrown value. If the thrown value is
 * an error, return the error's message property. Otherwise, return a default
 * provided by the second argument.
 * @param {*} maybeError
 * @param {String=} defaultMessage
 * @return {String}
 */
function getErrorMessage(maybeError, defaultMessage) {
  if (maybeError instanceof Error) {
    return maybeError.message;
  }
  return defaultMessage || 'Unknown error';
}

/**
 * ProjectConfigManager provides project config objects via its methods
 * getConfig and onUpdate. It uses a DatafileManager to fetch datafiles. It is
 * responsible for parsing and validating datafiles, and converting datafile
 * JSON objects into project config objects.
 * @param {Object}         config
 * @param {Object|string=} config.datafile
 * @param {Object=}        config.datafileOptions
 * @param {Object=}        config.jsonSchemaValidator
 * @param {string=}        config.sdkKey
 * @param {boolean=}       config.skipJSONValidation
 */
function ProjectConfigManager(config) {
  try {
    this.__initialize(config);
  } catch (ex) {
    logger.error(ex);
    this.__updateListeners = [];
    this.__configObj = null;
    this.__readyPromise = Promise.resolve({
      success: false,
      reason: getErrorMessage(ex, 'Error in initialize'),
    });
  }
}

/**
 * Initialize internal properties including __updateListeners, __configObj, and
 * __readyPromise, using the argument config. Create and subscribe to a datafile
 * manager if appropriate.
 * @param {Object}         config
 * @param {Object|string=} config.datafile
 * @param {Object=}        config.datafileOptions
 * @param {Object=}        config.jsonSchemaValidator
 * @param {string=}        config.sdkKey
 * @param {boolean=}       config.skipJSONValidation
 */
ProjectConfigManager.prototype.__initialize = function(config) {
  this.__updateListeners = [];
  this.jsonSchemaValidator = config.jsonSchemaValidator;
  this.skipJSONValidation = config.skipJSONValidation;

  if (!config.datafile && !config.sdkKey) {
    this.__configObj = null;
    var datafileAndSdkKeyMissingError = new Error(sprintf(ERROR_MESSAGES.DATAFILE_AND_SDK_KEY_MISSING, MODULE_NAME));
    this.__readyPromise = Promise.resolve({
      success: false,
      reason: getErrorMessage(datafileAndSdkKeyMissingError),
    });
    logger.error(datafileAndSdkKeyMissingError);
    return;
  }

  var initialDatafile = this.__getDatafileFromConfig(config);
  var projectConfigCreationEx;
  if (initialDatafile) {
    try {
      this.__configObj = projectConfig.tryCreatingProjectConfig({
        datafile: initialDatafile,
        jsonSchemaValidator: this.jsonSchemaValidator,
        logger: logger,
        skipJSONValidation: this.skipJSONValidation,
      });
    } catch (ex) {
      logger.error(ex);
      projectConfigCreationEx = ex;
      this.__configObj = null;
    }
  } else {
    this.__configObj = null;
  }

  if (config.sdkKey) {
    var datafileManagerConfig = {
      sdkKey: config.sdkKey,
    };
    if (this.__validateDatafileOptions(config.datafileOptions)) {
      fns.assign(datafileManagerConfig, config.datafileOptions);
    }
    if (initialDatafile && this.__configObj) {
      datafileManagerConfig.datafile = initialDatafile;
    }
    this.datafileManager = new datafileManager.DatafileManager(datafileManagerConfig);
    this.datafileManager.start();
    this.__readyPromise = this.datafileManager.onReady().then(
      this.__onDatafileManagerReadyFulfill.bind(this),
      this.__onDatafileManagerReadyReject.bind(this)
    );
    this.datafileManager.on('update', this.__onDatafileManagerUpdate.bind(this));
  } else if (this.__configObj) {
    this.__readyPromise = Promise.resolve({
      success: true,
    });
  } else {
    this.__readyPromise = Promise.resolve({
      success: false,
      reason: getErrorMessage(projectConfigCreationEx, 'Invalid datafile'),
    });
  }
};

/**
 * Respond to datafile manager's onReady promise becoming fulfilled.
 * If there are validation or parse failures using the datafile provided by
 * DatafileManager, ProjectConfigManager's ready promise is resolved with an
 * unsuccessful result. Otherwise, ProjectConfigManager updates its own project
 * config object from the new datafile, and its ready promise is resolved with a
 * successful result.
 */
ProjectConfigManager.prototype.__onDatafileManagerReadyFulfill = function() {
  var newDatafile = this.datafileManager.get();
  var newConfigObj;
  try {
    newConfigObj = projectConfig.tryCreatingProjectConfig({
      datafile: newDatafile,
      jsonSchemaValidator: this.jsonSchemaValidator,
      logger: logger,
      skipJSONValidation: this.skipJSONValidation,
    });
  } catch (ex) {
    logger.error(ex);
    return {
      success: false,
      reason: getErrorMessage(ex),
    };
  }
  this.__handleNewConfigObj(newConfigObj);
  return {
    success: true,
  };
};

/**
 * Respond to datafile manager's onReady promise becoming rejected.
 * When DatafileManager's onReady promise is rejected, there is no possibility
 * of obtaining a datafile. In this case, ProjectConfigManager's ready promise
 * is fulfilled with an unsuccessful result.
 * @param {Error} err
 */
ProjectConfigManager.prototype.__onDatafileManagerReadyReject = function(err) {
  return {
    success: false,
    reason: getErrorMessage(err, 'Failed to become ready'),
  };
};

/**
 * Respond to datafile manager's update event. Attempt to update own config
 * object using latest datafile from datafile manager. Call own registered
 * update listeners if successful
 */
ProjectConfigManager.prototype.__onDatafileManagerUpdate = function() {
  var newDatafile = this.datafileManager.get();
  var newConfigObj;
  try {
    newConfigObj = projectConfig.tryCreatingProjectConfig({
      datafile: newDatafile,
      jsonSchemaValidator: this.jsonSchemaValidator,
      logger: logger,
      skipJSONValidation: this.skipJSONValidation,
    });
  } catch (ex) {
    logger.error(ex);
  }
  if (newConfigObj) {
    this.__handleNewConfigObj(newConfigObj);
  }
};

/**
 * If the argument config contains a valid datafile object or string,
 * return a datafile object based on that provided datafile, otherwise
 * return null.
 * @param {Object}         config
 * @param {Object|string=} config.datafile
 * @return {Object|null}
 */
ProjectConfigManager.prototype.__getDatafileFromConfig = function(config) {
  var initialDatafile = null;
  try {
    if (config.datafile) {
      configValidator.validateDatafile(config.datafile);
      if (typeof config.datafile === 'string' || config.datafile instanceof String) {
        initialDatafile = JSON.parse(config.datafile);
      } else {
        initialDatafile = config.datafile;
      }
    }
  } catch (ex) {
    logger.error(ex);
  }
  return initialDatafile;
};

/**
 * Validate user-provided datafileOptions. It should be an object or undefined.
 * @param {*} datafileOptions
 * @returns {boolean}
 */
ProjectConfigManager.prototype.__validateDatafileOptions = function(datafileOptions) {
  if (typeof datafileOptions === 'undefined') {
    return true;
  }

  if (typeof datafileOptions === 'object') {
    return datafileOptions !== null;
  }

  return false;
};

/**
 * Update internal project config object to be argument object when the argument
 * object has a different revision than the current internal project config
 * object. If the internal object is updated, call update listeners.
 * @param {Object} newConfigObj
 */
ProjectConfigManager.prototype.__handleNewConfigObj = function(newConfigObj) {
  var oldConfigObj = this.__configObj;

  var oldRevision = oldConfigObj ? oldConfigObj.revision : 'null';
  if (oldRevision === newConfigObj.revision) {
    return;
  }

  this.__configObj = newConfigObj;

  this.__updateListeners.forEach(function(listener) {
    listener(newConfigObj);
  });
};

/**
 * Returns the current project config object, or null if no project config object
 * is available
 * @return {Object|null}
 */
ProjectConfigManager.prototype.getConfig = function() {
  return this.__configObj;
};

/**
 * Returns a Promise that fulfills when this ProjectConfigManager is ready to
 * use (meaning it has a valid project config object), or has failed to become
 * ready.
 *
 * Failure can be caused by the following:
 * - At least one of sdkKey or datafile is not provided in the constructor argument
 * - The provided datafile was invalid
 * - The datafile provided by the datafile manager was invalid
 * - The datafile manager failed to fetch a datafile
 *
 * The returned Promise is fulfilled with a result object containing these
 * properties:
 *    - success (boolean): True if this instance is ready to use with a valid
 *                         project config object, or false if it failed to
 *                         become ready
 *    - reason (string=):  If success is false, this is a string property with
 *                         an explanatory message.
 * @return {Promise}
 */
ProjectConfigManager.prototype.onReady = function() {
  return this.__readyPromise;
};

/**
 * Add a listener for project config updates. The listener will be called
 * whenever this instance has a new project config object available.
 * Returns a dispose function that removes the subscription
 * @param {Function} listener
 * @return {Function}
 */
ProjectConfigManager.prototype.onUpdate = function(listener) {
  this.__updateListeners.push(listener);
  return function() {
    var index = this.__updateListeners.indexOf(listener);
    if (index > -1) {
      this.__updateListeners.splice(index, 1);
    }
  }.bind(this);
};

/**
 * Stop the internal datafile manager and remove all update listeners
 */
ProjectConfigManager.prototype.stop = function() {
  if (this.datafileManager) {
    this.datafileManager.stop();
  }
  this.__updateListeners = [];
};

module.exports = {
  ProjectConfigManager: ProjectConfigManager,
};


/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var browserDatafileManager_1 = __webpack_require__(229);
exports.DatafileManager = browserDatafileManager_1.default;
var staticDatafileManager_1 = __webpack_require__(235);
exports.StaticDatafileManager = staticDatafileManager_1.default;


/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var browserRequest_1 = __webpack_require__(230);
var httpPollingDatafileManager_1 = __importDefault(__webpack_require__(232));
var BrowserDatafileManager = /** @class */ (function (_super) {
    __extends(BrowserDatafileManager, _super);
    function BrowserDatafileManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BrowserDatafileManager.prototype.makeGetRequest = function (reqUrl, headers) {
        return browserRequest_1.makeGetRequest(reqUrl, headers);
    };
    BrowserDatafileManager.prototype.getConfigDefaults = function () {
        return {
            autoUpdate: false,
        };
    };
    return BrowserDatafileManager;
}(httpPollingDatafileManager_1.default));
exports.default = BrowserDatafileManager;


/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __webpack_require__(231);
var js_sdk_logging_1 = __webpack_require__(8);
var logger = js_sdk_logging_1.getLogger('DatafileManager');
var GET_METHOD = 'GET';
var READY_STATE_DONE = 4;
function parseHeadersFromXhr(req) {
    var allHeadersString = req.getAllResponseHeaders();
    if (allHeadersString === null) {
        return {};
    }
    var headerLines = allHeadersString.split('\r\n');
    var headers = {};
    headerLines.forEach(function (headerLine) {
        var separatorIndex = headerLine.indexOf(': ');
        if (separatorIndex > -1) {
            var headerName = headerLine.slice(0, separatorIndex);
            var headerValue = headerLine.slice(separatorIndex + 2);
            if (headerValue.length > 0) {
                headers[headerName] = headerValue;
            }
        }
    });
    return headers;
}
function setHeadersInXhr(headers, req) {
    Object.keys(headers).forEach(function (headerName) {
        var header = headers[headerName];
        req.setRequestHeader(headerName, header);
    });
}
function makeGetRequest(reqUrl, headers) {
    var req = new XMLHttpRequest();
    var responsePromise = new Promise(function (resolve, reject) {
        req.open(GET_METHOD, reqUrl, true);
        setHeadersInXhr(headers, req);
        req.onreadystatechange = function () {
            if (req.readyState === READY_STATE_DONE) {
                var statusCode = req.status;
                if (statusCode === 0) {
                    reject(new Error('Request error'));
                    return;
                }
                var headers_1 = parseHeadersFromXhr(req);
                var resp = {
                    statusCode: req.status,
                    body: req.responseText,
                    headers: headers_1,
                };
                resolve(resp);
            }
        };
        req.timeout = config_1.REQUEST_TIMEOUT_MS;
        req.ontimeout = function () {
            logger.error('Request timed out');
        };
        req.send();
    });
    return {
        responsePromise: responsePromise,
        abort: function () {
            req.abort();
        },
    };
}
exports.makeGetRequest = makeGetRequest;


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes
exports.MIN_UPDATE_INTERVAL = 1000;
exports.DEFAULT_URL_TEMPLATE = "https://cdn.optimizely.com/datafiles/%s.json";
exports.BACKOFF_BASE_WAIT_SECONDS_BY_ERROR_COUNT = [0, 8, 16, 32, 64, 128, 256, 512];
exports.REQUEST_TIMEOUT_MS = 60 * 1000; // 1 minute


/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var js_sdk_logging_1 = __webpack_require__(8);
var js_sdk_utils_1 = __webpack_require__(12);
var eventEmitter_1 = __importDefault(__webpack_require__(233));
var config_1 = __webpack_require__(231);
var backoffController_1 = __importDefault(__webpack_require__(234));
var logger = js_sdk_logging_1.getLogger('DatafileManager');
var UPDATE_EVT = 'update';
function isValidUpdateInterval(updateInterval) {
    return updateInterval >= config_1.MIN_UPDATE_INTERVAL;
}
function isSuccessStatusCode(statusCode) {
    return statusCode >= 200 && statusCode < 400;
}
var HTTPPollingDatafileManager = /** @class */ (function () {
    function HTTPPollingDatafileManager(config) {
        var _this = this;
        var configWithDefaultsApplied = __assign({}, this.getConfigDefaults(), config);
        var datafile = configWithDefaultsApplied.datafile, _a = configWithDefaultsApplied.autoUpdate, autoUpdate = _a === void 0 ? false : _a, sdkKey = configWithDefaultsApplied.sdkKey, _b = configWithDefaultsApplied.updateInterval, updateInterval = _b === void 0 ? config_1.DEFAULT_UPDATE_INTERVAL : _b, _c = configWithDefaultsApplied.urlTemplate, urlTemplate = _c === void 0 ? config_1.DEFAULT_URL_TEMPLATE : _c;
        this.isReadyPromiseSettled = false;
        this.readyPromiseResolver = function () { };
        this.readyPromiseRejecter = function () { };
        this.readyPromise = new Promise(function (resolve, reject) {
            _this.readyPromiseResolver = resolve;
            _this.readyPromiseRejecter = reject;
        });
        if (datafile) {
            this.currentDatafile = datafile;
            this.resolveReadyPromise();
        }
        else {
            this.currentDatafile = null;
        }
        this.isStarted = false;
        this.datafileUrl = js_sdk_utils_1.sprintf(urlTemplate, sdkKey);
        this.emitter = new eventEmitter_1.default();
        this.autoUpdate = autoUpdate;
        if (isValidUpdateInterval(updateInterval)) {
            this.updateInterval = updateInterval;
        }
        else {
            logger.warn('Invalid updateInterval %s, defaulting to %s', updateInterval, config_1.DEFAULT_UPDATE_INTERVAL);
            this.updateInterval = config_1.DEFAULT_UPDATE_INTERVAL;
        }
        this.currentTimeout = null;
        this.currentRequest = null;
        this.backoffController = new backoffController_1.default();
        this.syncOnCurrentRequestComplete = false;
    }
    HTTPPollingDatafileManager.prototype.get = function () {
        return this.currentDatafile;
    };
    HTTPPollingDatafileManager.prototype.start = function () {
        if (!this.isStarted) {
            logger.debug('Datafile manager started');
            this.isStarted = true;
            this.backoffController.reset();
            this.syncDatafile();
        }
    };
    HTTPPollingDatafileManager.prototype.stop = function () {
        logger.debug('Datafile manager stopped');
        this.isStarted = false;
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }
        this.emitter.removeAllListeners();
        if (this.currentRequest) {
            this.currentRequest.abort();
            this.currentRequest = null;
        }
        return Promise.resolve();
    };
    HTTPPollingDatafileManager.prototype.onReady = function () {
        return this.readyPromise;
    };
    HTTPPollingDatafileManager.prototype.on = function (eventName, listener) {
        return this.emitter.on(eventName, listener);
    };
    HTTPPollingDatafileManager.prototype.onRequestRejected = function (err) {
        if (!this.isStarted) {
            return;
        }
        this.backoffController.countError();
        if (err instanceof Error) {
            logger.error('Error fetching datafile: %s', err.message, err);
        }
        else if (typeof err === 'string') {
            logger.error('Error fetching datafile: %s', err);
        }
        else {
            logger.error('Error fetching datafile');
        }
    };
    HTTPPollingDatafileManager.prototype.onRequestResolved = function (response) {
        if (!this.isStarted) {
            return;
        }
        if (typeof response.statusCode !== 'undefined' &&
            isSuccessStatusCode(response.statusCode)) {
            this.backoffController.reset();
        }
        else {
            this.backoffController.countError();
        }
        this.trySavingLastModified(response.headers);
        var datafile = this.getNextDatafileFromResponse(response);
        if (datafile !== null) {
            logger.info('Updating datafile from response');
            this.currentDatafile = datafile;
            if (!this.isReadyPromiseSettled) {
                this.resolveReadyPromise();
            }
            else {
                var datafileUpdate = {
                    datafile: datafile,
                };
                this.emitter.emit(UPDATE_EVT, datafileUpdate);
            }
        }
    };
    HTTPPollingDatafileManager.prototype.onRequestComplete = function () {
        if (!this.isStarted) {
            return;
        }
        this.currentRequest = null;
        if (!this.isReadyPromiseSettled && !this.autoUpdate) {
            // We will never resolve ready, so reject it
            this.rejectReadyPromise(new Error('Failed to become ready'));
        }
        if (this.autoUpdate && this.syncOnCurrentRequestComplete) {
            this.syncDatafile();
        }
        this.syncOnCurrentRequestComplete = false;
    };
    HTTPPollingDatafileManager.prototype.syncDatafile = function () {
        var _this = this;
        var headers = {};
        if (this.lastResponseLastModified) {
            headers['if-modified-since'] = this.lastResponseLastModified;
        }
        logger.debug('Making datafile request to url %s with headers: %s', this.datafileUrl, function () { return JSON.stringify(headers); });
        this.currentRequest = this.makeGetRequest(this.datafileUrl, headers);
        var onRequestComplete = function () {
            _this.onRequestComplete();
        };
        var onRequestResolved = function (response) {
            _this.onRequestResolved(response);
        };
        var onRequestRejected = function (err) {
            _this.onRequestRejected(err);
        };
        this.currentRequest.responsePromise
            .then(onRequestResolved, onRequestRejected)
            .then(onRequestComplete, onRequestComplete);
        if (this.autoUpdate) {
            this.scheduleNextUpdate();
        }
    };
    HTTPPollingDatafileManager.prototype.resolveReadyPromise = function () {
        this.readyPromiseResolver();
        this.isReadyPromiseSettled = true;
    };
    HTTPPollingDatafileManager.prototype.rejectReadyPromise = function (err) {
        this.readyPromiseRejecter(err);
        this.isReadyPromiseSettled = true;
    };
    HTTPPollingDatafileManager.prototype.scheduleNextUpdate = function () {
        var _this = this;
        var currentBackoffDelay = this.backoffController.getDelay();
        var nextUpdateDelay = Math.max(currentBackoffDelay, this.updateInterval);
        logger.debug('Scheduling sync in %s ms', nextUpdateDelay);
        this.currentTimeout = setTimeout(function () {
            if (_this.currentRequest) {
                _this.syncOnCurrentRequestComplete = true;
            }
            else {
                _this.syncDatafile();
            }
        }, nextUpdateDelay);
    };
    HTTPPollingDatafileManager.prototype.getNextDatafileFromResponse = function (response) {
        logger.debug('Response status code: %s', response.statusCode);
        if (typeof response.statusCode === 'undefined') {
            return null;
        }
        if (response.statusCode === 304) {
            return null;
        }
        if (isSuccessStatusCode(response.statusCode)) {
            return this.tryParsingBodyAsJSON(response.body);
        }
        return null;
    };
    HTTPPollingDatafileManager.prototype.tryParsingBodyAsJSON = function (body) {
        var parseResult;
        try {
            parseResult = JSON.parse(body);
        }
        catch (err) {
            logger.error('Error parsing response body: %s', err.message, err);
            return null;
        }
        var datafileObj = null;
        if (typeof parseResult === 'object' && parseResult !== null) {
            datafileObj = parseResult;
        }
        else {
            logger.error('Error parsing response body: was not an object');
        }
        return datafileObj;
    };
    HTTPPollingDatafileManager.prototype.trySavingLastModified = function (headers) {
        var lastModifiedHeader = headers['last-modified'] || headers['Last-Modified'];
        if (typeof lastModifiedHeader !== 'undefined') {
            this.lastResponseLastModified = lastModifiedHeader;
            logger.debug('Saved last modified header value from response: %s', this.lastResponseLastModified);
        }
    };
    return HTTPPollingDatafileManager;
}());
exports.default = HTTPPollingDatafileManager;


/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.listeners = {};
        this.listenerId = 1;
    }
    EventEmitter.prototype.on = function (eventName, listener) {
        var _this = this;
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = {};
        }
        var currentListenerId = String(this.listenerId);
        this.listenerId++;
        this.listeners[eventName][currentListenerId] = listener;
        return function () {
            if (_this.listeners[eventName]) {
                delete _this.listeners[eventName][currentListenerId];
            }
        };
    };
    EventEmitter.prototype.emit = function (eventName, arg) {
        var listeners = this.listeners[eventName];
        if (listeners) {
            Object.keys(listeners).forEach(function (listenerId) {
                var listener = listeners[listenerId];
                listener(arg);
            });
        }
    };
    EventEmitter.prototype.removeAllListeners = function () {
        this.listeners = {};
    };
    return EventEmitter;
}());
exports.default = EventEmitter;
// TODO: Create a typed event emitter for use in TS only (not JS)


/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __webpack_require__(231);
function randomMilliseconds() {
    return Math.round(Math.random() * 1000);
}
var BackoffController = /** @class */ (function () {
    function BackoffController() {
        this.errorCount = 0;
    }
    BackoffController.prototype.getDelay = function () {
        if (this.errorCount === 0) {
            return 0;
        }
        var baseWaitSeconds = config_1.BACKOFF_BASE_WAIT_SECONDS_BY_ERROR_COUNT[Math.min(config_1.BACKOFF_BASE_WAIT_SECONDS_BY_ERROR_COUNT.length - 1, this.errorCount)];
        return baseWaitSeconds * 1000 + randomMilliseconds();
    };
    BackoffController.prototype.countError = function () {
        if (this.errorCount < config_1.BACKOFF_BASE_WAIT_SECONDS_BY_ERROR_COUNT.length - 1) {
            this.errorCount++;
        }
    };
    BackoffController.prototype.reset = function () {
        this.errorCount = 0;
    };
    return BackoffController;
}());
exports.default = BackoffController;


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright 2019, Optimizely
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var doNothing = function () { };
var StaticDatafileManager = /** @class */ (function () {
    function StaticDatafileManager(datafile) {
        this.datafile = datafile;
        this.readyPromise = Promise.resolve();
    }
    StaticDatafileManager.prototype.get = function () {
        return this.datafile;
    };
    StaticDatafileManager.prototype.onReady = function () {
        return this.readyPromise;
    };
    StaticDatafileManager.prototype.start = function () {
    };
    StaticDatafileManager.prototype.stop = function () {
        return Promise.resolve();
    };
    StaticDatafileManager.prototype.on = function (eventName, listener) {
        return doNothing;
    };
    return StaticDatafileManager;
}());
exports.default = StaticDatafileManager;


/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.8+1e68dce6
 */

(function (global, factory) {
	 true ? module.exports = factory() :
	undefined;
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && "function" === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    var then$$1 = void 0;
    try {
      then$$1 = value.then;
    } catch (error) {
      reject(promise, error);
      return;
    }
    handleMaybeThenable(promise, value, then$$1);
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = true;

  if (hasCallback) {
    try {
      value = callback(detail);
    } catch (e) {
      succeeded = false;
      error = e;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (succeeded === false) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = void 0;
      var error = void 0;
      var didError = false;
      try {
        _then = entry.then;
      } catch (e) {
        didError = true;
        error = e;
      }

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        if (didError) {
          reject(promise, error);
        } else {
          handleMaybeThenable(promise, entry, _then);
        }
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    if (isFunction(callback)) {
      return promise.then(function (value) {
        return constructor.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return constructor.resolve(callback()).then(function () {
          throw reason;
        });
      });
    }

    return promise.then(callback, callback);
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));



//# sourceMappingURL=es6-promise.map

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(7), __webpack_require__(5)))

/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
__webpack_require__(238);
module.exports = self.fetch.bind(self);


/***/ }),
/* 238 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Headers", function() { return Headers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Request", function() { return Request; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Response", function() { return Response; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOMException", function() { return DOMException; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetch", function() { return fetch; });
var support = {
  searchParams: 'URLSearchParams' in self,
  iterable: 'Symbol' in self && 'iterator' in Symbol,
  blob:
    'FileReader' in self &&
    'Blob' in self &&
    (function() {
      try {
        new Blob()
        return true
      } catch (e) {
        return false
      }
    })(),
  formData: 'FormData' in self,
  arrayBuffer: 'ArrayBuffer' in self
}

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj)
}

if (support.arrayBuffer) {
  var viewClasses = [
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]'
  ]

  var isArrayBufferView =
    ArrayBuffer.isView ||
    function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name)
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
    throw new TypeError('Invalid character in header field name')
  }
  return name.toLowerCase()
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value
}

// Build a destructive iterator for the value list
function iteratorFor(items) {
  var iterator = {
    next: function() {
      var value = items.shift()
      return {done: value === undefined, value: value}
    }
  }

  if (support.iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator
    }
  }

  return iterator
}

function Headers(headers) {
  this.map = {}

  if (headers instanceof Headers) {
    headers.forEach(function(value, name) {
      this.append(name, value)
    }, this)
  } else if (Array.isArray(headers)) {
    headers.forEach(function(header) {
      this.append(header[0], header[1])
    }, this)
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function(name) {
      this.append(name, headers[name])
    }, this)
  }
}

Headers.prototype.append = function(name, value) {
  name = normalizeName(name)
  value = normalizeValue(value)
  var oldValue = this.map[name]
  this.map[name] = oldValue ? oldValue + ', ' + value : value
}

Headers.prototype['delete'] = function(name) {
  delete this.map[normalizeName(name)]
}

Headers.prototype.get = function(name) {
  name = normalizeName(name)
  return this.has(name) ? this.map[name] : null
}

Headers.prototype.has = function(name) {
  return this.map.hasOwnProperty(normalizeName(name))
}

Headers.prototype.set = function(name, value) {
  this.map[normalizeName(name)] = normalizeValue(value)
}

Headers.prototype.forEach = function(callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this)
    }
  }
}

Headers.prototype.keys = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push(name)
  })
  return iteratorFor(items)
}

Headers.prototype.values = function() {
  var items = []
  this.forEach(function(value) {
    items.push(value)
  })
  return iteratorFor(items)
}

Headers.prototype.entries = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push([name, value])
  })
  return iteratorFor(items)
}

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries
}

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'))
  }
  body.bodyUsed = true
}

function fileReaderReady(reader) {
  return new Promise(function(resolve, reject) {
    reader.onload = function() {
      resolve(reader.result)
    }
    reader.onerror = function() {
      reject(reader.error)
    }
  })
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsArrayBuffer(blob)
  return promise
}

function readBlobAsText(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsText(blob)
  return promise
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf)
  var chars = new Array(view.length)

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i])
  }
  return chars.join('')
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0)
  } else {
    var view = new Uint8Array(buf.byteLength)
    view.set(new Uint8Array(buf))
    return view.buffer
  }
}

function Body() {
  this.bodyUsed = false

  this._initBody = function(body) {
    this._bodyInit = body
    if (!body) {
      this._bodyText = ''
    } else if (typeof body === 'string') {
      this._bodyText = body
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString()
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer)
      // IE 10-11 can't handle a DataView body.
      this._bodyInit = new Blob([this._bodyArrayBuffer])
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body)
    } else {
      this._bodyText = body = Object.prototype.toString.call(body)
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8')
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type)
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
      }
    }
  }

  if (support.blob) {
    this.blob = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob')
      } else {
        return Promise.resolve(new Blob([this._bodyText]))
      }
    }

    this.arrayBuffer = function() {
      if (this._bodyArrayBuffer) {
        return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
      } else {
        return this.blob().then(readBlobAsArrayBuffer)
      }
    }
  }

  this.text = function() {
    var rejected = consumed(this)
    if (rejected) {
      return rejected
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob)
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text')
    } else {
      return Promise.resolve(this._bodyText)
    }
  }

  if (support.formData) {
    this.formData = function() {
      return this.text().then(decode)
    }
  }

  this.json = function() {
    return this.text().then(JSON.parse)
  }

  return this
}

// HTTP methods whose capitalization should be normalized
var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

function normalizeMethod(method) {
  var upcased = method.toUpperCase()
  return methods.indexOf(upcased) > -1 ? upcased : method
}

function Request(input, options) {
  options = options || {}
  var body = options.body

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read')
    }
    this.url = input.url
    this.credentials = input.credentials
    if (!options.headers) {
      this.headers = new Headers(input.headers)
    }
    this.method = input.method
    this.mode = input.mode
    this.signal = input.signal
    if (!body && input._bodyInit != null) {
      body = input._bodyInit
      input.bodyUsed = true
    }
  } else {
    this.url = String(input)
  }

  this.credentials = options.credentials || this.credentials || 'same-origin'
  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers)
  }
  this.method = normalizeMethod(options.method || this.method || 'GET')
  this.mode = options.mode || this.mode || null
  this.signal = options.signal || this.signal
  this.referrer = null

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests')
  }
  this._initBody(body)
}

Request.prototype.clone = function() {
  return new Request(this, {body: this._bodyInit})
}

function decode(body) {
  var form = new FormData()
  body
    .trim()
    .split('&')
    .forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
  return form
}

function parseHeaders(rawHeaders) {
  var headers = new Headers()
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
  preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
    var parts = line.split(':')
    var key = parts.shift().trim()
    if (key) {
      var value = parts.join(':').trim()
      headers.append(key, value)
    }
  })
  return headers
}

Body.call(Request.prototype)

function Response(bodyInit, options) {
  if (!options) {
    options = {}
  }

  this.type = 'default'
  this.status = options.status === undefined ? 200 : options.status
  this.ok = this.status >= 200 && this.status < 300
  this.statusText = 'statusText' in options ? options.statusText : 'OK'
  this.headers = new Headers(options.headers)
  this.url = options.url || ''
  this._initBody(bodyInit)
}

Body.call(Response.prototype)

Response.prototype.clone = function() {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  })
}

Response.error = function() {
  var response = new Response(null, {status: 0, statusText: ''})
  response.type = 'error'
  return response
}

var redirectStatuses = [301, 302, 303, 307, 308]

Response.redirect = function(url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code')
  }

  return new Response(null, {status: status, headers: {location: url}})
}

var DOMException = self.DOMException
try {
  new DOMException()
} catch (err) {
  DOMException = function(message, name) {
    this.message = message
    this.name = name
    var error = Error(message)
    this.stack = error.stack
  }
  DOMException.prototype = Object.create(Error.prototype)
  DOMException.prototype.constructor = DOMException
}

function fetch(input, init) {
  return new Promise(function(resolve, reject) {
    var request = new Request(input, init)

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    var xhr = new XMLHttpRequest()

    function abortXhr() {
      xhr.abort()
    }

    xhr.onload = function() {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      }
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
      var body = 'response' in xhr ? xhr.response : xhr.responseText
      resolve(new Response(body, options))
    }

    xhr.onerror = function() {
      reject(new TypeError('Network request failed'))
    }

    xhr.ontimeout = function() {
      reject(new TypeError('Network request failed'))
    }

    xhr.onabort = function() {
      reject(new DOMException('Aborted', 'AbortError'))
    }

    xhr.open(request.method, request.url, true)

    if (request.credentials === 'include') {
      xhr.withCredentials = true
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false
    }

    if ('responseType' in xhr && support.blob) {
      xhr.responseType = 'blob'
    }

    request.headers.forEach(function(value, name) {
      xhr.setRequestHeader(name, value)
    })

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr)

      xhr.onreadystatechange = function() {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr)
        }
      }
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
  })
}

fetch.polyfill = true

if (!self.fetch) {
  self.fetch = fetch
  self.Headers = Headers
  self.Request = Request
  self.Response = Response
}


/***/ }),
/* 239 */
/***/ (function(module, exports) {

// constants.js

// Default datafile provided to get up and running quickly. Replace with your own!
const datafileURL = 'https://cdn.optimizely.com/json/14559360552.json';
const sdkKey = '487G98QeGH4LdnV37rNTCt';
module.exports = {
    datafileURL,
    sdkKey  
};


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.9.1
//     http://underscorejs.org
//     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  if ( true && !exports.nodeType) {
    if ( true && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.9.1';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  var restArguments = function(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var shallowProperty = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  var has = function(obj, path) {
    return obj != null && hasOwnProperty.call(obj, path);
  }

  var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  var createReduce = function(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (_.isFunction(path)) {
      func = path;
    } else if (_.isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return _.map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection.
  _.shuffle = function(obj) {
    return _.sample(obj, Infinity);
  };

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, Boolean);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = restArguments(function(array, otherArrays) {
    return _.difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = restArguments(function(arrays) {
    return _.uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = restArguments(function(array, rest) {
    rest = flatten(rest, true, true);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  });

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = restArguments(_.unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of _.pairs.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions.
  var createPredicateIndexFinder = function(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  _.chunk = function(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = restArguments(function(func, context, args) {
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  _.partial = restArguments(function(func, boundArgs) {
    var placeholder = _.partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = restArguments(function(obj, keys) {
    keys = flatten(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = _.bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function(args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = _.delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  _.restArguments = restArguments;

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var collectNonEnumProps = function(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to _.map it returns an object.
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
        length = keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of _.object.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`.
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test.
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Internal pick helper function to determine if `obj` has key `key`.
  var keyInObj = function(value, key, obj) {
    return key in obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = restArguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = _.allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  _.omit = restArguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = _.map(flatten(keys, false, false), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq, deepEq;
  eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  deepEq = function(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if ( true && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, path) {
    if (!_.isArray(path)) {
      return has(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indexes.
  _.property = function(path) {
    if (!_.isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  _.result = function(obj, path, fallback) {
    if (!_.isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return _;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}());

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(5), __webpack_require__(62)(module)))

/***/ })
/******/ ]);
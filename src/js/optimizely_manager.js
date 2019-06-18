var optimizely = require('@optimizely/optimizely-sdk');
var logger = require('@optimizely/optimizely-sdk/lib/plugins/logger');
var enums = require('@optimizely/optimizely-sdk/lib/utils/enums');
require('es6-promise').polyfill();
require('isomorphic-fetch');

import {datafileURL, sdkKey} from '../../constants';  // datafileURL no longer used with ADM update in 3.2.0


class OptimizelyManager {

  // instantiate the Optimizely client
  static createInstance(initCallback,updateCallback) {
    //    var datafile = await _getDatafile();  // pre-datafile management
    let instance = optimizely.createInstance({
      sdkKey: sdkKey,
      datafileOptions: {
          autoUpdate: true,
          updateInterval: 30000
      },
      logger: logger.createLogger({
        logLevel: enums.LOG_LEVEL.DEBUG,
      })
    });
      
    instance.onReady().then(function() {
        console.log("Initial instance created and ready.");
        if(!!initCallback) initCallback();
    });
      
    instance.notificationCenter.addNotificationListener(
      enums.NOTIFICATION_TYPES.OPTIMIZELY_CONFIG_UPDATE,
      function() {
          console.log("Optimizely config updated automatically by ADM");
          if(!!updateCallback) updateCallback();
      }
    );
      
    return instance;
  
  }
}

export default OptimizelyManager;

// fetch JSON datafile from CDN
// no longer used, in favor of built-in datafile management with automatic downloading
async function _getDatafile() {
  return await fetch(datafileURL)
    .then(function (response) {
      if (response.status >= 400) {
        console.log('Error downloading datafile');
      }
      return response.json();
    });
}

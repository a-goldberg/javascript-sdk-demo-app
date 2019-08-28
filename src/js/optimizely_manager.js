var optimizely = require('@optimizely/optimizely-sdk');
var logger = require('@optimizely/optimizely-sdk/lib/plugins/logger');
var enums = require('@optimizely/optimizely-sdk').enums;
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

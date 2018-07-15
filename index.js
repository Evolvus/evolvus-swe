const debug = require("debug")("evolvus-swe:index");
const _ = require('lodash');
const setupService = require("./model/sweSetup");
const eventService = require("./model/sweEvent");

const shortid = require("shortid");

// initalize is called with the wfEntity, wfEntityAction and the query criteria
// to be used to update the wfEntity.
// We query the wfSetup table to get the configuration matchnig the wfEntity
// and wfEntityAction criteria. if there is no record we reject the promise
// with a wfStatus of 'NO_WORKFLOW_DEFINED' and wfInstanceId of 0
// if an instance is found and no callback or flowCode is defined, we return
// INVALID_WF_CONFIGURATION, wfInstanceId = 0
// if all is fine, we create a new wfInstanceId, save a record in wfEvent and then
// we execute callback with new wfInstanceId, and status = 'INITIATED'
// if the flowCode is 'AA' - we call complete with Status = 'APPROVED', wfInstanceId
// (newly created), and comment - Automatic Approval.
module.exports.initialize = (tenantId, createdBy, wfEntity, wfEntityAction, query) => {
  return new Promise((resolve, reject) => {
    var filter = {
      "wfEntity": wfEntity,
      "wfEntityAction": wfEntityAction
    };
    setupService.findOne(tenantId, filter)
      .then((result) => {
        // find returns an array of size 0 on no data found
        // findOne returns null, _.isEmpty returns true of null or size 0
        if (_.isEmpty(result)) { // no records found
          return Promise.reject({
            "wfStatus": "NO_WORKFLOW_DEFINED",
            "wfInstanceId": "0"
          });
        } else { //we found a configuration record
          let wfInstanceId = shortid.generate();
          return eventService.save(tenantId, {
            "wfInstanceId": wfInstanceId,
            "wfStatus": "INITIALIZED",
            "wfEntity": wfEntity,
            "wfEntityAction": wfEntityAction,
            "eventDate": Date.now(),
            "eventStatus": "IN_PROGRESS",
            "createdBy": createdBy
          });
        } // if else ends
      })
      .then((resolved, rejected) => {

      });
  });
};

module.exports.complete = () => {

};

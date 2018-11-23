const debug = require("debug")("evolvus-swe:index");
const _ = require('lodash');
const setupService = require("./model/sweSetup");
const eventService = require("./model/sweEvent");
const axios = require("axios");

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
module.exports.initialize = (tenantId, createdBy, wfEntity, wfEntityAction, objectId, oldObject) => {
  let wfInstanceId = shortid.generate();
  let sweEvent = {
    "wfInstanceId": wfInstanceId,
    "wfInstanceStatus": "PENDING_AUTHORIZATION",
    "wfEntity": wfEntity,
    "wfEntityAction": wfEntityAction,
    "query": objectId,
    "wfEventDate": Date.now(),
    "wfEvent": "PENDING_AUTHORIZATION",
    "createdBy": createdBy,
    "createdDate": Date.now(),
    "object": oldObject
  };
  return eventService.save(tenantId, sweEvent)
    .then((result) => {
      debug("result %o", result);
      var query = {
        "wfEntity": wfEntity,
        "wfEntityAction": wfEntityAction
      };
      return setupService.findOne(tenantId, query);
    })
    .then((result) => {
      if (result == null) { // no records found..
        return module.exports.complete(tenantId, createdBy, wfEntity, objectId, wfInstanceId, "REPROCESS", "Invalid WF Configuration");
      } else {
        if (result.flowCode == 'AA') {
          // automatic approval
          return module.exports.complete(tenantId, createdBy, wfEntity, objectId, wfInstanceId, "AUTHORIZED", "Automatic Approval").then((res) => {
            res.wfInstanceStatus = "AUTHORIZED";
            return Promise.resolve(res);
          }).catch((e) => {
            return Promise.reject(e);
          });
        } else { // maker checker
          return Promise.resolve(sweEvent);
        }
      }
    });
};

module.exports.complete = (tenantId, createdBy, wfEntity, objectId, wfInstanceId, wfEvent, comments) => {
  let sweEvent = {
    "wfInstanceId": wfInstanceId,
    "wfInstanceStatus": "COMPLETED",
    "query": objectId,
    "wfEntity": wfEntity,
    "wfEventDate": Date.now(),
    "wfEvent": wfEvent,
    "createdBy": createdBy,
    "createdDate": Date.now(),
    "comments": comments
  };
  debug("saving event %O", sweEvent);
  var query = {
    "wfEntity": wfEntity
  };
  eventService.find(tenantId, {
    "wfInstanceId": wfInstanceId
  }, {}, 0, 1).then((result) => {
    let action = result[0].wfEntityAction;
    let oldObject = result[0].object;
    let value = result[0].object.activationStatus;
    setupService.findOne(tenantId, query).then((result) => {
      let data;
      let status = "INACTIVE";
      if (sweEvent.wfEvent === "AUTHORIZED" && result.flowCode !== "AA") {
        status = "ACTIVE";
      }
      if (sweEvent.wfEvent === "AUTHORIZED" && result.flowCode === "AA") {
        status = value;
      }
      if ((sweEvent.wfEvent === "AUTHORIZED" || sweEvent.wfEvent === "FAILURE") && action === "UPDATE") {
        data = {
          "processingStatus": wfEvent
        };
      } else if (action === "CREATE") {
        data = {
          "processingStatus": wfEvent,
          "activationStatus": status
        };
      } else {
        data = oldObject;
      }
      axios({
        headers: {
          "X-TENANT-ID": tenantId,
          "X-USER": createdBy,
          "X-IP-HEADER": "192.168.1.122",
          "X-ACCESS-LEVEL": "1",
          "X-ENTITY-ID": "H001B001"
        },
        method: result.callbackMethod,
        url: result.callbackURL + "/" + objectId,
        data: data
      }).catch((err) => {
        debug(`Error:${err} and failed to Axios`);
        Promise.resolve(err);
      });
    }).catch((err) => {
      debug(`Error:${err} and failed to findOne setup`);
      Promise.resolve(err);
    });
  }).catch((err) => {
    debug(`Error:${err} and failed to find Event`);
    Promise.resolve(err);
  });
  return eventService.update(tenantId, {
    "wfInstanceId": wfInstanceId
  }, {
      "wfInstanceStatus": "COMPLETED",
      "updatedBy": createdBy,
      "updatedDate": Date.now()
    })
    .then((result) => {
      return eventService.save(tenantId, sweEvent);
    });
};
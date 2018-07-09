const debug = require("debug")("evolvus-swe:db:sweevent");
const mongoose = require("mongoose");
const _ = require("lodash");

const schema = require("./sweEventSchema");

// Creates a sweSetups collection in the database
var collection = mongoose.model("sweEvent", schema);

// Saves the sweSetup object to the database and returns a Promise
// The assumption here is that the Object is valid
// tenantId must match object.tenantId,if missing it will get added here
module.exports.save = (tenantId, object) => {
  let result = _.merge(object, {
    "tenantId": tenantId
  });
  let saveObject = new collection(result);
  return saveObject.save();
};

module.exports.find = (tenantId, filter, orderby, skipCount, limit) => {
  let query = _.merge(filter, {
    "tenantId": tenantId
  });

  return collection.find(query)
    .sort(orderby)
    .skip(skipCount)
    .limit(limit);
};

module.exports.findOne = (tenantId, filter) => {
  let query = _.merge(filter, {
    "tenantId": tenantId
  });
  return collection.findOne(query);
};

module.exports.update = (tenantId, key, update) => {
  let query = {
    "tenantId": tenantId,
    "wfInstanceId": key
  };
  return collection.update(query, update);
};

// Deletes all the entries of the collection.
// To be used by test only
module.exports.deleteAll = (tenantId) => {
  let query = {
    "tenantId": tenantId
  };
  return collection.remove(query);
};

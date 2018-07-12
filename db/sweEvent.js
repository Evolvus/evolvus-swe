const debug = require("debug")("evolvus-swe:db:sweevent");
const mongoose = require("mongoose");

const schema = require("./sweEventSchema");

// Creates a sweSetups collection in the database
var collection = mongoose.model("sweEvent", schema);

// Saves the sweSetup object to the database and returns a Promise
// The assumption here is that the Object is valid
// if it fails validation it will throw an exception
module.exports.save = (object) => {
  let saveObject = new collection(result);
  return saveObject.save();
};

// find returns an array object with the results
// [] (empty array) if the columns mismatch or if there are no records.
// if the skipCount is negative it will throw and error
// this usually indicates a logical error in the code
// limit of 0 means all values, else absolute of limit is used
// point here is that no error is thrown
module.exports.find = (filter, orderby, skipCount, limit) => {
  return collection.find(filter)
    .sort(orderby)
    .skip(skipCount)
    .limit(limit);
};

// findOne returns an object or null based on the filter condition
module.exports.findOne = (filter) => {
  return collection.findOne(filter);
};

// update will find the records matched by the filter and update
// the attributes set in the update object
module.exports.update = (filter, update) => {
  return collection.update(filter, update);
};

// Deletes all the entries of the collection.
// To be used by test only
module.exports.deleteAll = (filter) => {
  return collection.remove(filter);
};

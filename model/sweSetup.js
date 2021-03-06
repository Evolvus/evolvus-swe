const debug = require("debug")("evolvus-swe:model:sweSetup");
const model = require("./sweEventSchema")
  .schema;

const schema = require("../db/sweSetupSchema");
const Dao = require("@evolvus/evolvus-mongo-dao").Dao;

const collection = new Dao("sweSetup", schema);

const _ = require("lodash");

const validate = require("jsonschema")
  .validate;

//validate object before save
module.exports.save = (tenantId, object) => {
  let result = _.merge(object, {
    "tenantId": tenantId
  });
  return collection.save(result)
};

// Ensure skipCount is >= 0
module.exports.find = (tenantId, filter, orderby, skipCount, limit) => {
  let query = _.merge(filter, {
    "tenantId": tenantId
  });
  return collection.find(filter, orderby, skipCount, limit);
};


module.exports.findOne = (tenantId, filter) => {
  console.log("INSIDE",tenantId,filter);

 
  let query = _.merge(filter, {
    "tenantId": tenantId
  });
  console.log("filter one",filter);
  return collection.findOne(filter);
};

module.exports.findData2 = (filter) =>{
  console.log("filter two",filter);
  return collection.findOne(filter);
}

module.exports.findData = (path,tenantId, filter) => {
  console.log("INSIDE",tenantId,filter);

 
  if(path !== '/swe/initialize'){
  let query = _.merge(filter, {
    "tenantId": tenantId
  });}
  console.log("filter three",filter);
  return collection.findOne(filter);
};
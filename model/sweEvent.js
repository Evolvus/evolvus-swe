const debug = require("debug")("evolvus-swe:model:sweEvent");
const model = require("./sweEventSchema")
  .schema;
const collection = require("../db/sweEvent");

const validate = require("jsonschema")
  .validate;

module.exports.save = (tenantId, object) => {
  let result = _.merge(object, {
    "tenantId": tenantId
  });

  return collection.save(result)
};

// Ensure skipCount is >= 0
module.exports.find = (tenantId, filter, orderby, skipCount, limit) => {
  return collection.find(tenantId, filter, orderby, skipCount, limit);
};

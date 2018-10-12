module.exports.validObject1 = {
  // valid role object
  "tenantId": "T001",
  "wfEntity": "ROLE",
  "wfEntityAction": "CREATE",
  "createdBy": "kamalarani",
  "query": "5b6d29c3744dee603a11d6dc"
};

module.exports.validObject2 = {
  // valid role object
  "tenantId": "T001",
  "wfEntity": "ROLE",
  "wfEntityAction": "UPDATE",
  "createdBy": "kamalarani",
  "query": "5b6d29c3744dee603a11d6dc"
};

module.exports.validObject3 = {
  // valid role object
  "tenantId": "T001",
  "wfEntity": "ENTITY",
  "wfEntityAction": "CREATE",
  "createdBy": "kamalarani",
  "query": "5b6d2f7b29db50657853d27e"
};

module.exports.validObject4 = {
  // valid role object
  "tenantId": "T001",
  "wfEntity": "ENTITY",
  "wfEntityAction": "UPDATE",
  "createdBy": "kamalarani",
  "query": "5b6d2f7b29db50657853d27e"
};

module.exports.invalidObject1 = {
  // invalid role object
  "tenantId": "T001",
  "wfEntity": "ENTfsgdgdghITY",
  "wfEntityAction": "CREATE",
  "createdBy": "kamalarani",
  "query": "5b6d2f7b29db50657853d27e"
};

module.exports.sweEventObject = {
  "wfInstanceId": 'hPCuLlkND',
  "wfInstanceStatus": 'PENDING_AUTHORIZATION',
  "wfEntity": 'ROLE',
  "wfEntityAction": 'CREATE',
  "query": '5b6d29c3744dee603a11d6dc',
  "wfEventDate": 1539063191768,
  "wfEvent": 'PENDING_AUTHORIZATION',
  "createdBy": 'kamalarani',
  "createdDate": 1539063191768,
  "object": ''
};

module.exports.sweEventComplete1 = {
  "wfInstanceId": "hPCuLlkND",
  "wfInstanceStatus": "COMPLETED",
  "query": "5b6d29c3744dee603a11d6dc",
  "wfEntity": "ROLE",
  "wfEventDate": 1539063191768,
  "wfEvent": "AUTHORIZED",
  "createdBy": 'kamalarani',
  "createdDate": 1539063191768,
  "comments": "comments"
};

module.exports.sweEventObject2 = {
  "wfInstanceId": 'HPCuLlkND',
  "wfInstanceStatus": 'PENDING_AUTHORIZATION',
  "wfEntity": 'ROLE',
  "wfEntityAction": 'CREATE',
  "query": '5b6d29c3744dee603a11d6dg',
  "wfEventDate": 1539063191768,
  "wfEvent": 'PENDING_AUTHORIZATION',
  "createdBy": 'kamalarani',
  "createdDate": 1539063191768,
  "object": ''
};

module.exports.sweSetupObject = {
  "enabled": "true",
  "wfEntity": "ENTITY",
  "wfEntityAction": "CREATE",
  "flowCode": "MAKER",
  "createdBy": "SYSTEM",
  "createdDate": "2018-08-08T06:04:18.135Z",
  "updatedDate": "2018-08-08T06:04:18.135Z",
  "callbackURL": "http://localhost:8086/api/private/api/entity",
  "callbackMethod": "put"
};

module.exports.sweSetupObject1 = {
  "enabled": "true",
  "wfEntity": "ENTITY",
  "wfEntityAction": "UPDATE",
  "flowCode": "MAKER",
  "createdBy": "SYSTEM",
  "createdDate": "2018-08-08T06:04:18.135Z",
  "updatedDate": "2018-08-08T06:04:18.135Z",
  "callbackURL": "http://localhost:8086/api/private/api/entity",
  "callbackMethod": "put"
};

// module.exports.sweSetupObject2 = {
//   "enabled": "true",
//   "wfEntity": "ENTITY",
//   "wfEntityAction": "CREATE",
//   "flowCode": "CHECKER",
//   "createdBy": "SYSTEM",
//   "createdDate": "2018-08-08T06:04:18.135Z",
//   "updatedDate": "2018-08-08T06:04:18.135Z",
//   "callbackURL": "http://localhost:8086/api/private/api/entity",
//   "callbackMethod": "put"
// };
//
// module.exports.sweSetupObject3 = {
//   "enabled": "true",
//   "wfEntity": "ENTITY",
//   "wfEntityAction": "UPDATE",
//   "flowCode": "CHECKER",
//   "createdBy": "SYSTEM",
//   "createdDate": "2018-08-08T06:04:18.135Z",
//   "updatedDate": "2018-08-08T06:04:18.135Z",
//   "callbackURL": "http://localhost:8086/api/private/api/entity",
//   "callbackMethod": "put"
// };
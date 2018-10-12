const debug = require("debug")("evolvus-swe.test.index");
const chai = require("chai");
const mongoose = require("mongoose");
const dbSchema = require("../db/sweEventSchema");
const setupSchema = require("../db/sweSetupSchema");
const _ = require("lodash");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204:27017/TestPlatform_Dev";
/*
 ** chaiAsPromised is needed to test promises
 ** it adds the "eventually" property
 **
 ** chai and others do not support async / await
 */
const chaiAsPromised = require("chai-as-promised");

const expect = chai.expect;
chai.use(chaiAsPromised);

const swe = require("../index");
const sweEvent = require("../model/sweEvent");
const sweSetup = require("../model/sweSetup");

const Dao = require("@evolvus/evolvus-mongo-dao").Dao;
const collection = new Dao("sweevent", dbSchema);
const collection1 = new Dao("swesetup1", dbSchema);

const tenantId = "T001";

const sweTestData = require("./sweTestData");

describe('testing index', () => {
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });

  describe("testing index.initailize method", () => {

    beforeEach(function(done) {
      this.timeout(10000);
      collection.deleteAll({
          tenantId: "T001"
        })
        .then((data) => {
          done();
        });
    });

    it('should save a valid event object to database', (done) => {
      try {
        var result = swe.initialize("T001", "kamalarani", "ROLE", "CREATE", "5b6d29c3744dee603a11d6dc", "");
        expect(result)
          .to.eventually.have.property("query")
          .to.equal("5b6d29c3744dee603a11d6dc")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `saving event object should not throw exception: ${e}`);
      }
    });

    it('should not save a invalid event object to database', (done) => {
      try {
        var result = swe.initialize("T001", "kamalarani", "ROLE", "CREATE", "", "");
        expect(result)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

  });

  describe("testing index.complete method", () => {

    beforeEach(function(done) {
      this.timeout(10000);
      collection.deleteAll({
          tenantId: "T001"
        })
        .then((data) => {
          done();
        });
    });

    it('should save a valid event complete object to database', (done) => {
      try {
        var result = swe.complete("T001", "kamalarani", "ROLE", "5b6d29c3744dee603a11d6dc", "8Xb_tkWd5", "AUTHORIZED", "approved");
        expect(result)
          .to.eventually.have.property("query")
          .to.equal("5b6d29c3744dee603a11d6dc")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `saving event complete object should not throw exception: ${e}`);
      }
    });

    it('should not save a invalid complete event object to database', (done) => {
      try {
        var result = swe.complete("T001", "kamalarani", "ROLE", "CREATE", "", "");
        expect(result)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

  });
});

describe('testing sweEvent', () => {
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });

  describe("testing sweEvent.save method", () => {

    beforeEach(function(done) {
      this.timeout(10000);
      collection.deleteAll({
          tenantId: "T001"
        })
        .then((data) => {
          done();
        });
    });

    it('should save a valid sweEvent object to database', (done) => {
      try {
        var result = sweEvent.save("T001", sweTestData.sweEventObject);
        expect(result)
          .to.eventually.have.property("query")
          .to.equal("5b6d29c3744dee603a11d6dc")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `saving event complete object should not throw exception: ${e}`);
      }
    });

    it('should not save invalid sweEvent object to database', (done) => {
      try {
        var result = sweEvent.save("T001", "dbdhbv");
        expect(result)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });
  });

  describe("testing sweEvent.find method", () => {

    beforeEach(function(done) {
      this.timeout(10000);
      collection.deleteAll({
          tenantId: "T001"
        }).then((value) => {
          return sweEvent.save(tenantId, sweTestData.sweEventObject);
        })
        .then((value) => {
          return sweEvent.save(tenantId, sweTestData.sweEventComplete1);
        })
        .then((value) => {
          return sweEvent.save(tenantId, sweTestData.sweEventObject2);
        })
        .then((data) => {
          done();
        });
    });

    it("should return all the sweEvent Objects", (done) => {
      let res = sweEvent.find(tenantId, {}, {}, 0, 0);
      expect(res)
        .to.have.be.fulfilled.then((events) => {
          expect(events)
            .to.have.lengthOf(3);
          expect(events[0])
            .to.have.property("tenantId")
            .to.equal(tenantId);
          expect(events[1])
            .to.have.property("tenantId")
            .to.equal(tenantId);
          expect(events[2])
            .to.have.property("tenantId")
            .to.equal(tenantId);
          done();
        });
    });

    it("should return all the objects whose wfInstanceStatus is PENDING_AUTHORIZATION", (done) => {
      var filter = {
        wfInstanceStatus: "PENDING_AUTHORIZATION"
      };
      let res = sweEvent.find(tenantId, filter, {}, 0, 0);
      expect(res)
        .to.have.be.fulfilled.then((events) => {
          expect(events[0])
            .to.have.property("tenantId")
            .to.equal(tenantId);
          expect(events[0])
            .to.have.property("wfInstanceStatus")
            .to.equal("PENDING_AUTHORIZATION");
          expect(events[1])
            .to.have.property("tenantId")
            .to.equal(tenantId);
          expect(events[1])
            .to.have.property("wfInstanceStatus")
            .to.equal("PENDING_AUTHORIZATION");
          done();
        });
    });

    it("should return a single event object based on filter", (done) => {
      var filter = {
        wfInstanceStatus: "PENDING_AUTHORIZATION",
        query: "5b6d29c3744dee603a11d6dc"
      };
      let res = sweEvent.find(tenantId, filter, {}, 0, 1);
      expect(res)
        .to.have.be.fulfilled.then((events) => {
          debug("result:" + JSON.stringify(events));
          expect(events[0])
            .to.have.property("tenantId")
            .to.equal(tenantId);
          expect(events[0])
            .to.have.property("wfInstanceStatus")
            .to.equal("PENDING_AUTHORIZATION");
          expect(events[0])
            .to.have.property("query")
            .to.equal("5b6d29c3744dee603a11d6dc");
          done();
        });
    });

    it('should throw an empty object for null value of tenantId', (done) => {
      try {
        let res = sweEvent.find(null, {}, {}, 0, 1);
        expect(res);
        done();
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should throw an empty object for undefined value of tenantId', (done) => {
      var undefinedId;
      try {
        let res = sweEvent.find(undefinedId, {}, {}, 0, 1);
        expect(res);
        done();
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });
  });

  describe("testing sweEvent.update method", () => {

    beforeEach(function(done) {
      this.timeout(10000);
      collection.deleteAll({
          tenantId: "T001"
        }).then((value) => {
          return sweEvent.save(tenantId, sweTestData.sweEventObject);
        })
        .then((value) => {
          return sweEvent.save(tenantId, sweTestData.sweEventComplete1);
        })
        .then((value) => {
          return sweEvent.save(tenantId, sweTestData.sweEventObject2);
        })
        .then((data) => {
          done();
        });
    });

    it('should update an event with new values', (done) => {
      let filter = {
        query: "5b6d29c3744dee603a11d6dg"
      };
      var res = sweEvent.update(tenantId, filter, {
        wfInstanceStatus: "COMPLETED",
        wfEvent: "AUTHORIZED"
      });
      expect(res)
        .to.have.be.fulfilled.then((events) => {
          debug("result: " + JSON.stringify(events));
          expect(events)
            .to.have.property("nModified")
            .to.equal(1);
          done();
        });
    });

    it('should not update an event for undefined tenantId', (done) => {
      let undefinedId;
      var res = sweEvent.update(undefinedId, {}, {
        wfInstanceStatus: "COMPLETED",
        wfEvent: "AUTHORIZED"
      });
      expect(res)
        .to.have.be.fulfilled.then((events) => {
          debug("result: " + JSON.stringify(events));
          expect(events)
            .to.have.property("nModified")
            .to.equal(0);
          done();
        });
    });

    it('should not update an event for null tenantId', (done) => {
      var res = sweEvent.update(null, {}, {
        wfInstanceStatus: "COMPLETED",
        wfEvent: "AUTHORIZED"
      });
      expect(res)
        .to.have.be.fulfilled.then((events) => {
          debug("result: " + JSON.stringify(events));
          expect(events)
            .to.have.property("nModified")
            .to.equal(0);
          done();
        });
    });

    it('should not update an event for empty filter', (done) => {
      var res = sweEvent.update(tenantId, {}, {
        wfInstanceStatus: "COMPLETED",
        wfEvent: "AUTHORIZED"
      });
      expect(res)
        .to.have.be.fulfilled.then((events) => {
          debug("result: " + JSON.stringify(events));
          expect(events)
            .to.have.property("nModified")
            .to.equal(0);
          done();
        });
    });

    it('should not update an event for null filter object', (done) => {
      var res = sweEvent.update(tenantId, null, {
        wfInstanceStatus: "COMPLETED",
        wfEvent: "AUTHORIZED"
      });
      expect(res)
        .to.have.be.fulfilled.then((events) => {
          debug("result: " + JSON.stringify(events));
          expect(events)
            .to.have.property("nModified")
            .to.equal(0);
          done();
        });
    });

    it('should not update an event for undefined filter object', (done) => {
      let undefinedFilter;
      var res = sweEvent.update(tenantId, undefinedFilter, {
        wfInstanceStatus: "COMPLETED",
        wfEvent: "AUTHORIZED"
      });
      expect(res)
        .to.have.be.fulfilled.then((events) => {
          debug("result: " + JSON.stringify(events));
          expect(events)
            .to.have.property("nModified")
            .to.equal(0);
          done();
        });
    });

    it('should not update an event for empty update object', (done) => {
      let filter = {
        query: "5b6d29c3744dee603a11d6dg"
      };
      var res = sweEvent.update(tenantId, filter, {});
      expect(res)
        .to.have.be.fulfilled.then((events) => {
          debug("result: " + JSON.stringify(events));
          expect(events)
            .to.have.property("nModified")
            .to.equal(0);
          done();
        });
    });
  });
});

describe('testing sweSetups', () => {
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });

  describe("testing sweSetup.save method", () => {

    beforeEach(function(done) {
      this.timeout(10000);
      collection1.deleteAll({
          tenantId: "T001"
        })
        .then((data) => {
          done();
        });
    });

    it('should save a valid sweSetup object to database', (done) => {
      try {
        var result = sweSetup.save(tenantId, sweTestData.sweSetupObject);
        expect(result)
          .to.eventually.have.property("tenantId")
          .to.equal(tenantId)
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `saving setup object should not throw exception: ${e}`);
      }
    });

    it('should not save a invalid setup object to database', (done) => {
      try {
        var result = swe.initialize(tenantId, "kamalarani");
        expect(result)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });
  });

  describe("testing sweSetup.find method", () => {

    beforeEach(function(done) {
      this.timeout(1000);
      collection1.deleteAll({
          tenantId: "T001"
        }).then((value) => {
          return sweSetup.save(tenantId, sweTestData.sweSetupObject);
        })
        .then((value) => {
          return sweSetup.save(tenantId, sweTestData.sweSetupObject1);
        })
        .then((data) => {
          done();
        });
    });

    it("should return all the sweSetup Objects", (done) => {
      let res = sweSetup.find(tenantId, {}, {}, 0, 0);
      expect(res)
        .to.have.be.fulfilled.then((setups) => {
          expect(setups)
            .to.have.lengthOf(2);
          expect(setups[0])
            .to.have.property("tenantId")
            .to.equal(tenantId);
          expect(setups[1])
            .to.have.property("tenantId")
            .to.equal(tenantId);
          done();
        });
    });

    it("should return all the objects whose flowCode is MAKER", (done) => {
      var filter = {
        flowCode: "MAKER"
      };
      let res = sweSetup.find(tenantId, filter, {}, 0, 0);
      expect(res)
        .to.have.be.fulfilled.then((setups) => {
          expect(setups[0])
            .to.have.property("tenantId")
            .to.equal(tenantId);
          expect(setups[0])
            .to.have.property("flowCode")
            .to.equal("MAKER");
          expect(setups[1])
            .to.have.property("tenantId")
            .to.equal(tenantId);
          expect(setups[1])
            .to.have.property("flowCode")
            .to.equal("MAKER");
          done();
        });
    });

    it("should return a single setup object based on filter", (done) => {
      var filter = {
        wfEntity: "ENTITY",
        wfEntityAction: "CREATE"
      };
      let res = sweSetup.find(tenantId, filter, {}, 0, 1);
      expect(res)
        .to.have.be.fulfilled.then((setups) => {
          debug("result:" + JSON.stringify(setups));
          expect(setups[0])
            .to.have.property("tenantId")
            .to.equal(tenantId);
          expect(setups[0])
            .to.have.property("wfEntity")
            .to.equal("ENTITY");
          expect(setups[0])
            .to.have.property("wfEntityAction")
            .to.equal("CREATE");
          done();
        });
    });

    it('should throw an empty object if tenantId is null', (done) => {
      try {
        let res = sweSetup.find(null, {}, {}, 0, 1);
        expect(res);
        done();
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should throw an empty object if tenantId is undefined', (done) => {
      var undefinedId;
      try {
        let res = sweSetup.find(undefinedId, {}, {}, 0, 1);
        expect(res);
        done();
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should throw an empty object if filter is null', (done) => {
      try {
        let res = sweSetup.find(tenantId, null, {}, 0, 1);
        expect(res);
        done();
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should throw an empty object if filter is undefined', (done) => {
      var undefinedFilter;
      try {
        let res = sweSetup.find(tenantId, undefinedFilter, {}, 0, 1);
        expect(res);
        done();
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });
  });

  describe("testing sweSetup.findOne method", () => {

    beforeEach(function(done) {
      this.timeout(1000);
      collection1.deleteAll({
          tenantId: "T001"
        }).then((value) => {
          return sweSetup.save(tenantId, sweTestData.sweSetupObject);
        })
        .then((value) => {
          return sweSetup.save(tenantId, sweTestData.sweSetupObject1);
        })
        .then((data) => {
          done();
        });
    });

    it("should return a setup object based on filter", (done) => {
      var filter = {
        wfEntity: "ENTITY",
        wfEntityAction: "CREATE"
      };
      let res = sweSetup.findOne(tenantId, filter);
      expect(res)
        .to.have.be.fulfilled.then((setups) => {
          debug("result:" + JSON.stringify(setups));
          expect(setups)
            .to.have.property("tenantId")
            .to.equal(tenantId);
          expect(setups)
            .to.have.property("wfEntity")
            .to.equal("ENTITY");
          expect(setups)
            .to.have.property("wfEntityAction")
            .to.equal("CREATE");
          done();
        });
    });

    it('should throw an empty object if filter is null', (done) => {
      try {
        let res = sweSetup.findOne(tenantId, null);
        expect(res);
        done();
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should throw an empty object if filter is undefined', (done) => {
      var undefinedFilter;
      try {
        let res = sweSetup.findOne(tenantId, undefinedFilter);
        expect(res);
        done();
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should throw an empty object if tenantId is null', (done) => {
      try {
        let res = sweSetup.findOne(null, {});
        expect(res);
        done();
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should throw an empty object if tenantId is undefined', (done) => {
      var undefinedId;
      try {
        let res = sweSetup.findOne(undefinedId, {});
        expect(res);
        done();
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });
  });
});
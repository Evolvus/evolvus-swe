/*
 ** Get all the environment variables
 ** The PORT env variable is not set in docker so
 ** defaults to 3000
 */
const PORT = process.env.PORT || 3000;

/*
 ** Get all the required libraries
 */
const debug = require("debug")("evolvus-swe:server");
const http = require("http");
const terminus = require("@godaddy/terminus");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const db = require("@evolvus/evolvus-mongo-dao").connection;
const _ = require("lodash");
const shortid = require("shortid");

const healthCheck = require("@evolvus/evolvus-node-health-check");
const healthCheckAttributes = ["status", "saveTime"];
let body = _.pick(healthCheckAttributes);

const LIMIT = process.env.LIMIT || 10;
const tenantHeader = "X-TENANT-ID";
const userHeader = "X-USER";
const ipHeader = "X-IP-HEADER";
const PAGE_SIZE = 10;

var connection = db.connect("swe").then((res, err) => {
  if (err) {
    debug(`connection problem due to :${err}`);
  } else {
    debug("connected to mongodb");
    body.status = "working";
    body.saveTime = new Date().toISOString();
    healthCheck.save(body).then((ent) => {
      debug("healthcheck object saved");
    }).catch((e) => {
      debug(`unable to save Healthcheck object due to ${e}`);
    });
  }
});

const app = express();
const router = express.Router();

// with this setting we expect the correct client hostname to be in the
// header X-Forwarded-Host and we get this value from req.hostname and
// req.ip(s) will give the value of the client ip(s) (X-Forwarded-For)
app.set("trust proxy", true);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({
  limit: "2mb",
  extended: false
}));

app.use(bodyParser.json({
  limit: "2mb"
}));

app.use(function(req, res, next) {

  // Website you wish to allow to connect

  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT");

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  const tenantId = req.header(tenantHeader);
  const createdBy = req.header(userHeader);
  const ipAddress = req.ip;

  req.body = _.merge(req.body, {
    "tenantId": tenantId,
    "createdBy": createdBy,
    "ipAddress": ipAddress
  });

  // Pass to next layer of middleware
  next();
});

app.use(function(err, req, res, next) {
  let reference = shortid.generate();
  debug("Reference %s, Unexpected exception in save %o", reference, JSON.stringify(err));
  const response = {
    "status": "500",
    "description": "Unexpected error encountered. Server unable to process request. Please contact server administrator.",
    "data": reference
  };
  res.status(500)
    .json(response);
});

app.use(function(req, res, next) {
  //  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Request-Headers", "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,X-HTTP-Method-Override, Content-Type, Accept, Authorization,entityId,tenantId,entityCode,accessLevel");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

require("./routes/main")(router);
app.use("/api", router);

/*
 * Healthcheck and gracefull shutdown..
 */
function onSignal() {
  console.log("server is starting cleanup");
  // start cleanup of resource, like databases or file descriptors
  db.disconnect();
}

function onHealthCheck() {
  // checks if the system is healthy, like the db connection is live
  // resolves, if health, rejects if not
  return new Promise((resolve, reject) => {

    healthCheck.getAll(-1).then((healthChecks) => {
      if (healthChecks.length > 0) {
        resolve("CONNECTION CONNECTED");
        debug("CONNECTION CONNECTED");
      } else {
        reject("CONNECTION PROBLEM");
        debug("CONNECTION PROBLEM");
      }
    }).catch((e) => {
      debug("CONNECTION PROBLEM");
      reject("CONNECTION PROBLEM");
    });
  });
}

const server = http.createServer(app);

terminus(server, {
  signal: "SIGINT",
  healthChecks: {
    "/api/healthcheck": onHealthCheck,
  },
  onSignal
});


server.listen(PORT, () => {
  debug("server started: ", PORT);
  app.emit("application_started");
});

module.exports.app = app;
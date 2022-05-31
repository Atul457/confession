module.exports = app => {
  const adminauth = require("../services/admin/adminauth.js");
  const adminCategories = require("../services/admin/categories.js");
  const adminConfession = require("../services/admin/confession.js");
  const adminUser = require("../services/admin/user.js");
  const adminReport = require("../services/admin/report.js");
  const adminComplain = require("../services/admin/complain.js");
  var router = require("express").Router();
  router.post("/updatepassword", adminauth.updatepassword);
  router.post("/register", adminauth.register);
  router.post("/login", adminauth.login);
  router.get("/logout", adminauth.logout);
  router.post("/createcategory", adminCategories.createcategory);
  router.get("/deletecategory/:id", adminCategories.deletecategory);
  router.post("/getcategories", adminCategories.getcategories);
  router.get("/deleteconfession/:confession_id", adminConfession.deleteconfession);
  router.get("/deletecomment/:confession_id/:comment_id", adminConfession.deletecomment);

  router.post("/getcomplains", adminComplain.getallcomplain);
  router.post("/getreportusers", adminReport.getallreport);
  router.post("/getusers", adminUser.getalluser);
  router.post("/updateuserstatus", adminUser.userstatus);
  app.use('/api/admin', router);
};

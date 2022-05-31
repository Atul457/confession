module.exports = app => {
  const confessions = require("../services/confession.js");
  const auth = require("../services/auth.js");
  const complain = require("../services/complains.js");
  const profile = require("../services/profile.js");
  var router = require("express").Router();
  router.get("/getcategories", confessions.getcategories);
  router.post("/createconfession", confessions.createconfession);
  router.get("/getconfessions/:category_id/:page", confessions.getconfessions);
  router.get("/getconfession/:confession_id", confessions.getconfession);
  router.post("/uploadimage", confessions.uploadimage);

  router.post("/login", auth.login);
  router.post("/sociallogin", auth.sociallogin);
  router.post("/register", auth.register);
  router.get("/logout", auth.logout);
  router.post("/sendtestemail", auth.sendtestemail);

  router.post("/getcomments", confessions.getcomments);
  router.post("/postcomment", confessions.postcomment);
  router.get("/deletecomment/:confession_id/:comment_id", confessions.deletecomment);
  router.get("/deleteconfession/:confession_id", confessions.deleteconfession);
  
  router.post("/getotherprofile", profile.getotherprofile);
  router.post("/getmyconfessions", profile.getmyconfessions);
  router.post("/sendfriendrequest", profile.sendfriendrequest);
  router.post("/getfriendrequests", profile.getfriendrequests);
  router.post("/getfriends", profile.getfriends);
  router.post("/getchat", profile.getchat);
  router.post("/refreshchat", profile.refreshchat);
  router.post("/sendmessage", profile.sendmessage);
  router.post("/clearchat", profile.clearchat);
  router.post("/updatefriendrequeststatus", profile.updatefriendrequeststatus);
  router.get("/getprofile", profile.getprofile);
  router.post("/updateprofile", profile.updateprofile);
  router.post("/reportuser", profile.reportuser);
  router.get("/newcommentscount", profile.newcommentscount);
  router.get("/verifyemail/:user_id/:token", profile.verifyemail);
  router.post("/sendverifyemail", auth.sendverifyemail);

  router.post("/postcomplains", complain.postcomplains);
  app.use('/api', router);
};

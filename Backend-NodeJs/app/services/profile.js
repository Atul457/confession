const util = require('../../utils/util');
const knex = require("../config/db.js");
const common = require('./common.js');
const cryptojs = require('../../utils/cryptojs');
const fs = require('fs');
const knexdb =knex.knex;
const filepath =knex.filepath;

async function getotherprofile(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }
    if(!(req.body.profile_id).trim())
      return res.send({
        status: false,
        message: "All fields required."
      });
    let user_id = 0;
    if(req.headers.token && req.headers.token != "")
    {
      const token = req.headers.token;
      user_id = await common.tokenAuthenticate(knexdb, token);
      if(!user_id)
        return res.send({
          status: false,
          message: "Token not found in our database.",
          logout: true
        });
    }
    let profile_id = (req.body.profile_id).trim();
    profile_id = cryptojs.decryptStr(profile_id);
    const users = await knexdb('users').select(['name','email','image','post_as_anonymous','display_name']).where('id',profile_id);
    if(!users)
      return res.send({
        status: false,
        message: "User not found."
      });
    const user = users[0];
    if(user.image != "")
      user.image = filepath+user.image;
    let is_requested = 0;
    let is_friend = 0;
    let requested;
    if(user_id != 0)
    {
      requested = await knexdb('friends').where('user_id',user_id).where('friend_id',profile_id).where('status',0).count({ rows: 'id'});
      if(requested && requested[0].rows > 0)
        is_requested = 1;
      else {
        requested = await knexdb('friends').where('user_id',profile_id).where('friend_id',user_id).where('status',0).count({ rows: 'id'});
        if(requested && requested[0].rows > 0)
          is_requested = 1;
      }
      if(is_requested == 0)
      {
        alreadyFriend = await knexdb('friends').where('user_id',user_id).where('friend_id',profile_id).where('status',1).count({ rows: 'id'});
        if(alreadyFriend && alreadyFriend[0].rows > 0)
          is_friend = 1;
        else {
          alreadyFriend = await knexdb('friends').where('user_id',profile_id).where('friend_id',user_id).where('status',1).count({ rows: 'id'});
          if(alreadyFriend && alreadyFriend[0].rows > 0)
            is_friend = 1;
        }
      }
    }
    user.is_requested = is_requested;
    user.is_friend = is_friend;
    return res.send({
        status: true,
        profile: user
    });
  } catch (err) {
    common.logdata('getotherprofile', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function getmyconfessions(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token && !(req.body.profile_id).trim())
      return res.send({
        status: false,
        message: "All fields required."
      });
    const token = req.headers.token;
    const profile_id = (req.body.profile_id).trim();
    let user_id = 0;
    let is_deleteable = 0;
    if(token != "")
    {
      user_id = await common.tokenAuthenticate(knexdb, token);
      if(!user_id)
        return res.send({
          status: false,
          message: "Token not found in our database.",
          logout: true
        });
      is_deleteable = 1;
    }
    let view_previous_invoice = 1;
    if(profile_id != "")
    {
      user_id = cryptojs.decryptStr(profile_id);
      let checkuniq = await knexdb('users').select(['view_previous_invoice']).where('id',user_id).pluck('view_previous_invoice');
      if(checkuniq && checkuniq.length == 0)
        return res.send({
          status: false,
          message: "User not found."
        });
      view_previous_invoice = checkuniq[0];
      is_deleteable = 0;
    }
    const today = util.formatCurrentDate();
    const setlimit = 20;
    const page = req.body.page;
    const offsetval = (parseInt(page)-1)*parseInt(setlimit);
    const count = await knexdb('confession_thoughts').where('status',1).where('is_deleted',0).where('user_id',user_id).where(function() {
      if(profile_id != "")
      {
        this.where('post_as_anonymous',0);
        if(view_previous_invoice == 0)
          this.where(knexdb.raw('date(confession_thoughts.created_at)'),today);
      }
    }).count({ rows: 'id'});
    const confessions = await knexdb('confession_thoughts').innerJoin('categories',function() {
                this.on('categories.id', '=', 'confession_thoughts.category_id');
    }).select(['confession_thoughts.category_id','confession_thoughts.id as confession_id','confession_thoughts.viewcount','confession_thoughts.temp_name','confession_thoughts.user_id','confession_thoughts.description','confession_thoughts.post_as_anonymous','confession_thoughts.image','confession_thoughts.created_at','categories.category_name']).where('confession_thoughts.status',1).where('confession_thoughts.is_deleted',0).where("categories.status", 1).where('confession_thoughts.user_id',user_id).where(function() {
      if(profile_id != "")
      {
        this.where('post_as_anonymous',0);
        if(view_previous_invoice == 0)
          this.where(knexdb.raw('date(confession_thoughts.created_at)'),today);
      }
    }).orderBy('confession_thoughts.id', 'desc').limit(setlimit).offset(offsetval);
    if(!confessions)
      return res.send({
        status: false,
        message: "Network connection error."
      });
    let userData;
    let comments = 0;
    let unread_comments = 0;
    for (let i = 0; i < confessions.length; i++) {
      comments = await knexdb('confession_thoughts_comments').where('is_deleted',0).where('confession_id',confessions[i].confession_id).count({ rows: 'id'});
      confessions[i].no_of_comments = comments[0].rows;

      confessions[i].unread_comments = 0;
      if(profile_id === "")
      {
        unread_comments = await knexdb('confession_thoughts_comments').where('is_deleted',0).where('is_unread',1).where('confession_id',confessions[i].confession_id).count({ rows: 'id'});
        confessions[i].unread_comments = unread_comments[0].rows;
      }
      if(confessions[i].image !== null)
      {
        let images = confessions[i].image;
        for (let j = 0; j < images.length; j++) {
          images[j] = filepath+images[j];
        }
        confessions[i].image = images;
      }
      confessions[i].created_at = util.formatDateTime(confessions[i].created_at);
      confessions[i].created_by = "";
      if(confessions[i].post_as_anonymous == 0 && confessions[i].user_id != 0)
      {
        userData = await knexdb('users').select(['name']).where('id',confessions[i].user_id);
        confessions[i].created_by = userData[0].name;
      } else {
        confessions[i].created_by = confessions[i].temp_name;
        confessions[i].post_as_anonymous = 1;
      }
      confessions[i].confession_id = cryptojs.encryptStr(confessions[i].confession_id);
      delete confessions[i].user_id;
      delete confessions[i].temp_name;
    }
    return res.send({
        status: true,
        count: count[0].rows,
        confessions:confessions,
        is_deleteable
    });
  } catch (err) {
    common.logdata('getmyconfessions', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function sendfriendrequest(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token || !req.body.friend_id)
      return res.send({
        status: false,
        message: "All fields required."
      });
    const token = req.headers.token;
    let friend_id = req.body.friend_id;
    friend_id = cryptojs.decryptStr(friend_id);
    const user_id = await common.tokenAuthenticate(knexdb, token);
    if(!user_id)
      return res.send({
        status: false,
        message: "Token not found in our database.",
        logout: true
      });
    if(req.body.is_cancelled && req.body.is_cancelled === 1)
    {
      let checkrequestAccepted = await knexdb('friends').where(function() {
        this.orWhere(function() {
          this.where('friend_id',user_id).where('user_id',friend_id);
        }).orWhere(function() {
          this.where('user_id',user_id).where('friend_id',friend_id);
        });
      }).where('status',1).count({ rows: 'id'});
      if(checkrequestAccepted && checkrequestAccepted[0].rows > 0)
      return res.send({
        status: false,
        message: "Your friend request already accepted."
      });
      await knexdb('friends').where('user_id', user_id).where('friend_id', friend_id).where('status', 0).delete();
      return res.send({
        status: true,
        message: "Your friend request has been cancelled successfully."
      });
    }
    let checkrequest = await knexdb('friends').where(function() {
      this.orWhere(function() {
        this.where('friend_id',user_id).where('user_id',friend_id);
      }).orWhere(function() {
        this.where('user_id',user_id).where('friend_id',friend_id);
      });
    }).where('status',0).count({ rows: 'id'});
    if(checkrequest && checkrequest[0].rows > 0)
      return res.send({
        status: false,
        message: "Your friend request already sent for accept."
      });
    const friendData = {
      user_id: user_id,
      friend_id: friend_id,
      status: 0,
      created_at: new Date(),
      updated_at: new Date()
    };
    await knexdb('friends').insert(friendData);

    let friendDetail = await knexdb('users').select(['name','email']).where('id',friend_id);
    friendDetail = friendDetail[0];
    if(friendDetail.email != '')
    {
      const template = fs.readFileSync('talkemail/requestemail.html',{encoding:'utf-8'});
      let body = template.replace('[USER_NAME]', friendDetail.name);
      body = body.replace('[REQUEST_LINK]', 'https://thetalkplace.com/requests');
      common.sendemail(friendDetail.email,"You have a new friend request on Talkplace",body);
    }
    return res.send({
        status: true,
        message: "Your friend request has been sent successfully."
    });
  } catch (err) {
    common.logdata('getfriendrequests', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function getfriendrequests(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token)
      return res.send({
        status: false,
        message: "All fields required."
      });
    const token = req.headers.token;
    const user_id = await common.tokenAuthenticate(knexdb, token);
    if(!user_id)
      return res.send({
        status: false,
        message: "Token not found in our database.",
        logout: true
      });

    const setlimit = 20;
    const page = req.body.page;
    const offsetval = (parseInt(page)-1)*parseInt(setlimit);
    const count = await knexdb('friends').where('friend_id',user_id).where('status',0).count({ rows: 'id'});
    const requests = await knexdb('friends').innerJoin('users',function() {
                this.on('users.id', '=', 'friends.user_id');
            }).select(['friends.id as request_id','friends.user_id','users.name','users.display_name','users.image','friends.created_at']).where('friends.friend_id',user_id).where('users.status',1).where('friends.status',0).orderBy('friends.id', 'desc').limit(setlimit).offset(offsetval);
    if(!requests)
      return res.send({
        status: false,
        message: "Network connection error."
      });
    let confessions = 0;
    for (let i = 0; i < requests.length; i++) {
      confessions = await knexdb('confession_thoughts').where('status',1).where('is_deleted',0).where('user_id',requests[i].user_id).count({ rows: 'id'});
      requests[i].no_of_confessions = confessions[0].rows
      if(requests[i].image != "")
        requests[i].image = filepath+requests[i].image;
      requests[i].created_at = util.formatDateTime(requests[i].created_at);
      if(requests[i].display_name != "")
        requests[i].name = requests[i].display_name;
      delete requests[i].user_id;
      delete requests[i].display_name;
    }
    return res.send({
        status: true,
        count: count[0].rows,
        requests:requests
    });
  } catch (err) {
    common.logdata('getfriendrequests', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function updatefriendrequeststatus(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token || !req.body.request_id || !req.body.status)
      return res.send({
        status: false,
        message: "All fields required."
      });
    const token = req.headers.token;
    const request_id = req.body.request_id;
    const status = req.body.status;
    const user_id = await common.tokenAuthenticate(knexdb, token);
    if(!user_id)
      return res.send({
        status: false,
        message: "Token not found in our database.",
        logout: true
      });

    let checkrequest = await knexdb('friends').where('friend_id',user_id).where('id',request_id).where('status',0).count({ rows: 'id'});
    if(checkrequest && checkrequest[0].rows == 0)
      return res.send({
        status: false,
        message: "Request not found."
      });

    await knexdb('friends').where('friend_id',user_id).where('id',request_id).update({'status':status,'updated_at':new Date()});
    let message = "";
    if(status == 1)
      message = "Request has been approved successfully.";
    else if(status == 2)
      message = "Request has been rejected successfully.";
    return res.send({
        status: true,
        message: message
    });
  } catch (err) {
    common.logdata('getfriendrequests', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function getfriends(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token)
      return res.send({
        status: false,
        message: "All fields required."
      });
    const token = req.headers.token;
    const user_id = await common.tokenAuthenticate(knexdb, token);
    if(!user_id)
      return res.send({
        status: false,
        message: "Token not found in our database.",
        logout: true
      });

    const setlimit = 20;
    const page = req.body.page;
    const offsetval = (parseInt(page)-1)*parseInt(setlimit);
    const count = await knexdb('friends').where(function() {
      this.where('friend_id',user_id).orWhere('user_id',user_id);
    }).where('status',1).where('is_inactive',0).count({ rows: 'id'});
    const friends = await knexdb('friends').select(['id as channel_id','friend_id','user_id','last_messsage','updated_at']).where(function() {
      this.where('friend_id',user_id).orWhere('user_id',user_id);
    }).where('status',1).where('is_inactive',0).orderBy('updated_at', 'desc').limit(setlimit).offset(offsetval);
    if(!friends)
      return res.send({
        status: false,
        message: "Network connection error."
      });
    //const today = util.formatCurrentDate();
    for (let i = 0; i < friends.length; i++) {
      let is_online = 1;
      if(friends[i].friend_id === user_id)
        friends[i].friend_id = friends[i].user_id;
      let confessions = await knexdb('confession_thoughts').where('status',1).where('is_deleted',0).where('user_id',friends[i].friend_id).count({ rows: 'id'});
      friends[i].no_of_confessions = confessions[0].rows
      let updated_at = util.formatDateTime(friends[i].updated_at);
      updated_at = updated_at.toString();
      //if(today === updated_at.substring(0,10))
        friends[i].updated_at = util.formatDateTime(friends[i].updated_at);
      //else
        //friends[i].updated_at = util.standaredFormat(friends[i].updated_at);
      friends[i].name = "";
      friends[i].image = "";
      let user = await knexdb('users').select(['name','image','display_name']).where('id',friends[i].friend_id);
      if(user.length)
      {
        user = user[0];
        if(user.display_name != '')
          user.name = user.display_name;
        friends[i].name = user.name;
        friends[i].image = user.image;
      }
      if(friends[i].image != "")
        friends[i].image = filepath+friends[i].image;

      let is_userreport = 0;
      let userreport = await knexdb('reportuser').where('report_by',user_id).where('report_to',friends[i].friend_id).count({ rows: 'id'});
      if(userreport[0].rows > 0 )
        is_userreport = 1;
      friends[i].friend_id = cryptojs.encryptStr((friends[i].friend_id).toString());
      friends[i].is_online = is_online;
      friends[i].is_userreport = is_userreport;
      delete friends[i].user_id;
    }
    return res.send({
        status: true,
        count: count[0].rows,
        friends:friends
    });
  } catch (err) {
    common.logdata('getfriends', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function getchat(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token || !req.body.channel_id)
      return res.send({
        status: false,
        message: "All fields required."
      });
    const token = req.headers.token;
    const user_id = await common.tokenAuthenticate(knexdb, token);
    if(!user_id)
      return res.send({
        status: false,
        message: "Token not found in our database.",
        logout: true
      });

    const setlimit = 100;
    const page = req.body.page;
    const offsetval = (parseInt(page)-1)*parseInt(setlimit);
    const channel_id = req.body.channel_id;
    const count = await knexdb('friend_chat').where('channel_id',channel_id).where('clear_by','NOT LIKE','%,'+user_id+',%').count({ rows: 'id'});
    const messages = await knexdb('friend_chat').select().where('channel_id',channel_id).where('clear_by','NOT LIKE','%,'+user_id+',%').orderBy('friend_chat.id', 'desc').limit(setlimit).offset(offsetval);
    if(!messages)
      return res.send({
        status: false,
        message: "Network connection error."
      });
    let last_id = 0;
    const today = util.formatCurrentDate();
    for (let i = 0; i < messages.length; i++) {
      if(last_id === 0)
        last_id = messages[i].id;
      let created_at = messages[i].created_at;
      created_at = util.formatDateTime(created_at);
      created_at = created_at.toString();
      if(today === created_at.substring(0,10))
        messages[i].created_at = util.formatDateTime(messages[i].created_at);
      else
        messages[i].created_at = util.formatDateTime(messages[i].created_at);
      messages[i].from_id = cryptojs.encryptStr((messages[i].from_id).toString());
      messages[i].to_id = cryptojs.encryptStr((messages[i].to_id).toString());
      delete messages[i].id;
      delete messages[i].clear_by;
    }
    await knexdb("friend_chat").where('channel_id',channel_id).where('is_unread',1).where('to_id',user_id).update({is_unread: 0});
    return res.send({
        status: true,
        count: count[0].rows,
        messages:messages,
        last_id: last_id
    });
  } catch (err) {
    common.logdata('getchat', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function refreshchat(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token || !req.body.last_id || !req.body.channel_id)
      return res.send({
        status: false,
        message: "All fields required."
      });
    const token = req.headers.token;
    const user_id = await common.tokenAuthenticate(knexdb, token);
    if(!user_id)
      return res.send({
        status: false,
        message: "Token not found in our database.",
        logout: true
      });

    let last_id = req.body.last_id;
    const channel_id = req.body.channel_id;
    const messages = await knexdb('friend_chat').select().where('channel_id',channel_id).where('id','>',last_id).where('from_id','!=',user_id).where('clear_by','NOT LIKE','%,'+user_id+',%').orderBy('id', 'desc');
    if(!messages)
      return res.send({
        status: false,
        message: "Network connection error."
      });
    let new_last_id = last_id;
    for (let i = 0; i < messages.length; i++) {
      if(new_last_id === last_id)
        last_id = messages[i].id;
      messages[i].created_at = util.formatDateTime(messages[i].created_at);
      messages[i].from_id = cryptojs.encryptStr((messages[i].from_id).toString());
      messages[i].to_id = cryptojs.encryptStr((messages[i].to_id).toString());
      delete messages[i].id;
      delete messages[i].clear_by;
    }
    return res.send({
        status: true,
        messages:messages,
        last_id: last_id
    });
  } catch (err) {
    common.logdata('refreshchat', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function sendmessage(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token || !req.body.channel_id || !(req.body.message).trim() || !req.body.to_id)
      return res.send({
        status: false,
        message: "All fields required."
      });
    const token = req.headers.token;
    const user_id = await common.tokenAuthenticate(knexdb, token);
    if(!user_id)
      return res.send({
        status: false,
        message: "Token not found in our database.",
        logout: true
      });
    const message = (req.body.message).trim();
    const channel_id = req.body.channel_id;
    let to_id = req.body.to_id;
    to_id = cryptojs.decryptStr(to_id);
    const msgData = {
      channel_id: channel_id,
      from_id: user_id,
      to_id: to_id,
      message: message,
      created_at: new Date()
    };
    const getMsgResponse = await knexdb("friend_chat").insert(msgData);
    const msg_id = getMsgResponse[0];
    const messages = await knexdb('friend_chat').select().where('id',msg_id);
    const messageData = messages[0];
    messageData.created_at = util.formatDateTime(messageData.created_at);
    messageData.from_id = cryptojs.encryptStr((messageData.from_id).toString());
    messageData.to_id = cryptojs.encryptStr((messageData.to_id).toString());
    delete messageData.id;
    delete messageData.clear_by;
    await knexdb("friends").where('id',channel_id).update({
      'last_messsage': message,
      'updated_at': new Date()
    });
    let fromDetail = await knexdb('users').select(['name']).where('id',user_id).pluck('name');
    fromDetail = fromDetail[0];
    //console.log(fromDetail);
    let friendDetail = await knexdb('users').select(['name','email']).where('id',to_id);
    friendDetail = friendDetail[0];
    //console.log(friendDetail);
    if(friendDetail.email != '')
    {
      const template = fs.readFileSync('talkemail/messageemail.html',{encoding:'utf-8'});
      let body = template.replace('[USER_NAME]', friendDetail.name);
      body = body.replace('[FROM_NAME]', fromDetail);
      body = body.replace('[REQUEST_LINK]', 'https://thetalkplace.com/chat');
      common.sendemail(friendDetail.email,"You have Got a New Message",body);
    }
    return res.send({
        status: true,
        message: messageData
    });
  } catch (err) {
    common.logdata('sendmessage', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function clearchat(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token || !req.body.channel_id)
      return res.send({
        status: false,
        message: "All fields required."
      });
    const token = req.headers.token;
    const user_id = await common.tokenAuthenticate(knexdb, token);
    if(!user_id)
      return res.send({
        status: false,
        message: "Token not found in our database.",
        logout: true
      });
    const channel_id = req.body.channel_id;
    let checkuniq = await knexdb('friends').where('id',channel_id).count({ rows: 'id'});
    if(checkuniq && checkuniq[0].rows == 0)
      return res.send({
        status: false,
        message: "Chat channel not found."
      });
    await knexdb('friend_chat').where('channel_id',channel_id).where('clear_by','NOT LIKE','%,'+user_id+',%').update({'clear_by': knexdb.raw(`CONCAT(clear_by,'${user_id},')`)});
    return res.send({
        status: true,
        message: "All messages cleared.",
    });
  } catch (err) {
    common.logdata('clearchat', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function getprofile(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token)
      return res.send({
        status: false,
        message: "All fields required."
      });
    const token = req.headers.token;
    const user_id = await common.tokenAuthenticate(knexdb, token);
    if(!user_id)
      return res.send({
        status: false,
        message: "Token not found in our database.",
        logout: true
      });
    const profile = await profileData(user_id);
    if(!profile)
      return res.send({
        status: false,
        message:'Network connection error.'
      });
    profile.user_id = cryptojs.encryptStr(user_id.toString());
    return res.send({
        status: true,
        user: profile
    });
  } catch (err) {
    common.logdata('getprofile', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function updateprofile(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token)
      return res.send({
        status: false,
        message: "All fields required."
      });
    const token = req.headers.token;
    const user_id = await common.tokenAuthenticate(knexdb, token);
    if(!user_id)
      return res.send({
        status: false,
        message: "Token not found in our database.",
        logout: true
      });
    let isUpdate = 0;
    const updateData = {};
    if(req.body.view_previous_invoice)
    {
      isUpdate = 1;
      updateData.view_previous_invoice = req.body.view_previous_invoice;
    }
    /*if(req.body.first_name && (req.body.first_name).trim() != "")
    {
      isUpdate = 1;
      updateData.first_name = (req.body.first_name).trim();
    }
    if(req.body.last_name && (req.body.last_name).trim() != "")
    {
      isUpdate = 1;
      updateData.last_name = (req.body.last_name).trim();
      updateData.name = updateData.first_name+' '+updateData.last_name;
    }*/
    if(req.body.image && (req.body.image).trim() != "")
    {
      isUpdate = 1;
      updateData.image = (req.body.image).trim();
    }
    if(req.body.post_as_anonymous)
    {
      isUpdate = 1;
      updateData.post_as_anonymous = req.body.post_as_anonymous;
    } else updateData.post_as_anonymous = 0;
    if(req.body.email && (req.body.email).trim() != "")
    {
      let checkuniqemail = await knexdb('users').where('email','like',req.body.email).where('id','!=',user_id).count({ rows: 'id'});
      if(checkuniqemail && checkuniqemail[0].rows > 0)
        return res.send({
          status: false,
          message: "A user with this email address already exists."
        });
      updateData.email = (req.body.email).trim();
      isUpdate = 1;
    }
    if(req.body.display_name)
    {
      isUpdate = 1;
      updateData.display_name = (req.body.display_name).trim();
    } else {
      isUpdate = 1;
      updateData.display_name = await common.getDisplayName();
    }
    updateData.name = updateData.display_name;
    if(isUpdate === 1)
    {
      updateData.updated_at = new Date();
      await knexdb("users").where('id',user_id).update(updateData);
    }
    const profile = await profileData(user_id);
    if(!profile)
      return res.send({
        status: false,
        message:'Network connection error.'
      });
    profile.user_id = cryptojs.encryptStr(user_id.toString());
    return res.send({
        status: true,
        message: "Your profile updated.",
        user: profile
    });
  } catch (err) {
    common.logdata('updateprofile', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function reportuser(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token || !(req.body.friend_id).trim())
      return res.send({
        status: false,
        message: "All fields required."
      });
    const token = req.headers.token;
    const user_id = await common.tokenAuthenticate(knexdb, token);
    if(!user_id)
      return res.send({
        status: false,
        message: "Token not found in our database.",
        logout: true
      });
    let friend_id = (req.body.friend_id).trim();
    friend_id = cryptojs.decryptStr(friend_id);
    const updateData = {
      report_by: user_id,
      report_to: friend_id,
      reported_at: new Date()
    };
    await knexdb("reportuser").insert(updateData);
    return res.send({
        status: true,
        message: "Successfully reported"
    });
  } catch (err) {
    common.logdata('reportuser', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function newcommentscount(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token)
      return res.send({
        status: false,
        message: "All fields required."
      });
    const token = req.headers.token;
    const user_id = await common.tokenAuthenticate(knexdb, token);
    if(!user_id)
      return res.send({
        status: false,
        message: "Token not found in our database.",
        logout: true
      });
    const userData = await knexdb('users').select(['email_verified']).where('id',user_id).pluck('email_verified');
    email_verified = userData[0];
    const confession_ids = await knexdb("confession_thoughts").select(["id"]).where('user_id',user_id).where('status',1).where('is_deleted',0).pluck('id');
    const comments = await knexdb('confession_thoughts_comments').where('is_deleted',0).where('is_unread',1).whereIn('confession_id',confession_ids).count({ rows: 'id'});
    const messages = await knexdb('friend_chat').where('is_unread',1).where('to_id',user_id).count({ rows: 'id'});
    return res.send({
        status: true,
        comments: comments[0].rows,
        email_verified,
        messages: messages[0].rows
    });
  } catch (err) {
    common.logdata('newcommentscount', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function verifyemail(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.params.user_id)
      return res.send({
        status: false,
        message: "All fields required."
      });

    let user_id = req.params.user_id;
    user_id = cryptojs.decryptStr(user_id);

    let token = req.params.token;
    let checkuniq = await knexdb('users').where('id',user_id).where('email_verifiy_token',token).count({ rows: 'id'});
    if(checkuniq && checkuniq[0].rows == 0)
        return res.send({
          status: false,
          message: "Your verification link has been expired."
        });
    await knexdb('users').where('id',user_id).where('email_verifiy_token',token).update({
      'email_verifiy_token': '',
      'email_verified': 1,
      'updated_at': new Date()
    });
    return res.send({
        status: true,
        message: "Your email address has been verified successfully."
    });
  } catch (err) {
    common.logdata('verifyemail', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}
async function profileData(user_id)
{
  const users = await knexdb('users').select(['name','first_name','last_name','email','source','status','image','post_as_anonymous','display_name','view_previous_invoice']).where('id',user_id);
  if(!users)
    return false;
  const user = users[0];
  if(user.image != "")
      user.image = filepath+user.image;
  return user;
}
exports.getmyconfessions = getmyconfessions;
exports.sendfriendrequest = sendfriendrequest;
exports.getfriendrequests = getfriendrequests;
exports.updatefriendrequeststatus = updatefriendrequeststatus;
exports.getotherprofile = getotherprofile;
exports.updateprofile = updateprofile;
exports.getfriends = getfriends;
exports.getchat = getchat;
exports.refreshchat = refreshchat;
exports.clearchat = clearchat;
exports.sendmessage = sendmessage;
exports.reportuser = reportuser;
exports.newcommentscount = newcommentscount;
exports.verifyemail = verifyemail;
exports.getprofile = getprofile;
const util = require('../../utils/util');
const knex = require("../config/db.js");
const common = require('./common.js');
const request = require('request');
const fs = require('fs');
const cryptojs = require('../../utils/cryptojs');
const knexdb =knex.knex;
const filepath =knex.filepath;
const hostname =knex.captcha_hostname;
const s3js = require("../libraries/s3js.js");
const tempnames = ["Cinnamon","Alder","Almond","Ambrosia","Amy root","Apple","Apricot","Arfaj","Arizona sycamore","Arrowwood","Ash","Azolla","Bamboo","Banana","Baobab","Bay","Bean","Bear corn","Bearberry","Beech","Bindweed","Birch","Bird's nest plant","Bird's nest","Bittercress","Bittersweet","Bitterweed","Black cap","Black","Black","Blackberry","Blackhaw","Blackiehead","Blue","Blueberry","Bow","Box","Boxelder","Boxwood","Brier","Brittlebush","Broadleaf","Brown Betty","Brown","Buckeye (California buckeye)","Buffalo weed","Butterfly flower","Butterfly weed","Cabbage","California bay","California buckeye","California sycamore","California walnut","Canada root","Cancer jalap","Carrot weed","Carrot","Cart track plant","Catalina ironwood","Cherry","Chestnut","Chigger flower","Chrysanthemum","Clove","Clover","Coakum","Coconut","Coffee plant","Colic weed","Collard","Colwort","Coneflower","Cornel","Cornelian tree","Corydalis","Cotton plant","Creeping yellowcress","Cress","Crow's nest","Crow's toes","Crowfoot","Cucumber","Daisy","Deadnettle","Devil's bite","Devil's darning needle","Devil's nose","Devil's plague","Dewberry","Dindle","Dogwood","Drumstick","Duck retten","Duscle","Dye","Earth gall","English bull's eye","Eucalyptus","Extinguisher moss","Eytelia","Fair","Fairymoss Azolla caroliniana","Fellenwort","Felonwood","Felonwort","Fennel","Ferns","Feverbush","Feverfew","Fig","Flax","Flowering Dogwood","Fluxroot","Fumewort","Gallberry","Garget","Garlic","Garlic mustard","Garlic root","Gilliflower","Golden Jerusalem","Golden buttons","Goldenglow","Goose tongue","Gordaldo","Grapefruit","Grapevine","Groundberry","Gutweed","Haldi","Harlequin","Hay fever weed","Healing blade","Hedge plant","Hellebore","Hemp dogbane","Hemp","Hen plant","Herb barbara","Hogweed","Holly","Horse cane","Hound's berry","Houseleek","Huckleberry","Indian hemp","Indian paintbrush","Indian posy","Inkberry","Isle of Man cabbage","Itchweed","Ivy","Jack","Jack","Juneberry","Juniper","Keek","Kinnikinnik","Kousa","Kudzu","Laceflower","Lamb's foot","Lavender","Leek","Lemon","Lettuce","Lilac","Love vine","Maize","Mango","Maple","Mesquite","Milfoil","Milkweed","Milky tassel","Moosewood","Morel","Mosquito plant","Mother","Mountain mahogany","Mulberry","Neem","Nettle","Nightshade","Nosebleed","Oak tree","Olive","Onion","Orange","Orange","Osage","Osier","Parsley","Parsnip","Pea","Peach","Peanut","Pear","Pellitory","Penny hedge","Pepper root","Pigeon berry","Pine","Pineapple","Pistachio","Plane (European sycamore)","Plantain","Pleurisy root","Pocan bush","Poison ivy","Poisonberry","Poisonflower","Poke","Pokeroot","Pokeweed","Polecat weed","Polkweed","Poor Annie","Poor man's mustard","Poplar","Poppy","Possumhaw","Potato","Pudina","Queen Anne's lace","Quercitron","Radical weed","Ragweed","Ragwort","Rantipole","Rapeseed","Raspberry","Red ink plant","Redbrush","Redbud","Redweed","Rheumatism root","Rhubarb","Ribwort","Rice","Roadweed","Rocket","Rocketcress","Rose","Rosemary","Rye","Saffron crocus","Sanguinary","Saskatoon","Sauce","Scarlet berry","Scoke","Scotch cap","Scrambled eggs","Scurvy grass","Serviceberry","Shadblow","Shadbush","Silkweed","Skunkweed","Snakeberry","Sneezeweed","Sneezewort","Snowdrop","Soldier's woundwort","Sorrel","Speedwell","Spoolwood","Squaw bush","Stag bush","Stammerwort","Star","Stickweed","Strawberry tree 'Marina'","Strawberry tree","Strawberry","Sugarcane","Sugarplum","Sunflower","Swallow","Swallow","Sweet potato vine","Sweet potato","Swinies","Sycamore","Tansy","Tassel weed","Tea","Thimbleberry","Thimbleweed","Thistle","Thousand","Thousand","Thyme","Tickleweed","Tobacco plant","Tomato","Toothwort","Touch","Traveller's joy","Tread","Tree tobacco","Trillium","Tuber","Tulip","Tulsi","Vanilla orchid","Viburnum","Violet bloom","Violet","Virgin's bower","Walnut","Walnut","Waybread","Western redbud","Wheat","White man's foot","White","Wild cotton","Wild hops","Willow","Windroot","Wineberry","Winterberry","Wintercress","Woodbine","Wormwood","Wound rocket","Yam","Yarrow","Yellow coneflower","Yellow fieldcress","Yellowwood","Zedoary","Buckeye"];
async function uploadimage(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!(req.body.image).trim() || !(req.body.folder).trim())
      return res.send({
        status: false,
        message: "All fields required."
      });
    const image = (req.body.image).trim();
    const folder = (req.body.folder).trim();
    const buf = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""),'base64');
    const type = image.split(';')[0].split('/')[1];
    const timestamp = new Date().toISOString().replace(/[-:.]/g,"");  
    const random = ("" + Math.random()).substring(2, 8); 
    let filename = timestamp+random; 
    filename = filename+'.'+type;
    const imagepath = await s3js.uploadFile(folder, buf, filename, type);
    return res.send({
      status: true,
      imagepath: `${folder}/${filename}`
    });
  } catch (err) {
    common.logdata('uploadimage', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function getcategories(req, res)
{
  try {
    created_at = '';
    if(req.headers.token)
    {
      const token = req.headers.token;
      const user_id = await common.tokenAuthenticate(knexdb, token);
      if(!user_id)
        return res.send({
          status: false,
          message: "Token not found in our database.",
          logout: true
        });
    }

    const categories = await knexdb('categories').select(['id','category_name']).where('status',1);
    if(!categories)
      return res.send({
        status: false,
        message: "Network connection error."
      });

    return res.send({
        status: true,
        categories:categories
    });
  } catch (err) {
    common.logdata('getcategories', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function createconfession(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!(req.body.description).trim() || !(req.body.category_id).trim() || (!req.headers.token && !req.body.code))
      return res.send({
        status: false,
        message: "All fields required."
      });
    const description = (req.body.description).trim();
    const category_id = (req.body.category_id).trim();
    const post_as_anonymous = req.body.post_as_anonymous;
    let image = req.body.image;
    if(image == "")
      image = null;

    if(req.body.code != "")
    {
      let captchaResponse = await common.verifyCaptcha(req.body.code);
      if(!captchaResponse.success)
          return res.send({
            status: false,
            message: "Failed captcha"
          });
    }

    let temp_name = await common.getDisplayName();

    let user_id = 0;
    if(req.headers.token != "")
    {
      const token = req.headers.token;
      user_id = await common.tokenAuthenticate(knexdb, token);
      if(!user_id)
        return res.send({
          status: false,
          message: "Token not found in our database.",
          logout: true
        });
      if(post_as_anonymous == 0)
      {
        const userData = await knexdb('users').select(['display_name']).where('id',user_id).pluck('display_name');
        if(userData[0] != "")
          temp_name = userData[0];
      }
    }
    
    // Create a Confession
    const confession = {
      user_id: user_id,
      description: description,
      category_id: category_id,
      post_as_anonymous: post_as_anonymous,
      image: image,
      temp_name,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const confessionResponse = await knexdb('confession_thoughts').insert(confession);
    if(!confessionResponse)
      return res.send({
        status: false,
        message:'Network connection error.'
      });
    return res.send({
      status: true,
      message:'Your confession has been created successfully.'
    });
  } catch (err) {
    common.logdata('createconfession', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function getconfessions(req, res)
{
  try {
    let loggedInUserId = 0;
    if(req.headers.token != "")
    {
      const token = req.headers.token;
      loggedInUserId = await common.tokenAuthenticate(knexdb, token);
      if(!loggedInUserId)
        return res.send({
          status: false,
          message: "Token not found in our database.",
          logout: true
        });
    }
    if(!(req.params.category_id).trim() || !req.params.page)
      return res.send({
        status: false,
        message: "All fields required."
      });
    const category_id = (req.params.category_id).trim();
    const setlimit = 20;
    const page = req.params.page;
    const offsetval = (parseInt(page)-1)*parseInt(setlimit);
    const count = await knexdb('confession_thoughts').where('status',1).where('is_deleted',0).modify(function(queryBuilder) {
        if(category_id != "all")
          queryBuilder.where('category_id',category_id);
    }).count({ rows: 'id'});
    const confessions = await knexdb('confession_thoughts').innerJoin('categories',function() {
                this.on('categories.id', '=', 'confession_thoughts.category_id');
            }).select(['confession_thoughts.id as confession_id','confession_thoughts.viewcount','confession_thoughts.user_id','confession_thoughts.temp_name','confession_thoughts.description','confession_thoughts.post_as_anonymous','confession_thoughts.image','confession_thoughts.created_at','confession_thoughts.category_id','categories.category_name']).where('confession_thoughts.status',1).where('confession_thoughts.is_deleted',0).modify(function(queryBuilder) {
        if(category_id != "all")
          queryBuilder.where('category_id',category_id);
    }).where("categories.status", 1).orderBy('confession_thoughts.id', 'desc').limit(setlimit).offset(offsetval);
    if(!confessions)
      return res.send({
        status: false,
        message: "Network connection error."
      });
    let userData;
    let comments = 0;
    for (let i = 0; i < confessions.length; i++) {
      comments = await knexdb('confession_thoughts_comments').where('is_deleted',0).where('confession_id',confessions[i].confession_id).count({ rows: 'id'});
      confessions[i].no_of_comments = comments[0].rows
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
      confessions[i].profile_image = "";
      let user_id = confessions[i].user_id;
      user_id = user_id.toString();
      confessions[i].isNotFriend = 0;
      confessions[i].isRegistered = 0;
      if(confessions[i].user_id != 0)
      {
        confessions[i].isRegistered = 1;
        if(loggedInUserId != 0 && user_id !== loggedInUserId.toString())
        {
          confessions[i].isNotFriend = 3;
          let fCount = await knexdb('friends').select(['status']).where(function() {
            this.orWhere(function() {
              this.where('friend_id',user_id).where('user_id',loggedInUserId);
            }).orWhere(function() {
              this.where('user_id',user_id).where('friend_id',loggedInUserId);
            });
          }).where('status','!=',2).where('is_inactive',0);
          if(fCount.length == 0)
            confessions[i].isNotFriend = 1;
          else if(fCount[0].status === 0)
            confessions[i].isNotFriend = 2;
        }
      }
      if(confessions[i].post_as_anonymous == 0 && confessions[i].user_id != 0)
      {
        confessions[i].isRegistered = 1;
        userData = await knexdb('users').select(['name','image']).where('id',confessions[i].user_id);
        confessions[i].created_by = userData[0].name;
        if(userData[0].image != "")
          confessions[i].profile_image = filepath+userData[0].image;
        if(loggedInUserId != 0 && user_id !== loggedInUserId.toString())
        {
          confessions[i].isNotFriend = 3;
          let fCount = await knexdb('friends').select(['status']).where(function() {
            this.orWhere(function() {
              this.where('friend_id',user_id).where('user_id',loggedInUserId);
            }).orWhere(function() {
              this.where('user_id',user_id).where('friend_id',loggedInUserId);
            });
          }).where('status','!=',2).where('is_inactive',0);
          if(fCount.length == 0)
            confessions[i].isNotFriend = 1;
          else if(fCount[0].status === 0)
            confessions[i].isNotFriend = 2;
        }
      } else {
        confessions[i].created_by = confessions[i].temp_name;
        confessions[i].post_as_anonymous = 1;
      }
      if(confessions[i].user_id != 0)
        user_id = cryptojs.encryptStr(user_id);
      else
        user_id = 0;
      confessions[i].user_id = user_id;
      confessions[i].confession_id = cryptojs.encryptStr(confessions[i].confession_id);
      delete confessions[i].temp_name;
    }
    return res.send({
        status: true,
        count: count[0].rows,
        confessions:confessions
    });
  } catch (err) {
    common.logdata('getconfessions', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function getconfession(req, res)
{
  try {
    if(!req.params.confession_id)
      return res.send({
        status: false,
        message: "All fields required."
      });
    let confession_id = req.params.confession_id;
    confession_id = cryptojs.decryptStr(confession_id);
    const confessions = await knexdb('confession_thoughts').innerJoin('categories',function() {
      this.on('categories.id', '=', 'confession_thoughts.category_id');
    }).select(['confession_thoughts.id as confession_id','confession_thoughts.user_id','confession_thoughts.temp_name','confession_thoughts.description','confession_thoughts.post_as_anonymous','confession_thoughts.image','confession_thoughts.created_at','confession_thoughts.category_id','categories.category_name','confession_thoughts.viewcount']).where('confession_thoughts.status',1).where('confession_thoughts.id',confession_id).where("categories.status", 1);
    if(!confessions)
      return res.send({
        status: false,
        message: "Network connection error."
      });
    if(!confessions.length)
      return res.send({
        status: false,
        message: "Confession not found."
      });
    const confession = confessions[0];
    let userData;
    let comments = 0;
    comments = await knexdb('confession_thoughts_comments').where('is_deleted',0).where('confession_id',confession.confession_id).count({ rows: 'id'});
    confession.no_of_comments = comments[0].rows
    if(confession.image !== null)
    {
      let images = confession.image;
      for (let j = 0; j < images.length; j++) {
        images[j] = filepath+images[j];
      }
      confession.image = images;
    }
    confession.created_at = util.formatDateTime(confession.created_at);
    confession.created_by = confession.temp_name;
    confession.profile_image = "";
    let user_id = 0;
    if(confession.post_as_anonymous == 0 && confession.user_id != 0)
    {
      user_id = confession.user_id;
      userData = await knexdb('users').select(['name','image']).where('id',confession.user_id);
      confession.created_by = userData[0].name;

      if(userData[0].image != "")
          confession.profile_image = filepath+userData[0].image;
      user_id = user_id.toString();
      user_id = cryptojs.encryptStr(user_id);
    } else confession.post_as_anonymous = 1;
    confession.user_id = user_id;
    confession.confession_id = cryptojs.encryptStr(confession.confession_id);
    delete confession.temp_name;

    await knexdb('confession_thoughts').where('id',confession_id).update({'viewcount':knexdb.raw('viewcount + 1')});
    return res.send({
        status: true,
        confession:confession
    });
  } catch (err) {
    //console.log(err);
    common.logdata('getconfession', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function getcomments(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.body.confession_id || !req.body.page)
      return res.send({
        status: false,
        message: "All fields required."
      });
    let user_id = 0;
    if(req.headers.token)
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

    let confession_id = req.body.confession_id;
    confession_id = cryptojs.decryptStr(confession_id);
    const setlimit = 20;
    const page = req.body.page;
    const offsetval = (parseInt(page)-1)*parseInt(setlimit);
    if(page === 1)
      await knexdb('confession_thoughts').where('id',confession_id).update({'viewcount':knexdb.raw('viewcount + 1')});
    const count = await knexdb('confession_thoughts_comments').where('is_deleted',0).where('confession_id',confession_id).count({ rows: 'id'});
    const comments = await knexdb("confession_thoughts_comments").leftJoin('users',function() {
      this.on('users.id', '=', 'confession_thoughts_comments.user_id');
    }).select(['confession_thoughts_comments.id as comment_id','confession_thoughts_comments.temp_name','confession_thoughts_comments.user_id','confession_thoughts_comments.comment','confession_thoughts_comments.created_at','users.name as comment_by','users.image as profile_image','confession_thoughts_comments.post_as_anonymous']).where('confession_thoughts_comments.is_deleted',0).where('confession_thoughts_comments.confession_id',confession_id).orderBy('confession_thoughts_comments.id', 'asc').limit(setlimit).offset(offsetval);
    const today = util.formatCurrentDate();
    const comment_ids = [];
    for (let i = 0; i < comments.length; i++) {
      comments[i].is_editable = 0;
      if(comments[i].user_id !== 0 && user_id === comments[i].user_id)
        comments[i].is_editable = 1;
        comment_ids.push(comments[i].comment_id);
        let created_at = util.formatDateTime(comments[i].created_at);
        created_at = created_at.toString();
        if(today === created_at.substring(0,10))
        comments[i].created_at = util.formatDateTime(comments[i].created_at);
        else
        comments[i].created_at = util.formatDateTime(comments[i].created_at);
        if(comments[i].post_as_anonymous == 0)
        {
          if(comments[i].profile_image != "")
            comments[i].profile_image = filepath+comments[i].profile_image;
          comments[i].user_id = cryptojs.encryptStr((comments[i].user_id).toString());
        } else {
          comments[i].comment_by = comments[i].temp_name;
          comments[i].profile_image = "";
          comments[i].user_id = "";
        }
        comments[i].comment_id = cryptojs.encryptStr(comments[i].comment_id);
        delete comments[i].temp_name;
    }

    if(comment_ids.length && user_id !== 0)
    {
      let confession_user_id = await knexdb("confession_thoughts").select(['user_id']).where("id",confession_id).pluck('user_id');
      confession_user_id = confession_user_id[0];
      if(confession_user_id == user_id)
        await knexdb("confession_thoughts_comments").whereIn("id",comment_ids).where('is_unread',1).update({is_unread: 0, updated_at: new Date()});
    }
    return res.send({
        status: true,
        body: {
          comments: comments,
          count: count[0].rows
        }
    });
  } catch (err) {
    common.logdata('getcomments', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function postcomment(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token || !req.body.confession_id || !(req.body.comment).trim())
      return res.send({
        status: false,
        message: "All fields required."
      });
    const token = req.headers.token;
    let is_admin = 0;
    if(req.body.is_admin)
      is_admin = req.body.is_admin;
    let user_id = 0;
    if(is_admin === 1)
    {
      const admin_id = await common.adminTokenAuthenticate(knexdb, token);
      if(!admin_id)
        return res.send({
          status: false,
          message: "Token not found in our database."
        });
    } else {
      user_id = await common.tokenAuthenticate(knexdb, token);
      if(!user_id)
        return res.send({
          status: false,
          message: "Token not found in our database.",
          logout: true
        });
    }
    let confession_id = req.body.confession_id;
    confession_id = cryptojs.decryptStr(confession_id);
    const commentMSG = (req.body.comment).trim();

    let checkExist = await knexdb('confession_thoughts').select(['user_id','temp_name','post_as_anonymous']).where('id',confession_id);
    if(!checkExist || !checkExist.length)
      return res.send({
        status: false,
        message: "Confession not found."
      });
    const to_id = checkExist[0].user_id;
    let to_temp_name = checkExist[0].temp_name;
    const to_post_as_anonymous = checkExist[0].post_as_anonymous;
    let post_as_anonymous = 1;
    // Create a Confession

    let temp_name = "Admin";
    if(is_admin === 0)
    {
      const usersData = await knexdb('users').select(['display_name','post_as_anonymous']).where('id',user_id);
      const userData = usersData[0];
      post_as_anonymous = userData.post_as_anonymous;
      temp_name = await common.getDisplayName();
      if(post_as_anonymous == 0 && userData.display_name != "")
        temp_name = userData.display_name;
    }
    const commentData = {
      user_id: user_id,
      confession_id: confession_id,
      comment: commentMSG,
      post_as_anonymous,
      temp_name,
      is_admin,
      created_at: new Date(),
      updated_at: new Date()
    };

    let comment_id = 0;
    if(req.body.comment_id && req.body.comment_id != "")
    {
      comment_id = cryptojs.decryptStr(req.body.comment_id);
      const checkExistComment = await knexdb('confession_thoughts_comments').where('id',comment_id).where('confession_id',confession_id).where('user_id',user_id).count({ rows: 'id'});
      if(!checkExistComment || checkExistComment[0].rows == 0)
      return res.send({
        status: false,
        message: "You have no permission to edit this comment."
      });
      delete commentData.created_at;
      delete commentData.post_as_anonymous;
      delete commentData.is_admin;
      delete commentData.temp_name;
      await knexdb('confession_thoughts_comments').where('id',comment_id).update(commentData);
    } else {
      const commentResponse = await knexdb('confession_thoughts_comments').insert(commentData);
      comment_id = commentResponse[0];
      if(to_id != 0)
      {
        let from_temp_name = temp_name;
        //if(post_as_anonymous == 0)
        //{
          let fromDetail = await knexdb('users').select(['name']).where('id',user_id).pluck('name');
          fromDetail = fromDetail[0];
          from_temp_name = fromDetail;
        //}
        //console.log(fromDetail);
        let friendDetail = await knexdb('users').select(['name','email']).where('id',to_id);
        friendDetail = friendDetail[0];
        //if(to_post_as_anonymous == 0)
          to_temp_name = friendDetail.name;
        //console.log(friendDetail);
        if(friendDetail.email != '')
        {
          const template = fs.readFileSync('talkemail/messageemail.html',{encoding:'utf-8'});
          let body = template.replace('[USER_NAME]', to_temp_name);
          body = body.replace('[FROM_NAME]', from_temp_name);
          body = body.replace('[REQUEST_LINK]', `https://thetalkplace.com/confession/${req.body.confession_id}`);
          common.sendemail(friendDetail.email,"You have Got a New Message",body);
        }
      }
    }
    
    const comments = await knexdb("confession_thoughts_comments").leftJoin('users',function() {
      this.on('users.id', '=', 'confession_thoughts_comments.user_id');
    }).select(['confession_thoughts_comments.id as comment_id','confession_thoughts_comments.temp_name','confession_thoughts_comments.user_id','confession_thoughts_comments.comment','confession_thoughts_comments.created_at','users.name as comment_by','users.image as profile_image','confession_thoughts_comments.post_as_anonymous']).where('confession_thoughts_comments.id',comment_id);
    const today = util.formatCurrentDate();
    const comment = comments[0];
    let created_at = util.formatDateTime(comment.created_at);
    created_at = created_at.toString();
    if(today === created_at.substring(0,10))
      comment.created_at = util.formatDateTime(comment.created_at);
    else
      comment.created_at = util.formatDateTime(comment.created_at);
    if(comment.post_as_anonymous == 0)
    {
      if(comment.profile_image != "")
        comment.profile_image = filepath+comment.profile_image;
      comment.user_id = cryptojs.encryptStr((comment.user_id).toString());
    } else {
      comment.comment_by = comment.temp_name;
      comment.profile_image = "";
      comment.user_id = "";
    }
    comment.comment_id = cryptojs.encryptStr(comment.comment_id);
    delete comment.temp_name;
    comment.is_editable = 1;
    return res.send({
        status: true,
        message:'Comment has been created successfully.',
        comment: comment
    });
  } catch (err) {
    common.logdata('postcomment', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function deleteconfession(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token || !req.params.confession_id)
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
    
    let confession_id = req.params.confession_id;
    confession_id = cryptojs.decryptStr(confession_id);
    
    let checkExist = await knexdb('confession_thoughts').select(['user_id']).where('user_id',user_id).where('id',confession_id).pluck('user_id');
    if(!checkExist || !checkExist.length)
      return res.send({
        status: false,
        message: "Confession not found."
      });
    const confData = {
      old_user_id: user_id,
      user_id: 0,
      post_as_anonymous: 1,
      updated_at: new Date()
    };

    await knexdb('confession_thoughts').where('id',confession_id).update(confData);
    
    return res.send({
        status: true,
        message:'Confession has been deleted successfully.'
    });
  } catch (err) {
    common.logdata('deleteconfession', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

// delete comment
async function deletecomment(req, res)
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
        message: "Token not found in our database."
      });
    let comment_id = (req.params.comment_id).trim();
    comment_id = cryptojs.decryptStr(comment_id);
    let confession_id = (req.params.confession_id).trim();
    confession_id = cryptojs.decryptStr(confession_id);

    let confession_thoughts = await knexdb('confession_thoughts_comments').where('user_id',user_id).where('id',comment_id).where('confession_id', confession_id).count({ rows: 'id'});
    if(confession_thoughts[0].rows == 0)
      return res.send({
        status: false,
        message: "Comment not found."
      });
   
    let update = await knexdb('confession_thoughts_comments').where('user_id',user_id).where('id', comment_id).where('confession_id', confession_id).update({is_deleted: 1,updated_at: new Date(), updated_by: 0});
    return res.send({
      status: true,
      message: "Comment deleted.",
    });
  } catch (err) {
    common.logdata('deletecomment', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

exports.createconfession = createconfession;
exports.getconfessions = getconfessions;
exports.getconfession = getconfession;
exports.getcategories = getcategories;
exports.getcomments = getcomments;
exports.postcomment = postcomment;
exports.uploadimage = uploadimage;
exports.deleteconfession = deleteconfession;
exports.deletecomment = deletecomment;
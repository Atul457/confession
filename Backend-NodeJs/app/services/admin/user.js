const util = require('../../../utils/util');
const knex = require("../../config/db.js");
const common = require('../common.js');
const knexdb =knex.knex;
const filepath =knex.filepath;
async function getalluser(req, res)
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
    const admin_id = await common.adminTokenAuthenticate(knexdb, token);
    if(!admin_id)
      return res.send({
        status: false,
        message: "Token not found in our database."
      });
    let setlimit = 20;
    if(req.body.perpage)
      setlimit = req.body.perpage
    let searchvalue = "";
    if(req.body.searchvalue)
      searchvalue = req.body.searchvalue
    const page = req.body.page;
    const offsetval = (parseInt(page)-1)*parseInt(setlimit);
    const count = await knexdb('users').count({ rows: 'id'});
    let filtercount = count;
    if(searchvalue != "")
      filtercount = await knexdb('users').where(function() {
        if(searchvalue != "")
          this.where('name','like','%'+searchvalue+'%').orWhere('email','like','%'+searchvalue+'%');
      }).count({ rows: 'id'});
    const userdata = await knexdb.select('id','name', 'image', 'post_as_anonymous','email','source','last_login','status','created_at').from('users').where(function() {
      if(searchvalue != "")
        this.where('name','like','%'+searchvalue+'%').orWhere('email','like','%'+searchvalue+'%');
    }).limit(setlimit).offset(offsetval);
    if(!userdata)
      return res.send({
        status: false,
        message: "Network connection error."
      });
    for (let i = 0; i < userdata.length; i++) {
      if(userdata[i].image != "")
        userdata[i].image = filepath+userdata[i].image;
      userdata[i].created_at = util.formatDateTime(userdata[i].created_at);
      if(userdata[i].last_login !== null)
        userdata[i].last_login = util.formatDateTime(userdata[i].created_at);
    } 
    return res.send({
      status: true,
      count: count[0].rows,
      filtercount: filtercount[0].rows,
      users:userdata
    });
  } catch (err) {
    common.logdata('getalluser', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

async function userstatus(req, res)
{
  
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!req.headers.token || !req.body.id || !req.body.status)
      return res.send({
        status: false,
        message: "All fields required."
      });
    const token = req.headers.token;
    const admin_id = await common.adminTokenAuthenticate(knexdb, token);
    if(!admin_id)
      return res.send({
        status: false,
        message: "Token not found in our database."
      });
    const status = req.body.status;
    const id = req.body.id;
    let updatestatus = await knexdb('users').where('id', '=', id).update({status: status, updated_at: new Date(), updated_by: admin_id})

    if(!updatestatus)
      return res.send({
        status: false,
        message: "Network connection error."
      });
    await knexdb('confession_thoughts').where('user_id', '=', id).where('is_deleted',0).update({status: status, updated_at: new Date(), updated_by: admin_id})
    let is_inactive = 0;
    if(status === 2)
      is_inactive = 1;
    await knexdb('friends').where('user_id', '=', id).where(function() {
      this.where('friend_id',id).orWhere('user_id',id);
    }).update({is_inactive})
    return res.send({
        status: true,
        message: 'user update successfully'
    });
  } catch (err) {
    common.logdata('userstatus', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

exports.getalluser = getalluser;
exports.userstatus = userstatus;
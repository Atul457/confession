const util = require('../../../utils/util');
const knex = require("../../config/db.js");
const common = require('../common.js');
const knexdb =knex.knex;
const filepath =knex.filepath;

async function getallcomplain(req, res)
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
    const count = await knexdb('complains').count({ rows: 'id'});
    let filtercount = count;
    if(searchvalue != "")
      filtercount = await knexdb('complains').leftJoin('users', 'users.id', 'complains.user_id').where(function() {
        if(searchvalue != "")
          this.where('users.name','like','%'+searchvalue+'%').orWhere('complains.related_issue','like','%'+searchvalue+'%').orWhere('complains.message','like','%'+searchvalue+'%');
      }).count({ rows: 'users.id'});
    const complain = await knexdb.select('complains.id','users.name','complains.related_issue','complains.message','complains.image','complains.status','complains.created_at').from('complains').leftJoin('users', 'users.id', 'complains.user_id').where(function() {
      if(searchvalue != "")
        this.where('users.name','like','%'+searchvalue+'%').orWhere('complains.related_issue','like','%'+searchvalue+'%').orWhere('complains.message','like','%'+searchvalue+'%');
    }).limit(setlimit).offset(offsetval).orderBy("id","desc");
    if(!complain)
      return res.send({
        status: false,
        message: "Network connection error."
      });
    for (let i = 0; i < complain.length; i++) {
      if(complain[i].image !== null)
      {
        let images = complain[i].image;
        for (let j = 0; j < images.length; j++) {
          images[j] = filepath+images[j];
        }
        complain[i].image = images;
      }
      complain[i].created_at = util.formatDateTime(complain[i].created_at);
    }  
    return res.send({
      status: true,
      count: count[0].rows,
      filtercount: filtercount[0].rows,
      complain:complain
    });
  } catch (err) {
    common.logdata('getcategories', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}


exports.getallcomplain = getallcomplain;
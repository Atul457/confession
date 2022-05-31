const util = require('../../../utils/util');
const knex = require("../../config/db.js");
const common = require('../common.js');
const knexdb =knex.knex;

async function getallreport(req, res)
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
    const count = await knexdb('reportuser').count({ rows: 'id'});
    let filtercount = count;
    if(searchvalue != "")
      filtercount = await knexdb('reportuser').join('users as byuser','byuser.id', '=', 'reportuser.report_by').join('users as touser','touser.id', '=', 'reportuser.report_to').where(function() {
        if(searchvalue != "")
          this.where('byuser.name','like','%'+searchvalue+'%').orWhere('touser.name','like','%'+searchvalue+'%');
      }).count({ rows: 'reportuser.id'});
    const report = await knexdb('reportuser').select(["reportuser.id as report_id","reportuser.report_by", "reportuser.report_to","byuser.name as by_name","touser.name as to_name", "reportuser.reported_at"]).join('users as byuser','byuser.id', '=', 'reportuser.report_by').join('users as touser','touser.id', '=', 'reportuser.report_to').where(function() {
        if(searchvalue != "")
          this.where('byuser.name','like','%'+searchvalue+'%').orWhere('touser.name','like','%'+searchvalue+'%');
      }).limit(setlimit).offset(offsetval).orderBy('report_id','desc');
    if(!report)
      return res.send({
        status: false,
        message: "Network connection error."
      });
    for (let i = 0; i < report.length; i++) {
      report[i].reported_at = util.formatDateTime(report[i].reported_at);
    }    
    return res.send({
      status: true,
      count: count[0].rows,
      filtercount: filtercount[0].rows,
      reports:report
    });
  } catch (err) {
    conole.log(err);
    common.logdata('getallreport', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}


exports.getallreport = getallreport;
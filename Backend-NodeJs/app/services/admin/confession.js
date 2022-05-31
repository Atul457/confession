const knex = require("../../config/db.js");
const common = require('../common.js');
const cryptojs = require('../../../utils/cryptojs');
const knexdb =knex.knex;

async function deleteconfession(req, res)
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
    let confession_id = (req.params.confession_id).trim();
    confession_id = cryptojs.decryptStr(confession_id);
    let confession_thoughts = await knexdb('confession_thoughts').where('id',confession_id).count({ rows: 'id'});
    if(confession_thoughts[0].rows == 0)
      return res.send({
        status: false,
        message: "Confession not found.",
      });
    let update = await knexdb('confession_thoughts').where('id', confession_id).update({status: 2, is_deleted: 1, updated_at: new Date(), updated_by: admin_id})
    return res.send({
      status: true,
      message: "Confession inactive for users",
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
    const admin_id = await common.adminTokenAuthenticate(knexdb, token);
    if(!admin_id)
      return res.send({
        status: false,
        message: "Token not found in our database."
      });
    let comment_id = (req.params.comment_id).trim();
    comment_id = cryptojs.decryptStr(comment_id);
    let confession_id = (req.params.confession_id).trim();
    confession_id = cryptojs.decryptStr(confession_id);
    let confession_thoughts = await knexdb('confession_thoughts_comments').where('id',comment_id).where('confession_id', confession_id).count({ rows: 'id'});
    if(confession_thoughts[0].rows == 0)
      return res.send({
        status: false,
        message: "Comment not found."
      });
   
    let update = await knexdb('confession_thoughts_comments').where('id', comment_id).where('confession_id', confession_id).update({is_deleted: 1,updated_at: new Date(), updated_by: admin_id});
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

exports.deleteconfession = deleteconfession;
exports.deletecomment = deletecomment;
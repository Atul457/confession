const util = require('../../utils/util');
const knex = require("../config/db.js");
const common = require('./common.js');
const knexdb =knex.knex;

async function postcomplains(req, res)
{
  try {
    if (!req.body) {
      return res.status(400).send({
        status: false,
        message: "Content can not be empty!"
      });
    }

    if(!(req.body.related_issue).trim() || !(req.body.message).trim() || (!req.headers.token && !req.body.code))
      return res.send({
        status: false,
        message: "All fields required."
      });
    const related_issue = (req.body.related_issue).trim();
    const message = (req.body.message).trim();
    let image = req.body.image;
    if(image == "")
      image = null;
    
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
    }
    
    if(req.body.code != "")
    {
      let captchaResponse = await common.verifyCaptcha(req.body.code);
      if(!captchaResponse.success)
          return res.send({
            status: false,
            message: "Failed captcha"
          });
    }

    const complainData = {
      user_id: user_id,
      related_issue: related_issue,
      message: message,
      image: image,
      status: 0,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const complainResponse = await knexdb('complains').insert(complainData);
    if(!complainResponse)
      return res.send({
        status: false,
        message:'Network connection error.'
      });
    return res.send({
      status: true,
      message:'Your complain has been created successfully.'
    });
  } catch (err) {
    common.logdata('postcomplains', err.message);
    return res.send({
      status: false,
      message: "Something went wrong."
    });
  }
}

exports.postcomplains = postcomplains;
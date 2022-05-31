const host = process.env.HOST;
const user = process.env.DBUSER;
const password = process.env.PASSWORD;
const database = process.env.DB;
const connection = {
    host,
    user,
    password,
    database
};

const knex = require('knex')({
    client: 'mysql2',
    connection
});
module.exports.knex = knex;
module.exports.filepath = process.env.SERVER_PATH;
module.exports.captcha_hostname = process.env.CAPTCHA_HOSTNAME;

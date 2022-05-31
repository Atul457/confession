const datejs = require('date-and-time');
const ordinal = require('date-and-time/plugin/ordinal');
datejs.plugin(ordinal);
function standaredFormat(date)
{
    return datejs.format(date,'MMM DDD, hh:mm A');
}

function standaredFormatTime(date)
{
    return datejs.format(date,'hh:mm A');
}

function buildResponse(statusCode, body)
{
    return {
        statusCode: statusCode,
        body: JSON.stringify(body),
    };
}

function formatCurrentDate()
{
    const d = new Date();
    const month =  addZero((d.getMonth() + 1));
    const day =  addZero(d.getDate());
    const year = d.getFullYear();
    
    return [year, month, day].join('-');
}

function formatDate(date)
{
    const d = new Date(date);
    const month =  addZero((d.getMonth() + 1));
    const day =  addZero(d.getDate());
    const year = d.getFullYear();
    
    return [year, month, day].join('-');
}

function formatDateTime(datetime)
{
    const d = new Date(datetime);
    const month =  addZero((d.getMonth() + 1));
    const day =  addZero(d.getDate());
    const year = d.getFullYear();
    
    const h = addZero(d.getHours());
    const m = addZero(d.getMinutes());
    const s = addZero(d.getSeconds());
    return [year, month, day].join('-')+' '+h+':'+m+':'+s;
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function random_number() {
    const minm = 100000;
    const maxm = 999999;
    return Math.floor(Math
    .random() * (maxm - minm + 1)) + minm;
}

async function updateTeamPoint(knex, team_id)
{
    const teamData = await knex("team_members").innerJoin('users',function() {
            this.on('users.id', '=', 'team_members.user_id');
        }).sum({ points: 'users.points'}).where('team_members.team_id','=',team_id);
    await knex('teams').where('id','=',team_id).update({points: teamData[0].points});
    return true
}
module.exports.buildResponse = buildResponse;
module.exports.formatDateTime = formatDateTime;
module.exports.formatDate = formatDate;
module.exports.formatCurrentDate = formatCurrentDate;
module.exports.random_number = random_number;
module.exports.updateTeamPoint = updateTeamPoint;
module.exports.standaredFormat = standaredFormat;
module.exports.standaredFormatTime = standaredFormatTime;
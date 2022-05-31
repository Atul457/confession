require('../../utils/logger');
const util = require('../../utils/util');
const request = require('request');
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');

async function verifyCaptcha(code)
{
  const options = {
    'method': 'POST',
    'url': 'https://www.google.com/recaptcha/api/siteverify',
    'json': true,
    'headers': {
    },
    formData: {
      'secret': process.env.GOOGLE_RECAPTCHA_KEY,
      'response': code
    }
  };
  return new Promise(function (resolve, reject) {
    request(options, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

async function tokenAuthenticate(knexdb, token)
{
  if(!token)
    return false;
  const authResponse = await knexdb('auth').innerJoin('users',function() {
    this.on('users.id', '=', 'auth.user_id');
  }).select(['user_id']).where('token',token).where('status',1);
  if(!authResponse || !authResponse.length)
    return false;
  return authResponse[0].user_id;
}

async function adminTokenAuthenticate(knexdb, token)
{
  if(!token)
    return false;
  const adminAuthResponse = await knexdb('admin_auth').select(['user_id']).where('token',token);
  if(!adminAuthResponse || !adminAuthResponse.length)
    return false;
  return adminAuthResponse[0].user_id;
}

async function logdata(apiname, data)
{
  console.file(`log/log-${util.formatCurrentDate()}.log`);
  console.log(`${new Date()} ${apiname}`);
  console.log(`${data}\n`);
  console.file();
}

async function sendemail($to, $subject, $html)
{
  /*let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });*/
  const transport = nodemailer.createTransport(
    nodemailerSendgrid({
      apiKey: process.env.SENDGRID_API_KEY
    })
  );
  var mailOptions = {
    from: process.env.EMAIL_FROM,
    to: $to,
    subject: $subject,
    html: $html
  };
  
  transport.sendMail(mailOptions, function(error, info){
    if (error)
      logdata("sendemail", error);
  }); 
}

async function getDisplayName()
{
  const tempnames = ["Cinnamon","Alder","Almond","Ambrosia","Amy root","Apple","Apricot","Arfaj","Arizona sycamore","Arrowwood","Ash","Azolla","Bamboo","Banana","Baobab","Bay","Bean","Bear corn","Bearberry","Beech","Bindweed","Birch","Bird's nest plant","Bird's nest","Bittercress","Bittersweet","Bitterweed","Black cap","Black","Black","Blackberry","Blackhaw","Blackiehead","Blue","Blueberry","Bow","Box","Boxelder","Boxwood","Brier","Brittlebush","Broadleaf","Brown Betty","Brown","Buckeye (California buckeye)","Buffalo weed","Butterfly flower","Butterfly weed","Cabbage","California bay","California buckeye","California sycamore","California walnut","Canada root","Cancer jalap","Carrot weed","Carrot","Cart track plant","Catalina ironwood","Cherry","Chestnut","Chigger flower","Chrysanthemum","Clove","Clover","Coakum","Coconut","Coffee plant","Colic weed","Collard","Colwort","Coneflower","Cornel","Cornelian tree","Corydalis","Cotton plant","Creeping yellowcress","Cress","Crow's nest","Crow's toes","Crowfoot","Cucumber","Daisy","Deadnettle","Devil's bite","Devil's darning needle","Devil's nose","Devil's plague","Dewberry","Dindle","Dogwood","Drumstick","Duck retten","Duscle","Dye","Earth gall","English bull's eye","Eucalyptus","Extinguisher moss","Eytelia","Fair","Fairymoss Azolla caroliniana","Fellenwort","Felonwood","Felonwort","Fennel","Ferns","Feverbush","Feverfew","Fig","Flax","Flowering Dogwood","Fluxroot","Fumewort","Gallberry","Garget","Garlic","Garlic mustard","Garlic root","Gilliflower","Golden Jerusalem","Golden buttons","Goldenglow","Goose tongue","Gordaldo","Grapefruit","Grapevine","Groundberry","Gutweed","Haldi","Harlequin","Hay fever weed","Healing blade","Hedge plant","Hellebore","Hemp dogbane","Hemp","Hen plant","Herb barbara","Hogweed","Holly","Horse cane","Hound's berry","Houseleek","Huckleberry","Indian hemp","Indian paintbrush","Indian posy","Inkberry","Isle of Man cabbage","Itchweed","Ivy","Jack","Jack","Juneberry","Juniper","Keek","Kinnikinnik","Kousa","Kudzu","Laceflower","Lamb's foot","Lavender","Leek","Lemon","Lettuce","Lilac","Love vine","Maize","Mango","Maple","Mesquite","Milfoil","Milkweed","Milky tassel","Moosewood","Morel","Mosquito plant","Mother","Mountain mahogany","Mulberry","Neem","Nettle","Nightshade","Nosebleed","Oak tree","Olive","Onion","Orange","Orange","Osage","Osier","Parsley","Parsnip","Pea","Peach","Peanut","Pear","Pellitory","Penny hedge","Pepper root","Pigeon berry","Pine","Pineapple","Pistachio","Plane (European sycamore)","Plantain","Pleurisy root","Pocan bush","Poison ivy","Poisonberry","Poisonflower","Poke","Pokeroot","Pokeweed","Polecat weed","Polkweed","Poor Annie","Poor man's mustard","Poplar","Poppy","Possumhaw","Potato","Pudina","Queen Anne's lace","Quercitron","Radical weed","Ragweed","Ragwort","Rantipole","Rapeseed","Raspberry","Red ink plant","Redbrush","Redbud","Redweed","Rheumatism root","Rhubarb","Ribwort","Rice","Roadweed","Rocket","Rocketcress","Rose","Rosemary","Rye","Saffron crocus","Sanguinary","Saskatoon","Sauce","Scarlet berry","Scoke","Scotch cap","Scrambled eggs","Scurvy grass","Serviceberry","Shadblow","Shadbush","Silkweed","Skunkweed","Snakeberry","Sneezeweed","Sneezewort","Snowdrop","Soldier's woundwort","Sorrel","Speedwell","Spoolwood","Squaw bush","Stag bush","Stammerwort","Star","Stickweed","Strawberry tree 'Marina'","Strawberry tree","Strawberry","Sugarcane","Sugarplum","Sunflower","Swallow","Swallow","Sweet potato vine","Sweet potato","Swinies","Sycamore","Tansy","Tassel weed","Tea","Thimbleberry","Thimbleweed","Thistle","Thousand","Thousand","Thyme","Tickleweed","Tobacco plant","Tomato","Toothwort","Touch","Traveller's joy","Tread","Tree tobacco","Trillium","Tuber","Tulip","Tulsi","Vanilla orchid","Viburnum","Violet bloom","Violet","Virgin's bower","Walnut","Walnut","Waybread","Western redbud","Wheat","White man's foot","White","Wild cotton","Wild hops","Willow","Windroot","Wineberry","Winterberry","Wintercress","Woodbine","Wormwood","Wound rocket","Yam","Yarrow","Yellow coneflower","Yellow fieldcress","Yellowwood","Zedoary","Buckeye"];
  const randIndex = Math.floor(Math.random() * (tempnames.length - 1)) + 1;
  return temp_name = tempnames[randIndex];
}
exports.tokenAuthenticate = tokenAuthenticate;
exports.adminTokenAuthenticate = adminTokenAuthenticate;
exports.logdata = logdata;
exports.verifyCaptcha = verifyCaptcha;
exports.sendemail = sendemail;
exports.getDisplayName = getDisplayName;
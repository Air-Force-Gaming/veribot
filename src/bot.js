require('dotenv').config();

const eris = require('eris');
const webhookListener = require('./server.js');
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;
const ROLE_NAME = process.env.ROLE_NAME;
const ROLE_REMOVE = process.env.ROLE_REMOVE;

const bot = new eris.Client(process.env.DISCORD_API_TOKEN);

async function updateMemberRoleForVerification(guild, member, component) {
  // If the user is verified on verify.airforcegaming.com they will be granted verified role.

  //wants ID number not name for some reason
  if (guild && member) {
    // Get the role
    let roleAdd = Array.from(guild.roles.values())
      .find(role => role.name === ROLE_NAME);

    let roleComponent = Array.from(guild.roles.values())
      .find(role => role.name === component);


    let roleRemove = Array.from(guild.roles.values())
      .find(role => role.name === ROLE_REMOVE);

    // Add the role to the user, along with an explanation
    // for the guild log (the "audit log").
    member.addRole(roleAdd.id, 'Verified with Air Force Gaming!');
    member.addRole(roleComponent.id, 'Verified with Air Force Gaming!');
    member.removeRole(roleRemove.id, 'Verified with Air Force Gaming!');

    return;
  }
}

function findUserInString(str) {
  const lowercaseStr = str.toLowerCase();
  // Look for a username in the form of username#discriminator.
  const user = bot.users.find(
    user => lowercaseStr.indexOf(`${user.username.toLowerCase()}#${user.discriminator}`) !== -1,
  );
  return user;
}

function logVerification(member, email, realName, discName, component) {
  const isKnownMember = !!member;
  const memberName = isKnownMember ? `${member.username}#${member.discriminator}` : 'Unknown';
  const embedColor = isKnownMember ? 0x00ff00 : 0xff0000;
  let timestamp = new Date();

  timestamp = timestamp.toISOString();

  const logMessage = {
    embed: {
      title: 'Verification processed',
      color: embedColor,
      timestamp: timestamp,
      fields: [
        { name: 'Email', value: email, inline: true },
        { name: 'User\'s Real Name', value: realName, inline: true },
        { name: 'Discord name', value: memberName, inline: true },
        { name: 'Component', value: component, inline: true },

      ],
    }
  }

  bot.createMessage(LOG_CHANNEL_ID, logMessage);
}

async function onVerify(
  email,
  realName,
  discName,
  component,
) {
  try {
    const user = findUserInString(discName);
    const guild = user ? bot.guilds.find(guild => guild.members.has(user.id)) : null;
    const guildMember = guild ? guild.members.get(user.id) : null;

    return await Promise.all([
      updateMemberRoleForVerification(guild, guildMember, component),
      logVerification(guildMember, email, realName, discName, component),
    ]);
  } catch (err) {
    console.warn('Error updating verify role and logging verification');
    console.warn(err);
  }
}

webhookListener.on('verification', onVerify);

bot.connect();

bot.on('error', err => {
  console.warn(err);
});

//Public functions
const test = () => {
  console.log('Connection to bot.js solid!');

}

// self verification for limited access with single code
bot.on("messageCreate", (msg) => {
  const guild = msg.member ? bot.guilds.find(guild => guild.members.has(msg.member.id)) : null;
  const lowMsg = msg.content.toLowerCase();
  if (lowMsg.includes("osanqr20")) {
    let roleAdd = Array.from(guild.roles.values())    
    .find(role => role.name === 'AiT');

    msg.member.addRole(roleAdd.id, 'Added Osan Quarantine Role!');
    msg.delete('Prune join code');

    bot.createMessage(msg.channel.id, msg.member.mention + " Quarantine role added!");
    bot.createMessage('716213574036488235', 'Please welcome ' + msg.member.mention + ' to our community!');
    bot.createMessage(LOG_CHANNEL_ID, msg.member.mention + ' has joined from Osan.');
   
  }

});
/*
// self verification for limited access using switch
bot.on("messageCreate", (msg) => {
  const guild = msg.member ? bot.guilds.find(guild => guild.members.has(msg.member.id)) : null;
  const lowMsg = msg.content.toLowerCase();
  let roleAdd = Array.from(guild.roles.values()).find(role => role.id === '717716131498033152');
  // .find(role => role.name === 'AiT');
  try {
    switch (lowMsg) {
      case 'osanqr20':
        msg.member.addRole(roleAdd.id, 'Added Osan Quarantine Role!');
        msg.delete('Prune join code');
        bot.createMessage('716213574036488235', 'Please welcome ' + msg.member.mention + ' from Osan AB!');
        //bot.createMessage('699304600175378445', 'Please welcome ' + msg.member.mention + ' from Osan AB!');
         bot.createMessage(LOG_CHANNEL_ID, msg.member.mention + ' has joined from Osan.');
        //bot.createMessage('700106834010439783', msg.member.mention + ' has joined from Osan.');
        
        break;
      case 'shep82':
        msg.member.addRole(roleAdd.id, 'Added AiT Role!');
        msg.delete('Prune join code');
        bot.createMessage('716213574036488235', 'Please welcome ' + msg.member.mention + ' from Sheppard AFB!');
        //bot.createMessage('699304600175378445', 'Please welcome ' + msg.member.mention + ' from Sheppard AFB!');
         bot.createMessage(LOG_CHANNEL_ID, msg.member.mention + ', AiT, has joined from Sheppard AFB.');
        //bot.createMessage('700106834010439783', msg.member.mention + ', AiT, has joined from Sheppard AFB.');
        break;
      case 'ftsam59':
        msg.member.addRole(roleAdd.id, 'Added AiT Role!');
        msg.delete('Prune join code');
        bot.createMessage('716213574036488235', 'Please welcome ' + msg.member.mention + ' from Fort Sam!');
        //bot.createMessage('699304600175378445', 'Please welcome ' + msg.member.mention + ' from Fort Sam!');
         bot.createMessage(LOG_CHANNEL_ID, msg.member.mention + ', AiT, has joined from Fort Sam.');
        //bot.createMessage('700106834010439783', msg.member.mention + ', AiT, has joined from Fort Sam.');
        break;
      case 'kees81':
        msg.member.addRole(roleAdd.id, 'Added AiT Role!');
        msg.delete('Prune join code');
        bot.createMessage('716213574036488235', 'Please welcome ' + msg.member.mention + ' from Keesler AFB!'); 
        //bot.createMessage('699304600175378445', 'Please welcome ' + msg.member.mention + ' from Keesler AFB!');
         bot.createMessage(LOG_CHANNEL_ID, msg.member.mention + ', AiT, has joined from Keesler AFB.');
        //bot.createMessage('700106834010439783', msg.member.mention + ', AiT, has joined from Keesler AFB.');
        break;
      case 'ftlee345':
        msg.member.addRole(roleAdd.id, 'Added AiT Role!');
        msg.delete('Prune join code');
        bot.createMessage('716213574036488235', 'Please welcome ' + msg.member.mention + ' from Fort Lee!');
        //bot.createMessage('699304600175378445', 'Please welcome ' + msg.member.mention + ' from Fort Lee!');
         bot.createMessage(LOG_CHANNEL_ID, msg.member.mention + ', AiT, has joined from Fort Lee.');
        //bot.createMessage('700106834010439783', msg.member.mention + ', AiT, has joined from Fort Lee.');
        break;
      default:
    }  
 }catch (err) {
  console.warn('Error updating verify role and logging verification from user input codes');
    console.warn(err);
 }
});
*/
//module.exports = bot;
exports.test = test;


require('dotenv').config();
const eris = require('eris');

// Create a Client instance with our bot token.
const bot = new eris.Client(process.env.DISCORD_API_TOKEN);

// Defining a prefix for bot commands
const PREFIX = 'vb!';

const commandHandlerForCommandName = {};
commandHandlerForCommandName['addpayment'] = (msg, args) => {
    const mention = args[0];
    const amount = parseFloat(args[1]);

    // TODO: Handle invalid command arguments, such as:
    // 1. No mention or invalid mention.
    // 2. No amount or invalid amount.

    return msg.channel.createMessage(`${mention} paid $${amount.toFixed(2)}`);
    // 3. CHANGE TO VERIFY

    // 4. add help command
}


// When the bot is connected and ready, log to console.
bot.on('ready', () => {
   console.log('Connected to discord server.');
});

// Every time a message is sent anywhere the bot is present,
// this event will fire and we will check if the bot was mentioned.
// If it was, the bot will attempt to respond with "Present".
bot.on('messageCreate', async (msg) => {
   const botWasMentioned = msg.mentions.find(
       mentionedUser => mentionedUser.id === bot.user.id,
   );

   const content = msg.content;
    // Ignore any messages sent as a DM
   if (!msg.channel.guild) {
       return;
   }

   // Ignore messages that don't start with the correct prefix
   if (!content.startsWith(PREFIX)) {
       return;
   }

   // Extract the parts of the command and command name
   const parts = content.split(' ').map(s => s.trim()).filter(s => s);
   const commandName = parts[0].substr(PREFIX.length);

   // Get appropriate handler for the command, if there is one.
   const commandHandler = commandHandlerForCommandName[commandName];
   if (!commandHandler) {
       return;
   }

   // Separate the command arguments from the command prefix and command name
   const args = parts.slice(1);

   try {
       // Execute the command
       await commandHandler(msg, args);
   } catch (err) {
       console.warn('Error handling command');
       console.warn(err);
   }

   if (botWasMentioned) {
       try {
           await msg.channel.createMessage('Present');
       } catch (err) {
           // There are various reasons why sending a message may fail.
           // The API might time out or choke and return a 5xx status,
           // or the bot may not have permission to send the
           // message (403 status).
           console.warn('Failed to respond to mention.');
           console.warn(err);
       }
   }
});

/*--- temp code tying to get roles assigned ---
//code to get role id
//console.log(guild.roles.values("name", "✔️"));

let member = '132505636016619520'
let guildId = '699304600175378442'
let roleId = '699967041842446388'
//bot.addGuildMemberRole(guildId, member, roleId, "test");
//bot.editGuildMember('699304600175378442','132505636016619520',options.roles = ["✔️"],"test");
//member.addRole(roleId).catch(console.error);

console.log(bot.guilds)
*/


bot.on('error', err => {
   console.warn(err);
});

bot.connect();



//Public functions
const test = () => {
    console.log('Connection to bot.js solid!');

}

//module.exports = bot;
exports.test = test;
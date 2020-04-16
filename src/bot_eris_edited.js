
require('dotenv').config();
const eris = require('eris');

// Create a Client instance with our bot token.
const bot = new eris.Client(process.env.DISCORD_API_TOKEN);

// Defining a prefix for bot commands
const PREFIX = 'vb!';



bot.on('error', err => {
    console.warn(err);
});

bot.connect();


const verifiedRole = {
    name: 'testrole',
    color: 0x6aa84f,
    hoist: true, // Show users with this role in their own section of the member list.
};

async function updateMemberRoleForVerification(guild, member) {
    // If the user is verified, give them the verified role.
    if (guild && member ) {
        // Get the role, or if it doesn't exist, create it.
        let role = Array.from(guild.roles.values())
            .find(role => role.name === verifiedRole.name);

        if (!role) {
            role = await guild.createRole(verifiedRole);
        }

        // Add the role to the user, along with an explanation
        // for the guild log (the "audit log").
        return member.addRole(role.id, 'Officially verified user.');
    }
}

const commandForName = {};
commandForName['addverify'] = {
    botOwnerOnly: true,
    execute: (msg, args) => {
        const mention = args[0];
        const amount = parseFloat(args[1]);
        const guild = msg.channel.guild;
        const userId = mention.replace(/<@(.*?)>/, (match, group1) => group1);
        const member = guild.members.get(userId);

        const userIsInGuild = !!member;
        if (!userIsInGuild) {
            return msg.channel.createMessage('User not found in this guild.');
        }
        /*
        const amountIsValid = amount && !Number.isNaN(amount);
        if (!amountIsValid) {
            return msg.channel.createMessage('Invalid donation amount');
        }
        */

        return Promise.all([
            msg.channel.createMessage(`${mention} paid $${amount.toFixed(2)}`),
            updateMemberRoleForVerification(guild, member, amount),
        ]);
    },
};

bot.on('messageCreate', async (msg) => {
    try {
        const content = msg.content;

        // Ignore any messages sent as direct messages.
        // The bot will only accept commands issued in
        // a guild.
        if (!msg.channel.guild) {
            return;
        }

        // Ignore any message that doesn't start with the correct prefix.
        if (!content.startsWith(PREFIX)) {
            return;
        }

        // Extract the name of the command
        const parts = content.split(' ').map(s => s.trim()).filter(s => s);
        const commandName = parts[0].substr(PREFIX.length);

        // Get the requested command, if there is one.
        const command = commandForName[commandName];
        if (!command) {
            return;
        }

        // If this command is only for the bot owner, refuse
        // to execute it for any other user.
        const authorIsBotOwner = msg.author.id === BOT_OWNER_ID;
        if (command.botOwnerOnly && !authorIsBotOwner) {
            return await msg.channel.createMessage('Hey, only my owner can issue that command!');
        }

        // Separate the command arguments from the command prefix and name.
        const args = parts.slice(1);

        // Execute the command.
        await command.execute(msg, args);
    } catch (err) {
        console.warn('Error handling message create event');
        console.warn(err);
    }
});

bot.on('error', err => {
    console.warn(err);
});

function findUserInString(str) {
    const lowercaseStr = str.toLowerCase();
    // Look for a username in the form of username#discriminator.
    const user = bot.users.find(
        user => lowercaseStr.indexOf(`${user.username.toLowerCase()}#${user.discriminator}`) !== -1,
    );
    return user;
}

function logDonation(member, donationAmount, verifySource, senderName, message, timestamp) {
    const isKnownMember = !!member;
    const memberName = isKnownMember ? `${member.username}#${member.discriminator}` : 'Unknown';
    const embedColor = isKnownMember ? 0x00ff00 : 0xff0000;

    const logMessage = {
        embed: {
            title: 'Verification received',
            color: embedColor,
            timestamp: timestamp,
            fields: [
                { name: 'Verified Source', value: verifySource, inline: true },
                
                { name: 'Sender', value: senderName, inline: true },
                { name: 'User Discord name', value: memberName, inline: true },
                
                { name: 'Message', value: message, inline: true },
            ],
        }
    }

    bot.createMessage(LOG_CHANNEL_ID, logMessage);
}
//was onDonation
async function onVerification(
    verifySource,
    
    timestamp,
    senderName,
    message,
) {
    try {
        const user = findUserInString(message);
        const guild = user ? bot.guilds.find(guild => guild.members.has(user.id)) : null;
        const guildMember = guild ? guild.members.get(user.id) : null;

        return await Promise.all([
            updateMemberRoleForVerification(guild, guildMember),
            logDonation(guildMember, verifySource, senderName, message, timestamp),
        ]);
    } catch (err) {
        console.warn('Error updating donor role and logging verification');
        console.warn(err);
    }
}

webhookListener.on('verification', onVerification);

//Public functions
const test = () => {
    console.log('Connection to bot.js solid!');

}

//module.exports = bot;
exports.test = test;
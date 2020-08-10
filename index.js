// Modules:
const fs = require("fs");
const Discord = require('discord.js');
const bot = new Discord.Client();
const Canvas = require("discord-canvas");
const randomImageJs = require('random-image-js');
const db = require('quick.db');

// Databses:
const config = require('./storages/config.json');
const guildConf = require('./storages/guildConf.json');
const guildBlacklists = require('./storages/guildBlacklists.json');
const snipes = {};
const quiz = require('./storages/quiz.json');

// Other:
const talkedRecently = new Set();
const banned = new Set();
const availableCommands = ['number', 'pp', 'coin', '8ball', 'prefix', 'goodbye', 'welcome', 'blacklist', 'snipe', 'info', 'ping', 'serverinfo', 'whois', 'purge', 'kill', 'dad', 'quiz', 'jfgi', 'justgoogleit', 'anime', 'hentai', 'cat', 'porn', 'dog', 'memes', 'cute', 'reddit', 'help', 'enable', 'disable', 'disabled', 'commands', 'dad', 'antilinks'];
const botVersion = 'BETA v0.01';

// Add banned users:
const bannedList = [];
bannedList.forEach(item => banned.add(item));

bot.on('ready', () => {
    console.log('=======================');
    console.log('')
    var currentdate = new Date(); 
    var datetime = "Date Time: " + currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/" 
        + currentdate.getFullYear() + " @ "  
        + currentdate.getHours() + ":"  
        + currentdate.getMinutes() + ":" 
        + currentdate.getSeconds();
    console.log(datetime);
    console.log('Strawbery bot launched...');
    console.log('');
    console.log('=======================');
    bot.user.setStatus('online');
    bot.user.setActivity(`@me | Being sweet in ${bot.guilds.cache.size} servers`, { type: 'PLAYING' })
    .catch(console.error);
});

bot.on('guildCreate', (guild) => {
    if (!guildConf[guild.id]) {
	guildConf[guild.id] = {
        prefix: config.prefix,
        welcomeChannelID: false, // Welcome image channel ID
        goodbyeChannelID: false, // Goodbye image channel ID
        welcomeMessage: false, // Welcome message. ( If not false, then true )
        goodbyeMessage: false, // Goodbye message. ( If not false, then true )
        disabled: [],
        dad: false,
        links: true
	}
    }
     fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
     	if (err) console.log(err)
    })

    if (!guildBlacklists[guild.id]) {
    guildBlacklists[guild.id] = {
        blacklist: []
    }
    }
     fs.writeFile('./storages/guildBlacklists.json', JSON.stringify(guildBlacklists, null, 2), (err) => {
         if (err) console.log(err)
    })

    const welcomeChannel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
    welcomeChannel.send("Thanks for invite me!\nDo `s!prefix <New prefix>` to change my prefix and `s!help` for more info!")
});

bot.on('guildDelete', (guild) => {
     delete guildConf[guild.id];
     fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
     	if (err) console.log(err)
    })

    delete guildBlacklists[guild.id];
    fs.writeFile('./storages/guildBlacklists.json', JSON.stringify(guildBlacklists, null, 2), (err) => {
        if (err) console.log(err)
   })
});

bot.on("messageDelete", (message) => {
    snipes[message.channel.id] = {
        content: message.content,
        author: message.member
    };

    setTimeout(() => {
        delete snipes[message.channel.id];
    }, 60000);
});

bot.on('guildMemberAdd', async member => {
    if (guildConf[member.guild.id].welcomeChannelID != false){
        const channel = member.guild.channels.cache.find(ch => ch.id === `${guildConf[member.guild.id].welcomeChannelID}`)
        if (guildConf[member.guild.id].welcomeMessage != false){
            let message = guildConf[member.guild.id].welcomeMessage;
            message = message.replace(new RegExp('{mention}', 'g'), `${member}`);
            message = message.replace(new RegExp('{server}', 'g'), `${member.guild.name}`);
            message = message.replace(new RegExp('{discriminator}', 'g'), `${member.user.discriminator}`);
            message = message.replace(new RegExp('{name}', 'g'), `${member.displayName}`);
            channel.send(`${message}`).catch((error) => {
                channel.send('**ERROR** **PLEASE CHANGE MESSAGE** **ERROR**')
                channel.send(`Error (Please send to DEV): \`\`\`js\n${error}\`\`\``)
            });
        };
    };
});

bot.on('guildMemberRemove', async member => {
    if (guildConf[member.guild.id].goodbyeChannelID != false){
        const channel = member.guild.channels.cache.find(ch => ch.id === `${guildConf[member.guild.id].goodbyeChannelID}`);
        if (guildConf[member.guild.id].goodbyeMessage != false){
            let message = guildConf[member.guild.id].goodbyeMessage;
            message = message.replace(new RegExp('{mention}', 'g'), `${member}`);
            message = message.replace(new RegExp('{server}', 'g'), `${member.guild.name}`);
            message = message.replace(new RegExp('{discriminator}', 'g'), `${member.user.discriminator}`);
            message = message.replace(new RegExp('{name}', 'g'), `${member.displayName}`);
            channel.send(`${message}`).catch((error) => {
                channel.send('**ERROR** **PLEASE CHANGE MESSAGE** **ERROR**')
                channel.send(`Error (Please send to DEV): \`\`\`js\n${error}\`\`\``)
            });
        };
    };
});

bot.on('message', async message => {
	var msg = message.content.toLowerCase();
    if (message.channel.type === "dm" || message.author.bot || message.author === bot.user) return;
    var args = msg.split(' ').slice(1);
    var command = msg.split(' ')[0].replace(guildConf[message.guild.id].prefix, '');
	
    if (message.mentions.has(bot.user)){
        message.channel.send(`My prefix is \`${guildConf[message.guild.id].prefix}\`\nDo \`${guildConf[message.guild.id].prefix}help\` for help.`);
    };

    let blacklist = guildBlacklists[message.guild.id].blacklist;
    var i;
    for (i = 0; i < blacklist.length; i++) {
        if (!message.member.hasPermission('MANAGE_GUILD')){
            if (message.content.includes(`${blacklist[i]}`)){
                message.reply('don\'t say that word!');
                message.author.send(`Don\'t say \`${blacklist[i]}\` in \`${message.guild.name}\`!`);
            };
        };
    };

    if (msg.startsWith('im')) if (guildConf[message.guild.id].dad) return message.channel.send(`Hi${msg.replace('im','')}, im Dad!`);

    if (!guildConf[message.guild.id].links && !message.member.hasPermission('MANAGE_GUILD')){
        if (msg.includes("https://")) {
            message.delete();
            message.channel.send("No links here, " + message.member);
        };
        if (msg.includes("http://")) {
            message.delete();
            message.channel.send("No links here, " + message.member);
        };
        if (msg.includes("www.")) {
            message.delete();
            message.channel.send("No links here, " + message.member);
        };
    };

    if (!msg.startsWith(guildConf[message.guild.id].prefix)) return;
	
	var cooldownTime = 5000;
	function cooldownMessage(m){
		const cooldownEmbed = new Discord.MessageEmbed()
		.setColor('RANDOM')
		.setTitle('Please wait')
		.setDescription(`${m} please wait 5 seconds untill executing another command!`)
		.setFooter(`Bot created by 𝐙𝐞𝐫𝐨 𝐭𝐰𝐨#0265 | Currently in ${bot.guilds.cache.size} servers`);
        message.channel.send(cooldownEmbed);
    };

    var i;
    for (i = 0; i < guildConf[message.guild.id].disabled.length; i++) {
        if (command === guildConf[message.guild.id].disabled[i]){
            return;
        };
    };

    if (banned.has(message.author.id)) return message.reply('ok banned person.');

    if (command === 'help'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {

            if (!args[0]){
                var commandList = '`' + availableCommands.toString().replace(new RegExp(',', 'g'), '`, `') + '`';
                const helpEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setAuthor('Command list', bot.user.avatarURL())
                .setDescription(`**Type \`${guildConf[message.guild.id].prefix}help <command>\` for more info about that command.**
    
[Add me to your server!](https://discordapp.com/oauth2/authorize?client_id=726065453591560262&scope=bot&permissions=8)
[Join the Strawberry server!](https://discord.gg/kEnspZc) (updates, bug reports, support and more)`)
                .addFields(
                    { name: 'Random:', value: '\`number\`, \`pp\`, \`coin\`, \`8ball\`', inline: true },
                    { name: 'Reddit:', value: '\`anime\`, \`reddit\`, \`meme\`, \`porn\`, \`dog\`, \`memes\`, \`cute\`', inline: true },
                    { name: 'Fun:', value: '\`kill\`, \`dad\`, \`quiz\`, \`justgoogleit\`', inline: true },
                    { name: 'Utility:', value: '\`snipe\`, \`info\`, \`ping\`, \`serverinfo\`, \`whois\`, \`purge\`, \`commands\`', inline: true },
                    { name: 'Settings:', value: '\`blacklist\`, \`welcome\`, \`goodbye\`, \`prefix\`, \`disabled\`, \`disable\`, \`enable\`, `dad`, `antilinks`', inline: true },
                    { name: 'All commands:', value: commandList, inline: false},
                )
                .setFooter(`Bot created by 𝐙𝐞𝐫𝐨 𝐭𝐰𝐨#0265 | Currently in ${bot.guilds.cache.size} servers`);
                message.channel.send(helpEmbed);
            } else {
                if (args[0] === 'number'){
                    message.channel.send('**Number command**\nGives you a random number between 0 and <args>');
                } else if (args[0] === 'pp'){
                    message.channel.send('**Coin command**\nFlips a coin. Duh')
                } else if (args[0] === 'coin'){
                    message.channel.send('**Coin command**\nFlips a coin. Duh')
                } else if (args[0] === '8ball'){
                    message.channel.send('**Coin command**\nFlips a coin. Duh')
                } else if (args[0] === 'Goodbye'){
                    message.channel.send('**Coin command**\nFlips a coin. Duh')
                } else if (args[0] === 'Welcome'){
                    message.channel.send('**Coin command**\nFlips a coin. Duh')
                } else if (args[0] === 'Blacklist'){
                    message.channel.send('**Coin command**\nFlips a coin. Duh')
                } else if (args[0] === 'coin'){
                    message.channel.send('**Coin command**\nFlips a coin. Duh')
                } else if (args[0] === 'coin'){
                    message.channel.send('**Coin command**\nFlips a coin. Duh')
                } else {
                    message.channel.send('Invalid command!')
                }
            };
            talkedRecently.add(message.author.id);
            setTimeout(() => {
				talkedRecently.delete(message.author.id);
            }, cooldownTime);
        };
    };

    if (command === 'commands'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {
        var commandList = '`' + availableCommands.toString().replace(new RegExp(',', 'g'), '`, `') + '`';
            message.channel.send('**All commands:** ' + commandList);
            talkedRecently.add(message.author.id);
            setTimeout(() => {
                talkedRecently.delete(message.author.id);
            }, cooldownTime);
        }
    };

    if (command === 'disabled'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {
            var commandList = '`' + guildConf[message.guild.id].disabled.toString().replace(new RegExp(',', 'g'), '`, `') + '`';
            message.channel.send('**Disabled commands:** ' + commandList);
            talkedRecently.add(message.author.id);
            setTimeout(() => {
                talkedRecently.delete(message.author.id);
            }, cooldownTime);
        }
    };

    if (command === 'disable'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {
            if (!args[0]) return message.channel.send(`What commands are you adding? Do \`${guildConf[message.guild.id].prefix}commands\` for all of the commands!`);

            var i;
            for (i = 0; i < availableCommands.length; i++) {
                if (args[0] === availableCommands[i]){
                    guildConf[message.guild.id].disabled.push(args[0]);
                    let unique = [...new Set(guildConf[message.guild.id].disabled)];
                    guildConf[message.guild.id].disabled = Array.from(unique);
                    fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
                        if (err) console.log(err);
                    });
                    message.channel.send(`Added \`${args[0]}\` to the disabled commands!`);
                    return;
                };
            };
            message.channel.send('Invalid command! ' + `Do \`${guildConf[message.guild.id].prefix}commands\` for all of the commands!`);
            talkedRecently.add(message.author.id);
            setTimeout(() => {
				talkedRecently.delete(message.author.id);
            }, cooldownTime);
		
		};
    };

    if (command === 'enable'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {
            if (args[0]){
                let value = args[0];
                var i;
                for (i = 0; i < guildConf[message.guild.id].disabled.length; i++) {
                    if (args[0] === guildConf[message.guild.id].disabled[i]){
                        guildConf[message.guild.id].disabled = guildConf[message.guild.id].disabled.filter(item => item !== value);
                        message.channel.send(`Removed \`${args[0]}\` from the disabled commands!`);
                        fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
                            if (err) console.log(err);
                        });
                        talkedRecently.add(message.author.id);
                        setTimeout(() => {
                            talkedRecently.delete(message.author.id);
                        }, cooldownTime);
                        return;
                    };
                };
                message.channel.send('Imagine tryin to enable a command that\'s not disabled **lmao**.');
            } else {
                message.channel.send('Imagine tryin to enable nothing.');
            };
            talkedRecently.add(message.author.id);
            setTimeout(() => {
				talkedRecently.delete(message.author.id);
            }, cooldownTime);
		
		}
    };

    if (command === 'dad'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {
            if (guildConf[message.guild.id].dad){
                guildConf[message.guild.id].dad = false;
                message.channel.send('Dad left to go get the milk. ( Disabled )');
                fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
                    if (err) console.log(err);
                });
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                    talkedRecently.delete(message.author.id);
                }, cooldownTime);
                return;
            };
            if (!guildConf[message.guild.id].dad){
                guildConf[message.guild.id].dad = true;
                message.channel.send('Dad came back and he is feeling super corny');
                fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
                    if (err) console.log(err);
                });
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                    talkedRecently.delete(message.author.id);
                }, cooldownTime);
                return;
            };
		
		}
    };

    if (command === 'antilinks'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {
            if (guildConf[message.guild.id].links){
                guildConf[message.guild.id].links = false;
                message.channel.send('Links disabled!');
                fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
                    if (err) console.log(err);
                });
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                    talkedRecently.delete(message.author.id);
                }, cooldownTime);
                return;
            };
            if (!guildConf[message.guild.id].links){
                guildConf[message.guild.id].links = true;
                message.channel.send('Links enabled!');
                fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
                    if (err) console.log(err);
                });
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                    talkedRecently.delete(message.author.id);
                }, cooldownTime);
                return;
            };
		
		}
    };

    if (command === 'blacklist'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {
            if (!args[0]){
                message.channel.send('Available commands: `add`, `clear`, `list`');
            } else {
                if (args[0] === 'add'){
                    if (message.member.hasPermission('MANAGE_GUILD')){
                        if (!args[1]){
                            message.channel.send('What are you adding to the blacklist?')
                        } else {
                            var newBlacklist = message.content.replace(`${guildConf[message.guild.id].prefix}blacklist add `, '');
                            guildBlacklists[message.guild.id].blacklist.push(`${newBlacklist}`);
                            let unique = [...new Set(guildBlacklists[message.guild.id].blacklist)];
                            guildBlacklists[message.guild.id].blacklist = Array.from(unique);
                            fs.writeFile('./storages/guildBlacklists.json', JSON.stringify(guildBlacklists, null, 2), (err) => {
                                if (err) console.log(err)
                            })
                            message.channel.send(`Added ${newBlacklist} to the blacklist!`);
                        }
                    } else {
                        message.channel.send('You have to have `MANAGE_GUILD` permissions to use this command!')
                    };
                } else if (args[0] === 'list'){
                    const blacklistEmbed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(`${message.guild.name}'s blacklist:`)
                    .setDescription(`\`${guildBlacklists[message.guild.id].blacklist.toString().replace(new RegExp(',', 'g'), '\`, \`')}\``)
                    .setFooter('`` means its empty')
                    message.channel.send(blacklistEmbed)
                } else if (args[0] === 'clear'){
                    if (message.member.hasPermission('MANAGE_GUILD')){
                        delete guildBlacklists[message.guild.id];
                        fs.writeFile('./storages/guildBlacklists.json', JSON.stringify(guildBlacklists, null, 2), (err) => {
                            if (err) console.log(err);
						})
                        message.channel.send('Blacklist cleared!');
                        
                        if (!guildBlacklists[message.guild.id]) {
                        guildBlacklists[message.guild.id] = {
                            blacklist: []
                        };
                        };
                         fs.writeFile('./storages/guildBlacklists.json', JSON.stringify(guildBlacklists, null, 2), (err) => {
                             if (err) console.log(err);
                         });
                    } else {
                        message.channel.send('You have to have `MANAGE_GUILD` permissions to use this command!');
                    };
                };
            };
            talkedRecently.add(message.author.id);
            setTimeout(() => {
				talkedRecently.delete(message.author.id);
            }, cooldownTime);
        };
    };

    if (command === 'welcome'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {
            if (!args[0]){
                message.channel.send(`Invalid commands! Available commands: \`edit\`, \`view\`, \`setchannel\`, \`removechannel\``);
            } else if (args[0] === 'view'){
                message.channel.send(`**Join message:** \`${guildConf[message.guild.id].welcomeMessage}\``);
            } else if (args[0] === 'edit'){
                if (!args[1]) return message.channel.send('What do you want the new message to be? `You can use: {mention}, {server}, {discriminator}, {name}`');
                let loc = message.content.replace(`${guildConf[message.guild.id].prefix}${command} ${args[0]} `, '')
                guildConf[message.guild.id].welcomeMessage = loc;
                if (!guildConf[message.guild.id].welcomeMessage) {
                    guildConf[message.guild.id].welcomeMessage = false;
                };
                fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
                    if (err) console.log(err)
                })
                message.channel.send(`Welcome message set to \`${loc}\``);
            } else if (args[0] === 'setchannel'){
                if (!args[1]){
                    message.reply('please mention a channel!');
                    return;
                };
                var channel = message.mentions.channels.first();

                if (!channel) return message.channel.send('Please **mention** a channel!');

                guildConf[message.guild.id].welcomeChannelID = channel.id;
                if (!guildConf[message.guild.id].welcomeChannelID) {
                    guildConf[message.guild.id].welcomeChannelID = false;
                };
                fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
                    if (err) console.log(err)
                })
                message.channel.send(`Channel set to ${channel}!`);
            } else if (args[0] === 'removechannel'){
                guildConf[message.guild.id].welcomeChannelID = false;
                if (!guildConf[message.guild.id].welcomeChannelID) {
                    guildConf[message.guild.id].welcomeChannelID = false;
                };
                fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
                    if (err) console.log(err)
                })
                message.channel.send(`Welcome messages removed.`);
            };
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            talkedRecently.delete(message.author.id);
            }, cooldownTime);
        }
    };

    if (command === 'goodbye'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {
            if (!args[0]){
                message.channel.send(`Invalid commands! Available commands: \`edit\`, \`view\`, \`setchannel\`, \`removechannel\``);
            } else if (args[0] === 'view'){
                message.channel.send(`**Join message:** \`${guildConf[message.guild.id].goodbyeMessage}\``);
            } else if (args[0] === 'edit'){
                if (!args[1]) return message.channel.send('What do you want the new message to be? `You can use: {mention}, {server}, {discriminator}, {name}`');
                let loc = message.content.replace(`${guildConf[message.guild.id].prefix}${command} ${args[0]} `, '')
                guildConf[message.guild.id].goodbyeMessage = loc;
                if (!guildConf[message.guild.id].goodbyeMessage) {
                    guildConf[message.guild.id].goodbyeMessage = false;
                };
                fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
                    if (err) console.log(err)
                })
                message.channel.send(`Goodbye message set to \`${loc}\``);
            } else if (args[0] === 'setchannel'){
                if (!args[1]){
                    message.reply('please mention a channel!');
                    return;
                };
                var channel = message.mentions.channels.first();

                if (!channel) return message.channel.send('Please **mention** a channel!');

                guildConf[message.guild.id].goodbyeChannelID = channel.id;
                if (!guildConf[message.guild.id].goodbyeChannelID) {
                    guildConf[message.guild.id].goodbyeChannelID = false;
                };
                fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
                    if (err) console.log(err)
                })
                message.channel.send(`Channel set to ${channel}!`);
            } else if (args[0] === 'removechannel'){
                guildConf[message.guild.id].goodbyeChannelID = false;
                if (!guildConf[message.guild.id].goodbyeChannelID) {
                    guildConf[message.guild.id].goodbyeChannelID = false;
                };
                fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
                    if (err) console.log(err)
                })
                message.channel.send(`Goodbye messages removed.`);
            };
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            talkedRecently.delete(message.author.id);
            }, cooldownTime);
        }
    };

    if (command === 'jfgi' || command === 'justgoogleit'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {
            if (!args[0]){
                message.channel.send('What type of jfgi? (`normal` or `angry`)')
            } else {
                if (args[0] === 'angry'){
                    if (!args[1]){
                        message.channel.send('What do you want to jfg?')
                    } else {
                        message.delete();
                        search = message.content.replace(`${guildConf[message.guild.id].prefix}${command} ${args[0]}`, '')
                        search = search.replace(new RegExp(' ', 'g'), '%20')
                        const jfgiEmbed = new Discord.MessageEmbed()
                        .setTitle('Click here!')
                        .setColor("RANDOM")
                        .setURL(`https://www.just-fucking-google.it?s=${search}&e=fingerxyz`)
                        message.channel.send(jfgiEmbed)
                    }
                } else if (args[0] === 'normal'){
                    if (!args[1]){
                        message.channel.send('What do you want to jfg?')
                    } else {
                        message.delete();
                        search = message.content.replace(`${guildConf[message.guild.id].prefix}${command} ${args[0]}`, '')
                        search = search.replace(new RegExp(' ', 'g'), '+')
                        const jfgiEmbed = new Discord.MessageEmbed()
                        .setTitle('Click here!')
                        .setColor("RANDOM")
                        .setURL(`https://lmgtfy.com/?q=${search}`)
                        message.channel.send(jfgiEmbed)
                    }
                } else {
                    message.channel.send('Wrong type! (`normal` or `angry`)')
                }
            }
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, cooldownTime);
        }

    };

    if (command === 'purge' || command === 'clean' || command === 'clear'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {

            if (message.member.hasPermission('MANAGE_MESSAGES')) {
                if (!args[0]){
                    message.channel.send('How many messages should I purge?');
                } else {
                    if (!isNaN(args[0])){
                        if (args[0] >= 101 || args[0] <= 0){
                            message.channel.send('Please mention a number between `1-100`!');
                            return;
                        };
                        message.delete();
                        message.channel.bulkDelete(args[0], true)
                        .then(messages => message.channel.send(`Deleted ${messages.size} messages`)
                        .then(msg => {
                        msg.delete({ timeout: 2000 })
                        }))
                        .catch(() => message.channel.send('Can\'t delete messages over `2 weeks` old!')
                        .then(msg => {
                        msg.delete({ timeout: 2000 })
                        }));
                    } else {
                        message.channel.send('Number please.');
                        return;
                    };
                };
            } else {
                message.channel.send('You have to have `MANAGE_MESSAGES` permissions to use this command!')
            };
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, cooldownTime);
        }
    };

    if (command === 'whois' || command === 'userinfo'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {

            let user;
            if (message.mentions.users.first()) {
                user = message.mentions.users.first();
            } else {
                user = message.member;
            }
    
            function checkDays(date) {
                let now = new Date();
                let diff = now.getTime() - date.getTime();
                let days = Math.floor(diff / 86400000);
                return days + (days == 1 ? " day" : " days") + " ago";
            };
            
            const member = message.guild.member(user);
            
            const userInfoEmbed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setThumbnail(message.author.avatarURL)
                .addField("Ping:", `${member}`, true)
                .addField("ID:", `${member.id}`, true)
                .addField("Nickname:", `${member.nickname !== null ? `${member.nickname}` : 'None'}`, true)
                .addField("Status:", `${member.presence.status}`, true)
                .addField("In Server:", message.guild.name, true)
                .addField("Game:", `${member.presence.game ? member.presence.game.name : 'None'}`, true)
                .addField("Bot:", `${member.user.bot}`, true)
                .addField("Joined The Server On:", `${member.joinedAt.toUTCString().substr(0, 16)} (${checkDays(member.joinedAt)})`, true)
                .addField("Account Created On:", `${member.user.createdAt.toUTCString().substr(0, 16)} (${checkDays(member.user.createdAt)})`, true)
                .addField("Roles:", `<@&${message.guild.member(member)._roles.join('> <@&')}>`)
                .setFooter(`Replying to ${message.author.username}#${message.author.discriminator}`)
            message.channel.send(userInfoEmbed);
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, cooldownTime);
        }
    }

    if (command === 'serverinfo'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {

            function checkDays(date) {
                let now = new Date();
                let diff = now.getTime() - date.getTime();
                let days = Math.floor(diff / 86400000);
                return days + (days == 1 ? " day" : " days") + " ago";
            };
    
            let region = {
                "brazil": ":flag_br: Brazil",
                "eu-central": ":flag_eu: Central Europe",
                "singapore": ":flag_sg: Singapore",
                "us-central": ":flag_us: U.S. Central",
                "sydney": ":flag_au: Sydney",
                "us-east": ":flag_us: U.S. East",
                "us-south": ":flag_us: U.S. South",
                "us-west": ":flag_us: U.S. West",
                "eu-west": ":flag_eu: Western Europe",
                "vip-us-east": ":flag_us: VIP U.S. East",
                "london": ":flag_gb: London",
                "amsterdam": ":flag_nl: Amsterdam",
                "hongkong": ":flag_hk: Hong Kong",
                "russia": ":flag_ru: Russia",
                "southafrica": ":flag_za:  South Africa"
            };
    
            const serverInfoEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(message.guild.name, message.guild.iconURL)
            .addField("Name", message.guild.name, true)
            .addField("ID", message.guild.id, true)
            .addField("Owner", `${message.guild.owner.user}`, true)
            .addField("Region", region[message.guild.region], true)
            .addField("Total | Humans | Bots", `${message.guild.members.cache.size} | ${message.guild.members.cache.filter(member => !member.user.bot).size} | ${message.guild.members.cache.filter(member => member.user.bot).size}`, true)
            .addField("Verification Level", message.guild.verificationLevel, true)
            .addField("Text | Voice", `${message.guild.channels.cache.filter(m => m.type === 'text').size} | ${message.guild.channels.cache.filter(m => m.type === 'voice').size}`, true)
            .addField("Roles", message.guild.roles.cache.size, true)
            .addField("Creation Date", `${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`, true)
            .setThumbnail(message.guild.iconURL)
            message.channel.send(serverInfoEmbed);
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, cooldownTime);
        }
    }

    if (command === `ping`){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {
            const pingEmbed = new Discord.MessageEmbed()
            .setTitle('Pong')
            .setDescription("My ping is `" + `${Date.now() - message.createdTimestamp}` + " ms`")
            .setColor('#0099ff')
            .setFooter(`Bot created by 𝐙𝐞𝐫𝐨 𝐭𝐰𝐨#0265 | Currently in ${bot.guilds.cache.size} servers`);
            message.channel.send(pingEmbed);
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, cooldownTime);
        }

    };

    if (command === 'info'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {
            const infoEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setAuthor('Info', bot.user.avatarURL())
            .setDescription(`**Ping:** ` + `${Date.now() - message.createdTimestamp}` + " ms" + `
 
📘 **Version** - \`${botVersion}\`

📚 **Github** - [Click here](https://github.com/jameslinimk/Strawberry-bot/)

⚠ **Report issues** - [Click here](https://github.com/jameslinimk/Strawberry-bot/issues/new)

💡 **To-do** - [Click here](https://github.com/jameslinimk/Strawberry-bot/projects/1)

🎉 **API Key** - [Click here ( Dev acces key )](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

[Add me to your server!](https://discordapp.com/oauth2/authorize?client_id=726065453591560262&scope=bot&permissions=8)
[Join the Strawberry server!](https://discord.gg/kEnspZc) (updates, bug reports, support and more)`)
            .setFooter(`Bot created by 𝐙𝐞𝐫𝐨 𝐭𝐰𝐨#0265 | Currently in ${bot.guilds.cache.size} servers`);
            message.channel.send(infoEmbed);
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, cooldownTime);
        }
    };
	
    if (command === '8ball'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {

            let lmsgs = message.content.replace(`${guildConf[message.guild.id].prefix}8ball`, "")
            if (args[0]){
                if (lmsgs.length < 5){
                    message.channel.send('Try the command again, but type a **real** question.');
                } else {
                    var randomAnswers = [
                        "It is certain.",
                        "It is decidedly so.",
                        "Without a doubt.",
                        "Yes – definitely.",
                        "You may rely on it.",
                        "As I see it, yes.",
                        "Most likely.",
                        "Outlook good.",
                        "Yes.",
                        "Signs point to yes.",
                        "Reply hazy, try again.",
                        "Ask again later.",
                        "Better not tell you now.",
                        "Cannot predict now.",
                        "Concentrate and ask again.",
                        "Don't count on it.",
                        "My reply is no.",
                        "My sources say no.",
                        "Outlook not so good.",
                        "Very doubtful."
                      ];
                    var randomAnswer = randomAnswers[Math.floor(Math.random()*randomAnswers.length)];
                    message.channel.send('🔁 Thinking...')
                    setTimeout(function(){
                        message.channel.send(`**Question:**${lmsgs}\n**Answer:** ${randomAnswer}`)
                    }, 1000);
                };
            } else {
                message.channel.send('What are you asking?');
            };
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, cooldownTime);
        }

    };

    if (command === 'coin'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {
            message.channel.send('🔁 Flipping...')
            let random = Math.floor(Math.random() * 105);
            if (random < 5){
                setTimeout(function(){
                    message.channel.send(`Holy s*** it landed on its side!`)
                }, 1000);
            } else if (random >= 5 && random < 55){
                setTimeout(function(){
                    message.channel.send(`The coin landed heads up.`)
                }, 1000);
            } else if (random >= 55 && random <= 105){
                setTimeout(function(){
                    message.channel.send(`The coin landed tails up.`)
                }, 1000);
            };
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, cooldownTime);
        }
    };

    if (command === 'pp'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {

            message.channel.send('🔁 Calculing...')
            let random = Math.floor(Math.random() * 15);
            message.channel.send(`**Your pp is** \`${random}\`in. **Wow such size**`)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, cooldownTime);
        }
    };

    if (command === 'number'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {
            if (!args[0]){
                message.channel.send('What should the max number be?');
            } else {
            message.channel.send('🔁 Calculing...');
            let random = Math.floor(Math.random() * args[0]);
            message.channel.send(`**Random number:** \`${random}\`.`);
            };
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, cooldownTime);
        }
    };

    if (command === 'quiz'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {

            const item = quiz[Math.floor(Math.random() * quiz.length)];
            const filter = response => {
                return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
            };
    
            const questionEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Trivia question:')
            .setDescription(`${item.question}

[Add me to your server!](https://discordapp.com/oauth2/authorize?client_id=726065453591560262&scope=bot&permissions=8)
[Join the Strawberry server!](https://discord.gg/kEnspZc) (updates, bug reports, support and more)`)
            .setFooter(`Bot created by 𝐙𝐞𝐫𝐨 𝐭𝐰𝐨#0265 | Currently in ${bot.guilds.cache.size} servers`);
            
            message.channel.send(questionEmbed).then(() => {
                message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                    .then(collected => {
                        message.channel.send(`${collected.first().author} got the correct answer!`);
                    })
                    .catch(collected => {
                        message.channel.send('Looks like nobody got the answer this time.');
                    });
            });    
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, cooldownTime);
        }
    };

    if (command === 'kill'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {
            if (!args[0]){
                message.channel.send('You were gonna kill yourself, but relized you needed to mention someone to kill them.');
            } else {
                var waysToKill = [
                `${message.member} stabbed ${msg.replace(`${guildConf[message.guild.id].prefix}kill `, '')} with a rusty knife. ${msg.replace(`${guildConf[message.guild.id].prefix}kill `, '')}'s family had to pay for the tetanus fees too. Cold.`,
                `${message.member} hired 69 assassins to kill ${msg.replace(`${guildConf[message.guild.id].prefix}kill `, '')}. Everyone died including all of the assassins.`,
                `${message.member} was planning to kill ${msg.replace(`${guildConf[message.guild.id].prefix}kill `, '')} but got caught! While struggling with the police officer, the officer tried to shoot ${message.member}, but the bullet missed and hit ${msg.replace(`${guildConf[message.guild.id].prefix}kill `, '')} in china.`,
                `${msg.replace(`${guildConf[message.guild.id].prefix}kill `, '')} heard ${message.member} was gonna kill them, and then hid. Little did he know he just trapped himslef in a room with 12 rabid dogs. You know what happened next.`,
                `${message.member} shot and killed ${msg.replace(`${guildConf[message.guild.id].prefix}kill `, '')} with a bannana. The cops didnt know what happened.`,
                `${message.member} hacked ${msg.replace(`${guildConf[message.guild.id].prefix}kill `, '')} to death. What?`,
                `${message.member} bored ${msg.replace(`${guildConf[message.guild.id].prefix}kill `, '')} to death with math. What?`
                ]
                var randomAnswer = waysToKill[Math.floor(Math.random()*waysToKill.length)];
                message.channel.send(randomAnswer);
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                    talkedRecently.delete(message.author.id);
                }, cooldownTime);
            };
        };
    };

    if (command === "prefix") {
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {

            if (message.member.hasPermission('MANAGE_GUILD')) {
                if (args[0]){
                    guildConf[message.guild.id].prefix = args[0];
                    if (!guildConf[message.guild.id].prefix) {
                        guildConf[message.guild.id].prefix = config.prefix; // If you didn't specify a Prefix, set the Prefix to the Default Prefix
                    }
                    fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
                        if (err) console.log(err)
                    })
                    message.channel.send(`Prefix set to \`${args[0]}\``);
                } else {
                    message.channel.send('Please include a new prefix!');
                };
            } else {
                message.channel.send('You have to have `MANAGE_GUILD` permissions to use this command!')
            };
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, cooldownTime);
        }
    };
	
    if (command === 'cat' || command === 'dog' || command === 'memes' || command === 'cute' || command === 'porn' || command === 'hentai' || command === 'reddit' || command === 'anime'){
        if (talkedRecently.has(message.author.id)) {
            cooldownMessage(message.member);
        } else {
			if (command === 'cat') var reddits = ['cats', 'Catswhoyell', 'sleepingcats', 'CatPics', 'KittenGifs'];
			if (command === 'dog') var reddits = ['Corgi', 'dogswithjobs', 'puppysmiles', 'dogs', 'dogpictures', 'dogtraining'];
			if (command === 'memes') var reddits = ['wholesomememes', 'dankmemes', 'raimimemes', 'historymemes', 'memes', 'PrequelMemes'];
			if (command === 'cute') var reddits = ['cute'];
			if (command === 'porn') var reddits = ['porn', 'porno', 'blowjobs', 'MILF'];
			if (command === 'hentai') var reddits = ['hentai'];
			if (command === 'anime') var reddits = ['anime'];
			if (command === 'reddit'){
				if (args[0]){
					var reddits = [`${args[0]}`];
				} else {
					message.channel.send('What subreddit?');
				};
			};
			
            const getReddit = await randomImageJs.getMemes({ 
                get: 1, 
                removeAllSubReddit: true, 
                addSubReddit: reddits
            }).catch(error => {
				message.channel.send('Took too long! Please try again!');
				return;
            });
            if (getReddit[0].NSFW && !message.channel.nsfw){
				message.channel.send(':warning: The post is NSFW, but this channel isn\'t nsfw!');
				message.channel.send('https://support.discord.com/hc/article_attachments/360007795191/2_.jpg');
            } else {
				const redditEmbed = new Discord.MessageEmbed()
				.setTitle(`${getReddit[0].title}`)
				.setURL(`${getReddit[0].postLink}`)
				.setImage(`${getReddit[0].image}`)
				.setColor('RANDOM')
				.setFooter(`Sub: ${getReddit[0].subreddit} | NSFW: ${getReddit[0].NSFW}`);
				message.channel.send(redditEmbed).catch((error) => {
					message.channel.send('Error! Try again!');
                });
			};
            talkedRecently.add(message.author.id);
            setTimeout(() => {
				talkedRecently.delete(message.author.id);
            }, cooldownTime);
        };
    };

    if (command === 'snipe'){
        if (snipes[message.channel.id] ){
            const snipeEmbed = new Discord.MessageEmbed()
            .setTitle(`${message.channel.name} 's snipe`)
            .setColor('RANDOM')
            .setDescription(`${snipes[message.channel.id].content}\n\n**Author:** ${snipes[message.channel.id].author}`)
            message.channel.send(snipeEmbed);
        } else {
            message.channel.send('Nothing to snipe!');
        };
    };
});

bot.login(config.token);

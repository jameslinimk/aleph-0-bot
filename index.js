const Discord = require('discord.js'); // Gets The Discord.js Package
const fs = require("fs"); // Gets the fs Package
const bot = new Discord.Client(); // Our Discord Client defined as bot
var randomImageJs = require('random-image-js');
// const Canvas = require('canvas');
const Canvas = require("discord-canvas");

var config = require('./storages/config.json');
var guildConf = require('./storages/guildConf.json');
var guildBlacklists = require('./storages/guildBlacklists.json');
const quiz = require('./storages/quiz.json');

const talkedRecently = new Set();

const botVersion = '1.0';

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

bot.on('guildCreate', (guild) => { // If the Bot was added on a server, proceed
    if (!guildConf[guild.id]) { // If the guild's id is not on the GUILDCONF File, proceed
	guildConf[guild.id] = {
        prefix: config.prefix,
        welcomeImage: false, // Background image color
        welcomeImageURL: false, // Background image URL
        welcomeChannelID: false, // Welcome image channel ID
        goodbyeImage: false, // Background image color
        goodbyeImageURL: false, // Background image URL
        goodbyeChannelID: false, // Goodbye image channel ID
        welcomeMessage: false, // Welcome message. ( If not false, then true )
        goodbyeMessage: false // Goodbye message. ( If not false, then true )
	}
    }
     fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
     	if (err) console.log(err)
    })

    if (!guildBlacklists[guild.id]) { // If the guild's id is not on the GUILDCONF File, proceed
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


bot.on('guildDelete', (guild) => { // If the Bot was removed on a server, proceed
     delete guildConf[guild.id]; // Deletes the Guild ID and Prefix
     fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
     	if (err) console.log(err)
    })

    delete guildBlacklists[guild.id]; // Deletes the Guild ID and Prefix
    fs.writeFile('./storages/guildBlacklists.json', JSON.stringify(guildBlacklists, null, 2), (err) => {
        if (err) console.log(err)
   })
});

bot.on('guildMemberAdd', async member => {
    if (guildConf[member.guild.id].welcomeChannelID != false){
        const channel = member.guild.channels.cache.find(ch => ch.id === `${guildConf[member.guild.id].welcomeChannelID}`).catch((error) =>{
            const errorChannel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
            errorChannel.send("Error with sending welcomes. Please check the ID and try again!")
        });
        if (guildConf[member.guild.id].welcomeMessage != false){
            let message = guildConf[member.guild.id].welcomeMessage;
            message = message.replace(new RegExp('{mention}', 'g'), `${member}`);
            message = message.replace(new RegExp('{server}', 'g'), `${member.guild.name}`);
            message = message.replace(new RegExp('{discriminator}', 'g'), `${member.user.discriminator}`);
            message = message.replace(new RegExp('{name}', 'g'), `${member.displayName}`);
            channel.send(`${message}`, attachment).catch((error) => {
                channel.send('**ERROR** **PLEASE CHANGE MESSAGE** **ERROR**')
                channel.send(`Error (Please send to DEV): \`\`\`js\n${error}\`\`\``)
            });
        };

        // Add if welcomeImage then send image with Welcome image URL

    };
    welcomeCanvas = new Canvas.Welcome();
    let image = await welcomeCanvas
      .setUsername(`${member.displayName}`)
      .setDiscriminator(`${member.user.discriminator}`)
      .setMemberCount(`${member.guild.members.cache.filter(member => !member.user.bot).size}`)
      .setGuildName(`${member.guild.name}`)
      .setAvatar(member.user.displayAvatarURL({ format: 'jpg' }))
      .setColor("border", "#8015EA")
      .setColor("username-box", "#8015EA")
      .setColor("discriminator-box", "#8015EA")
      .setColor("message-box", "#8015EA")
      .setColor("title", "#8015EA")
      .setColor("avatar", "#8015EA")
      .setBackground('https://discordjs.guide/assets/img/8CQvVRV.cced9193.png')
      .toAttachment();
    
    let attachment = new Discord.MessageAttachment(image.toBuffer(), "welcome-image.png");

    const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
});

bot.on('message', message => {
	if (message.content === '!join') {
		bot.emit('guildMemberAdd', message.member);
	}
});

bot.on('message', async message => {
    if (message.channel.type === "dm" || message.author.bot || message.author === bot.user) return; // Checks if we're on DMs, or the Author is a Bot, or the Author is our Bot, stop.
    var args = message.content.split(' ').slice(1); // We need this later
    var command = message.content.split(' ')[0].replace(guildConf[message.guild.id].prefix, ''); // Replaces the Current Prefix with this

    if (!message.content.startsWith(guildConf[message.guild.id].prefix)) return;

    if (command === 'cat'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
        } else {

            const cat = await randomImageJs.getMemes({ 
                get: 1, 
                removeAllSubReddit: true, 
                addSubReddit: ['cats', 'Catswhoyell', 'sleepingcats'] 
            });
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            const catEmbed = new Discord.MessageEmbed()
            .setTitle(`${cat[0].title}`)
            .setURL(`${cat[0].postLink}`)
            .setImage(`${cat[0].image}`)
            .setColor(`#${randomColor}`)
            .setFooter(`Sub: ${cat[0].subreddit} | NSFW: ${cat[0].NSFW}`)
            message.channel.send(catEmbed)

            talkedRecently.add(message.author.id);
            setTimeout(() => {
            talkedRecently.delete(message.author.id);
            }, 5000);
        }
    };

    if (command === 'dog'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
        } else {
            const dog = await randomImageJs.getMemes({ 
                get: 1, 
                removeAllSubReddit: true, 
                addSubReddit: ['dog'] 
            });
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            const dogEmbed = new Discord.MessageEmbed()
            .setTitle(`${dog[0].title}`)
            .setURL(`${dog[0].postLink}`)
            .setImage(`${dog[0].image}`)
            .setColor(`#${randomColor}`)
            .setFooter(`Sub: ${dog[0].subreddit} | NSFW: ${dog[0].NSFW}`)
            message.channel.send(dogEmbed)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, 5000);
        }
    };

    if (command === 'memes' || command === 'meme' || command === 'dankmemes' || command === 'dankmeme'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
        } else {
            const meme = await randomImageJs.getMemes({ 
                get: 1, 
                removeAllSubReddit: true, 
                addSubReddit: ['memes', 'dankmemes'] 
            });
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            const memeEmbed = new Discord.MessageEmbed()
            .setTitle(`${meme[0].title}`)
            .setURL(`${meme[0].postLink}`)
            .setImage(`${meme[0].image}`)
            .setColor(`#${randomColor}`)
            .setFooter(`Sub: ${meme[0].subreddit} | NSFW: ${meme[0].NSFW}`)
            message.channel.send(memeEmbed)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, 5000);
        }
    };

    if (command === 'anime'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
        } else {
            const anime = await randomImageJs.getMemes({ 
                get: 1, 
                removeAllSubReddit: true, 
                addSubReddit: ['anime'] 
            });
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            const animeEmbed = new Discord.MessageEmbed()
            .setTitle(`${anime[0].title}`)
            .setURL(`${anime[0].postLink}`)
            .setImage(`${anime[0].image}`)
            .setColor(`#${randomColor}`)
            .setFooter(`Sub: ${anime[0].subreddit} | NSFW: ${anime[0].NSFW}`)
            message.channel.send(animeEmbed)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, 5000);
        }
    };

    if (command === 'reddit'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
        } else {

            if (!args[0]){
                message.channel.send('What subreddit?');
            } else {
                const reddit = await randomImageJs.getMemes({ 
                    get: 1, 
                    removeAllSubReddit: true, 
                    addSubReddit: [`${args[0]}`] 
                }).catch(error => {
                    message.channel.send('Took too long! Try again with another subreddit!');
                    return;
                });
                if (reddit[0].NSFW){
                    if (message.channel.nsfw === true){
    
                        const redditEmbed = new Discord.MessageEmbed()
                        .setTitle(`${reddit[0].title}`)
                        .setURL(`${reddit[0].postLink}`)
                        .setImage(`${reddit[0].image}`)
                        .setColor('RANDOM')
                        .setFooter(`Sub: ${reddit[0].subreddit} | NSFW: ${reddit[0].NSFW}`)
                        message.channel.send(redditEmbed)
    
                    } else {
                        message.channel.send(':warning: This channel isn\'t nsfw!');
                        message.channel.send('https://support.discord.com/hc/article_attachments/360007795191/2_.jpg');
                    };
                } else {
    
                    var randomColor = Math.floor(Math.random()*16777215).toString(16);
                    const redditEmbed = new Discord.MessageEmbed()
                    .setTitle(`${reddit[0].title}`)
                    .setURL(`${reddit[0].postLink}`)
                    .setImage(`${reddit[0].image}`)
                    .setColor(`#${randomColor}`)
                    .setFooter(`Sub: ${reddit[0].subreddit} | NSFW: ${reddit[0].NSFW}`)
                    message.channel.send(redditEmbed).catch((error) => {
                        message.channel.send(`\`\`\`js\n${error}\`\`\``);
                    })
    
                };
            };
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, 5000);
        }
    };

    if (command === 'hentai'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
        } else {
            if (message.channel.nsfw === true){
                const hentai = await randomImageJs.getMemes({ 
                    get: 1, 
                    removeAllSubReddit: true, 
                    addSubReddit: ['hentai'] 
                });
                var randomColor = Math.floor(Math.random()*16777215).toString(16);
                const hentaiEmbed = new Discord.MessageEmbed()
                .setTitle(`${hentai[0].title}`)
                .setURL(`${hentai[0].postLink}`)
                .setImage(`${hentai[0].image}`)
                .setColor(`#${randomColor}`)
                .setFooter(`Sub: ${hentai[0].subreddit} | NSFW: ${hentai[0].NSFW}`)
                message.channel.send(hentaiEmbed)
            } else {
                message.channel.send(':warning: This channel isn\'t nsfw!');
                message.channel.send('https://support.discord.com/hc/article_attachments/360007795191/2_.jpg');
            };
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, 5000);
        }

    };

    if (command === 'porn' || command === 'porno'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
        } else {

            if (message.channel.nsfw === true){
                const porn = await randomImageJs.getMemes({ 
                    get: 1, 
                    removeAllSubReddit: true, 
                    addSubReddit: ['porn', 'porno'] 
                });
                var randomColor = Math.floor(Math.random()*16777215).toString(16);
                const pornEmbed = new Discord.MessageEmbed()
                .setTitle(`${porn[0].title}`)
                .setURL(`${porn[0].postLink}`)
                .setImage(`${porn[0].image}`)
                .setColor(`#${randomColor}`)
                .setFooter(`Sub: ${porn[0].subreddit} | NSFW: ${porn[0].NSFW}`)
                message.channel.send(pornEmbed)
            } else {
                message.channel.send(':warning: This channel isn\'t nsfw!');
                message.channel.send('https://support.discord.com/hc/article_attachments/360007795191/2_.jpg');
            };
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, 5000);
        }

    };
})

bot.on('message', (message) => {
    if (message.channel.type === "dm" || message.author.bot || message.author === bot.user) return; // Checks if we're on DMs, or the Author is a Bot, or the Author is our Bot, stop.
    var args = message.content.split(' ').slice(1); // We need this later
    var command = message.content.split(' ')[0].replace(guildConf[message.guild.id].prefix, ''); // Replaces the Current Prefix with this

    if (message.mentions.has(bot.user)){
        message.channel.send(`My prefix is \`${guildConf[message.guild.id].prefix}\`\nDo \`${guildConf[message.guild.id].prefix}help\` for help.`)
    };
    
    let blacklist = guildBlacklists[message.guild.id].blacklist;

    var i;
    for (i = 0; i < blacklist.length; i++) {
        if (!message.member.hasPermission('MANAGE_GUILD')){
            if (message.content.includes(`${blacklist[i]}`)){
                message.reply('don\'t say that word!');
                message.author.send(`Don\'t say \`${blacklist[i]}\` in \`${message.guild.name}\`!`)
            }
        }
    }

    if (!message.content.startsWith(guildConf[message.guild.id].prefix)) return;

    if (command === 'blacklist'){
        if (talkedRecently.has(msg.author.id)) {
            msg.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
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
                            fs.writeFile('./storages/guildBlacklists.json', JSON.stringify(guildBlacklists, null, 2), (err) => {
                                if (err) console.log(err)
                            })
                            message.channel.send(`Added ${newBlacklist} to the blacklist!`)
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
                        delete guildBlacklists[message.guild.id]; // Deletes the Guild ID and Prefix
                        fs.writeFile('./storages/guildBlacklists.json', JSON.stringify(guildBlacklists, null, 2), (err) => {
                            if (err) console.log(err)
                    })
                        message.channel.send('Blacklist cleared!')
                        
                        if (!guildBlacklists[message.guild.id]) { // If the guild's id is not on the GUILDCONF File, proceed
                        guildBlacklists[message.guild.id] = {
                            blacklist: []
                        }
                        }
                         fs.writeFile('./storages/guildBlacklists.json', JSON.stringify(guildBlacklists, null, 2), (err) => {
                             if (err) console.log(err)
                        })
                    } else {
                        message.channel.send('You have to have `MANAGE_GUILD` permissions to use this command!')
                    };
                }
            }
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, 5000);
        }

    }

    if (command === 'help' || command === 'h'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
        } else {

            if (!args[0]){
                const helpEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setAuthor('Command list', bot.user.avatarURL())
                .setDescription(`**Type \`${guildConf[message.guild.id].prefix}help <command>\` for more info about that command.**
    
[Add me to your server!](https://discordapp.com/oauth2/authorize?client_id=726065453591560262&scope=bot&permissions=8)
[Join the Strawberry server!](https://discord.gg/kEnspZc) (updates, bug reports, support and more)`)
                .addFields(
                    { name: 'Random:', value: '\`coin\`, \`8ball\`, \`pp\`, \`number\`, \`test\`', inline: true },
                    { name: 'Reddit:', value: '\`cat\`, \`dog\`, \`meme\`, \`anime\`, \`reddit\`', inline: true },
                    { name: 'Fun:', value: '\`justgoogleit\`, \`jfgi\`, \`quiz\`, \`test\`, \`test\`', inline: true },
                    { name: 'Test:', value: '\`test\`, \`test\`, \`test\`, \`test\`, \`test\`', inline: true },
                    { name: 'NSFW:', value: '\`porn\`, \`hentai\`, \`test\`, \`test\`, \`test\`', inline: true },
                    { name: 'Utility:', value: '\`prefix\`, \`purge\`, \`whois\`, \`serverinfo\`, \`test\`', inline: true },
                    { name: 'Settings:', value: '\`blacklist\`, \`welcome\`, \`goodbye\`, \`test\`, \`test\`', inline: true },
                )
                .setFooter(`Bot created by 𝐙𝐞𝐫𝐨 𝐭𝐰𝐨#0265 | Currently in ${bot.guilds.cache.size} servers`);
                message.channel.send(helpEmbed);
            } else {
                if (args[0] === 'coin'){
    
                } else if (args[0] === 'coin'){
                    message.channel.send('**Coin command**\nFlips a coin. Duh')
                } else if (args[0] === '8ball'){
                    message.channel.send('**8ball command**\nGives you a random answer. Totaly reliable to make life decisions.')
                } else if (args[0] === 'pp'){
                    message.channel.send('**pp command**\nGives you a rand-- I mean accurate size of your pp.')
                } else if (args[0] === 'number'){
                    message.channel.send('**Number command**\nGives you a random number between 0 and <Args>.')
                } else if (args[0] === 'cat' || args[0] === 'dog' || args[0] === 'meme' || args[0] === 'anime'){
                    message.channel.send('**Cat, dog, meme, and anime commands**\nGives you a random reddit post from their respective subreddits.')
                } else if (args[0] === 'reddit'){
                    message.channel.send('**Reddit command**\nGives you a random pic from your mentioned subreddit!')
                } else if (args[0] === 'hentai' || args[0] === 'porn'){
                    message.channel.send('You know what this does. ( ͡° ͜ʖ ͡°)')
                } else if (args[0] === 'prefix'){
                    message.channel.send('**Prefix command**\nChanges the bot prefix.')
                } else if (args[0] === 'purge'){
                    message.channel.send('**Purge command**\nPurges 1-100 messages.')
                } else if (args[0] === 'coin'){
    
                } else {
                    message.channel.send('Invalid command!')
                }
            };
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, 5000);
        }
    };

    if (command === 'welcome'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
        } else {
            if (!args[0]){
                message.channel.send(`Invalid commands! Available commands: \`image\`, \`message\``);
            } else if (args[0] === 'image'){
                if (!args[1]){
                    message.channel.send(`Invalid sub-commands! Available commands: \`view\`, \`edit\`, \`remove\``);
                } else if (args[1] === 'view'){
                    bot.emit('guildMemberAdd', message.member);
                    message.react('✅');
                } else if (args[1] === 'edit'){
                    if (!args[2]){
                        message.channel.send(`What do you want to edit? Available: \`color\`, \`image\``);
                    } else if (args[2] === 'color'){
                        // WORK IN PROGRESS
                    } else if (args[2] === 'image'){

                    }
                }
            } else if (args[0] === 'message'){
                if (!args[1]){
                    message.channel.send(`Invalid sub-commands! Available commands: \`view\`, \`edit\``);
                } else if (args[1] === 'view'){
                    message.channel.send(`**Join message:** \`${guildConf[message.guild.id].welcomeMessage}\``);
                } else if (args[1] === 'edit'){
                    if (!args[2]){
                        message.channel.send('What do you want the new message to be? `You can use: {mention}, {server}, {discriminator}, {name}`');
                    } else {
                        let loc = message.content.replace(`${guildConf[message.guild.id].prefix}${command} ${args[0]} ${args[1]} `, '')
                        guildConf[message.guild.id].welcomeMessage = loc;
                        if (!guildConf[message.guild.id].welcomeMessage) {
                            guildConf[message.guild.id].welcomeMessage = false; // If you didn't specify a Prefix, set the Prefix to the Default Prefix
                        }
                        fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
                            if (err) console.log(err)
                        })
                        message.channel.send(`Welcome message set to \`${loc}\``);
                    };
                };
            };
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, 5000);
        }
    };

    if (command === 'jfgi' || command === 'justgoogleit'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
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
            }, 5000);
        }

    };

    if (command === 'purge' || command === 'clean' || command === 'clear'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
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
            }, 5000);
        }
    };

    if (command === 'whois' || command === 'userinfo'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
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
            }, 5000);
        }
    }

    if (command === 'serverinfo'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
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
            }, 5000);
        }
    }

    if (command === `ping`){
        const pingEmbed = new Discord.MessageEmbed()
        .setTitle('Pong')
        .setDescription("My ping is `" + `${Date.now() - message.createdTimestamp}` + " ms`")
        .setColor('#0099ff')
        .setFooter(`Bot created by 𝐙𝐞𝐫𝐨 𝐭𝐰𝐨#0265 | Currently in ${bot.guilds.cache.size} servers`);
        message.channel.send(pingEmbed);
    };

    if (command === 'info'){
        const infoEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setAuthor('Info', bot.user.avatarURL())
        .setDescription(`**Ping:** ` + `${Date.now() - message.createdTimestamp}` + " ms" + `
        
:blue_book: **Version** - \`${botVersion}\`

[Add me to your server!](https://discordapp.com/oauth2/authorize?client_id=726065453591560262&scope=bot&permissions=8)
[Join the Strawberry server!](https://discord.gg/kEnspZc) (updates, bug reports, support and more)`)
        .setFooter(`Bot created by 𝐙𝐞𝐫𝐨 𝐭𝐰𝐨#0265 | Currently in ${bot.guilds.cache.size} servers`);
        message.channel.send(infoEmbed);
    };

    if (command === '8ball'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
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
            }, 5000);
        }

    };

    if (command === 'coin'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
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
            }, 5000);
        }
    };

    if (command === 'pp'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
        } else {

            message.channel.send('🔁 Calculing...')
            let random = Math.floor(Math.random() * 15);
            message.channel.send(`**Your pp is** \`${random}\`in. **Wow such size**`)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, 5000);
        }
    };

    if (command === 'number'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
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
            }, 5000);
        }
    };

    if (command === 'quiz' || command === 'trivia'){
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
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
            }, 5000);
        }
    };

    if (command === "prefix") {
        if (talkedRecently.has(message.author.id)) {
            message.channel.send("Wait 5 seconds before getting typing again. - " + `${message.member}`);
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
            }, 5000);
        }
    };
});

bot.login(config.token);

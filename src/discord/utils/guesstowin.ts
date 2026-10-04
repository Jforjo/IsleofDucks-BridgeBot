import { Message } from 'discord.js';
import type { BotEvent } from '../../utils.ts';

const BLACKLISTED = "985708515484114966"; // Activity blacklist role

export default {
    id: "reset",
    once: false,
    run: async (bridge, _bot, message: Message) => {
        if (message.channel !== bridge.guesstowinChannel) return;
        if (!message.member) return;
        if (!message.guild) return;
        if (message.member.user.bot) return;
        if (bridge.guesstowin.data == null) return await message.react('🚫').catch(() => {});
        if (message.member.roles.cache.has(BLACKLISTED)) return await message.delete();
        if (message.member.user.id === bridge.guesstowin.data.sponsor) return;
        
        const guess = message.content;
        if (guess.toLowerCase() !== "dirt") bridge.guesstowin.guesses++;
        
        if (guess.toLowerCase() === bridge.guesstowin.data.answer.toLowerCase()) {
            const res = await fetch(`https://isle-of-ducks.vercel.app/api/guesstowin?id=${encodeURIComponent(bridge.guesstowin.data.id)}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
                },
                body: JSON.stringify({
                    guesses: bridge.guesstowin.guesses,
                    winner: message.member.user.id
                })
            });
            if (!res.ok) {
                bridge.logger.log("log_error", `[DISCORD] Failed to end GTW`);
                await message.react('⚠️').catch(() => {});
            }

            await bridge.guesstowinChannel?.permissionOverwrites.edit("1287098228067664004", { SendMessages: false }).catch(async () => {
                bridge.logger.log("log_error", `[DISCORD] Failed to edit permissions for verified role in GTW channel`);
                await message.react('⚠️').catch(() => {});
            });

            await bridge.guesstowinChannel?.send({
                embeds: [
                    {
                        title: "Guesstowin Won!",
                        color: 0xFB9B00,
                        description: `<@${message.member.user.id}> ${message.member.nickname || message.member.user.username} guessed the word correctly in ${bridge.guesstowin.guesses} guesses with **${bridge.guesstowin.data.answer}**.${bridge.guesstowin.data.prize ? `\nThe prize they won: **${bridge.guesstowin.data.prize}**` : ''}`,
                    }
                ]
            }).catch(async () => {
                bridge.logger.log("log_error", `[DISCORD] Failed to send GTW win message`);
                await message.react('⚠️').catch(() => {});
            });

            bridge.guesstowin.data = null;
            bridge.guesstowin.guesses = 0;
            // clearInterval(bridge.guesstowin.interval);
            bridge.guesstowin.interval?.unref();
            bridge.guesstowin.interval = null;

            await message.react('✅').catch(() => {});
        } else {
            await message.react('❌').catch(() => {});

            if (bridge.guesstowin.data.hints.length > 0 && bridge.guesstowin.guesses >= bridge.guesstowin.data.hints[0].at) {
                const hint = bridge.guesstowin.data.hints.shift();
                if (hint) {
                    const hintMessage = await bridge.guesstowinChannel?.send({
                        embeds: [
                            {
                                title: "Hint!",
                                color: 0xFB9B00,
                                description: hint.hint,
                                footer: {
                                    text: `Guesses so far: ${hint.at}`
                                }
                            }
                        ]
                    }).catch(async () => {
                        bridge.logger.log("log_error", `[DISCORD] Failed to send GTW hint message`)
                        await message.react('⚠️').catch(() => {});
                    });
                    if (hintMessage) await hintMessage.pin("Guesstowin hint").catch(async () => {
                        bridge.logger.log("log_error", `[DISCORD] Failed to pin GTW hint message`)
                        await message.react('⚠️').catch(() => {});
                    });
                }
            }

            if (bridge.guesstowinChannel && typeof bridge.guesstowinChannel.topic === "string") {
                const topics = bridge.guesstowinChannel.topic.split(' | ');
                if (topics[1].split(':')[0] !== "Guesses so far") return;
                await bridge.guesstowinChannel.setTopic(`${topics[0]} | Guesses so far: ${bridge.guesstowin.guesses} | ${topics[2]}`);
            }
        }
    },
} as BotEvent;
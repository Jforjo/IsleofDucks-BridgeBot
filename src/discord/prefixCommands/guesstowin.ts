import { ComponentType, ContainerComponent, Message, TextDisplayComponent, type ComponentInContainer } from 'discord.js';
import type { BotEvent } from '../../utils.ts';

export default {
    id: "updatefilters",
    once: false,
    run: async (bridge, _bot, message: Message) => {
        if (
            message.channel !== bridge.mineflayerDuck.officerChannel &&
            message.channel !== bridge.mineflayerDuckling.officerChannel &&
            message.channel !== bridge.combinedOfficerChannel
        ) return;
        if (!message.member) return;
        if (message.member.user.id !== "1287662103414571009" && message.member.user.id !== "791380888197660722") return;

        const params = message.content.split(" ");
        if (params[0] !== "guesstowin") return;

        const res = await fetch(`https://isle-of-ducks.vercel.app/api/guesstowin?id=${encodeURIComponent(params[1])}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.VERCEL_API_KEY}`
            }
        });
        if (!res.ok) return await message.react("❌").catch(() => {});
        const gtw = await res.json() as {
            success: false;
            message: string;
        } | {
            success: true;
            data: NonNullable<typeof bridge.guesstowin.data>
        };
        if (!gtw || !gtw.success) return await message.reply({
            embeds: [
                {
                    title: "Failed to fetch GTW data",
                    color: 0xB00020,
                    description: gtw.message
                }
            ]
        });

        if (gtw.data.ended !== null) return await message.reply({
            embeds: [
                {
                    title: "GtW has already ended",
                    color: 0xB00020,
                }
            ]
        });

        // bridge.guesstowin.interval = setInterval(async () => {
        //     if (bridge.guesstowin.prevGuesses === bridge.guesstowin.guesses) return;
        //     if (!bridge.guesstowinChannel) return;
        //     if (typeof bridge.guesstowinChannel.topic !== "string") return;
        //     const topics = bridge.guesstowinChannel.topic.split(' | ');
        //     if (topics[1].split(':')[0] !== "Guesses so far") return;
        //     await bridge.guesstowinChannel.setTopic(`${topics[0]} | Guesses so far: ${bridge.guesstowin.guesses} | ${topics[2]}`);

        //     bridge.guesstowin.prevGuesses = bridge.guesstowin.guesses;
        // }, 10000);

        bridge.guesstowin.data = gtw.data;
        if (params.length === 3 && !isNaN(+params[2])) bridge.guesstowin.guesses = +params[2];
        await message.react('✅').catch(() => {});
    },
} as BotEvent;
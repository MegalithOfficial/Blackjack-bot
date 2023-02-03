import { Client as BaseClient, Events, EmbedBuilder as Embed, ButtonBuilder as Button, ButtonStyle, ActionRowBuilder as Row } from "discord.js"
import { Blackjack } from "./classes/Blackjack.js";
import config from "./config.js"

const client = new BaseClient({
    intents: 3276799
});

const collection = new Map();

const game = new Blackjack();
const { playerHand, dealerHand } = game;

client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const row = new Row().addComponents(
    new Button().setCustomId("hit").setStyle(ButtonStyle.Success).setLabel("Hit").setDisabled(false),
    new Button().setCustomId("stand").setStyle(ButtonStyle.Danger).setLabel("Stand").setDisabled(false)
)

client.on(Events.MessageCreate, (message) => {
    if (message.content === "!bj") {
        game.startgame();

        const startEmbed = new Embed()
            .setAuthor({ name: "Blackjack - Oyun Başladı!", iconURL: message.author.avatarURL() })
            .addFields(
                { name: `Elin [${playerHand.getValue()}]`, value: `${game.refresh()}` }
            )
            .setColor("Green")
            .setTimestamp();

        message.reply({ embeds: [startEmbed], components: [row] }).then((msg) => collection.set(`${message.author.id}_data`, msg.id));

    } /*else if (message.content === "!bj hit") {
        game.hit(playerHand);
        if (playerHand.isBust()) {
            message.reply(`Patladın! Elin: ${playerHand.cards.map(c => `${c.rank} of ${c.suit}`).join(', ')}.`);
        } else {
            message.reply(`Hit attın. Elin: ${playerHand.cards.map(c => `${c.rank} of ${c.suit}`).join(', ')}.`);
        }
    } else if (message.content === '!bj stand') {
        const result = game.getResults();
        message.reply(`Dealer'ın eli: ${dealerHand.cards.map(c => `${c.rank} of ${c.suit}`).join(', ')}. ${result}.`);
    }*/
})

client.on(Events.InteractionCreate, async (interaction) => {
    await interaction.deferUpdate();

    if (interaction.isButton() && interaction.customId === "hit") {
        const message = await interaction.channel.messages.fetch(collection.get(`${interaction.user.id}_data`))
        if (!message || message === undefined) return;
        if (playerHand.isBust()) {

            const disabledrow = new Row().addComponents(
                new Button().setCustomId("hit").setStyle(ButtonStyle.Success).setLabel("Hit").setDisabled(true),
                new Button().setCustomId("stand").setStyle(ButtonStyle.Danger).setLabel("Stand").setDisabled(true)
            )

            const result = game.getResults();

            const editedembed = new Embed()
                .setAuthor({ name: "Blackjack - Kaybettin" })
                .addFields(
                    { name: "Puanın:", value: `\`${result.playerValue}\``, inline: true },
                    { name: "Dealer'in Puanı:", value: `\`${result.dealerValue}\``, inline: true }
                )
                .setColor("Red")
                .setTimestamp();

            message.edit({ embeds: [editedembed], components: [disabledrow] });
        } else {
            game.hit(playerHand);

            const startEmbed = new Embed()
                .setAuthor({ name: "Blackjack - Hit", })
                .setDescription("**Hit** attın.  Buttonlara basarak oyna.")
                .addFields(
                    { name: `Elin [${playerHand.getValue()}]`, value: `${game.refresh()}` }
                )
                .setColor("Green")
                .setFooter({ text: "Kaybetme nedeni: Bust" })
                .setTimestamp();

            message.edit({ embeds: [startEmbed], components: [row] })

            if (playerHand.isBust()) {

                const disabledrow = new Row().addComponents(
                    new Button().setCustomId("hit").setStyle(ButtonStyle.Success).setLabel("Hit").setDisabled(true),
                    new Button().setCustomId("stand").setStyle(ButtonStyle.Danger).setLabel("Stand").setDisabled(true)
                )

                const result = game.getResults();

                const editedembed = new Embed()
                    .setAuthor({ name: "Blackjack - Kaybettin" })
                    .addFields(
                        { name: "Puanın:", value: `\`${result.playerValue}\``, inline: true },
                        { name: "Dealer'in Puanı:", value: `\`${result.dealerValue}\``, inline: true }
                    )
                    .setColor("Red")
                    .setFooter({ text: "Kaybetme nedeni: Bust" })
                    .setTimestamp();

                message.edit({ embeds: [editedembed], components: [disabledrow] });
            }

        }
    } else if (interaction.isButton() && interaction.customId === "stand") {

        const message = await interaction.channel.messages.fetch(collection.get(`${interaction.user.id}_data`))
        const result = game.getResults();

        const disabledrow = new Row().addComponents(
            new Button().setCustomId("hit").setStyle(ButtonStyle.Success).setLabel("Hit").setDisabled(true),
            new Button().setCustomId("stand").setStyle(ButtonStyle.Danger).setLabel("Stand").setDisabled(true)
        )

        if (result.iswon === false) {
            const editedembed = new Embed()
                .setAuthor({ name: "Blackjack - Kaybettin" })
                .addFields(
                    { name: "Puanın:", value: `\`${result.playerValue}\``, inline: true },
                    { name: "Dealer'in Puanı:", value: `\`${result.dealerValue}\``, inline: true }
                )
                .setColor("Red")
                .setTimestamp();

            message.edit({ embeds: [editedembed], components: [disabledrow] });
        } else if (result.iswon === true) {
            const editedembed = new Embed()
                .setAuthor({ name: "Blackjack - Kazandın" })
                .addFields(
                    { name: "Puanın:", value: `\`${result.playerValue}\``, inline: true },
                    { name: "Dealer'in Puanı:", value: `\`${result.dealerValue}\``, inline: true }
                )
                .setColor("Green")
                .setTimestamp();

            message.edit({ embeds: [editedembed], components: [disabledrow] });
        } else if (result.iswon === null) {
            const editedembed = new Embed()
                .setAuthor({ name: "Blackjack - Berabere" })
                .addFields(
                    { name: "Puanın:", value: `\`${result.playerValue}\``, inline: true },
                    { name: "Dealer'in Puanı:", value: `\`${result.dealerValue}\``, inline: true }
                )
                .setColor("Orange")
                .setTimestamp();

            message.edit({ embeds: [editedembed], components: [disabledrow] });
        }

    }

})

client.login(config.Bot.Token)

process.on("uncaughtException", (err) => {
    console.log(err)
})
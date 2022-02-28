const fs = require("fs");

const { Client, Intents } = require("discord.js");
const { fetch } = require("cross-fetch");
const { config } = require("dotenv");
const cron = require("cron");

config();

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.login(process.env.TOKEN);

client.on("ready", () => {
	console.log("Estou online");
	const writeFile = async () => {
		console.log("Estou executando?");

		const channel = client.channels.cache.get(String(process.env.TESTSERVER));
		const length = process.argv.length;
		const uriInstaUser = process.argv[length - 1];

		const urlRequest = `https://randomuser.me/api/?results=${uriInstaUser}`;
		const response = await fetch(urlRequest);
		const dataInsta = await response.json();

		const insta = dataInsta.results[0].login;

		const data = JSON.stringify(insta, null, 2);

		const output = fs.createWriteStream(`${Math.random().toFixed(2)}.json`);
		fs.writeFile(output.path, data, { encoding: "utf-8" }, async () => {
			try {
				const sending = await channel.send({
					content: "@everyone",
					files: [output.path],
				});

				if (sending) fs.unlinkSync(output.path);
			} catch (error) {
				console.log(error.message);
			}
		});
	};

	setInterval(() => {
		writeFile();
	}, 9000);
});

const fs = require("fs");

const { Client, Intents } = require("discord.js");
const { fetch } = require("cross-fetch");
const { config } = require('dotenv');

config();

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.login(process.env.TOKEN);

client.on('ready', () => {
	console.log('Estou online');
	const writeFile = async () => {
		const channel = client.channels.cache.get(String(process.env.TESTSERVER));
		const length = process.argv.length;
		const urlRequest = process.argv[length - 1];

		const response = await fetch(urlRequest);
		const status = response.status;
		const dataJson = await response.json();

		let dataStaved;

		if (status === 200 || status === 201) {
			dataStaved = {
				status,
				data: dataJson,
			};
		} else {
			dataStaved = {
				status,
				data: `API retornou uma resposta com o seguinte status: ${status}`,
			};
		}

		const data = JSON.stringify(dataStaved, null, 2);

		const output = fs.createWriteStream(`${Math.random().toFixed(2)}.json`);
		fs.writeFile(output.path, data, { encoding: 'utf-8' }, async () => {
			try {
				const sending = await channel.send({
					content: '@everyone',
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
	}, process.env.TIMEMS);
});

require('dotenv').config()
const { RTMClient } = require('@slack/rtm-api')
const {
	textHasTime,
	renderOtherTimezonesMessage
} = require('./parse-timezones')

const rtm = new RTMClient(process.env.SLACK_BOT_TOKEN)

rtm.on('message', (event) => {
	console.log(event)
	
	if (!textHasTime(event.text)) return
	
	//slack.users.info(id).then(i => i.tzOffset / 60)
	rtm.sendMessage(renderOtherTimezonesMessage(event.text), event.channel)
		.then((reply) => {
			console.log('Reply sent successfully', reply.ts)
		})
		.catch((err) => {
			console.log('An error occured:', err)
		})
})

rtm.start()
	.then((res) => {
		const { self, team } = res
		console.log('RTM bot ready!', self, team)
	})
	.catch((err) => {
		console.log('Error starting RTM', err)
	})

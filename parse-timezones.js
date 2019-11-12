const moment = require('moment-timezone')

const timezones = [
	{ tz: 'Asia/Dubai', city: 'Dubai', flag: ':flag-ae:' },
	{ tz: 'Europe/Istanbul', city: 'Istanbul', flag: ':flag-tr:' },
	{ tz: 'America/New_York', city: 'NYC', flag: ':flag-us:' },
	{ tz: 'America/Los_Angeles', city: 'LA', flag: ':flag-us:' },
]

/**
 * Helpers below used from: https://github.com/dempfi/slack-timezone-bot/blob/master/src/index.ts
 * 
 * Matches time strings in free form text
 * 12.12am, 12:12am, 1 12am, 1.12 am, 1.02 am
 * 23:23, 23 23, 23.23
 * 12am, 12PM, 1PM, 1am
 */
const TIME_REGEX = /[1-9]\d?(([:. ]\d{2}([ ]?[a|p]m)?)|([ ]?[a|p]m))/i

const textHasTime = (text) => TIME_REGEX.test(text)
const parseTime = (text) => text.match(TIME_REGEX)[0]
const normalizeTime = (s) => moment(s, 'h:mA').format('h:mm A')
moment.fn.formatTime = function () {
    if (this.minute() !== 0) {
        return this.format('h:mma')
    }
    return this.format('ha')
};

const renderOtherTimezonesMessage = (text) => {
	const timeStr = moment(normalizeTime(parseTime(text)), 'h:mm A')
	// TODO: detect author user's timzeone from slack user info api call and init
	// moment with that timezone (offset)
	const originTime = moment.tz(timeStr, 'America/New_York')
	// console.log('origin time: ', originTime.toString())

	const timeInOtherTimezones = []
	timezones.map(t => {
		timeInOtherTimezones.push({
			...t,
			time: originTime.clone().tz(t.tz)
		})
	})

	const otherTzStr = timeInOtherTimezones
		.map(z => `- ${z.time.formatTime()} in ${z.flag} ${z.city}`)
		.join('\n').trim()
		
	const message = `Just to help you guys ${originTime.formatTime()} in New York is:\n${otherTzStr}`
	// console.log(message)
		
	return message
}

module.exports = {
	textHasTime,
	renderOtherTimezonesMessage
}
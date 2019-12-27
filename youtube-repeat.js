var vid = 'qO8yfBLNVjU';
var start = 0;
var end = -1;
var prevTime = -1;
var count = 0;
var isRepeating = true;

const START_COOKIE_KEY = 'start';
const END_COOKIE_KEY = 'end';
const ID_COOKIE_KEY = 'id';

(() => {
	const cookies = document.cookie.split(';');
	for (let i = 0; i < cookies.length; i += 1) {
		if (cookies[i][0] === ' ') {
			cookies[i] = cookies[i].substr(1);
		}

		let pair = cookies[i].split('=');
		if (pair.length > 1) {
			if (pair[0] === ID_COOKIE_KEY) {
				vid = pair[1];
			} else if (pair[0] === START_COOKIE_KEY) {
				start = parseInt(pair[1], 10);
			} else if (pair[0] === END_COOKIE_KEY) {
				end = parseInt(pair[1], 10);
			}
		}
	}
})();

var tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function init() {
	const playerVars = { start };
	if (end !== -1) {
		playerVars.end = end;
	}

	player = new YT.Player('player', {
		height: '390',
		width: '640',
		videoId: vid,
		playerVars,
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange,
			'onError': onPlayerError,
		}
	});
}

function onYouTubeIframeAPIReady() {
	init();
}


function onPlayerReady(event) {
	event.target.playVideo();

	const duration = player.getDuration();
	if (end === -1) {
		end = duration;
	}

	document.getElementById('startTime').value = NumberToTimeString(start, duration);
	document.getElementById('endTime').value = NumberToTimeString(end, duration);
}

function onPlayerError() {
	window.alert('Oops! Please try again or enter a valid youtube URL!');
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED && isRepeating) {
		player.seekTo(start);
		player.playVideo();
		count += 1;
		document.getElementById('repeatTime').innerHTML = count.toString();
	} else if (event.data == YT.PlayerState.PLAYING) {
		SetCookie(ID_COOKIE_KEY, event.target.getVideoData()['video_id']);
		SetCookie(START_COOKIE_KEY, start);
		SetCookie(END_COOKIE_KEY, end);

		if (prevTime !== -1) {
			player.seekTo(prevTime, true);
			prevTime = -1;
		}

		document.getElementById('videoName').innerHTML = player.getVideoData().title;
		document.getElementById('url').value = `https://www.youtube.com/watch?v=${vid}`;
	}
}

function stopVideo() {
	player.stopVideo();
}

function submitID() {
	if (player === null) return;
	const re = new RegExp('(?:https://www.youtube.com/watch\\?v=|youtu.be/)([0-9A-Za-z_-]+)');
	const newVid = re.exec(document.getElementById('url').value);
	if (newVid === null) {
		window.alert('Invalid Youtube URL!');
		return;
	}
	if (newVid[1] !== vid) {
		vid = newVid[1];
		start = 0;
		end = -1;

		player.loadVideoById({
			videoId: vid,
			startSeconds: start,
		});

		count = 0;
		document.getElementById('repeatTime').innerHTML = count.toString();
	}
}

function RepeatButtonClicked() {
	if (isRepeating) {
		isRepeating = false;
		document.getElementById('repeatStatus').innerHTML = 'Disabled';
		document.getElementById('repeatButton').innerHTML = 'Enable';
	} else {
		isRepeating = true;
		document.getElementById('repeatStatus').innerHTML = 'Enabled';
		document.getElementById('repeatButton').innerHTML = 'Disable';
	}
}

function StartTimeButtonClicked() {
	const timeString = document.getElementById('startTime').value;
	const startTime = TimeStringToNumber(timeString);
	if (startTime === start) {
		return;
	}

	const playerState = player.getPlayerState();

	if (playerState !== -1) {
		// We can assume that the video remains the same when this button is clicked
		const duration = player.getDuration();
		if (startTime > duration || startTime < 0 || startTime > end) {
			document.getElementById('startTime').value = NumberToTimeString(start, duration);
			window.alert('Invalid start time');
			return;
		}

		const currentTime = player.getCurrentTime();
		start = startTime;
		player.loadVideoById({
			videoId: vid,
			startSeconds: start,
			endSeconds: end
		});

		if (currentTime > start) {
			prevTime = currentTime;
		}
	}
}

function EndTimeButtonClicked() {
	const timeString = document.getElementById('endTime').value;
	const endTime = TimeStringToNumber(timeString);
	if (endTime === end) {
		return;
	}

	const playerState = player.getPlayerState();

	if (playerState !== -1) {
		// We can assume that the video remains the same when this button is clicked
		const duration = player.getDuration();
		if (endTime > duration || endTime < 0) {
			document.getElementById('endTime').value = NumberToTimeString(end, duration);
			window.alert('Invalid end time');
			return;
		}
		const currentTime = player.getCurrentTime();
		end = endTime;
		player.loadVideoById({
			videoId: vid,
			startSeconds: start,
			endSeconds: end
		});

		if (currentTime < end) {
			prevTime = currentTime;
		}
	}
}


function NumberToTimeString(time, duration) {
	let length = 1;
	let denom = 1;
	while (denom * 60 < duration) {
		denom *= 60;
		length += 1
	}
	
	if (length < 2) {
		length = 2;
	}

	const tokens = new Array(length);

	for (let i = 0; i < length; i += 1) {
		if (time < denom) {
			tokens[i] = '00';
			denom /= 60;
			continue;
		}
		const number = (time - time % denom) / denom;
		const s = number.toString();
		tokens[i] = '0'.repeat(2 - s.length) + s;
		time = time % denom;
		denom /= 60;
	}

	return tokens.join(':');
}

function TimeStringToNumber(timeString) {
	const tokens = timeString.split(':').reverse();
	let startTime = 0;
	for (let i = 0; i < tokens.length; i += 1) {
		const number = parseInt(tokens[i], 10);
		if (isNaN(number) || number < 0 || number >= 60) {
			return -1;
		}
		startTime += Math.pow(60, i) * number;
	}

	return startTime;
}

function SetCookie(key, value) {
	document.cookie = `${key}=${value}`;
}

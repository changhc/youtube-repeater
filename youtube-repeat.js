var vid = 'qO8yfBLNVjU';
var cookies = document.cookie.split(';');
var cookieIdx = -1;
for (let i = 0; i < cookies.length; i += 1) {
    if (cookies[i][0] === ' ') {
        cookies[i] = cookies[i].substr(1);
    }
    let pair = cookies[i].split('=');
    if (pair.length > 1 && pair[0] === 'id') {
        vid = pair[1];
        cookieIdx = i;
    }
}

var count = 0;
var isRepeating = true;

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  	player = new YT.Player('player', {
		height: '390',
		width: '640',
		videoId: vid,
		events: {
		  'onReady': onPlayerReady,
		  'onStateChange': onPlayerStateChange,
          'onError': onPlayerError,
		}
	});
}


function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerError(event) {
    window.alert('Oops! Please try again or enter a valid youtube URL!');
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.ENDED && isRepeating) {
		player.seekTo(0);
		player.playVideo();
		count += 1;
		document.getElementById("repeatTime").innerHTML = count.toString();
  	}
  	else if(event.data == YT.PlayerState.PLAYING){
        if (cookieIdx !== -1) {
            cookies[cookieIdx] = 'id=' + event.target.getVideoData()['video_id'];
        } else if (document.cookie === "") {
            cookies[0] = 'id=' + event.target.getVideoData()['video_id'];
        } else {
            cookies.push('id=' + event.target.getVideoData()['video_id']);
        }

        document.cookies = cookies.join('; ');
        console.log(document.cookies);
		document.getElementById("videoName").innerHTML = player.getVideoData().title;
  	}
}
function stopVideo() {
  	player.stopVideo();
}

function submitID(){
  	if(player === null) return;
  	re = new RegExp("(?:https://www.youtube.com/watch\\?v=|youtu.be/)([0-9A-Za-z_-]+)");
  	newVid = re.exec(document.getElementById("url").value);
    if (newVid === null) {
        window.alert('Invalid Youtube URL!');
        return;
    }
    vid = newVid[1];
  	player.loadVideoById(vid, 0);
  
  	count = 0;
  	document.getElementById("repeatTime").innerHTML = count.toString();

}
function RepeatButtonClicked(){
  	if(isRepeating){
		isRepeating = false;
		document.getElementById("repeatStatus").innerHTML = "Disabled";
		document.getElementById("repeatButton").innerHTML = "Enable";
  	}
  	else{
		isRepeating = true;
		document.getElementById("repeatStatus").innerHTML = "Enabled";
		document.getElementById("repeatButton").innerHTML = "Disable";
  	}
}

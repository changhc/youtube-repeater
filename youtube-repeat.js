var vid = 'qO8yfBLNVjU';
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
		  'onStateChange': onPlayerStateChange
		}
	});
}


function onPlayerReady(event) {
  
  event.target.playVideo();
  
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.ENDED && isRepeating) {
		player.seekTo(0);
		player.playVideo();
		count += 1;
		document.getElementById("repeatTime").innerHTML = count.toString();
  	}
  	else if(event.data == YT.PlayerState.PLAYING){
		document.getElementById("videoName").innerHTML = player.getVideoData().title;
  	}
}
function stopVideo() {
  	player.stopVideo();
}

function submitID(){
  	if(player == null) return;
  	re = new RegExp("(?:https://www.youtube.com/watch\\?v=)([0-9A-Za-z_]+)");
  	vid = re.exec(document.getElementById("url").value)[1];
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
var accessToken =
  "?access_token=CXyFeSBw2lAdG41xkuU3LS6a_nwyxwwCz2dCkUohw-rw0C49x2HqP__6_4is5RPx";
var API = "https://api.genius.com/search";
var APISong = "https://api.genius.com/songs/";
var songID = "2471960";
var maxSong = 2471960;
const youtubeUrl = "https://www.googleapis.com/youtube/v3/search?key";
const key = "AIzaSyDX7f4MFB8gFIPnCgjWc4_AIWvLm-UdnzM";

const youtubeMusicAPIurl = "https://yt.lemnoslife.com/videos?";
//Max song is 489579 for a fairly safe number. But 2 million songs

const buttonNewSong = document.querySelector("#new-song");

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//https://api.genius.com/search?q=Kendrick%20Lamar
var xhr = new XMLHttpRequest(); //XML HTTP Request
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status === 200 || xhr.status === 304) {
      // Success! Do stuff with data.
      //console.log(xhr.responseText);
    }
  }
};
xhr.open("GET", APISong + songID + accessToken, false);
//xhr.open("GET", API+accessToken+ '&q=Kendrick%20Lamar', false);

xhr.send();
//console.log(xhr.status);
//console.log(xhr.statusText);
demo = xhr.response;

var json = JSON.parse(demo);
var song = json["response"]["song"];

function newRandomSong() {
  songID = getRandomInt(1, maxSong);
  randomSong();
}

async function randomSong() {
  xhr.open("GET", APISong + songID + accessToken, false);
  xhr.send();
  demo = xhr.response;

  while (xhr.status === 404) {
    //Checks if the Random Song Exists
    songID = getRandomInt(1, maxSong);
    xhr.open("GET", APISong + songID + accessToken, false);
    xhr.send();
    demo = xhr.response;
  }

  json = JSON.parse(demo);
  song = json["response"]["song"];
  console.log(song);
  document.getElementById("songImage").innerHTML =
    '<img src="' +
    song["song_art_image_url"] +
    '"alt="Some Awesome Album Art" style="width:200px;height:200px;">';
  // I made these pixel values since I'd rather have overlap on a small screen than the image scaled too small

  //document.getElementById("song").innerHTML = "SONG: <a href="+song['url']+" >"+song['title'].toUpperCase()+"</a>";
  document.getElementById("song").innerHTML =
    'SONG: <a target="_blank" href=' +
    song["url"] +
    " >" +
    song["title"].toUpperCase() +
    "</a>";

  document.getElementById("artist").innerHTML =
    'ARTIST: <a target="_blank"  href=' +
    song["primary_artist"]["url"] +
    ">" +
    song["primary_artist"]["name"].toUpperCase() +
    "</a>";
  document.getElementById("releaseDate").innerHTML =
    "RELEASE DATE: " + song["release_date"];

  if (document.querySelector("#player")?.nodeName === "IFRAME") {
    document.querySelector("#player").remove();
  }

  document.querySelector(".container").innerHTML = `<div id="player"></div>`;

  const youtubeDataRequest = await fetch(
    "https://content-youtube.googleapis.com/youtube/v3/search?" +
      new URLSearchParams({
        q: `${song["title"]} ${song["primary_artist"]["name"]}`,
        key,
        type: "video",
        part: "snippet",
        videoCategoryId: 10,
      })
  ).then((data) => {
    return data.json();
  });
  console.log(youtubeDataRequest);

  const songId = youtubeDataRequest.items[0].id.videoId;

  createYoutubeIframe(songId);
}
function tweetSong() {
  window.open(
    'https://twitter.com/intent/tweet?hashtags=songs&text=Found a cool song today. "' +
      song["title"] +
      '" by ' +
      song["primary_artist"]["name"]
  );
}

function createYoutubeIframe(songId) {
  try {
    var player;
    player = new YT.Player("player", {
      height: "360",
      width: "640",
      videoId: songId,
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: errorcito,
      },
    });
  } catch (e) {
    buttonNewSong.click();
  }
}

function onPlayerReady(event) {
  try {
    event.target.playVideo();
  } catch (e) {
    console.log(e);
  }
}

function errorcito(event) {
  console.log(event);
}

function onPlayerStateChange(event) {
  console.log(event);
  if (event.data === 0) {
    buttonNewSong.click();
  }
}

//GETTING STARTED //
$(document).ready(function () {
  newRandomSong();
});

states = {
  unstarted: 1,
  ended: 0,
  playing: 1,
  paused: 2,
  almacenando: 3,
  video: 5,
};

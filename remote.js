var token;

var hammer = new Hammer(document.getElementById("remote"));
hammer.get("swipe").set({ direction: Hammer.DIRECTION_ALL });

hammer.on("press", function(e) {
  showSettings(true);
});

hammer.on("tap", function(e) {
  playpause();
  flash("playpause");
});

hammer.on("swipe", function(e) {
  switch(e.direction) {
    case 4: // swipe right
      request("player/next");
      flash("next");
      break;
    case 2: // swipe left
      request("player/previous");
      flash("back");
      break;
    case 8: // swipe up
      flash("like");
      break;
    case 16: // swipe down
      flash("dislike");
      break;
    default:
      flash(e.direction);
      break;
  }
});

function showSettings(show) {
  $("#remote").toggle(!show);
  $("#settings").toggle(show);
}

function request(endpoint) {
  $.ajax({
    url: "https://api.spotify.com/v1/me/" + endpoint,
    type: "POST",
    headers: {"Authorization": "Bearer " + token}
  });
}

function playpause() {
  $.ajax({
    url: "https://api.spotify.com/v1/me/player",
    type: "GET",
    headers: {"Authorization": "Bearer " + token},
    success: function(e) {
      $.ajax({
        url: "https://api.spotify.com/v1/me/player/" + (e.is_playing ? "pause" : "play"),
        type: "PUT",
        headers: {"Authorization": "Bearer " + token}
      });
    }
  });
}

var flash_timer;
function flash(text) {
  $("#flash").text(text);
  clearTimeout(flash_timer);
  flash_timer = setTimeout(function() {
    $("#flash").text("");
  }, 800);
}

$("#clear-btn").click(function() {
  if(confirm("are you sure you want to clear your token?")) {
    localStorage.removeItem("spotify_token");
    location.reload();
  }
});

$("#exit-btn").click(function() {
  showSettings(false);
});

$("#setup-btn").click(function() {
  if ($("#token-input").val() != "") {
    localStorage.setItem("spotify_token", $("#token-input").val());
    location.reload();
  }
});

$(document).ready(function() {
  showSettings(false);

  if(localStorage.getItem("spotify_token") == null) {
    $("#setup").show();
    $("#remote").hide();
  } else {
    token = localStorage.getItem("spotify_token");
  }
});
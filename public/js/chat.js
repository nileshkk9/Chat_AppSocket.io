const socket = io();

//elemnts
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $locationButton = document.querySelector("#location");
const $messages = document.querySelector("#messages");

//templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

socket.on("locationMessage", url => {
  console.log(url);
  const html = Mustache.render(locationTemplate, {
    url: url.text,
    createdAt: moment(url.createdAt).format("h:mm A")
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("message", message => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm A")
  });
  $messages.insertAdjacentHTML("beforeend", html);
});
$messageForm.addEventListener("submit", e => {
  e.preventDefault();
  //disable
  $messageFormButton.setAttribute("disabled", "true");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, error => {
    //enable
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (error) return console.log(error);
    console.log("delivered");
  });
});

$locationButton.addEventListener("click", () => {
  // disable
  $locationButton.setAttribute("disabled", "true");

  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by this browser.");
  }
  navigator.geolocation.getCurrentPosition(position => {
    // console.log(position);
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      error => {
        if (error) {
          return console.log(error);
        }
        console.log("Location shared");
      }
    );
    //enable button
    $locationButton.removeAttribute("disabled");
    $messageFormInput.focus();
  });
});

socket.emit("join", { username, room },(error)=>{
  

});

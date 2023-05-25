const socket = io("http://54.145.184.28:4000", {
    transports: ["websocket"],
});

let name = "";
let password = "";

function showPopup() {
    document.getElementById("popup").style.display = "block";
}
 
function saveInputs() {
    name = document.getElementById("nameInput").value.trim();
    room = document.getElementById("roomInput").value.trim();

    console.log({name,room})

    if (name === "kavin" && room === "07") {
        document.getElementById("popup").style.display = "none";
        document.getElementById("input").focus();
        // Remove the blur effect from the chat div
        document.getElementById("chat").style.filter = "none";
        alert("logged Successfully 😉")
    }else{
        alert("Provide valid userName or RoomId 😋 ")
    }
}

showPopup();

let messages = document.getElementById("messages");
let form = document.getElementById("form");
let input = document.getElementById("input");

form.addEventListener("submit", function (e) {
    console.log("input", input.value)
    e.preventDefault();
    if (input.value) {
        socket.emit("chat-message", input.value, name);
        input.value = "";
    }
});

socket.on("chat-message", function (msg, name, animationUrl,id) {

    let item = document.createElement("li");

    // Create a div element for the circular profile image
    let profileDiv = document.createElement("div");
    profileDiv.classList.add("profile-image");

    // Create an img element for the GIF
    let gifImg = document.createElement("img");
    gifImg.src = animationUrl;

    // Append the img element to the div element 
    profileDiv.appendChild(gifImg);

    // Create a span element for the name
    let nameSpan = document.createElement("span");
    nameSpan.textContent = name;
    nameSpan.style.color = getColorForName(name);

    item.appendChild(profileDiv);
    item.appendChild(nameSpan);
    item.append(": " + msg);

    // Conditionally add different classes based on the name
    if (socket.id === id) {
        item.classList.add("message-from-me");
    } else {
        item.classList.add("message-from-other");
    }

    messages.append(item);
    window.scrollTo(0, document.body.scrollHeight);
});

const nameColors = {};
const getColorForName = (name) => {
    if (!nameColors[name]) {
        const usedColors = Object.values(nameColors);
        const availableColors = [
            "red",
            "green",
            "blue",
            "purple",
            "orange",
        ].filter((color) => !usedColors.includes(color));
        nameColors[name] = availableColors[0] || "black";
    }
    return nameColors[name];
};
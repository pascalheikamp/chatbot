let questionInput = document.querySelector(".form-control");
window.addEventListener('load', init)
let sendButton;
let inputField
let firstMessageBox;
let secondMessageBox;
let chatHistory;

function init() {
    sendButton = document.getElementById('send-button');
    firstMessageBox = document.querySelector(".content");
    secondMessageBox = document.querySelector(".content-2");
    inputField = document.querySelector(".form-control");
    sendButton.addEventListener('click', submitMessage);
}


async function submitMessage() {
    createUserMessage(inputField.value);
    await fetch('http://localhost:8000/chat', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "question": questionInput.value || localStorage.getItem("chatHistory")
        })
    }).then((response) => response.json())
        .then((data) => [createBotMessage(data), saveChatHistory(data, questionInput.value)])
        .catch((error) => console.log('data couldnt load: ' + error))
}

function createUserMessage(value) {
    let messageElement = document.createElement("p");
    let userImage = document.createElement("img");
    userImage.src="assets/profile.png"
    userImage.classList.add("profile")
    messageElement.textContent = value
    firstMessageBox.appendChild(userImage);
    firstMessageBox.append(messageElement);
}

function createBotMessage(data) {
    let messageElement = document.createElement("p");
    let message = JSON.stringify(data.kwargs.content);
    messageElement.textContent = message;
    let userImage = document.createElement("img");
    userImage.src="assets/robot.jpg"
    userImage.classList.add("robot")
    firstMessageBox.appendChild(userImage);
    firstMessageBox.append(messageElement);
}

function saveChatHistory(chatResponse, sendData) {
    let chatObject = {
        userMessage: sendData,
        aiResponse: chatResponse.kwargs.content
    }

    let storage = localStorage.getItem("chatHistory");
    chatHistory = JSON.parse(storage);
    if (chatHistory == null) {
        chatHistory = []
    }
    chatHistory.push(chatObject)
    let stringifiedChatHistory = JSON.stringify(chatHistory);
    localStorage.setItem("chatHistory", stringifiedChatHistory);

    console.log(localStorage.getItem("chatHistory"));
}
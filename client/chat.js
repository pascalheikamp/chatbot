let incomingMessage = document.querySelector("received-chats");


let sendButton = document.getElementById("sendButtonId");

// console.log(sendButton)

sendButton.addEventListener("click", async () => {
    let questionInput = document.querySelector(".form-control");
    let receivedMessageInbox = document.querySelector(".received-msg-inbox");
    let userImageContainer = document.querySelector(".profile-img");
    let imageElement = document.createElement("img");
    imageElement.src = "assets/profile.png";
    let incomingMessageElement = document.createElement("p");

    let aiImage = document.createElement("img");
    // receivedMessageInbox.classList.add("message")
    // messageElement.textContent = questionInput.value
    // receivedMessageInbox.appendChild(messageElement);

    let outgoingMessageInbox = document.querySelector(".outgoing-chats-msg");
    let outcomingMessageElement = document.createElement("p");


    if (questionInput.value !== "" && !undefined) {
        function showChatResponse(data) {
            if(!data) {
                console.log("error")
            } else {
                let outgoingMessage = JSON.stringify(data.kwargs.content);
                outcomingMessageElement.textContent = outgoingMessage;
                outgoingMessageInbox.appendChild(outcomingMessageElement);
                console.log("succesfull" + data)
            }
        }
        incomingMessageElement.textContent = questionInput.value;
        if(userImageContainer) {
            userImageContainer.appendChild(imageElement);
        } else {
            // userImageContainer.classList.add("next-profile-img")
            receivedMessageInbox.appendChild(imageElement);
        }
        receivedMessageInbox.appendChild(incomingMessageElement);
        userImageContainer.classList.remove("profile-img")
        await fetch('http://localhost:8000/chat', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "question": questionInput.value
            })
        }).then((response) => response.json())
            .then((data) => showChatResponse(data))
            .catch((error) => console.log('data couldnt load: ' + error))
    } else {
        console.log("Please enter a message")
    }
})


console.log("works")
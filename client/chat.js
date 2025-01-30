/*
 *   Copyright (c) 2025
 *   All rights reserved.
 */
window.addEventListener("load", init);
let sendButton;
let nameField;
let levelField;
let enemyNameField;
let enemyLevelField;
let enemyHpField;
let hpField;
let firstMessageBox;
let secondMessageBox;
let chatHistory;
let movesContainer;
let pokemonStatusObj;
let enemyMovesContainer;
let questionInput;
let pokemonInputButton;
let SavedResponseMessage = localStorage.getItem("ChatHistory");

function init() {
  pokemonStatusObj = {};
  questionInput = document.querySelector(".form-control");
  pokemonInputButton = document.getElementById("pokemonInputButton");
  questionInput.setAttribute("disabled", "");
  sendButton = document.querySelector(".sendbutton");
  firstMessageBox = document.querySelector(".content");
  secondMessageBox = document.querySelector(".content-2");
  nameField = document.querySelector(".name");
  levelField = document.querySelector(".level");
  hpField = document.querySelector(".hp");
  enemyNameField = document.querySelector(".enemy-name");
  enemyLevelField = document.querySelector(".enemy-level");
  enemyHpField = document.querySelector(".enemy-hp");
  movesContainer = document.querySelector(".moves-container");
  enemyMovesContainer = document.querySelector(".enemymoves-container");
  pokemonInputButton.addEventListener("click", sendPokemonStatus);
  sendButton.addEventListener("click", sendMessage);
}

// const chatHis =  localStorage.getItem('chatHistory')
// const chatHisParse = JSON.parse(chatHis)
// console.log(chatHisParse.length)

// if (
//   nameField.value.trim() == "" ||
//   levelField.value.trim() === "" ||
//   hpField.value.trim() == "" ||
//   enemyNameField.value.trim() == "" ||
//   enemyLevelField.value.trim() == "" ||
//   enemyHpField.value.trim() == ""
// ) {
//   console.log("please provide a name, level and hp");
// } else {}

async function sendPokemonStatus() {
  sendButton.setAttribute("disabled", "");
  const endpoints = [
    `https://pokeapi.co/api/v2/pokemon/${nameField.value}`,
    `https://pokeapi.co/api/v2/pokemon/${enemyNameField.value}`,
  ];
  const response = await Promise.all(endpoints.map((url) => fetch(url)));
  if (!response[0].ok || !response[1].ok) {
    console.log("request failed");
    return;
  }

  const [userData, enemyData] = await Promise.all(
    response.map((res) => res.json())
  );

  console.log(userData);
  console.log(enemyData);
  const userMoves = userData.moves.map((move) => move);
  const enemyMoves = enemyData.moves.map((move) => move);

  pokemonStatusObj = {
    userPokemon: {
      name: nameField.value,
      level: levelField.value,
      hp: hpField.value,
    },
    enemyPokemon: {
      enemyName: enemyNameField.value,
      enemylevel: enemyLevelField.value,
      enemyHp: enemyHpField.value,
    },
  };
  showRandomMoveSets(userMoves, enemyMoves);

  console.log(pokemonStatusObj.enemyPokemon.enemyMoves);
  console.log(pokemonStatusObj.userPokemon.moves);

  await fetch("http://localhost:8000/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: nameField.value,
      level: nameField.value,
      moves: pokemonStatusObj.userPokemon.moves,
      hp: hpField.value,
      enemyName: enemyNameField.value,
      enemyLevel: enemyLevelField.value,
      enemyMoves: pokemonStatusObj.enemyPokemon.enemyMoves,
      enemyHp: enemyHpField.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => [
      createBotMessage(data),
      saveChatHistory(data, pokemonStatusObj),
    ]);
  setTimeout(() => {
    sendButton.removeAttribute("disabled");
  }, 2000);
  questionInput.removeAttribute("disabled");
}

function showRandomMoveSets(userMoves, enemyMoves) {
  const randomMoves = [...userMoves]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const randomMovesEnemy = [...enemyMoves]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  pokemonStatusObj.userPokemon.moves = randomMoves;
  pokemonStatusObj.enemyPokemon.enemyMoves = randomMovesEnemy;
  const listElementUser = document.createElement("ul");
  const listElementEnemy = document.createElement("ul");
  const yourMoveSet = randomMoves.map((move) => move.move);
  const enemyMoveSet = randomMovesEnemy.map((move) => move.move);
  console.log(yourMoveSet);
  movesContainer.innerHTML = "";

  yourMoveSet.forEach((element) => {
    const moveListItem = document.createElement("li");
    moveListItem.textContent = element.name;
    listElementUser.appendChild(moveListItem);
  });
  movesContainer.append(listElementUser);
  enemyMovesContainer.innerHTML = "";
  enemyMoveSet.forEach((element) => {
    const moveListItem = document.createElement("li");
    moveListItem.textContent = element.name;
    listElementEnemy.appendChild(moveListItem);
  });
  enemyMovesContainer.append(listElementEnemy);
}

function createUserMessage(value) {
  let messageElement = document.createElement("p");
  let userImage = document.createElement("img");
  userImage.src = "assets/profile.png";
  userImage.classList.add("profile");
  messageElement.textContent = value;
  firstMessageBox.appendChild(userImage);
  firstMessageBox.append(messageElement);
}

let chatHis = localStorage.getItem("chatHistory");
console.log(chatHis);
async function sendMessage() {
  let chatHis = localStorage.getItem("chatHistory");
  if (chatHis) {
    let chatHisMessage = JSON.parse(chatHis);
    let lastMessage = chatHisMessage[chatHisMessage.length - 1]?.aiResponse || "";

    console.log("Client-side LastMessage before sending:", lastMessage);

    await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        userQuestion: questionInput.value,
        lastMessage: lastMessage, // ✅ Send as a normal string
      }),
    })
      .then((response) => response.json())
      .then((data) => [
        createBotMessage(data),
        createUserMessage(questionInput.value),
        saveChatHistory(data, questionInput.value),
      ]);
  } else {
    console.log("No chat history found");
  }
}

// function createUserMessage(value) {
//   let messageElement = document.createElement("p");
//   let userImage = document.createElement("img");
//   userImage.src = "assets/profile.png";
//   userImage.classList.add("profile");
//   messageElement.textContent = value;
//   firstMessageBox.appendChild(userImage);
//   firstMessageBox.append(messageElement);
// }

function createBotMessage(data) {
  let messageElement = document.createElement("p");
  let message = JSON.stringify(data.kwargs.content);
  messageElement.textContent = message;
  let userImage = document.createElement("img");
  userImage.src = "assets/robot.jpg";
  userImage.classList.add("robot");
  firstMessageBox.appendChild(userImage);
  firstMessageBox.append(messageElement);
}

function saveChatHistory(chatResponse, sendData) {
  let chatObject = {
    userMessage: sendData,
    aiResponse: chatResponse.kwargs.content,
  };

  let storage = localStorage.getItem("chatHistory");
  chatHistory = JSON.parse(storage);
  if (chatHistory == null) {
    chatHistory = [];
  }
  chatHistory.push(chatObject);
  let stringifiedChatHistory = JSON.stringify(chatHistory);
  localStorage.setItem("chatHistory", stringifiedChatHistory);

  // console.log(localStorage.getItem("chatHistory"));
}

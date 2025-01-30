/*
 *   Copyright (c) 2025
 *   All rights reserved.
 */
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import express from "express";
import cors from "cors";
import "dotenv/config";

const model = new ChatOpenAI({
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
  azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
  azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
});

// const joke = await model.invoke("Can you tell me a joke?")
// console.log(joke.content)
//express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/quiz', quizRoutes);

app.get("/joke", async (req, res) => {
  const joke = await model.invoke("Can you create a quiz based on sports?");

  res.json(joke);
});

app.post("/status", async (req, res) => {
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Origin", "*");
  console.log("komt hij hier?");
  try {
    const contentType = req.header("Content-Type");
    if (
      contentType === "application/json" ||
      contentType === "application/x-www-form-urlencoded"
    ) {
      console.log("content-type is correct");

      const {
        name,
        level,
        moves,
        hp,
        enemyName,
        enemyLevel,
        enemyMoves,
        enemyHp,
      } = req.body;
      const userCurrentMoves = moves.map((userMove) => userMove.move);
      const userCurrentMoveNames = userCurrentMoves.map(
        (userMove) => userMove.name
      );
      const enemyCurrentMoves = moves.map((enemyMove) => enemyMove.move);
      const enemyCurrentMoveNames = enemyCurrentMoves.map(
        (enemyMove) => enemyMove.name
      );
      // const enemyCurrentMoves = moves.map((enemyMove) => enemyMove.move);
      console.log(userCurrentMoveNames);
      console.log("Received pokemonStatusObj:", name);
      const pokemonStatusObj = {
        userPokemon: {
          name: name,
          level: level,
          moves: userCurrentMoveNames,
          hp: hp,
        },
        enemyPokemon: {
          enemyName: enemyName,
          enemylevel: enemyLevel,
          enemyMoves: enemyCurrentMoveNames,
          enemyHp: enemyHp,
        },
      };
      if (!pokemonStatusObj || !pokemonStatusObj.userPokemon) {
        return res.status(400).send("Invalid data. Missing Pokémon info.");
      }
      // your pokemon
      const pokemonName = pokemonStatusObj.userPokemon.name;
      const pokemonLevel = pokemonStatusObj.userPokemon.level;
      const pokemonMoves = pokemonStatusObj.userPokemon.moves;
      const pokemonHp = pokemonStatusObj.userPokemon.hp;

      //enemy pokemon
      const enemyPokemonName = pokemonStatusObj.enemyPokemon.enemyName;
      const enemyPokemonLevel = pokemonStatusObj.enemyPokemon.enemylevel;
      const enemyPokemonMoves = pokemonStatusObj.enemyPokemon.enemyMoves;
      const enemyPokemonHp = pokemonStatusObj.enemyPokemon.enemyHp;

      if (!pokemonName) {
        return res.status(400).send("Pokémon name is required");
      }

      const response = await model.invoke(
        `In my pokemon battle I use ${pokemonName} with the moves ${pokemonMoves} against ${enemyPokemonName}, my pokemon level is ${pokemonLevel} 
          with ${pokemonHp} HP and the opponent level is ${enemyPokemonLevel} with ${enemyPokemonHp} HP and got the moves ${enemyPokemonMoves}. Can u tell me what the best move is to use and if it is possible to win?`
      );

      res.send(response);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/chat", async (req, res) => {
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Origin", "*");
  let { userQuestion, lastMessage } = req.body;

  console.log("Received LastMessage (before parsing):", lastMessage);

  try {
    // Ensure lastMessage is parsed correctly
    if (typeof lastMessage === "string") {
      try {
        lastMessage = JSON.parse(lastMessage); // Convert JSON string to object (if needed)
      } catch (error) {
        console.warn("Warning: lastMessage is already a raw string.");
      }
    }

    const prompt = await model.invoke(
      `Previous Message: ${
        lastMessage || "No previous context"
      }\nUser: ${userQuestion}\nAI:`
    );

    res.send(prompt);
  } catch (error) {
    console.error("Error processing AI response:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});
app.listen(process.env.EXPRESS_PORT, function () {
  console.log("Server started! at " + process.env.EXPRESS_PORT);
});

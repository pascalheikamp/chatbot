import {ChatOpenAI} from "@langchain/openai";
import express from 'express';
import cors from "cors";
import 'dotenv/config'


const model = new ChatOpenAI({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
})

// const joke = await model.invoke("Can you tell me a joke?")
// console.log(joke.content)
//express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// app.use('/quiz', quizRoutes);

app.get('/joke', async (req, res) => {
    const joke = await model.invoke("Can you create a quiz based on sports?")

    res.json(joke)
})

app.post('/chat', async (req, res) => {
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Origin', '*');
    console.log('method is post')
    try {
        const contentType = req.header("Content-Type");
        if (contentType === "application/json" || contentType === "application/x-www-form-urlencoded") {
            console.log('content-type is correct')
            const {question} = req.body || {};
            if (!question) {
                console.log('geen ingevoerde velden')
                return res.status(400).send('Invalid form data. Please provide title, artist and genre');
            }
            const currentQuestion = await model.invoke(question)
            res.send(currentQuestion)
        } else {
            res.status(400).send("Invalid request, check content-type")
        }
    } catch (error) {
        res.status(500).send(error);
    }
})
app.listen(process.env.EXPRESS_PORT, function () {
    console.log('Server started! at ' + process.env.EXPRESS_PORT)
});

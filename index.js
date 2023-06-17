const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// const OPENAI_KEY = process.env.OPENAI_KEY;
const OPENAI_KEY = "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";
console.log(OPENAI_KEY)
// tessting custom middleware
app.get('/', async (req, res) => {
  res.status(200).jsonp({message: "Welcome to the AI ASSISTANT Server!"})
})
 
// AI Assistant middleware to fetch response 
app.post("/chat", async (req, res) => {
  const { messages } = req.body;

  console.log(messages)
  if (!Array.isArray(messages) || !messages.length) {
    res.status(400).json({
      success: false,
      message: "messages required",
    });
    return;
  }

  let requiredPrompt =
    "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n" +
    messages
      .map((item) => `${item.from == "ai" ? "AI: " : "Human: "}${item.text}`)
      .join("\n") +
    "\nAI: ";

  const reqUrl = "https://api.openai.com/v1/completions";

  const reqBody = {
    model: "text-davinci-003",
    prompt: requiredPrompt,
    max_tokens: 1000,
    temperature: 0.8,
  };

  
  try {
    const response = await axios.post(reqUrl, reqBody, {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${OPENAI_KEY}`,
      },
    });
    const data = response.data;
    const answer = Array.isArray(data.choices) ? data.choices[0]?.text : "";

    res.status(200).json({
      success: true,
      data: answer.trim(),
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
      error: err,
    });
  }
});

app.listen(5000, () => console.log("Server is UP at 5000"));

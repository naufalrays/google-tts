const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS.split(",");
app.use(
  cors({ origin: allowedOrigins, credentials: true })
);
app.options('*', cors())

app.post("/synthesize", async (req, res) => {
  const { text, model_name, speaking_rate, pitch, volume_gain_db } = req.body; // Destructure text and model_name from request body
  const apiKey = process.env.API_KEY;
  const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
  const payload = {
    input: {
      text: text,
    },
    voice: {
      languageCode: "en-US",
      name: model_name,
    },
    audioConfig: {
      audioEncoding: "LINEAR16",
      speakingRate: speaking_rate,
      pitch: pitch,
      volumeGainDb: volume_gain_db,
    },
  };
  const response = await axios.post(endpoint, payload);
  res.json(response.data);
});

const port = process.env.PORT; // "3000"
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

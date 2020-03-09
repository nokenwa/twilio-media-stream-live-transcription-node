const WebSocket = require("ws");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
const path = require("path");

require("dotenv").config();

//Include Google Speech to Text
const speech = require("@google-cloud/speech");
const client = new speech.SpeechClient();

//Configure Transcription Request
const request = {
  config: {
    encoding: "MULAW",
    sampleRateHertz: 8000,
    languageCode: "en-US",
    model: "phone_call",
    diarization_config: {
      min_speaker_count: 1,
      max_speaker_count: 1
    }
  },
  interimResults: true // If you want interim results, set this to true
};

wss.on("connection", function connection(ws) {
  console.log("New Connection Initiated");
  let callSid = "";
  let speaker = null;
  let holdInterim = "";
  let recognizeStream = null;

  ws.on("message", function incoming(message) {
    const msg = JSON.parse(message);
    switch (msg.event) {
      case "connected":
        console.log(`A new call has connected.`);
        // Create Stream to the Google Speech to Text API
        recognizeStream = client
          .streamingRecognize(request)
          .on("error", console.error)
          .on("data", data => {
            let incomingTranscript = {
              text: data.results[0].alternatives[0].transcript,
              words: data.results[0].alternatives[0].words,
              callSid: callSid,
              speaker: speaker,
              isFinal: data.results[0].isFinal
            };

            holdInterim = incomingTranscript;

            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(incomingTranscript));
              }
            });
          })
          .on("close", () => {
            console.log("Recognize Stream is closing");
            if (!holdInterim.isFinal) {
              console.log("closing last message");
              wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                  holdInterim.isFinal = true;
                  client.send(JSON.stringify(holdInterim));
                }
              });
            }
          });
        break;
      case "start":
        callSid = msg.start.callSid;
        speaker = msg.start.customParameters.speaker;
        console.log(`Starting Media Stream ${msg.streamSid}`);
        break;
      case "media":
        // Write Media Packets to the recognize stream
        recognizeStream.write(msg.media.payload);
        break;
      case "stop":
        console.log(`Call Has Ended`);
        recognizeStream.destroy();
        break;
    }
  });
});

console.log("Listening on Port 8080");
server.listen(8080);

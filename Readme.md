# Live Transcribing Phone Calls using Twilio Media Streams and Google Speech-to-Text

With Twilio Media Streams, you can now extend the capabilities of your Twilio-powered voice application with real time access to the raw audio stream of phone calls. For example, we can build tools that transcribe the speech from a phone call live into a browser window, run sentiment analysis of the speech on a phone call or even use voice biometrics to identify individuals.

## Blog Post
If you prefer a step by step guide through building this yourself, this blog post will guide you through transcribing speech from a phone call into text, live in the browser using Twilio and Google Speech-to-Text using Node.js.

[Visit the Blog Post here](https://www.twilio.com/blog/live-transcribing-phone-calls-using-twilio-media-streams-and-google-speech-text)

---

## Prerequisites
Before we can get started, you’ll need to make sure to have:

- A [Free Twilio Account](https://www.twilio.com/try-twilio)
- A [Google Cloud Account](https://cloud.google.com/)
- Installed [ngrok](https://ngrok.com/)
- Installed the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart)

---

## Setup

1.  Setup Google Project and retrieve service account key

    a. [Install and initialize the Cloud SDK](https://cloud.google.com/sdk/docs/)

    b. Setup a new GCP Project

    c. Enable the Google Speech-To-Text API for that project

    d. Create a service account.

    e. Download a private key as JSON.

2.  Modify the `.env.sample` file to include the path to your JSON service account key and save it as a `.env` file
3.  Run the following commands:

    Buy a Phone Number (_I have used the `GB` country code to buy a mobile number, but feel free to change this for a [number local to you](https://support.twilio.com/hc/en-us/articles/223183068-Twilio-international-phone-number-availability-and-their-capabilities)._)

    `$ twilio phone-numbers:buy:mobile --country-code GB`

    Start ngrok:

    `$ ngrok http 8080`

    While this is running in a new window copy the forwarding HTTPS URL (https://xxxxx.ngrok.io) and set your Twilio number to this URL:

    `$ twilio phone-numbers:update YOUR_TWILIO_NUMBER_HERE --voice-url https://xxxxxxxx.ngrok.io`

    Install dependencies and start your server:

    `$ npm install`

    `$ npm start`

---

# Contact me

If you have any questions, feedback or just want to show me what you build, feel free to reach out to me:

- Twitter: [@chatterboxcoder](https://twitter.com/chatterboxCoder)
- GitHub: nokenwa
- Email: nokenwa@twilio.com

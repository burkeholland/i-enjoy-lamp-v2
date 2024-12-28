const { app } = require("@azure/functions");
const Pusher = require("pusher");

app.http("SetColor", {
  methods: ["PUT"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    // read the color, brightness
    const { color, brightness } = await request.json();

    const url = "https://api.lifx.com/v1/lights/label%3ALamp/state";
    const options = {
      method: "PUT",
      headers: {
        accept: "text/plain",
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.LIFX_TOKEN}`,
      },
      body: JSON.stringify({
        duration: 1,
        fast: false,
        color: color,
        brightness: brightness,
      }),
    };

    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: "us2",
      useTLS: true,
    });

    pusher.trigger("i-enjoy-lamp", "lamp-update", {
      color,
    });

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((err) => console.error(err));

    return { body: "Color changed successfully" };
  },
  route: "set",
});

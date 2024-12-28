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
        Authorization:
          "Bearer c67b08af258a0949aae37d8b2bd128f362a4d77e3ef0f26ee45e09b5a081d75c",
      },
      body: JSON.stringify({
        duration: 1,
        fast: false,
        color: color,
        brightness: brightness,
      }),
    };

    const pusher = new Pusher({
      appId: "1917237",
      key: "7b77fca77aa1c1163b46",
      secret: "a3296b14bbe3a6713ad4",
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

import { ref, onMounted } from "vue";
import Pusher from "pusher-js";

export function usePusher() {
  const messages = ref([]);
  const currentColor = ref("#FFFFFF");
  const lastUpdate = ref(null);

  onMounted(() => {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    const pusher = new Pusher("7b77fca77aa1c1163b46", {
      cluster: "us2",
    });

    const channel = pusher.subscribe("i-enjoy-lamp");
    channel.bind("lamp-update", (data) => {
      messages.value.push(data);
      if (data.color) {
        currentColor.value = data.color;
        lastUpdate.value = new Date();
      }
    });
  });

  return {
    messages,
    currentColor,
    lastUpdate
  };
}

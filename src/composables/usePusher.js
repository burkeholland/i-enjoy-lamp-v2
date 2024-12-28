import { ref, onMounted } from "vue";
import Pusher from "pusher-js";
import { useUserStore } from "../stores/userStore";

export function usePusher() {
  const messages = ref([]);
  const currentColor = ref("#FFFFFF");
  const lastUpdate = ref(null);
  const userStore = useUserStore();

  onMounted(() => {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    const pusher = new Pusher("7b77fca77aa1c1163b46", {
      cluster: "us2",
    });

    const channel = pusher.subscribe("i-enjoy-lamp");
    channel.bind("lamp-update", (data) => {
      const activity = {
        ...data,
        userName: userStore.userDisplayName || "Anonymous",
        timestamp: Date.now(),
      };

      messages.value = [...messages.value, activity].slice(-10);

      if (data.color) {
        currentColor.value = data.color;
        lastUpdate.value = activity.timestamp;
      }
    });
  });

  return {
    messages,
    currentColor,
    lastUpdate,
  };
}

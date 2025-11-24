import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import { API_BASE } from "./client.js";

export function subscribeToWs(onMessage) {
  const url =
    (API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE) + "/labwork-manager";

  const client = new Client({
    webSocketFactory: () => new SockJS(url),
    reconnectDelay: 5000,
    debug: function (str) {
      console.debug("[STOMP]", str);
    },
  });

  client.onConnect = () => {
    console.info("STOMP connected");
    client.subscribe("/topic/labworks", (message) => {
      const body = message.body;
      if (!body) return;
      try {
        const parsed = JSON.parse(body);
        onMessage(parsed);
      } catch {
        onMessage(body);
      }
    });
  };

  client.onStompError = (frame) => {
    console.error("STOMP error", frame);
  };

  client.activate();

  return () => {
    try {
      client.deactivate();
    } catch (e) {
      console.warn("Error deactivating stomp", e);
    }
  };
}

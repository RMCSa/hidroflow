// src/hooks/useMqtt.ts
import { useState, useEffect, useRef } from "react";
import Paho from "paho-mqtt";

// --- Constantes e Configurações ---
const MQTT_BROKER_WEBSOCKET = "wss://broker.emqx.io:8084/mqtt";
const UNIQUE_TOPIC_PREFIX_WEB = "hidroflow/hf123"; 
const ESP_OFFLINE_TIMEOUT = 40000; // 40 segundos

// Tipos para clareza
type MqttStatus = "Conectando..." | "Conectado" | "Desconectado" | "Erro";
type EspStatus = "Online" | "Offline" | "Aguardando Dados...";

export interface MqttData {
  water_level: number;
  humidity: number;
  humidity_state: string;
  pump_state: "Ativada" | "Desativada" | "Aguardando...";
}

// Função de formatação para garantir que o JSON seja válido
function formatStringToJson(message: string): string {
  if (!message.endsWith("}")) {
    message += "}";
  }
  return message;
}

export const useMqtt = (topicId: string) => {
  const [mqttStatus, setMqttStatus] = useState<MqttStatus>("Desconectado");
  const [espStatus, setEspStatus] = useState<EspStatus>("Aguardando Dados...");
  const [lastData, setLastData] = useState<MqttData | null>(null);

  const clientRef = useRef<Paho.Client | null>(null);
  const lastMessageTimestamp = useRef<number | null>(null);
  const espStatusTimer = useRef<NodeJS.Timeout | null>(null);

  // const topicSub = `${UNIQUE_TOPIC_PREFIX_WEB}/${topicId}/data`;
  const topicSub = `${UNIQUE_TOPIC_PREFIX_WEB}/data`;

  useEffect(() => {
    // Função para verificar o status do ESP
    const checkEspStatus = () => {
      if (!lastMessageTimestamp.current) {
        setEspStatus("Aguardando Dados...");
        return;
      }
      const timeSince = Date.now() - lastMessageTimestamp.current;
      setEspStatus(timeSince > ESP_OFFLINE_TIMEOUT ? "Offline" : "Online");
    };

    // Inicia a conexão
    connectMqtt();

    // Inicia o timer para checar o status do ESP
    espStatusTimer.current = setInterval(checkEspStatus, 5000);

    // Função de limpeza ao desmontar o componente
    return () => {
      if (espStatusTimer.current) {
        clearInterval(espStatusTimer.current);
      }
      if (clientRef.current && clientRef.current.isConnected()) {
        try {
          clientRef.current.disconnect();
          console.log("MQTT Desconectado na limpeza do componente.");
        } catch (error) {
          console.error("Erro ao desconectar MQTT:", error);
        }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]); 

  const connectMqtt = () => {
    setMqttStatus("Conectando...");
    const clientId = "hidroflow_web_" + Math.random().toString(16).substr(2, 8);
    const client = new Paho.Client(MQTT_BROKER_WEBSOCKET, clientId);

    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        setMqttStatus("Desconectado");
        console.warn("Conexão perdida:", responseObject.errorMessage);
        // Tenta reconectar após 5 segundos
        setTimeout(connectMqtt, 5000);
      }
    };

    client.onMessageArrived = (message) => {
      try {
        if (message.destinationName === topicSub) {
          const formattedPayload = formatStringToJson(message.payloadString);
          const data: MqttData = JSON.parse(formattedPayload);

          setLastData(data);
          lastMessageTimestamp.current = Date.now();
        }
      } catch (e) {
        console.error(
          "Erro ao processar mensagem MQTT:",
          e,
          message.payloadString
        );
      }
    };

    client.connect({
      onSuccess: () => {
        setMqttStatus("Conectado");
        console.log("Conectado ao Broker MQTT!");
        client.subscribe(topicSub);
        console.log("Inscrito no tópico:", topicSub);
      },
      onFailure: (message) => {
        setMqttStatus("Erro");
        console.error("Falha na conexão MQTT:", message.errorMessage);
        setTimeout(connectMqtt, 5000);
      },
      useSSL: true,
      timeout: 5,
      keepAliveInterval: 60,
    });

    clientRef.current = client;
  };

  return { mqttStatus, espStatus, lastData };
};

import { create } from "zustand";

export type Engine = "mpegts" | "flv" | "hls";
export type Connection = "idle" | "connecting" | "live" | "error";

export function urlForEngine(url: string, engine: Engine): string {
  return url.replace(/\.(?:flv|m3u8)(?=\?|$)/i, engine === "hls" ? ".m3u8" : ".flv");
}

type StreamState = {
  streamUrl: string;
  engine: Engine;
  isPlaying: boolean;
  connection: Connection;
  lastError: string;
  setStreamUrl: (value: string) => void;
  setEngine: (value: Engine) => void;
  setPlaying: (value: boolean) => void;
  setConnection: (value: Connection) => void;
  setError: (value: string) => void;
};

export const useStreamStore = create<StreamState>((set) => ({
  // The API should initialize this with the active live session URL and token.
  streamUrl: "",
  engine: "mpegts",
  isPlaying: false,
  connection: "idle",
  lastError: "",
  setStreamUrl: (streamUrl) =>
    set((state) => ({ streamUrl: urlForEngine(streamUrl, state.engine) })),
  setEngine: (engine) =>
    set((state) => ({ engine, streamUrl: urlForEngine(state.streamUrl, engine) })),
  setPlaying: (isPlaying) => set({ isPlaying, connection: isPlaying ? "live" : "idle" }),
  setConnection: (connection) => set({ connection }),
  setError: (lastError) => set({ lastError, connection: lastError ? "error" : "idle" }),
}));

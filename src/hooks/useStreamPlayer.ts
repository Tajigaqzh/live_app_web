import { useEffect, useRef, type RefObject } from "react";
import { useStreamStore } from "../store";

export function useStreamPlayer(videoRef: RefObject<HTMLVideoElement>) {
  const { streamUrl, engine, setPlaying, setConnection, setError } = useStreamStore();
  const playerRef = useRef<any>(null);

  useEffect(() => {
    let disposed = false;
    const video = videoRef.current;
    if (!video) return;

    const onPlaying = () => {
      if (!disposed) setPlaying(true);
    };
    const onVideoError = () => {
      if (!disposed) setError("视频解码失败或流地址不可用");
    };

    video.addEventListener("playing", onPlaying);
    video.addEventListener("error", onVideoError);

    const start = async () => {
      if (!streamUrl) return;
      setConnection("connecting");
      setError("");

      try {
        if (engine === "hls") {
          if (!/\.m3u8(?:\?|$)/i.test(streamUrl)) {
            throw new Error("HLS 需要 .m3u8 播放地址");
          }

          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            video.play().catch(() => {
              if (!disposed) setError("HLS 播放失败，请检查流地址");
            });
            return;
          }

          const { default: Hls } = await import("hls.js");
          if (disposed) return;
          if (!Hls.isSupported()) throw new Error("当前浏览器不支持 HLS");

          const hls = new Hls({ lowLatencyMode: true });
          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (!disposed && data.fatal) {
              setError(`HLS 拉流失败: ${data.details}`);
            }
          });
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {
              if (!disposed) setError("HLS 播放失败，请检查流地址");
            });
          });
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
          playerRef.current = hls;
          return;
        }

        if (!/\.flv(?:\?|$)/i.test(streamUrl)) {
          throw new Error("HTTP-FLV 需要 .flv 播放地址");
        }

        const lib = engine === "mpegts" ? await import("mpegts.js") : await import("flv.js");
        if (disposed) return;

        const api = lib.default;
        if (!api.isSupported()) {
          throw new Error(`${engine}.js 当前浏览器不支持`);
        }

        const player = api.createPlayer(
          { type: "flv", url: streamUrl, isLive: true, cors: true },
          {
            enableWorker: engine === "mpegts",
            lazyLoad: false,
            autoCleanupSourceBuffer: true,
          },
        );
        player.on?.(
          api.Events?.ERROR ?? "error",
          (_type: unknown, details: unknown, info: unknown) => {
            if (!disposed) {
              setError(`播放器拉流失败: ${String(details ?? info ?? "Failed to fetch")}`);
            }
          },
        );
        player.attachMediaElement(video);
        player.load();
        Promise.resolve(player.play()).catch(() => {
          if (!disposed) setError("播放失败，请检查流地址");
        });
        playerRef.current = player;
      } catch (error) {
        if (!disposed) {
          setError(error instanceof Error ? error.message : "无法连接到直播流");
        }
      }
    };

    void start();

    return () => {
      disposed = true;
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("error", onVideoError);
      playerRef.current?.pause?.();
      playerRef.current?.unload?.();
      playerRef.current?.detachMediaElement?.();
      playerRef.current?.destroy?.();
      playerRef.current = null;
      video.pause();
      video.removeAttribute("src");
      video.load();
      setPlaying(false);
    };
  }, [engine, streamUrl, setConnection, setError, setPlaying, videoRef]);
}

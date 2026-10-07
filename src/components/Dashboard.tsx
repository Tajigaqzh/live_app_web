import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Activity, Gauge, Link2, Radio, Settings, Video, Wifi, Zap } from "lucide-react";
import { useStreamStore } from "../store";
import { Player } from "./Player";

export function Dashboard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { streamUrl, engine, connection, lastError, setEngine } = useStreamStore();
  const [urlDraft, setUrlDraft] = useState(streamUrl);
  useEffect(() => setUrlDraft(streamUrl), [streamUrl]);
  const setStreamUrl = useStreamStore((state) => state.setStreamUrl);
  const streamName = streamUrl.split(/[?#]/)[0].split("/").filter(Boolean).pop()?.replace(/\.(?:flv|m3u8)$/i, "") ?? "--";
  const today = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());
  const status =
    connection === "live"
      ? "LIVE"
      : connection === "connecting"
        ? "CONNECTING"
        : connection === "error"
          ? "ERROR"
          : "OFFLINE";
  return (
    <div className="content">
      <section className="hero-row">
        <div>
          <h2>
            欢迎回来，Alex <span>👋</span>
          </h2>
          <p>监看你的直播节点，保持每一帧都清晰稳定。</p>
        </div>
        <div className="date-chip">
          <Activity size={15} /> {today}
        </div>
      </section>
      <section className="metrics">
        <Metric
          icon={Radio}
          label="流状态"
          value={status}
          sub={connection === "live" ? "已连接并正在播放" : "等待播放请求"}
          tone={connection === "live" ? "green" : connection === "error" ? "red" : "orange"}
        />
        <Metric
          icon={Gauge}
          label="延迟"
          value={connection === "live" ? "1.2s" : "--"}
          sub="目标低于 3 秒"
          tone="blue"
        />
        <Metric
          icon={Wifi}
          label="播放引擎"
          value={engine === "hls" ? "HLS" : engine === "mpegts" ? "mpegts.js" : "flv.js"}
          sub="浏览器 MSE"
          tone="purple"
        />
        <Metric icon={Zap} label="节点负载" value="24%" sub="运行状态良好" tone="yellow" />
      </section>
      <section className="monitor-grid">
        <div className="panel player-panel">
          <div className="panel-head">
            <div>
              <span className="section-kicker">PRIMARY FEED</span>
              <h3>主直播画面</h3>
            </div>
            <span className={`status-pill ${connection}`}>
              <i /> {status}
            </span>
          </div>
          <div className="player-wrap">
            <Player videoRef={videoRef} />
            {connection !== "live" && (
              <div className="player-overlay">
                <div className="overlay-icon">
                  <Video size={22} />
                </div>
                <strong>
                  {connection === "connecting"
                    ? "正在连接直播流…"
                    : connection === "error"
                      ? "连接失败"
                      : "等待直播流"}
                </strong>
                <span>{lastError || "输入地址后开始播放"}</span>
              </div>
            )}
            <div className="player-label">
              <span>
                <span className="red-dot" /> LIVE
              </span>
              <span>1080p · 30 FPS</span>
            </div>
          </div>
          <div className="player-controls">
            <div className="url-input">
              <Link2 size={15} />
              <input
                value={urlDraft}
                placeholder="输入带 token 的 HTTP-FLV 或 HLS 地址"
                onChange={(event) => setUrlDraft(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && setStreamUrl(urlDraft)}
              />
              <button onClick={() => setStreamUrl(urlDraft)}>连接</button>
            </div>
            <div className="engine-switch">
              <button
                className={engine === "mpegts" ? "selected" : ""}
                onClick={() => setEngine("mpegts")}
              >
                mpegts.js
              </button>
              <button
                className={engine === "flv" ? "selected" : ""}
                onClick={() => setEngine("flv")}
              >
                flv.js
              </button>
              <button
                className={engine === "hls" ? "selected" : ""}
                onClick={() => setEngine("hls")}
              >
                HLS
              </button>
            </div>
          </div>
        </div>
        <aside className="panel detail-panel">
          <div className="panel-head">
            <div>
              <span className="section-kicker">STREAM INFO</span>
              <h3>流详情</h3>
            </div>
            <button className="more">•••</button>
          </div>
          <div className="detail-list">
            <Detail label="流名称" value={streamName} />
            <Detail label="协议" value={engine === "hls" ? "HLS" : "HTTP-FLV"} />
            <Detail label="视频编码" value="H.264 / AVC" />
            <Detail label="音频编码" value="AAC" />
            <Detail label="分辨率" value="1920 × 1080" />
            <Detail label="帧率" value="30 FPS" />
          </div>
          <div className="quality">
            <div>
              <span>信号质量</span>
              <strong>优秀</strong>
            </div>
            <div className="quality-bars">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <small>最近 5 分钟无丢帧</small>
          </div>
        </aside>
      </section>
      <section className="bottom-grid">
        <div className="panel activity-panel">
          <div className="panel-head">
            <div>
              <span className="section-kicker">LAST 30 MINUTES</span>
              <h3>播放活动</h3>
            </div>
            <span className="activity-total">
              +12.4% <span>较昨日</span>
            </span>
          </div>
          <div className="chart">
            <div className="chart-y">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>
            <svg viewBox="0 0 700 170" preserveAspectRatio="none">
              <defs>
                <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#ff5a54" stopOpacity=".28" />
                  <stop offset="1" stopColor="#ff5a54" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 142 C40 138 55 110 92 118 S140 82 178 101 S220 68 260 86 S300 46 338 71 S380 28 420 56 S458 51 492 62 S540 24 580 47 S625 39 700 16 L700 170 L0 170Z"
                fill="url(#fill)"
              />
              <path
                d="M0 142 C40 138 55 110 92 118 S140 82 178 101 S220 68 260 86 S300 46 338 71 S380 28 420 56 S458 51 492 62 S540 24 580 47 S625 39 700 16"
                fill="none"
                stroke="#ff5a54"
                strokeWidth="3"
              />
            </svg>
            <div className="chart-x">
              <span>09:00</span>
              <span>09:10</span>
              <span>09:20</span>
              <span>09:30</span>
              <span>09:40</span>
              <span>09:50</span>
            </div>
          </div>
        </div>
        <div className="panel events-panel">
          <div className="panel-head">
            <div>
              <span className="section-kicker">SYSTEM LOG</span>
              <h3>最近事件</h3>
            </div>
            <button className="text-button">查看全部</button>
          </div>
          <div className="event-list">
            <Event color="green" title="节点连接成功" time="刚刚" desc="SRS RTMP server 已就绪" />
            <Event
              color="blue"
              title="播放器已初始化"
              time="2 分钟前"
              desc="mpegts.js · HTTP-FLV"
            />
            <Event
              color="yellow"
              title="播放会话结束"
              time="昨天 18:42"
              desc="正常关闭，持续 24 分钟"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

const Metric = ({ icon: Icon, label, value, sub, tone }) => (
  <div className="metric">
    <div className={`metric-icon ${tone}`}>
      <Icon size={17} />
    </div>
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{sub}</small>
    </div>
  </div>
);
const Detail = ({ label, value }) => (
  <div className="detail">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);
const Event = ({ color, title, time, desc }) => (
  <div className="event">
    <i className={color} />
    <div>
      <strong>{title}</strong>
      <small>{desc}</small>
    </div>
    <time>{time}</time>
  </div>
);

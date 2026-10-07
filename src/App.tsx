import { Route, Routes } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { Placeholder } from "./components/Placeholder";
import { Shell } from "./components/Shell";

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/streams"
          element={<Placeholder title="流地址" copy="管理常用的 HTTP-FLV 播放地址。" />}
        />
        <Route
          path="/settings"
          element={<Placeholder title="播放器设置" copy="选择播放器引擎并调整播放偏好。" />}
        />
      </Routes>
    </Shell>
  );
}

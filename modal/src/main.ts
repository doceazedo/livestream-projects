import "./lib/css/minireset.min.css";
import "./lib/css/global.css";
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

export default app;

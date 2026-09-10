import neutralino from "@neutralinojs/lib";
import { isNeutralinoRuntime } from "./transport";
import { extensionLifecycle } from "./lifecycle";
import "./todos";

if (isNeutralinoRuntime()) {
  neutralino.init();
  extensionLifecycle.start();
}

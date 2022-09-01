import { App } from "vue";
import component from "./src/index.vue";

export const Component = Object.assign(component, {
  install(app: App) {
    app.component(component.name, component);
  }
});

export default Component;

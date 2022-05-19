import configureStore from "@/store";
import history from "./history";

const { store } = configureStore(history);

export { history, store };

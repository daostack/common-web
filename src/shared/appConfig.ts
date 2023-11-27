import configureStore from "@/store";
import history from "./history";

const { store, persistor } = configureStore(history);

export { history, store, persistor };

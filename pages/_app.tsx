import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import store from "@/store";
import { Persistor } from "redux-persist/es/types";
import { persistStore } from "redux-persist";

export default function App({
    Component,
    pageProps: { session, ...pageProps }
}: AppProps) {
    let persist: Persistor = persistStore(store);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persist}>
                <Component {...pageProps} />
            </PersistGate>
        </Provider>
    );
}

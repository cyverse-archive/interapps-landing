import { toggleMobileOpen } from "./actions";
import store from "./store/configure";

export var mediaQueryList = window.matchMedia('(min-width: 500px)');   //width more than 500px

export function handleDeviceChange(evt) {
    store.dispatch(toggleMobileOpen(!evt.matches));
}

mediaQueryList.addListener(handleDeviceChange);



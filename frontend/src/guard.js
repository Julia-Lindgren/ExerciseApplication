import { createPinia } from 'pinia'
import { useUserStore } from './stores/UserStore'

const pinia = createPinia()
const userStore = useUserStore(pinia);

//Guard to be used on routes that should be exclusively available to logged in users.
export default async function guard(to, from, next) {
  //Run checkCookie to make sure the isLoggedIn variable is up to date.
  const isAuthenticated = await userStore.checkCookie();

  //If the user is logged in, proceed to the route, if not, reroute to the login page.
  if(userStore.isLoggedIn) {
    next();
  } else {
    next({ name: "login" });
  }
};
<script setup>
    import {auth} from '../fire.js';
    import {ref } from "vue";
    import { signInWithEmailAndPassword } from '@firebase/auth';
    import { useUserStore } from "../stores/UserStore";  
    import router from '../router';
    const userStore = useUserStore();

    //Ensure auth.CurrentUser loads in before trying to access any properties.
    auth.onAuthStateChanged((user) => {
        if (user) {
            // userEmail = user.email;
            userStore.getUser();
        } else {
           // userEmail = null;
        }
    });

    const email = ref('');
    const password = ref('');
    const loginError = ref('');

    const navigateToRoutines = async (email) => {
    await router.push('/routines')
    location.reload();
    }

    const login = async () => {
        loginError.value = '';
        // When the user signs in with email and password.
        signInWithEmailAndPassword(auth,email.value, password.value).then(({user}) => {
            // Get the user's ID token as it is needed to exchange for a session cookie.
            return user.getIdToken().then(idToken => {
                return userStore.postIdTokenToSessionLogin(idToken)
        });
        }).then((response) => {
            userStore.userEmail = email.value;
            navigateToRoutines();
        })
        .catch((error) => {
            // console.error('Incorrect username or password', error);
            loginError.value = ('Incorrect username or password');
        })
    }

    const registerRedirect = () => {
        router.push('/register');
    }
    
</script>

<template>
    <div class="login"> 
        <div class="loginBox">
            <h1 class="display-6">Login</h1>
            <form @submit.prevent="login">
                <span v-if="loginError" class="input-group-text"  id="errorMessage">{{loginError}}</span>
                <!-- Email Field -->
                <div class="mb-3 input-group"> 
                    <span class="input-group-text material-icons" id="basic-addon1" >mail</span>
                    <input type="text" class="form-control" id="email" v-model="email" placeholder="email">
                </div>

                <!-- Password Field -->
                <div class="input-group mb-3">
                    <span class="input-group-text material-icons" id="basic-addon1" >lock</span>
                    <input type="password" class="form-control" id="currentPassword" v-model="password" placeholder="password">
                </div>
                <button class="btn btn-primary" id="loginButton">Login</button>
            </form>

            <button class="registerRedirect"  @click="registerRedirect()">Don't have an account?</button>
        </div>
    </div>  
</template>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#errorMessage {
    color: #F76B69;
    border: none;
    background-color: #fcfcfc;
    font-weight: 500;
}

#errorMessage:hover {
    cursor:default;
}

.form-control:focus {
    box-shadow: 0 0 0 3px #21b48f49;
    border-color:#21b48f49 ;
}

.registerRedirect {
    color: #393E46;
    margin-top: 15px;
    background: none;
    border: none;
}

.registerRedirect:hover {
    color: #1FAB89;
    text-decoration: underline #1FAB89;
}

.form-control {
    background-color: #eeeeee5d;
    color: #393E46;
}
.material-icons {
    font-size: 20px;
    color: #ffffff;
    background-color: #393E46;
}

.loginBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fcfcfc;
    border-radius: 20px;
    padding: 40px;
    margin-top: 5vh;
    box-shadow: 2px 2px 5px rgb(125, 125, 125);
}
 .login {
        min-width: 400px;
        height: 92vh;
        padding-top: 50px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        justify-content: top;
        background-color: #eeeeee;
    }

    .display-6 {
        color: #393E46;
        font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        font-size: 40px;
        margin-bottom: 40px;
    }

    #loginButton {
        width: 50%;
        background-color: #1FAB89;
        border-color: rgb(255, 255, 255);
        border-radius: 20px;
    }
    
    .mb-3 {
        color: black;
        width:250px;
    }
</style>

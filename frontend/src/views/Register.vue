<script setup>
    import {auth} from '../fire.js';
    import {ref } from "vue";
    import router from "../router.js"; 
    import { useUserStore } from "../stores/UserStore";  
    const userStore = useUserStore();

    //Ensure auth.CurrentUser loads in before trying to access any properties.
    auth.onAuthStateChanged((user) => {
        if (user) {
            userStore.getUser();
        } else {
            // console.log("cant find user");
        }
    });

    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const displayName = ref('');

    const loginRedirect = () => {
        router.push('/login');
    }

    const routinesRedirect = () => {
        router.push('/routines');
    }

    const userNameError = ref('');
    const emailError = ref('');
    const passwordError = ref('');
    const confirmPasswordError = ref('');

    const emailRegex = /\S+@\S+\.\S+/;

    //Function to register an account, sets error messages for client feedback upon invalid input.
    const register = async () => {

        userNameError.value = '';
        emailError.value = '';
        passwordError.value = '';
        confirmPasswordError.value = '';
       
        if (displayName.value.length < 3 || displayName.value.length > 20) {
                userNameError.value = 'Username must be 3 to 20 characters long'
                return ;
            }

        if ( (email.value.length > 300) || (!(emailRegex.test(email.value)))) {
                emailError.value = 'Invalid email'
                return ;
            }
        
        if (password.value.length < 6 || password.value.length > 20) {
                passwordError.value = 'Password must be 6 to 20 characters long'
                return ;
        }  
        
        if (password.value != confirmPassword.value) {
                confirmPasswordError.value = 'Passwords must match'
                return ;
        }  

        try {
            await userStore.register(displayName.value, email.value, password.value);
            routinesRedirect();
        } catch (error) {
            // console.error(error);
            // Handle error
        }
    }   
</script>

<template>
    <div class="register"> 
        <div class="registerBox">
            <h1 class="display-6">Register</h1>
            <form @submit.prevent="register()">
                <!-- Username Field -->
                <span v-if="userNameError" class="input-group-text"  id="errorMessage">{{userNameError}}</span>
                <div class="mb-3 input-group">
                    <span class="input-group-text material-icons" id="basic-addon1" >person</span>
                    <input type="text" class="form-control" id="username" v-model="displayName" placeholder="username">
                    <span v-if="userNameError" class="input-group-text material-icons"  id="errorIcon">warning</span>
                </div>
                
                <!-- Email Field -->
                <span v-if="emailError" class="input-group-text"  id="errorMessage">{{emailError}}</span>
                <div class="mb-3 input-group">
                    <span class="input-group-text material-icons" id="basic-addon1" >mail</span>
                    <input type="text" class="form-control" id="email" v-model="email" placeholder="email">
                    <span v-if="emailError" class="input-group-text material-icons"  id="errorIcon">warning</span>
                </div>

                <!-- Password Field -->
                <span v-if="passwordError" class="input-group-text"  id="errorMessage">{{passwordError}}</span>
                <div class="input-group mb-3">
                    <span class="input-group-text material-icons" id="basic-addon1" >lock</span>
                    <input type="password" class="form-control" id="currentPassword" v-model="password" placeholder="password">
                    <span v-if="passwordError" class="input-group-text material-icons"  id="errorIcon">warning</span>
                </div>

                <!-- Confirm Password Field -->
                <span v-if="confirmPasswordError" class="input-group-text"  id="errorMessage">{{confirmPasswordError}}</span>
                <div class="input-group mb-3">
                    <span class="input-group-text material-icons" id="basic-addon1" >lock</span>
                    <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" placeholder="confirm password">
                    <span v-if="confirmPasswordError" class="input-group-text material-icons"  id="errorIcon">warning</span>
                </div>

                <button class="btn btn-primary" id="registerButton"> Register </button>
            </form>
            <button class="loginRedirect"  @click="loginRedirect()">Already have an account?</button>
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

#errorIcon {
    background-color: #F76B69;
}

#errorMessage:hover {
    cursor:default;
}

.loginRedirect {
    color: #393E46;
    margin-top: 15px;
    background: none;
    border: none;
}

.loginRedirect:hover {
    color: #1FAB89;
    text-decoration: underline #1FAB89;
}

.form-control {
    background-color: #eeeeee5d;
    color: #393E46;
}

.form-control:focus {
    box-shadow: 0 0 0 3px #21b48f49;
    border-color:#21b48f49 ;
}

.material-icons {
    font-size: 20px;
    color: #ffffff;
    background-color: #393E46;
}

.registerBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fcfcfc;
    padding: 40px;
    margin-top: 5vh;
    border-radius: 20px;
    min-width: 250px;
    width: 25vw;
    box-shadow: 2px 2px 5px rgb(125, 125, 125);
}
 .register {
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

#registerButton {
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

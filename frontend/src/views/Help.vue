<script setup>
    import {auth} from '../fire.js';
    import {ref } from "vue";
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
</script>

<template>
    <div class="home"> 
        <div class="homeBox">
            <h3 class="pageTitle">Frequently asked questions</h3>
            <div class="questionsBox">
                <p class="toggleButtons col1">
                <div class="question">
                    <button class="btn btn-primary" data-bs-toggle="collapse" href="#question1" role="button" aria-expanded="false" aria-controls="question1">
                        <span>What data does the website collect?</span>
                        <i class="material-icons routineListIcons" data-bs-toggle="tooltip" title="Delete Routine">expand_more</i>
                    </button>
                    <div class="collapse multi-collapse" id="question1">
                        <div class="card card-body">
                            The website only stores your username, password and email you use to register. Otherwise, no personal data is collected. 
                            Cookies are used but strictly for the purpose of authentication and session management, they are not used for tracking.
                        </div>
                    </div>
                </div>

                <div class="question">
                    <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#question2" aria-expanded="false" aria-controls="question2">
                        <span>Where are the exercises from?</span>
                        <i class="material-icons routineListIcons" data-bs-toggle="tooltip" title="Delete Routine">expand_more</i>
                    </button>
                    <div class="collapse multi-collapse" id="question2">
                        <div class="card card-body">
                           The exercises have been selected based on existing sources as seen in the information section of each exercise. If you wish to find out more about an exercise and whether it is suitable for you, 
                           you can use these to inform yourself further. However, if you are ever unsure, contact a medical professional before attempting an exercise.
                        </div>
                    </div>
                </div>

                <div class="question">
                    <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#question3" aria-expanded="false" aria-controls="question3">
                        <span>Can other people see my exercises and routines?</span>
                        <i class="material-icons routineListIcons" data-bs-toggle="tooltip" title="Delete Routine">expand_more</i>
                    </button>
                    <div class="collapse multi-collapse" id="question3">
                        <div class="card card-body">
                           No, the exercises and routines you create are strictly visible to only yourself. However, we strongly advice not storing sensitive information in them.
                        </div>
                    </div>
                </div>

                <div class="question">
                    <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#question4" aria-expanded="false" aria-controls="question4">
                        <span>Can I save my routine?</span>
                        <i class="material-icons routineListIcons" data-bs-toggle="tooltip" title="Delete Routine">expand_more</i>
                    </button>
                    <div class="collapse multi-collapse" id="question4">
                        <div class="card card-body">
                           Yes, after a routine is created you can view it on the routine page and click the eye icon. In the footer of the popup a print button can be clicked, which will
                           allow you to directly print or save the routine as a PDF so you can use it without accessing the page.
                        </div>
                    </div>
                </div>

                <div class="question">
                    <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#question5" aria-expanded="false" aria-controls="question5">
                        <span>I have trouble uploading an image</span>
                        <i class="material-icons routineListIcons" data-bs-toggle="tooltip" title="Delete Routine">expand_more</i>
                    </button>
                    <div class="collapse multi-collapse" id="question5">
                        <div class="card card-body">
                           If you are having trouble uploading a picture to a routine or exercise, ensure that after you have selected an image, that you click the upload button to the right. Otherwise it will not work.
                           Wait until the message saying it has been uploaded successfully appears, and then you can create your routine or exercise. Note, it must be a valid image file, as well as below 3MB in size.
                        </div>
                    </div>
                </div>

                <div class="question">
                    <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#question6" aria-expanded="false" aria-controls="question6">
                        <span>I have forgotten my password</span>
                        <i class="material-icons routineListIcons" data-bs-toggle="tooltip" title="Delete Routine">expand_more</i>
                    </button>
                    <div class="collapse multi-collapse" id="question6">
                        <div class="card card-body">
                            If you have forgotten your password, you will currently have to contact us at jrl1u20@soton.ac.uk with the email of the account concerned. An email with a link to reset your password will be sent.
                        </div>
                    </div>
                </div>
            </p>
            </div>
            
            <p class="email">Can't find your question or want more info? <span> <br>Don't hesitate to contact us at jrl1u20@soton.ac.uk</span> </p>    
        </div>
    </div>  
</template>

<style scoped>

.pageTitle {
    color: #3C4553;
    font-size: 30px;
}
.email {
    font-weight: 500;
    font-size: 16px;
    color: #3C4553;
    text-align: center;
}
.questionsBox {
    padding-top: 50px;
    display: flex;
    flex-direction: row;
    gap: 40px;
    padding-bottom: 30px;
    
}
.question{
    display: flex;
    flex-direction: column;
    width: 460px;
}

.toggleButtons {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 200px;
    width: 30%;
}
.btn-primary {
    background-color: #1FAB89;
    border: #393E46;
    font-weight: 500;
    font-size: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.btn-primary:focus {
    background-color: #1FAB89;
    border: #393E46;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.homeBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f1f1f1;
    border-radius: 20px;
    padding: 60px;
    min-width: 50vw;
    max-width: 700px;
    box-shadow: 2px 2px 5px rgb(125, 125, 125);
    overflow-y: scroll;
    margin-bottom: 5vh;
}
 .home {
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

    ::-webkit-scrollbar {
        width: 15px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #f5f5f5;
        border-radius: 20px;
        margin-top: 6vh;
        margin-bottom: 6vh;
        box-shadow: inset 1px 2px 4px grey; 
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #1FAB89;
        background: #1fab888d;
        border-radius: 20px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #1fab888d;
        background: #21b48f;
        border-radius: 20px;
    }
</style>

import {defineStore} from 'pinia'
import axios from 'axios'
import {auth} from '../fire.js';
import {createUserWithEmailAndPassword  } from '@firebase/auth';

export const useUserStore = defineStore('userStore', {
    state: () => ({
        favouriteExercises: [],
        userEmail: '',
        _id: '', //mongodb user object _id
        user: undefined,
        isLoggedIn: false,
        
    }),
    getters: {
       
    },
    actions: {

        //Checks that the cookie is still valid, used in the router guard to check if a user is allowed to access a route.
        async checkCookie() {
            try {
                const res = await axios.get('/api/users/validate')
                .then(response => {
                const isValid = response.data;
                this.isLoggedIn = isValid;
            })
            } catch (e) {
                // console.error('Error checking cookie');
            }
        },

        // Logs a user out from firebase as well as sending an axios request to the backend to revoke the session token and cookie.
        async logout() {
            this.userEmail = '';
            auth.signOut();
            
            const res = await axios.delete('/api/users/logout', (req, res) => {
              });
        },

        //Adds a favourite exercise to the logged in user.
        async addFavouriteExercise(exerciseId) {
            if(this.favouriteExercises.includes(exerciseId)) {
                //Exercise is already favourited
                return
            } else {
                try {
                    const email = auth.currentUser.email;
                    const res = await axios.patch('/api/users/'+email+'/favourites', {_id : exerciseId}).then(response => {
                        this.user.favouriteExercises = response.data.favourites;
                        this.favouriteExercises.push(exerciseId);
                    });
            
                } catch (e) {
                    // console.error('Error:', e);
                }
            }
            
            
        },

        //Remove an exercise from the logged in users favourites
        async removeFavouriteExercise(exerciseId) {
            if(this.favouriteExercises.includes(exerciseId)) {
                try {
                    const email = auth.currentUser.email;
                    const res = await axios.delete('/api/users/'+email+'/favourites/'+exerciseId).then(response => {
                        this.user.favouriteExercises = response.data.favourites;
                        this.favouriteExercises = this.favouriteExercises.filter(id => id !== exerciseId);
                    });
            
                } catch (e) {
                    // console.error('Error:', e)
                }
            } 
        },

        //Gets the currently logged in user.
        async getUser() {
            const userEmail = auth.currentUser.email;

            try {
                const res = await axios.get('/api/users/'+userEmail)
                .then(response => {
                this.user = response.data.user;
                this.favouriteExercises = response.data.user.favouriteExercises;
            })
            } catch (e) {
                // console.error('Error:');
            }
        },

        //Registers a user and adds them to the firebase store, creates a session cookie, then calls the MongoDB function.
        async register(displayName, email,password) {
                // When the user signs in with email and password.
                try {
                    //Attempts to create a user in firebase.
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                    .then ((userCredential) => {
                        return userCredential;
                    })
                    .catch ((error) => {
                        // User registration failed
                            if (error.code === 'auth/email-already-in-use') {
                                // Email is already taken
                                alert('This email is already in use. Please use a different email.');
                            } else {
                                // Some other error occurred
                                alert('An error occurred while registering. Please try again later.');
                            }

                            // console.log("error", error);
                    })

                    const user = userCredential.user;
                    user.displayName = displayName;
                
                    await this.createUser(email);
                
                    const idToken = await user.getIdToken();
                    //Creates a session for the user and logs them in after successfull registration
                    await this.postIdTokenToSessionLogin(idToken);
                
                    // return a Promise that resolves when registration and all related async operations are complete
                    return Promise.resolve();

                  } catch (error) {
                  }
        },

        //Using the users idToken generates a session cookie from the backend. 
        async postIdTokenToSessionLogin(userIdToken) {
            try {
                const response = await axios.post('/api/users/login', {idToken: userIdToken}, 

                ).then(response => {
                    this.getUser();
                    this.isLoggedIn = true;
                })
                
            } catch(error)  {
                }
        },

        //Creates a document for a new user in the mongoDB database.
        async createUser(userEmail) {

            //Create json object of user to send to backend.
            const user = {
                email: userEmail
            }
            try {
                const res = await axios.post('/api/users/', user).then(response => {
                });
        
            } catch (e) {
                // console.error('Error:', e);
            }
        }
    },
})
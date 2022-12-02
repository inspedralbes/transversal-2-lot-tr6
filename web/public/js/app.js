const quiz = Vue.component('quiz', {
    template: `
        <div class="container-landing">
            <router-link to="/login" class="button login-button">Login</router-link>    
            <div class="play">
                <div>
                <h1> Wanna test your knowledge? </h1>
                <router-link to="/difficulty" class="button">Play</router-link>
                </div>
            </div>
        </div>`
});

const difficulty = Vue.component('difficulty', {
    data: function () {
        return {
            categoriaSeleccionada: '',
            dificultadSeleccionada: ''
        }
    },
    template: `
        <div class="play"> 
            <div class="setParameters">
                <div class="categories">
                    <label> Category: 
                        <b-form-select v-model="categoriaSeleccionada" >
                            <option disabled selected>Please select a category</option>
                            <option  value="arts_and_literature">Arts & Literature</option>
                            <option  value="film_and_tv">Film & TV</option>
                            <option  value="food_and_drink">Food & Drink</option>
                            <option  value="general_knowledge">General Knowledge</option>
                            <option  value="geography">Geography</option>
                            <option  value="history">History</option>
                            <option  value="music">Music</option>
                            <option  value="science">Science</option>
                            <option  value="society_and_culture">Society & Culture</option>
                            <option  value="sport_and_leisure">Sport & Leisure</option>
                        </b-form-select>
                    </label>
                </div>
                <div class="difficulty">
                    <label> Difficulty: 
                        <b-form-select v-model="dificultadSeleccionada">
                            <option disabled selected>Choose a difficulty</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </b-form-select>
                    </label>
                </div>
                <router-link to="/play" class="button">Play</router-link>
            </div>
        </div>`,
    mounted() {
        {
          /*  fetch('https://the-trivia-api.com/api/categories')
                .then((response) => response.json())
                .then((categories) => 
                {this.categories = categories;
                console.log(categories);});*/
        }
    }
});

const play = Vue.component('play', {
    data: function () {
        return {
            questions: []
        }
    },
    template: `
    <div>
    <li v-for="question in questions">
        <h2>{{ question.question }}</h2>
        <div v-for="answer in question.answers">
            <br>
            <label>{{ answer }}</label>
        </div>
    </li>
    </div>`,
    mounted() {
        {
            fetch('https://the-trivia-api.com/api/questions')
                .then((response) => response.json())
                .then((questions) => {
                    this.questions = questions;
                    let length = this.questions.length;
                    let cont=0;

                    for(let j=0; j<length; j++){
                        let pos = Math.floor(Math.random() * 4);
                        let answers = [];
                        for (let i=0; i<4; i++) {
                            if (i==pos) {
                                answers.push(this.questions[j].correctAnswer);
                                this.questions[j].correctIndex = i;
                            }else{
                                answers.push(this.questions[j].incorrectAnswers[cont]);
                                cont++;
                            }
                        }
                        cont=0;
                        console.log(answers);
                        this.questions[j].answers = answers;
                    }

                    console.log(this.questions);
                });
        }    

    },
});

const login = Vue.component('login', {
    template: `<div>
        <router-link to="/" class="button">Home</router-link>
        <div v-show="!logged" class="button">
            <b-form-input id="input-2" v-model="form.username" placeholder="Username" required></b-form-input>
            <b-form-input id="input-2" v-model="form.password" placeholder="Password" required></b-form-input>
            <b-button @click="submitLogin" variant="primary">Login</b-button>
            <div v-show="processing">
                <b-spinner></b-spinner>
            </div>
        </div>
        <div v-show="logged">
        Bienvenido {{infoLogin.name}} 
        <img :src="infoLogin.image">
        <b-button @click="logOut" variant="primary">Logout</b-button>
        </div>
        </div>`,
    data: function () {
        return {
            processing: false,
            form: {
                username: "",
                password: ""
            },
            infoLogin: {
                name: "",
                image: "",
                idUser: "",
            },
            logged: false
        }
    },
    methods: {
        submitLogin() {
            this.processing = true;
            fetch(`http://alvaro.alumnes.inspedralbes.cat/loginGET.php?username=${this.form.username}&pwd=${this.form.password}`)
                .then(response => response.json())
                .then(data => {
                    if (data.exito) {
                        this.infoLogin.name = data.nombre;
                        this.infoLogin.image = data.imagen;
                        this.infoLogin.idUser = data.id;
                        this.logged = true;

                        store = userStore()
                        store.setStatus(this.infoLogin);
                        store.logged = true;
                    }
                })
        },
        logOut() {
            userStore().logged = false;
            this.logged = false;
            //this.processing = false;
        }
    }
});

const signup = Vue.component('signup',{
    template:`<div>
        <router-link to="/" class="button">Home</router-link>
        <div class="button">
            <b-form-input id="input-2" v-model="form.username" placeholder="Username" required></b-form-input>
            <b-form-input id="input-2" v-model="form.email" placeholder="email" required></b-form-input>
            <b-form-input id="input-2" v-model="form.password" placeholder="Password" required></b-form-input>
            <b-form-input id="input-2" v-model="form.verifyPassword" placeholder="Repeat password" required></b-form-input>
            <b-button @click="submitSignup" variant="primary">Signup</b-button>
            <div v-show="processing">
                <b-spinner></b-spinner>
            </div>
        </div>
        </div>`,
    data:function () {
        return {
            processing: false,
            form: {
                username: "",
                password: "",
                verifyPassword:"",
                email:"",
            },
        }
    },
    methods:{
        submitSignup() {
            this.processing = true;
            fetch(`http://alvaro.alumnes.inspedralbes.cat/loginGET.php?username=${this.form.username}&pwd=${this.form.password}`)
                .then(response => response.json())
                .then(data => {
                    if (data. ) {
                        this.infoLogin.name = data.nombre;
                        this.infoLogin.idUser = data.id;
                        this.logged = true;

                        store = userStore()
                        store.setStatus(this.infoLogin);
                        store.logged = true;
                    }
                })
        },
    },
    mounted(){
    }
})

const routes = [
    { path: "/", component: quiz },
    { path: "/login", component: login },
    { path: "/signup", component: signup },
    { path: "/difficulty", component: difficulty },
    { path: "/play", component: play },
];

const router = new VueRouter({
    routes,
})

let app = new Vue({
    el: '#app',
    router,
    data: {},
    methods: {},

});

{/* <li v-for="answer in question.incorrectAnswers">
<label>{{ answer }}</label>
</li> */}
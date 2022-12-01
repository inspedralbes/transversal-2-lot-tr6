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
            categories: [],
        }
    },
    template: `
        <div class="play"> 
            <div class="setParameters">
                <div class="categories">
                    <label> Difficulty 
                        <b-form-select v-model="selected" :options="categories"></b-form-select>
                    </label>
                </div>
                <div class="difficulty">
                    <label> Difficulty 
                        <select>
                            <option disabled selected>Choose a difficulty</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </label>
                </div>
                <router-link to="/play" class="button">Play</router-link>
            </div>
        </div>`,
    mounted() {
        {
            fetch('https://the-trivia-api.com/api/categories')
                .then((response) => response.json())
                .then((categories) => this.categories = categories);
        }
    }
});

const play = Vue.component('play', {
    data: function () {
        return {
            questions: [],
            answers: [],
        }
    },
    template: `
    <div>
    <li v-for="question in questions">
        <label>{{ question.question }}</label>
        <br>
        <label style="background-color: rgb(255, 15, 15);">{{ question.correctAnswer }}</label>
        <div v-for="answer in question.incorrectAnswers">
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

                    let pos = Math.floor(Math.random() * 4);
                    let length = this.questions.length;
                    let cont=0;
                    console.log(this.questions);
                    for(let j=0; j++; j<length){
                        for (let i=0; i++; i<4) {
                            if (i==pos) {
                                this.answers.push(this.questions.correctAnswer);
                            }else{
                                this.answers.push(this.questions.incorrectAnswers[cont]);
                                cont++;
                            }
                            
                        }
                    }
                    console.log(this.answers);
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
            fetch(`http://alvaro.alumnes.inspedralbes.cat/loginGET.php?username=${this.form.username
                }&pwd=${this.form.password
                }`).then(response => response.json())
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

const routes = [
    { path: "/", component: quiz },
    { path: "/login", component: login },
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
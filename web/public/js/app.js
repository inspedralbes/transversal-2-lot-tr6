const quiz = Vue.component('quiz', {
    template: `
        <div class="container-landing">
            <router-link to="/login" class="button login-button">Login</router-link>    
            <div class="play">
                <div>
                <h1 class="blanco"> Wanna test your knowledge? </h1>
                <router-link to="/difficulty" class="button">Play</router-link>
                <router-link to="/difficulty" class="button demo-button">Play as guest</router-link>
                </div>
            </div>
        </div>`
});

const difficulty = Vue.component('difficulty', {
    data: function () {
        return {
            categoriaSeleccionada: '',
            dificultadSeleccionada: '',
            chosen: false,
            questions: [],
            currentQuestion: 0,
            colorButtons: ["default", "default", "default", "default"],
            statusButtons: [false, false, false, false],
            correctAnswers: 0,
            finish: false,
        }
    },
    template: `
        <div class="play" > 
            <div v-if="!finish">
                <div v-if="!chosen" class="setParameters">
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
                            <br>
                            <button @click="fetchPreguntes" class="button">Play</button>
                        </label>
                    </div>
                </div>
                <div v-else>
                    <div class="nQuestionContainer" v-for="(question, indexQ) in questions">
                        <label v-if="currentQuestion!=indexQ">
                            <span class="nQuestion">{{indexQ+1}}</span>
                        </label>
                        <label v-else>
                            <span class="nCurrQuestion">{{indexQ+1}}</span>
                        </label>
                    </div>
                    <section class="carousel">    
                        <div>
                            <div class="slides">
                                <div class="slides-item slide-1" id="slide-1">            
                                    <div>
                                        <h2 class="blanco questionText">{{ questions[currentQuestion].question }}</h2>
                                        <div class="btnAnswer">
                                            <div v-for="(answer, indexA) in questions[currentQuestion].answers">
                                                <div>
                                                    <button :disabled="statusButtons[indexA]" class="answer" :class="colorButtons[indexA]" @click="verificate(currentQuestion, indexA)">{{ answer }}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="slides-item slide-2" id="slide-2">2</div> 
                            </div>
                        </div>
                    </section>
                    <div>
                        <p class="countAnswers">{{correctAnswers}}/{{currentQuestion+1}}</p>
                    </div>
                </div>
            </div>
            <div v-else>
            <p class="countAnswers">You have answered correctly a total of:</p>
            <p class="countAnswers">{{correctAnswers}}/10</p>
            </div>
        </div>
        `,

    methods: {
        fetchPreguntes: function () {
            fetch(`https://the-trivia-api.com/api/questions?categories=${this.categoriaSeleccionada}&limit=10&region=ES&difficulty=${this.dificultadSeleccionada}`)
                .then((response) => response.json())
                .then((questions) => {
                    console.log(questions)
                    this.chosen = true;
                    this.questions = questions;
                    let length = this.questions.length;
                    let cont = 0;

                    for (let j = 0; j < length; j++) {
                        let pos = Math.floor(Math.random() * 4);
                        let answers = [];
                        for (let i = 0; i < 4; i++) {
                            if (i == pos) {
                                answers.push(this.questions[j].correctAnswer);
                                this.questions[j].correctIndex = i;
                            } else {
                                answers.push(this.questions[j].incorrectAnswers[cont]);
                                cont++;
                            }
                        }
                        cont = 0;
                        this.questions[j].answers = answers;
                    }
                });
        },
        verificate(indexQ, indexA) {
            if (this.questions[indexQ].correctIndex == indexA) {
                for (let i = 0; i < 4; i++) {
                    if (this.questions[indexQ].correctIndex == i) {
                        this.colorButtons[i] = "correct";
                    } else {
                        this.colorButtons[i] = "simple-incorrect";
                    }
                }
                this.correctAnswers += 1;
            } else {
                for (let index = 0; index < 4; index++) {
                    this.colorButtons[index] = "incorrect";
                }
            }

            for (let index = 0; index < 4; index++) {
                this.statusButtons[index] = true;
            }

            this.$forceUpdate();

            setTimeout(() => {
                if (this.currentQuestion < this.questions.length) {
                    this.currentQuestion++;
                    this.colorButtons = ["default", "default", "default", "default"];
                    this.statusButtons = [false, false, false, false];
                }

                if (this.currentQuestion == 10) {
                    this.finish = true;
                }
            }, 1500);
        },

    }
},
);



const login = Vue.component('login', {
    template: `<div>
        <router-link to="/" class="button">Home</router-link>
        <div class="login-page">
            <div v-show="!logged" class="login-form-text">
                <h1>Welcome back</h1>
                <p>Enter your details and sign in</p>
            </div>
            <div v-show="!logged" class="login-form-form">
                <b-input-group class="mb-2" size="sm"> 
                    <b-input-group-prepend is-text>
                        <b-icon icon="person"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input class="input" :state="statusLogin" type="email" id="input-1" v-model="form.email" placeholder="Email" required></b-form-input>
                    <b-form-invalid-feedback id="input-live-feedback">
                        Introduce un email valido.
                    </b-form-invalid-feedback>
                </b-input-group>
                <b-input-group class="mb-2" size="sm">
                    <b-input-group-prepend is-text>
                        <b-icon icon="key"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input id="input-2" :state="statusLogin" v-model="form.password" placeholder="Password" required ></b-form-input>
                    <b-form-invalid-feedback id="input-live-feedback">
                        Introduce una contraseña valida, entre 8 y 16 caracteres. Ademas debe contener una mayuscula y una minuscula.
                    </b-form-invalid-feedback>
                </b-input-group>
                <b-button @click="submitLogin" variant="primary" class="signin-button">Sing in
                    <div v-if="!processing" class="signin-icon"><b-icon icon="check"></b-icon></div>
                    <div v-else="processing" class="signin-icon"><b-spinner small></b-spinner></div>
                </b-button>
                <div v-show="incorrectLogin">
                    <p style="color: red">Usuario Inexistente!</p> 
                </div>
            </div>
        <div v-show="logged">
            <p class="blanco">Bienvenido {{infoLogin.name}}</p>
        <b-button @click="logOut" variant="primary">Logout</b-button>
        </div>
        </div>
        </div>
        `,
    data: function () {
        return {
            processing: false,
            form: {
                email: "",
                password: ""
            },
            infoLogin: {
                name: "",
                idUser: "",
            },
            logged: false,
            incorrectLogin: false,
            statusLogin: "null"
        }
    },
    methods: {
        submitLogin() {
            if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(this.form.email) && /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/g.test(this.form.password)) {
                this.processing = true;
                this.incorrectLogin = false;
                fetch(`http://127.0.0.1:8000/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.form),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        if (data == 0) {
                            this.processing = false;
                            this.incorrectLogin = true;
                        } else {
                            this.infoLogin.name = data.username;
                            this.infoLogin.idUser = data.id;
                            this.logged = true;

                            // store = userStore();
                            // store.setStatus(this.infoLogin);
                            // store.logged = true;
                        }
                    })
            } else {
                console.log(9);
                this.statusLogin = false;
            }
        },
        logOut() {
            //userStore().logged = false;
            this.logged = false;
            this.processing = false;
        }
    },
    mounted() {
        console.log("login");
    }
});

const signup = Vue.component('signup', {
    template: `<div>
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
    data: function () {
        return {
            processing: false,
            form: {
                username: "",
                password: "",
                verifyPassword: "",
                email: "",
            },
        }
    },
    methods: {
        submitSignup() {
            this.processing = true;
            fetch(`http://alvaro.alumnes.inspedralbes.cat/loginGET.php?username=${this.form.username}&pwd=${this.form.password}`)
                .then(response => response.json())
                .then(data => {
                    if (data.exito) {
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
    mounted() {
    }
})

const routes = [
    { path: "/", component: quiz },
    { path: "/login", component: login },
    { path: "/signup", component: signup },
    { path: "/difficulty", component: difficulty },
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

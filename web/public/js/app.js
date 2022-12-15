const userStore = Pinia.defineStore('usuario', {
    state() {
        return {
            logged: false,
            loginInfo: {
                username: ''
            }
        }
    },
    actions: {
        setEstado(i) {
            this.loginInfo = i
        }
    }
});

Vue.use(Pinia.PiniaVuePlugin)
const pinia = Pinia.createPinia();

const quiz = Vue.component('quiz', {
    data: function () {
        return {
            logged: userStore().logged,
            username: userStore().loginInfo.username
        }
    },
    template: `
        <div class="container-landing">
            <div v-if="!logged">
                <router-link to="/login" class="button login-button">Login</router-link>   
            </div>
            <div v-else>
                <router-link to="/login" class="user"><b-icon icon="person-fill" class="h1"></b-icon><p>{{username}}</p></router-link>   
            </div>
            <div class="play">
                <div v-if="logged">
                        <h1 class="title-landing"> Wanna test your knowledge? </h1>
                        <router-link to="/difficulty" class="button-play">Play</router-link>
                        <br>
                </div>
                <div v-else>
                        <h1 class="title-landing"> Wanna test your knowledge? </h1>
                        <router-link to="/login" class="button-play">Play</router-link>
                        <br>
                        <router-link to="/difficulty" class="button demo-button">Play as guest</router-link>
                </div>
            </div>
            <canvas id="topScore"></canvas>
        </div>`,
    mounted() {
        const ChartScore = document.getElementById('topScore');

        new Chart(ChartScore, {
            type: 'bar',
            data: {
                labels: ['Lydia', 'Peter', 'Ermel', 'Cesar', 'Julian', 'Maria'],
                datasets: [{
                    label: 'Top Scorer',
                    data: [12, 19, 3, 5, 2, 3],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});

const difficulty = Vue.component('difficulty', {
    data: function () {
        return {
            user: {
                logged: userStore().logged,
                username: userStore().loginInfo.username,
            },
            categoriaSeleccionada: '',
            dificultadSeleccionada: '',
            chosen: false,
            questions: [],
            currentQuestion: 0,
            colorButtons: ["default", "default", "default", "default"],
            statusButtons: [false, false, false, false],
            correctAnswers: 0,
            error: false,
            failed: false,
            correction: '',
        }
    },
    template: `
    <div>
        <div class="play" > 
            <div v-show="user.logged">
                <router-link to="/login" class="user"><b-icon icon="person-fill" class="h1"></b-icon><p>{{user.username}}</p></router-link>   
            </div>
            <div v-if="$route.params.type!="demo">
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
                            <div v-show="error" style="color:red">
                                Select the difficulty and category
                            </div>
                            <button @click="fetchPreguntes" class="button">Play</button>
                        </label>
                    </div>
                </div>
                <div v-else>
                    <div class="nQuestionContainer">
                        <div v-for="(question, indexQ) in questions">
                            <span v-if="currentQuestion!=indexQ" class="nQuestion">{{indexQ+1}}</span>
                            <span v-else class="nCurrQuestion">{{indexQ+1}}</span>
                        </div>
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
                                        <br>
                                        <div v-show="failed">
                                            <h2></h2> The correct asnwer is: {{ correction }}
                                        </div>
                                    </div>
                                </div>
                                <div class="slides-item slide-2" id="slide-2">2</div> 
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
        `,

    methods: {
        fetchPreguntes: function () {
            if (this.categoriaSeleccionada == '' || this.dificultadSeleccionada == '') {
                this.error = true;
            } else {
                this.error = false;
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
            }


        },
        fetchDemo: function () {
            if (this.dificultadSeleccionada == '') {
                this.error = true;
            } else {
                this.error = false;
                fetch(`https://the-trivia-api.com/api/questions?categories=music&limit=10&region=ES&difficulty=${this.dificultadSeleccionada}`)
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
            }


        },
        verificate(indexQ, indexA) {
            if (this.questions[indexQ].correctIndex == indexA) {
                this.failed = false;
                for (let i = 0; i < 4; i++) {
                    if (this.questions[indexQ].correctIndex == i) {
                        this.colorButtons[i] = "correct";
                    } else {
                        this.colorButtons[i] = "simple-incorrect";
                    }
                }
                this.correctAnswers += 1;
            } else {
                this.failed = true;
                for (let index = 0; index < 4; index++) {
                    this.colorButtons[index] = "incorrect";
                    this.correction = this.questions[indexQ].correctAnswer
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
                    this.failed = false;
                }

                if (this.currentQuestion == 10) {
                    this.$router.replace('/finishGame');
                }
            }, 1500);
        },

    }
},
);

const finishGame = Vue.component('finishGame', {
    template: `<div>
        <div class="countAnswers">Your score was</div>
        <div class="countAnswers">Wanna try again? <router-link to="/difficulty" class="button-play">Play</router-link> </div>
    </div>`,
    data: function () {
        return{
            logged: userStore().logged,
            username: userStore().loginInfo.username
        }
    },
    methods:{

    }
});



const login = Vue.component('login', {
    template: `<div>
        <router-link to="/" class="button">Home</router-link>
        <div class="login-page">
            <div v-show="!logged" class="login-form-text">
                <h1>Welcome back</h1>
                <p>Enter your details and sign in</p>
                <p>If you still don't have an account sign up here</p>
                <router-link to="/signup" class="button-router">Sign up</router-link>
            </div>
            <div v-show="!logged" class="login-form-form">
                <b-input-group class="mb-2" size="sm"> 
                    <b-input-group-append is-text>
                        <b-icon icon="person" shift-h="-4"></b-icon>
                        <b-form-input class="input" :state="statusLogin" type="email" id="input-1" v-model="form.email" placeholder="Email" required></b-form-input>
                    </b-input-group-append>
                    <div v-show="!statusLogin" id="input-live-feedback" style="color: #F04848">
                        Introduce un email correcto.
                    </div>
                </b-input-group>
                <b-input-group class="mb-2" size="sm">
                    <b-input-group-append is-text>
                        <b-icon icon="key" shift-h="-4"></b-icon>
                        <b-form-input :type="type" id="input-2" :state="statusLogin" v-model="form.password" placeholder="Password" required ></b-form-input>
                        <b-button @click="showPass"><b-icon icon="eye-fill" shift-v="1" size="sm"></b-icon></b-button>
                    </b-input-group-append>
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
            logged: userStore().logged,
            incorrectLogin: false,
            statusLogin: "null",
            type: "password"
        }
    },
    methods: {
        submitLogin() {
            if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(this.form.email)) {
                this.processing = true;
                this.incorrectLogin = false;
                this.statusLogin = "null";
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
                            userStore().logged = true;
                            userStore().loginInfo.username = data.username;
                        }
                    })
            } else {
                console.log(9);
                this.statusLogin = false;
            }
        },
        logOut() {
            userStore().logged = false;
            userStore().loginInfo.username = '';
            this.logged = false;
            this.processing = false;
        },
        showPass() {
            if (this.type == "password") {
                this.type = "text"
            } else {
                this.type = "password"
            }
        }
    },
    mounted() {
        console.log("login");
    }
});

const signup = Vue.component('signup', {
    template: `<div>
        <router-link to="/" class="button">Home</router-link>
        <div class="signup-page">
            <div class="button" v-show="!registered" class="signup-form-form">
                <b-input-group class="mb-2" size="sm"> 
                    <b-input-group-append is-text>
                        <b-icon icon="person" shift-h="-4"></b-icon>
                        <b-form-input id="input-2" v-model="form.username" placeholder="Username" required></b-form-input>                    
                    </b-input-group-append>
                </b-input-group>

                <b-input-group class="mb-2" size="sm">
                    <b-input-group-append is-text>
                        <b-icon icon="envelope" shift-h="-4"></b-icon>
                        <b-form-input id="input-2" :state="statusEmail" v-model="form.email" placeholder="email" required></b-form-input>
                        <div v-show="!statusEmail" id="input-live-feedback" style="color: #F04848">
                            Enter a correct mail.
                        </div>
                    </b-input-group-append>
                </b-input-group>
                
                <b-input-group class="mb-2" size="sm">
                    <b-input-group-append is-text>
                        <b-icon icon="key" shift-h="-4"></b-icon>
                        <b-form-input :type="typeFirst" id="input-2" v-model="form.password" placeholder="Password" required></b-form-input>
                        <b-button @click="showPassFirst"><b-icon icon="eye-fill" shift-v="1" size="sm"></b-icon></b-button>
                    </b-input-group-append>
                </b-input-group>

                <b-input-group class="mb-2" size="sm">
                    <b-input-group-append is-text>
                        <b-icon icon="arrow-clockwise" shift-h="-4"></b-icon>
                        <b-form-input :type="typeConfirm" id="input-2" :state="statusPassword" v-model="form.verifyPassword" placeholder="Repeat password" required></b-form-input>
                        <b-button @click="showPassConfirm"><b-icon icon="eye-fill" shift-v="1" size="sm"></b-icon></b-button>
                        <div v-show="!statusPassword" id="input-live-feedback" style="color: #F04848">
                            The passwords don't match.
                        </div>
                    </b-input-group-append>
                </b-input-group>
                <b-button @click="submitSignup" variant="primary">Signup</b-button>
                <div v-show="processing">
                    <b-spinner></b-spinner>
                </div>
            </div>
            <div v-show="!registered" class="signup-form-text">
                <h1>Welcome back</h1>
                <p>Create an account and start playing</p>
                <p>If you already have an account sign in here</p>
                <router-link to="/login" class="button-router">Sign in</router-link>
            </div>
        </div>
        <div class="button" v-show="registered">
            <p>Te has registrado maquinote</p>
            <router-link to="/login" class="signin-button">Login</router-link>
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
            statusEmail: "null",
            statusPassword: "null",
            registered: false,
            typeFirst: "password",
            typeConfirm: "password"
        }
    },
    methods: {
        submitSignup() {
            this.processing = true;
            if (this.form.password == this.form.verifyPassword && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(this.form.email)) {
                this.processing = false;
                this.statusEmail = true;
                this.statusPassword = true;
                fetch(`http://127.0.0.1:8000/api/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.form),
                })
                    .then(response => response.json())
                    .then(data => {
                        this.registered = true;
                    })
            } else {
                this.processing = false;
                if (this.form.password != this.form.verifyPassword) {
                    this.statusPassword = false;
                }

                if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(this.form.email)) {
                    this.statusEmail = false;
                }
            }

        },
        showPassFirst() {
            if (this.typeFirst == "password") {
                this.typeFirst = "text"
            } else {
                this.typeFirst = "password"
            }
        },
        showPassConfirm() {
            if (this.typeConfirm == "password") {
                this.typeConfirm = "text"
            } else {
                this.typeConfirm = "password"
            }
        }
    },
    mounted() {
    }
})

const profile = Vue.component('profile',{
    template:`<div>
    <p>Perfil d'usuari</p>
    </div>`,
    data: function () {
        return{
            logged: userStore().logged,
            username: userStore().loginInfo.username
        }
    },
    methods:{
        
    },
    mounted(){

    }
})

const routes = [
    { path: "/", component: quiz },
    { path: "/login", component: login },
    { path: "/signup", component: signup },
    { path: "/difficulty", component: difficulty },
    { path: "/finishGame", component: finishGame },
];

const router = new VueRouter({
    routes,
})

let app = new Vue({
    el: '#app',
    router,
    pinia,
    data: {},
    computed: {
        ...Pinia.mapState(userStore, ['loginInfo', 'logged'])
    },
    methods: {},
});

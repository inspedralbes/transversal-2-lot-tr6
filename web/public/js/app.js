const userStore = Pinia.defineStore('usuario', {
    state() {
        return {
            logged: false,
            loginInfo: {
                username: '',
                id_user: null,
            },
            currentGame: {
                id_game: null,
                currentScore: -1
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
                <router-link to="/login" class="button login-button button-router">Login</router-link>   
            </div>
            <div v-else>
                <router-link to="/login" class="user"><b-icon icon="person-fill" class="h1"></b-icon><p>{{username}}</p></router-link>   
            </div>
            <div class="play">
                <div v-if="logged">
                        <h1 class="title-landing"> Wanna test your knowledge? </h1>
                        <router-link to="/difficulty" class="button-play button-router">Play</router-link>
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
        let users;
        let topScores;

        fetch(`http://127.0.0.1:8000/api/search-top-scores`)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                users = [data[0].name];
                topScores = [data[0].score];

                for (let i = 0; i < data.length; i++) {
                    let error = false;
                    for (let y = 0; y < users.length; y++) {
                        if (y == 0) {
                            topScores[y] = 0;
                        }

                        if (data[i].name == users[y]) {
                            error = true;
                            topScores[y] += data[i].score;
                        }
                    }

                    if (!error) {
                        users.push(data[i].name);
                    }
                }
                console.log(users);
                console.log(topScores);
                this.$forceUpdate();
            });



        const ChartScore = document.getElementById('topScore');

        new Chart(ChartScore, {
            type: 'bar',
            data: {
                labels: users,
                datasets: [{
                    label: 'Top Scorer',
                    data: topScores,
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
            noTime: false,
            contador: ''
        }
    },
    template: `
    <div>
        <router-link to="/" class="button home-button home-button-play">Home</router-link>       
        <div class="play" >
            <div v-show="user.logged">
                <router-link to="/login" class="user user-play"><b-icon icon="person-fill" class="h1"></b-icon><p>{{user.username}}</p></router-link>   
            </div>
            <div>
                <div v-if="!chosen" class="setParameters">
                    <div v-show="user.logged"class="categories">
                        <label> Category: 
                            <b-form-group v-model="categoriaSeleccionada" >
                                <b-form-radio button size="sm" button-variant="btn btn-dark btn-catdiff" v-model="categoriaSeleccionada"  name="categories"  value="arts_and_literature">Arts & Literature</b-form-radio>
                                <b-form-radio button size="sm" button-variant="btn btn-dark btn-catdiff" v-model="categoriaSeleccionada"  name="categories"  value="film_and_tv">Film & TV</b-form-radio>
                                <b-form-radio button size="sm" button-variant="btn btn-dark btn-catdiff" v-model="categoriaSeleccionada"  name="categories"  value="food_and_drink">Food & Drink</b-form-radio>
                                <b-form-radio button size="sm" button-variant="btn btn-dark btn-catdiff" v-model="categoriaSeleccionada"  name="categories"  value="general_knowledge">General Knowledge</b-form-radio>
                                <b-form-radio button size="sm" button-variant="btn btn-dark btn-catdiff" v-model="categoriaSeleccionada"  name="categories"  value="geography">Geography</b-form-radio>
                                <b-form-radio button size="sm" button-variant="btn btn-dark btn-catdiff" v-model="categoriaSeleccionada"  name="categories"  value="history">History</b-form-radio>
                                <b-form-radio button size="sm" button-variant="btn btn-dark btn-catdiff" v-model="categoriaSeleccionada"  name="categories"  value="music">Music</b-form-radio>
                                <b-form-radio button size="sm" button-variant="btn btn-dark btn-catdiff" v-model="categoriaSeleccionada"  name="categories"  value="science">Science</b-form-radio>
                                <b-form-radio button size="sm" button-variant="btn btn-dark btn-catdiff" v-model="categoriaSeleccionada"  name="categories"  value="society_and_culture">Society & Culture</b-form-radio>
                                <b-form-radio button size="sm" button-variant="btn btn-dark btn-catdiff" v-model="categoriaSeleccionada"  name="categories"  value="sport_and_leisure">Sport & Leisure</b-form-radio>
                            </b-form-group>
                        </label>
                    </div>
                    <div class="difficulty">
                        <label> Difficulty: 
                            <b-form-group v-model="dificultadSeleccionada">
                                <b-form-radio button size="sm" button-variant="btn btn-dark btn-outline-success btn-catdiff" v-model="dificultadSeleccionada" name="difficulty" value="easy">Easy</b-form-radio>
                                <b-form-radio button size="sm" button-variant="btn btn-dark btn-outline-warning btn-catdiff" v-model="dificultadSeleccionada" name="difficulty" value="medium">Medium</b-form-radio>
                                <b-form-radio button size="sm" button-variant="btn btn-dark btn-outline-danger btn-catdiff" v-model="dificultadSeleccionada" name="difficulty" value="hard">Hard</b-form-radio>
                            </b-form-group>
                            <br>
                            <div v-show="error" style="color:red">
                                <p>Select the difficulty</p><p v-show="user.logged">and category</p>
                            </div>
                            <button v-if="user.logged" @click="fetchPreguntes" class="button button-play">Play</button>
                            <button v-else @click="fetchDemo" class="button button-play">Play Demo Game</button>
                        </label>
                    </div>
                </div>
                <div v-else-if="!noTime">
                    <div class="timer">
                        <span class="timer_part seconds">{{contador}}</span>
                    </div> 
                    <div class="nQuestionContainer">
                        <div v-for="(question, indexQ) in questions">
                            <div v-if="currentQuestion!=indexQ" class="nQuestion">{{indexQ+1}}</div>
                            <div v-else class="nCurrQuestion">{{indexQ+1}}</div>
                        </div>
                    </div>
                    <section class="carousel">    
                        <div>
                            <div class="slides">
                                <div class="slides-item slide-1" id="slide-1">            
                                    <div class="slide-container">
                                        <div class="questionText">
                                            <h2>{{ questions[currentQuestion].question }}</h2>
                                        </div>
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
                <div v-else>
                    <h1 v-show="noTime" class="noTime" style="color: white;">Oh no! You ran out of time!!</h1>
                    <router-link to="/" class="button-play button">Try again</router-link> 
                </div>
            </div>
        </div>
    </div>
        `,
    methods: {
        setTimer: function () {
            var timer = 120;

            let idTimer = setInterval(() => {
                seconds = timer;
                this.contador = seconds;

                if (--timer < 0) {
                    this.noTime = true;
                    clearInterval(idTimer);
                }
            }, 1000);
        },
        fetchPreguntes: function () {
            if (this.categoriaSeleccionada == '' || this.dificultadSeleccionada == '') {
                this.error = true;
            } else {
                this.error = false;

                fetch(`https://the-trivia-api.com/api/questions?categories=${this.categoriaSeleccionada}&limit=10&region=ES&difficulty=${this.dificultadSeleccionada}`)
                    .then((response) => response.json())
                    .then((questions) => {
                        this.setTimer();
                        console.log(questions)
                        this.chosen = true;
                        this.questions = questions;

                        let questionsFormData = new FormData();
                        questionsFormData.append('category', this.categoriaSeleccionada);
                        questionsFormData.append('difficulty', this.dificultadSeleccionada);
                        questionsFormData.append('JSONQuestions', JSON.stringify(questions));

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

                        fetch(`http://127.0.0.1:8000/api/store-game`, {
                            method: 'POST',
                            body: questionsFormData,
                        }).then((response) => response.json())
                            .then((data) => {
                                userStore().currentGame.id_game = data.id;
                            });
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
                this.setTimer();
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
                    let score = parseInt((this.correctAnswers * 10) + this.contador);

                    if (userStore().loginInfo.id_user != null) {
                        let scoreUser = new FormData();
                        scoreUser.append('id_user', userStore().loginInfo.id_user);
                        scoreUser.append('id_game', userStore().currentGame.id_game);
                        scoreUser.append('score', score);

                        fetch(`http://127.0.0.1:8000/api/store-user`, {
                            method: 'POST',
                            body: scoreUser,
                        })
                    }

                    userStore().currentGame.currentScore = score;
                    this.$router.replace('/finishGame');
                }
            }, 1500);
        },
    },
},);

const finishGame = Vue.component('finishGame', {
    template: `<div>
        <div class="countAnswers" @click="hola()">Your score was {{correctAnswers}}</div>
        <router-link to="/difficulty" class="button-play">Play Again</router-link> 
        <router-link to="/" class="button">Home</router-link>
    </div>`,
    data: function () {
        return {
            logged: userStore().logged,
            username: userStore().loginInfo.username,
            id_user: userStore().loginInfo.id_user,
            correctAnswers: userStore().currentGame.currentScore
        }
    },
    methods: {
        hola: function () {
            console.log(this.id_user);
        },
    }
});



const login = Vue.component('login', {
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
            statusLogin: null,
            type: "password"
        }
    },
    template: `<div style="height:100vh">
    <router-link to="/" class="button home-button">Home</router-link>
        <div class="sign-page">
            <div class="sign-content">
                <div v-show="!logged" class="sign-form-text">
                    <h1 class="sign-title">Welcome back</h1>
                    <p>Enter your details and sign in</p>
                    <BR></br>
                    <p>If you still don't have an account sign up here</p>
                    <router-link to="/signup" class="button-router">Sign up</router-link>
                </div>
                <div v-show="!logged" class="sign-form-form">
                <h1>Sign in</h1>
                    <b-input-group class="mb-2" size="sm"> 
                        <b-input-group-append is-text class="input">
                            <b-icon icon="person" shift-h="-4"></b-icon>
                            <b-form-input class="font-input" :state="statusLogin" type="email" id="input-1" v-model="form.email" placeholder="Email" required></b-form-input>
                        </b-input-group-append>
                        <div v-if="statusLogin === false" id="input-live-feedback" style="color: #F04848; margin-left: 18%;">
                            Introduce un email correcto.
                        </div>
                    </b-input-group>
                    <b-input-group class="mb-2" size="sm">
                        <b-input-group-append is-text class="input">
                            <b-icon icon="key" shift-h="-4"></b-icon>
                            <b-form-input class="font-input" :type="type" id="input-2" :state="statusLogin" v-model="form.password" placeholder="Password" required ></b-form-input>
                            <b-button @click="showPass"><b-icon icon="eye-fill" shift-v="1" size="sm"></b-icon></b-button>
                        </b-input-group-append>
                    </b-input-group>
                    <b-button @click="submitLogin" variant="primary" class="signin-button">Sign in
                        <div v-if="!processing" class="signin-icon"><b-icon icon="check"></b-icon></div>
                        <div v-else="processing" class="signin-icon"><b-spinner class="signin-icon sign-icon-spinner"></b-spinner></div>
                    </b-button>
                    <div v-show="incorrectLogin">
                        <p style="color: red; margin: 18%;">Usuario Inexistente!</p> 
                    </div>
                </div>
                <div v-show="logged">
                    <p class="blanco">Bienvenido {{infoLogin.name}}</p>
                <b-button @click="logOut" variant="primary">Logout</b-button>
                </div>
            </div>
        </div>
        </div>
        `,
    methods: {
        submitLogin() {
            if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(this.form.email)) {
                this.processing = true;
                this.incorrectLogin = false;
                this.statusLogin = null;
                fetch(`http://127.0.0.1:8000/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.form),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data == 0) {
                            this.processing = false;
                            this.incorrectLogin = true;
                        } else {
                            this.infoLogin.name = data.username;
                            this.infoLogin.idUser = data.id;
                            this.logged = true;
                            userStore().logged = true;
                            userStore().loginInfo.username = data.username;
                            userStore().loginInfo.id_user = data.id;
                        }
                    })
            } else {
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
    template: `<div style="height:100vh">
        <router-link to="/" class="button home-button">Home</router-link>
        <div class="sign-page">
            <div class="sign-content">
                <div v-show="!registered" class="sign-form-form">
                <h1 class="sign-title">Sign up</h1>
                    <b-input-group class="mb-2" size="sm"> 
                        <b-input-group-append is-text class="input">
                            <b-icon icon="person" shift-h="-4"></b-icon>
                            <b-form-input class="font-input" id="input-1" v-model="form.username" placeholder="Username" required></b-form-input>                    
                        </b-input-group-append>
                    </b-input-group>

                    <b-input-group class="mb-2" size="sm">
                        <b-input-group-append is-text class="input">
                            <b-icon icon="envelope" shift-h="-4"></b-icon>
                            <b-form-input class="font-input" id="input-2" :state="statusEmail" v-model="form.email" placeholder="email" required></b-form-input>
                        </b-input-group-append>
                        <div v-if="statusEmail === false" id="input-live-feedback" class="error-text">
                            Enter a correct mail.
                        </div>
                    </b-input-group>
                    
                    <b-input-group class="mb-2" size="sm">
                        <b-input-group-append is-text class="input">
                            <b-icon icon="key" shift-h="-4"></b-icon>
                            <b-form-input class="font-input" :type="typeFirst" id="input-3" v-model="form.password" placeholder="Password" required></b-form-input>
                            <b-button @click="showPassFirst"><b-icon icon="eye-fill" shift-v="1" size="sm"></b-icon></b-button>
                        </b-input-group-append>
                    </b-input-group>

                    <b-input-group class="mb-2" size="sm">
                        <b-input-group-append is-text class="input">
                            <b-icon icon="arrow-clockwise" shift-h="-4"></b-icon>
                            <b-form-input class="font-input" :type="typeConfirm" id="input-4" :state="statusPassword" v-model="form.verifyPassword" placeholder="Repeat password" required></b-form-input>
                            <b-button @click="showPassConfirm"><b-icon icon="eye-fill" shift-v="1" size="sm"></b-icon></b-button>
                        </b-input-group-append>
                        <div v-if="statusPassword === false" id="input-live-feedback" class="error-text">
                            <p>The passwords don't match.</p>
                        </div>
                    </b-input-group>
                    <b-button @click="submitSignup" variant="primary" class="signin-button">Signup
                        <div v-if="!processing" class="signin-icon"><b-icon icon="check"></b-icon></div>
                        <div v-else="processing" class="signin-icon" ><b-spinner></b-spinner></div>
                    </b-button>
                </div>
                <div v-show="!registered" class="sign-form-text">
                    <h1>Welcome back</h1>
                    <p>Create an account and start playing</p>
                    <br></br>
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
            statusEmail: null,
            statusPassword: null,
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

const profile = Vue.component('profile', {
    template: `<div>
    <p>Perfil d'usuari</p>
    </div>`,
    data: function () {
        return {
            logged: userStore().logged,
            username: userStore().loginInfo.username
        }
    },
    methods: {

    },
    mounted() {

    }
})

const routes = [
    { path: "/", component: quiz },
    { path: "/login", component: login },
    { path: "/signup", component: signup },
    { path: "/difficulty", component: difficulty },
    { path: "/finishGame", component: finishGame },
    { path: "/profile", component: profile }
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
        ...Pinia.mapState(userStore, ['loginInfo', 'logged', 'currentGame'])
    },
    methods: {},
});

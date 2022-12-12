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
            <div class="containterStadistics">
                <canvas id="ranking"></canvas>
                <canvas id="playedGames"></canvas>
            </div>
        </div>`,
        mounted() {
            let chartRanking = document.getElementById('ranking');
            let chartGames = document.getElementById('playedGames');

            new Chart(chartRanking, {
                type: 'bar',
                data: {
                  labels: ['Julian', 'Peter', 'Ermel', 'Gracie', 'Lydia', 'Cesar'],
                  datasets: [{
                    label: 'Score',
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
            
              new Chart(chartGames, {
                type: 'bar',
                data: {
                  labels: ['History', 'Science', 'Sports', 'Music', 'Technology', 'Art'],
                  datasets: [{
                    label: 'Times played',
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
                        <p class="countAnswers">{{correctAnswers}}/{{currentQuestion}}</p>
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
            <div v-show="!logged" class="login-form">
                <b-input-group class="mb-2" size="sm"> 
                    <b-input-group-append is-text>
                        <b-icon icon="person" shift-h="-4"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input class="input" type="text" id="input-1" v-model="form.username" placeholder="Username" required></b-form-input>
                </b-input-group>
                <b-input-group class="mb-2" size="sm">
                    <b-input-group-append is-text>
                        <b-icon icon="key" shift-h="-4"></b-icon>
                    </b-input-group-prepend>
                    <b-form-input class="input" type="password" id="input-2" v-model="form.password" placeholder="Password" required ></b-form-input>
                </b-input-group>
                <b-button @click="submitLogin" variant="primary" >Sing in
                    <div v-if="!processing" class="signin-icon"><b-icon icon="check"></b-icon></div>
                    <div v-else="processing" class="signin-icon"><b-spinner small></b-spinner></div>
                </b-button>
                
            </div>
        <div v-show="logged">
            Bienvenido {{infoLogin.name}} 
            <img :src="infoLogin.image">
        <b-button @click="logOut" variant="primary">Logout</b-button>
        </div>
        </div>
        </div>
        `,
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
    },
    mounted() {
        console.log("login");
    }
});

const signup = Vue.component('signup', {
    template: `<div>
        <router-link to="/" class="button">Home</router-link>
        <div class="button">
            <b-form-input id="input-1" v-model="form.username" placeholder="Username" required></b-form-input>
            <b-form-input id="input-2" v-model="form.email" placeholder="email" required></b-form-input>
            <b-form-input id="input-3" v-model="form.password" placeholder="Password" required></b-form-input>
            <b-form-input id="input-4" v-model="form.verifyPassword" placeholder="Repeat password" required></b-form-input>
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

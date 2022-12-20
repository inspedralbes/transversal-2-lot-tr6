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
            username: userStore().loginInfo.username,
            ranking: [],
            dailyGame: [],
            challenges: []
        }
    },

    template: `
        <div class="container-landing">
            <div v-if="!logged">
                <router-link to="/login" class="button login-button button-router">Login</router-link>   
            </div>
            <div v-else>
                <router-link to="/profile" class="user"><b-icon icon="person-fill" class="h1"></b-icon><p>{{username}}</p></router-link>   
            </div>            
            <div class="play">
                <div v-if="logged">
                        <h1 class="title-landing"> Wanna test your knowledge? </h1>
                        <button  class="button-play" @click="btn_play(); $router.push('/difficulty')">Play
                        </button>
                        <br>
                </div>
                <div v-else>
                        <h1 class="title-landing" > Wanna test your knowledge? </h1>
                        <router-link to="/login" class="button-play" >Play</router-link>
                        <br>
                        <button  class="button demo-button" @click="btn_play(); $router.push('/difficulty')">Play as guest
                        </button>
                </div>
                <b-icon icon="arrow-down" class="arrow"></b-icon>
            </div>
            <canvas class="ranking" id="topScore"></canvas>
            <p class="text-ranking">Slide the table to Play</p>
            <div class="ranking-tables">
                <div class="div-ranking-table">
                    <table class="ranking-table">
                    <thead    
                    <tr>
                            <th>Position</th>
                            <th>Game Name</th>
                            <th>Difficulty</th>
                            <th>Play count</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(position, indexPos) in ranking">
                            <td>{{indexPos + 1}}º</td>
                            <td>{{position.id}} {{position.category}}</td>
                            <td>{{position.difficulty}}</td>
                            <td>{{position.play_count}}</td>
                            <td v-if="logged"><button class="button-table" @click="playGame(position.id)">Play</button></td>
                            <td v-else><button class="button-table" v-b-modal.my-modal>Play</button></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="gameOfTheDay">
                <p class="text-ranking">Slide the table to Play</p>
                    <table class="ranking-table">
                        <tr>
                            <th>Game Of The Day</th>
                            <th>Play count</th>
                            <th></th>
                        </tr>
                        <tr v-for="game in dailyGame">
                            <td>{{game.id}}_{{game.category}}_{{game.difficulty}}</td>
                            <td>{{game.play_count}}</td>
                            <td v-if="logged"><button class="button-table">Play</button></td>
                            <td v-else><button class="button-table" v-b-modal.my-modal>Play</button></td>
                        </tr>
                    </table>
                </div>
                <div class="gameOfTheDay">
                <p class="text-ranking">Slide the table to Play</p>
                    <table class="ranking-table">
                        <tr>
                            <th>Challenges</th>
                            <th></th>
                        </tr>
                        <tr v-for="challenge in challenges">
                            <td>{{challenge.username}}</td>
                            <td v-if="logged"><button class="button-table">Play</button></td>
                            <td v-else><button class="button-table" v-b-modal.my-modal>Play</button></td>
                        </tr>
                        <b-modal id="my-modal" ok-only>You must be logged-in to play a normal Game!</b-modal>
                    </table>
                </div>
            </div>
            <div class="footer">
                <p>This quiz was made using the <a href="https://the-trivia-api.com/">The Trivia API</a></p>
            </div>
        </div>`,
    mounted() {

        userStore().currentGame.id_game = null;
        let users;
        let topScores;

        fetch(`http://127.0.0.1:8000/api/search-top-scores`)
            .then(response => response.json())
            .then(data => {
                users = [data[0].name];
                topScores = [data[0].score];

                for (let i = 0; i < data.length; i++) {
                    let error = false;
                    for (let y = 0; y < users.length; y++) {
                        if (data[i].name == users[y]) {
                            error = true;
                            topScores[y] += data[i].score;
                        }
                    }

                    if (!error) {
                        users.push(data[i].name);
                        topScores.push(data[i].score);
                    }
                }

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
            });

        fetch(`http://127.0.0.1:8000/api/search-top-games`)
            .then(response => response.json())
            .then(data => {
                this.ranking = data;
            });
            
        fetch(`http://127.0.0.1:8000/api/daily-game-info`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.dailyGame = data;
            });

        let idUserFormData = new FormData();
        idUserFormData.append('id_user_challenged', userStore().loginInfo.id_user);

        fetch(`http://127.0.0.1:8000/api/get-challenges`, {
            method: 'POST',
            body: idUserFormData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.challenges = data;
            });
    },
    methods: {
        btn_play: function () {
            audioStart();
        },
        playGame(id_game) {
            userStore().currentGame.id_game = id_game;
            this.$router.replace('/difficulty');
        }
    },
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
            id_game: userStore().currentGame.id_game,
            questions: [],
            currentQuestion: 0,
            colorButtons: ["default", "default", "default", "default"],
            statusButtons: [false, false, false, false],
            correctAnswers: 0,
            error: false,
            failed: false,
            correction: '',
            noTime: false,
            contador: '',
        }
    },
    template: `
    <div>
        <router-link to="/" class="button home-button home-button-play">Home</router-link>       
        <div class="play" >
            <div v-show="user.logged">
                <router-link to="/profile" class="user user-play"><b-icon icon="person-fill" class="h1"></b-icon><p>{{user.username}}</p></router-link>   
            </div>
            <div>
                <div v-if="!chosen" class="setParameters">
                    <div v-if="id_game == null">
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
                    <div v-else>
                        <div class="difficulty">
                            <button @click="fetchPreguntes" class="button button-play">Play</button>
                        </div>
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
                        <h1 class="text-demo" v-show="!user.logged">You are playing a demo version, <router-link to="/login">sign in</router-link> if you want to play the full version</h1>
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
        `, mounted() {
        if (userStore().currentGame.id_game != null) {
            this.categoriaSeleccionada = "a";
            this.dificultadSeleccionada = "a";
        }
    },
    methods: {
        btn_pause: function(){
            audioStop();
        },
        btn_play: function(){
            audioStart();
        },
        setTimer: function () {
            var timer = 100;

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
                if (this.id_game == null) {
                    fetch(`https://the-trivia-api.com/api/questions?categories=${this.categoriaSeleccionada}&limit=10&region=ES&difficulty=${this.dificultadSeleccionada}`)
                        .then((response) => response.json())
                        .then((questions) => {
                            let questionsFormData = new FormData();
                            questionsFormData.append('category', this.categoriaSeleccionada);
                            questionsFormData.append('difficulty', this.dificultadSeleccionada);
                            questionsFormData.append('JSONQuestions', JSON.stringify(questions));
                            questionsFormData.append('id_game', -1);

                            this.questions = mixAnswers(questions);
                            this.setTimer();
                            this.chosen = true;

                            fetch(`http://127.0.0.1:8000/api/store-game`, {
                                method: 'POST',
                                body: questionsFormData,
                            }).then((response) => response.json())
                                .then((data) => {
                                    userStore().currentGame.id_game = data.id;
                                });
                        });
                } else {
                    let idGame = new FormData();
                    idGame.append('id_game', this.id_game);

                    fetch(`http://127.0.0.1:8000/api/json-game`, {
                        method: 'POST',
                        body: idGame,
                    })
                        .then((response) => response.json())
                        .then((questions) => {
                            questions = JSON.parse(questions[0].JSONQuestions);

                            this.questions = mixAnswers(questions);
                            this.setTimer();
                            this.chosen = true;

                            fetch(`http://127.0.0.1:8000/api/store-game`, {
                                method: 'POST',
                                body: idGame,
                            })
                        });
                }
            }

            function mixAnswers(questions) {
                let length = questions.length;
                let cont = 0;

                for (let j = 0; j < length; j++) {
                    let pos = Math.floor(Math.random() * 4);
                    let answers = [];
                    for (let i = 0; i < 4; i++) {
                        if (i == pos) {
                            answers.push(questions[j].correctAnswer);
                            questions[j].correctIndex = i;
                        } else {
                            answers.push(questions[j].incorrectAnswers[cont]);
                            cont++;
                        }
                    }
                    cont = 0;
                    questions[j].answers = answers;
                }

                return questions;
            }
        },
        fetchDemo: function () {
            if (this.dificultadSeleccionada == '') {
                this.error = true;
            } else {
                let diff;
                switch (this.dificultadSeleccionada) {
                    case 'easy': diff = 1;
                        break;
                    case 'medium': diff = 2;
                        break;
                    case 'hard': diff = 3;
                        break;
                    default: this.error = true;
                        break;
                }
                this.error = false;
                let difficulty = new FormData();
                difficulty.append('diff', diff);
                fetch(`http://127.0.0.1:8000/api/select-demo`, {
                    method: 'POST',
                    body: difficulty,
                })
                    .then(response => response.json())
                    .then(data => {
                        let incorrectAnswers2 = this.splitter(data);
                        this.chosen = true;
                        this.questions = data;
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
                                    answers.push(incorrectAnswers2[j][cont]);
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
        splitter: function (questions) {
            let answerArray = [];
            for (let i = 0; i < questions.length; i++) {
                answerArray.push(questions[i].incorrectAnswers.split(","));

            }
            return answerArray;
        },
        verificate(indexQ, indexA) {
            this.indexVAnswers++;
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

                    this.$router.push({
                        name: "finishGame",
                        params: {
                            correctAnswers: this.correctAnswers,
                        }
                    })

                    // this.$router.replace('/finishGame');
                }
            }, 100);
        },
    },
},);

const finishGame = Vue.component('finishGame', {
    template: `<div>
    <router-link to="/" class="button home-button">Home</router-link>       
    <div class="finish-page">
    <div v-if="!logged">
        <router-link to="/login" class="button login-button button-router">Login</router-link>   
    </div>
    <div v-else>
        <router-link to="/profile" class="user"><b-icon icon="person-fill" class="h1"></b-icon><p>{{username}}</p></router-link>   
    </div>
        <div class="finish-content">
            <div class="finish-data">
                <h1>You've scored {{this.score}} points!</h1>
                <h1>You've answered correctly {{correctAnswers}}/10 questions</h1>
                <h2>Wanna try again?</h2>
                <router-link to="/difficulty" class="button-play">Play</router-link>
            </div>    
            <div>
                <h1 style="color:white">Do you want to challenge another user?</h1>
                <table class="ranking-table">
                    <tr>
                        <th>Users</th>
                        <th></th>
                    </tr>
                    <tr v-for="user in users">
                        <td>{{user.username}}</td>
                        <td v-if="logged"><button class="button-table" @click="challengeGame(user.id)">Send Challenge</button></td>
                        <td v-else><button class="button-table" v-b-modal.my-modal>Send Request</button></td>
                    </tr>
                    <b-modal id="my-modal" ok-only>You must be logged-in to challenge another user!</b-modal>
                </table>
            </div>
        </div>
    </div>
    </div>`,
    data: function () {
        return {
            logged: userStore().logged,
            username: userStore().loginInfo.username,
            id_user: userStore().loginInfo.id_user,
            score: userStore().currentGame.currentScore,
            correctAnswers: 0,
            users: []
        }
    },
    mounted() {
        userStore().currentGame.id_game = null;

        this.correctAnswers= this.$route.params.correctAnswers;
        console.log(this.correctAnswers);

        fetch(`http://127.0.0.1:8000/api/users`)
            .then(response => response.json())
            .then(data => {
                console.log(data.users)
                this.users = data.users;
            });
    },
    methods: {
        challengeGame(userChallenged){
            let challengeUser = new FormData();
            challengeUser.append('id_user', userStore().loginInfo.id_user);
            challengeUser.append('id_user_challenged', userChallenged);
            challengeUser.append('id_game', ususerStore().currentGame.id_game);
            
            fetch(`http://127.0.0.1:8000/api/challenge`, {
                method: POST,
                body: challengeUser
            })
        }
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
            <div class="sign-content signin-content">
            <div v-show="!logged" class="sign-form-text signin">
                <div class="signin-text-content">
                    <h1 class="sign-title">Welcome back</h1>
                    <p>Enter your details and sign in</p>
                    <BR></br>
                    <p>If you still don't have an account sign up here</p>
                    <router-link to="/signup" class="button-router">Sign up</router-link>
                </div>
            </div>
            <div v-show="!logged" class="sign-form-form signin">
                <div class="signin-form-content">
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
                    <div style="margin: 0; text-align:center" v-show="incorrectLogin">
                        <p style="color: red; margin-top:10px">Usuario Inexistente!</p> 
                    </div>
                </div>
                <div v-show="logged">
                    <p class="blanco">Bienvenido {{infoLogin.name}}</p>
                <b-button @click="logOut" variant="primary">Logout</b-button>
                </div>
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

                            this.$router.replace('/profile');
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
});

const signup = Vue.component('signup', {
    template: `<div style="height:100vh">
        <router-link to="/" class="button home-button">Home</router-link>
        <div class="sign-page">
            <div class="sign-content signup-content">
            <div v-show="!registered" class="sign-form-form signup-form">
                <div class="signup-form-form">
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
            </div>
            <div v-show="!registered" class="sign-form-text signup-text">
                <div class="signup-text-content">
                    <h1>Welcome back</h1>
                    <p>Create an account and start playing</p>
                    <br></br>
                    <p>If you already have an account sign in here</p>
                    <router-link to="/login" class="button-router">Sign in</router-link>
                </div>
            </div>
            <div class="button" v-show="registered">
                <p>You've signed up successfully</p>
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
    <router-link to="/" class="button home-button">Home</router-link>       
    <div class="profile-page">
        <div class="profile-content">
            <div class="profile-data">
                <b-icon icon="person-fill" class="h1"></b-icon>
                <h1><strong>{{username}}  </strong></h1>
                <br>
                <h2 class="maxScore">Max score: {{maxScore}}</h2>
            </div>
                <div>
                    <b-table id="profile-table" striped hover :items="userData" dark responsive outlined style="width: 100%; margin: auto;"></b-table>
                </div>
                <div>
                    <b-button class="logout-btn" @click="logOut" variant="primary">Logout</b-button>
                </div>
        </div>
        
    </div>
    </div>`,
    data: function () {
        return {
            logged: userStore().logged,
            username: userStore().loginInfo.username,
            id_user: userStore().loginInfo.id_user,
            userData: [],
            maxScore: 0
        }
    },
    methods: {
        logOut: function () {
            userStore().logged = false;
            userStore().loginInfo.username = '';
            this.logged = false;
            this.processing = false;

            this.$router.replace('/login');
        },
    },
    mounted() {
        let id_userFormdata = new FormData();
        id_userFormdata.append('id_user', this.id_user);

        fetch(`http://127.0.0.1:8000/api/user-data`, {
            method: 'post',
            body: id_userFormdata
        })
            .then((response) => response.json())
            .then((data) => {
                this.userData = data;
                console.log(this.userData);

                for (let i = 0; i < this.userData.length; i++) {
                    this.maxScore += this.userData[i].score
                }
        });
    }
})

const routes = [
    { path: "/", component: quiz },
    { path: "/login", component: login },
    { path: "/signup", component: signup },
    { path: "/difficulty", component: difficulty },
    { path: "/finishGame", component: finishGame, name: "finishGame" },
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

const quiz = Vue.component('quiz', {
<<<<<<< HEAD
    template: `<div>
        <router-link to="/login" class="button">Login</router-link>
        <h1> Wanna test your knowledge? </h1>
        <router-link to="/play" class="button">Play</router-link>
        </div>`
=======
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
            categorias: [],
        }
    },
    template: `
        <div class="play"> 
            <div class="setParameters">
                <div class="categories">
                    <label> Difficulty 
                        <select>
                            <option disabled selected>Choose a Category</option>
                            <option value="fantasy">Fantaseame esta</option>
                            <option value="cine">Cine</option>
                            <option value="amongus">Amongus</option>
                        </select>
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
                .then((categories) => console.log(categories));
        }
    }
>>>>>>> 16173899410a09f3fc4aba6fe80d796747a27e46
});

const play = Vue.component('play', {
    template: `<section> 
    <ol class="carousel__viewport">
        <li id="carousel__slide1"
            tabindex="0"
            class="carousel__slide">
        <div class="carousel__snapper">
        </div>
        </li>
        <li id="carousel__slide2"
            tabindex="0"
            class="carousel__slide">
        <div class="carousel__snapper"></div>
        </li>
        <li id="carousel__slide3"
            tabindex="0"
            class="carousel__slide">
        <div class="carousel__snapper"></div>
        </li>
        <li id="carousel__slide4"
            tabindex="0"
            class="carousel__slide">
        <div class="carousel__snapper"></div>
        </li>
    </ol>
    <aside class="carousel__navigation">
        <ol class="carousel__navigation-list">
        <li class="carousel__navigation-item">
            <a href="#carousel__slide1"
            class="carousel__navigation-button">Go to slide 1</a>
        </li>
        <li class="carousel__navigation-item">
            <a href="#carousel__slide2"
            class="carousel__navigation-button">Go to slide 2</a>
        </li>
        <li class="carousel__navigation-item">
            <a href="#carousel__slide3"
            class="carousel__navigation-button">Go to slide 3</a>
        </li>
        <li class="carousel__navigation-item">
            <a href="#carousel__slide4"
            class="carousel__navigation-button">Go to slide 4</a>
        </li>
        </ol>
    </aside>
    </section>`
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
                        store.setEstado(this.infoLogin);
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
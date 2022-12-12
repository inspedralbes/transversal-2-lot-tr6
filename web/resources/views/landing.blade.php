<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>League Of Trivial</title>
    <link type="text/css" rel="stylesheet" href="/css/normalize.css" />
    <link rel="stylesheet" href="/css/style.css">

    <!-- Load required Bootstrap and BootstrapVue CSS -->
    <link type="text/css" rel="stylesheet" href="https://unpkg.com/bootstrap/dist/css/bootstrap.min.css" />
    <link type="text/css" rel="stylesheet" href="https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.css" />

    <!-- UIkit CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uikit@3.15.14/dist/css/uikit.min.css" />

    <!-- UIkit JS -->
    <script src="https://cdn.jsdelivr.net/npm/uikit@3.15.14/dist/js/uikit.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/uikit@3.15.14/dist/js/uikit-icons.min.js"></script>

    <!-- Load polyfills to support older browsers -->
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es2015%2CIntersectionObserver" crossorigin="anonymous"></script>

    <!-- Load Vue followed by BootstrapVue -->
    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
    <script src="https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.js"></script>

    <!-- Load the following for BootstrapVueIcons support -->
    <script src="https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue-icons.min.js"></script>
    <script src="https://unpkg.com/vue-router@3/dist/vue-router.js"></script>

    <link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap/dist/css/bootstrap.min.css" />
    <link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.css" />
    <!-- Load Vue followed by BootstrapVue, and BootstrapVueIcons -->
    <script src="//unpkg.com/vue@latest/dist/vue.min.js"></script>
    <script src="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.js"></script>
    <script src="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue-icons.min.js"></script>

    {{-- Vue chart --}}
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body class="fondo">
    <div id="app">
        <router-view></router-view>
    </div>

    <script src="/js/app.js"></script>
</body>

</html>

{{--
<section> 
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
    </section> --}}
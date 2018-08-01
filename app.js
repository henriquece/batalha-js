/////////////////////////////////////////
// CONTROLADOR - DADOS
/////////////////////////////////////////
const controladorDados = (function() {

    class DataDefault {
        constructor() {
            this.jogoEstado = true,
            this.cartaVirada = [false, false],
            this.cartasMesa = 0,
            this.pontos = [10, 10],
            this.montes = [10, 10],
            this.cartaValor = [0, 0],
            this.cartaCaractere = ["", ""],
            this.naipeValor = [0, 0],
            this.naipeCaractere = ["", ""],
            this.vencedor = -1
        } 
    }

    let data;

    const valorMap = new Map();
    valorMap.set(1, "a");
    valorMap.set(2, "2");
    valorMap.set(3, "3");
    valorMap.set(4, "4");
    valorMap.set(5, "5");
    valorMap.set(6, "6");
    valorMap.set(7, "7");
    valorMap.set(8, "8");
    valorMap.set(9, "9");
    valorMap.set(10, "10");
    valorMap.set(11, "j");
    valorMap.set(12, "q");
    valorMap.set(13, "k");

    const naipesMap = new Map();
    naipesMap.set(1, "o");
    naipesMap.set(2, "e");
    naipesMap.set(3, "c");
    naipesMap.set(4, "p");
    
    const limparRodada = () => {
        data.cartaVirada = [false, false];        
    };
    
    const limparAposUmVencedor = () => {
        data.cartasMesa = 0;
        data.pontos = [...data.montes];
    };

    return {
        getData: () => data,

        jogar: (player) => {    
            player === 0 ? outroPlayer = 1 : outroPlayer = 0;
            
            if (!data.cartasMesa) {
                data.cartaValor[outroPlayer] = 0;
                data.cartaCaractere[outroPlayer] = "";
                data.naipeValor[outroPlayer] = 0;
                data.naipeCaractere[outroPlayer] = "";
            }

            const valorAleatorio = Math.ceil(Math.random() * 13);
            data.cartaValor[player] = valorAleatorio;
            data.cartaCaractere[player] = valorMap.get(valorAleatorio);

            const naipeAleatorio = Math.ceil(Math.random() * 4)
            data.naipeValor[player] = naipeAleatorio;
            data.naipeCaractere[player] = naipesMap.get(naipeAleatorio);  
            
            data.cartaVirada[player] = true;
            data.montes[player] -= 1;
            data.cartasMesa += 1;  
        },

        confrontar: () => {
            if (data.cartaValor[0] > data.cartaValor[1]) {
                data.montes[0] += data.cartasMesa;
                limparRodada();
                limparAposUmVencedor();                
            } else if (data.cartaValor[1] > data.cartaValor[0]) {
                data.montes[1] += data.cartasMesa;
                limparRodada();
                limparAposUmVencedor();
            } else if (data.cartaValor[1] === data.cartaValor[0]) {
                console.log("Empate");
                limparRodada();
            }

            if (!data.montes[0] || !data.montes[1]) {
                data.jogoEstado = false;
                data.montes[0] === 0 ? data.vencedor = 1 : data.vencedor = 0;
            }
        },

        inicializarDados: () => {
            data = new DataDefault()
        }

    }

})();


/////////////////////////////////////////
// CONTROLADOR - UI
/////////////////////////////////////////
const controladorUI = (function() {

    const classes = {
        cardModelo: "card-modelo",
        vencedorPlayer: "vencedor"
    };

    const elements = {
        btnReiniciar: document.querySelector("#btn-reiniciar"),
        player1Lado: document.querySelector("#player-1"),
        player1Titulo: document.querySelector("#player-1-titulo h2"),
        player1Pontos: document.querySelector("#player-1-pontos h1"),
        player1Monte: document.querySelector("#p1-monte"),
        player1Carta: document.querySelector("#p1-carta"),
        player1BtnMostrarCarta: document.querySelector("#btn-p1-mostrar-carta"),
        player2Lado: document.querySelector("#player-2"),
        player2Titulo: document.querySelector("#player-2-titulo h2"),
        player2Pontos: document.querySelector("#player-2-pontos h1"),
        player2Monte: document.querySelector("#p2-monte"),
        player2Carta: document.querySelector("#p2-carta"),
        player2BtnMostrarCarta: document.querySelector("#btn-p2-mostrar-carta"),
    };   

    return {
        getElements: () => elements,

        mostrarCarta: (playerUI, data) => {
            idCarta = "#p" + playerUI + "-carta";    
            elementCarta = document.querySelector(idCarta);
            elementCarta.classList.value = "";     
            
            idMonte = "#p" + playerUI + "-monte";      
            elementMonte = document.querySelector(idMonte);
            elementMonte.classList.value = "";   

            if (data.montes[playerUI - 1]) {
                const monteClasse = `card-back-${data.montes[playerUI - 1]}`; 
                elementMonte.classList.add(classes.cardModelo);         
                elementMonte.classList.add(monteClasse);                 
            }

            if (data.cartaValor[playerUI - 1]) {
                const cartaClasse = `card-${data.cartaCaractere[playerUI - 1]}-${data.naipeCaractere[playerUI - 1]}`;
                elementCarta.classList.add(classes.cardModelo);         
                elementCarta.classList.add(cartaClasse);                
            }
        },

        atualizarPontos: (data) => {
            elements.player1Pontos.textContent = data.pontos[0];
            elements.player2Pontos.textContent = data.pontos[1];
        },
        
        mostrarVencedor: (data) => {
            const elementVencedorLado = document.querySelector(`#player-${data.vencedor + 1}`);
            elementVencedorLado.classList.add(classes.vencedorPlayer);

            const elementVencedorTitulo = document.querySelector(`#player-${data.vencedor + 1}-titulo h2`);
            elementVencedorTitulo.textContent = "Vencedor!";
        },

        inicializarUI: () => {
            elements.player1Lado.classList.remove("vencedor");
            elements.player2Lado.classList.remove("vencedor");
            elements.player1Titulo.textContent = "Player 1";
            elements.player2Titulo.textContent = "Player 2";
        }
    }

})();


/////////////////////////////////////////
// CONTROLADOR - GLOBAL
/////////////////////////////////////////
const controladorGlobal = (function(ctrlDados, ctrlUI) {

    const setupEventListeners = () => {
        const elements = ctrlUI.getElements();
        
        elements.btnReiniciar.addEventListener("click", inicializarJogo);
        elements.player1BtnMostrarCarta.addEventListener("click", ctrlGlobalMostrarCarta);
        elements.player2BtnMostrarCarta.addEventListener("click", ctrlGlobalMostrarCarta);
    };

    const ctrlGlobalMostrarCarta = function(e) {
        const data = ctrlDados.getData();
        if (data.jogoEstado) {
            e.target.nodeName === "BUTTON" ? idBotao = e.target.id : idBotao = e.target.parentNode.id; 
    
            const playerUI = parseInt(idBotao.substr(5, 1));
    
            if (data.cartaVirada[playerUI - 1] === false) {
                const playerDadosRodada = ctrlDados.jogar(playerUI - 1);
                ctrlUI.mostrarCarta(1, data);
                ctrlUI.mostrarCarta(2, data);
            }
    
            if (data.cartaVirada[0] && data.cartaVirada[1]) {
                ctrlDados.confrontar();

                console.log(data.pontos)
    
                ctrlUI.atualizarPontos(data);
                ctrlUI.mostrarCarta(1, data);
                ctrlUI.mostrarCarta(2, data);

                if (data.vencedor !== -1) {
                    ctrlUI.mostrarVencedor(data);
                }
            }  
        }
    };

    const inicializarJogo = () => {
        ctrlDados.inicializarDados();
        
        data = ctrlDados.getData();
        ctrlUI.inicializarUI();
        ctrlUI.atualizarPontos(data);
        ctrlUI.mostrarCarta(1, data);
        ctrlUI.mostrarCarta(2, data);
    };
    
    return {
        init: function() {
            console.log("A aplicação foi iniciada!");            
            setupEventListeners();
            inicializarJogo();
        }
    }

})(controladorDados, controladorUI);


/////////////////////////////////////////
// INICIALIZAÇÃO DO CONTROLADOR - GLOBAL
/////////////////////////////////////////
controladorGlobal.init();

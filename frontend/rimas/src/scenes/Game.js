import Phaser from "phaser";
import { selectedVoice } from "./Preloader.js";

//TODO: transformar os objetos e as seções do jogo em containers, mudar os sons de acerto e erro, deixar responsivo e criar menu no fim do game
let score = 0;
// Função para fazer o navegador ler o texto em voz alta
function speak(text) {
  const synth = speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = selectedVoice;
  synth.speak(utterance);
}

// Lista de palavras
const palavras = [
  ["Cão", "Mão", "Leão", "Avião"],
  ["Casa", "Brasa"],
  ["Pato", "Gato", "Sapato", "Retrato", "Rato"],
  ["Bola", "Escola", "Cachola"],
  ["Fada", "Estrada"],
  ["Bolo", "Tolo"],
  ["Sol", "Farol"],
  ["Touro", "Louro", "Ouro"],
  [
    "Mesa",
    "Beleza",
    "Princesa",
    "Defesa",
    "Surpresa",
    "Franqueza",
    "Certeza",
    "Tristeza",
    "Proeza",
  ],
  ["Lua", "Rua", "Flutua", "Continua"],
  ["Sorriso", "Paraíso"],
  ["Cama", "Lama"],
  ["Roda", "Moda"],
  ["Fruta", "Bruta"],
  ["Fogo", "Togo"],
  ["Pente", "Presente", "Dente", "Gente"],
  ["Festa", "Floresta"],
  ["Caderno", "Inverno"],
  ["Morango", "Tango"],
  ["Mapa", "Capa"],
  ["Estrela", "Cinderela", "Janela"],
  ["Flor", "Cor"],
  ["Cobra", "Sombra"],
  ["Garrafa", "Rafa"],
  ["Mala", "Bala"],
  ["Coelho", "Espelho", "Joelho"],
  ["Chuva", "Uva"],
  ["Vento", "Momento"],
  ["Fome", "Nome"],
  ["Vaca", "Placa"],
  ["Roda", "Moda"],
  ["Guarda", "Tarda"],
  ["Porta", "Torta"],
  ["Chave", "Nave"],
  ["Galo", "Ralo", "Calo"],
  //["Corda", "Gorda"],
  ["Tomate", "Debate"],
  ["Tigre", "Livre"],
  ["Pé", "Café"],
  ["Brinquedo", "Segredo"],
  ["Fio", "Desafio", "Navio", "Rio"],
];

// Função para embaralhar uma lista de palavras
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function selecionarPalavras() {
  const palavrasSelecionadas = shuffle(
    shuffle(palavras)
      .slice(0, 10)
      .map((palavra) => shuffle(palavra).slice(0, 2))
  );

  let paresDePalavras = [];
  palavrasSelecionadas.forEach((par, index) => {
    paresDePalavras.push({ palavra: par[0], id: index });
    paresDePalavras.push({ palavra: par[1], id: index });
  });

  return shuffle(paresDePalavras);
}

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  create() {
    // Inicia o jogo e cria os objetos necessários
    this.startGame();
    // Salvar o melhor tempo (em segundos)
    this.bestTime = Infinity; // Inicializa com um valor grande para garantir que qualquer tempo é menor
    this.bestTimerText = this.add.text(470, 30, "Melhor Tempo: 00:00", {
      fontSize: "24px",
      color: "#ffffff",
    });
  }

  startGame() {
    // Destruir objetos antigos
    this.destroyGameObjects();

    // Inicia o jogo
    score = 0;
    this.isRunning = true;
    // Criação do cronômetro
    this.startTime = this.time.now; // Salva o tempo inicial
    this.timerText = this.add.text(50, 30, "00:00", {
      fontSize: "24px",
      color: "#ffffff",
    });

    const palavrasSelecionadas = selecionarPalavras();

    const atributos = {
      posX: 145,
      posY: 480,
      width: 150,
      height: 50,
      gap: 30,
      colorRec: 0xffffff,
      textColor: "#ffffff",
    };

    atributos.textX = atributos.posX + atributos.width + atributos.gap;
    atributos.interrogacaoX =
      atributos.textX + atributos.width + atributos.gap + 135;

    // Adiciona dois retângulos com bordas
    this.retangulo1 = this.add.graphics();
    this.retangulo1.lineStyle(2, 0xffffff, 1);
    this.retangulo1.strokeRect(
      atributos.posX,
      atributos.posY,
      atributos.width,
      atributos.height
    );
    this.textRec1 = this.add
      .text(
        atributos.posX + atributos.width / 2,
        atributos.posY + atributos.height / 2,
        "",
        {
          fontSize: "24px",
          color: atributos.textColor,
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    this.retangulo2 = this.add.graphics();
    this.retangulo2.lineStyle(2, 0xffffff, 1);
    this.retangulo2.strokeRect(
      atributos.posX + atributos.width + atributos.gap + 150,
      atributos.posY,
      atributos.width,
      atributos.height
    );
    this.textRec2 = this.add
      .text(
        atributos.posX +
          atributos.width +
          atributos.gap +
          150 +
          atributos.width / 2,
        atributos.posY + atributos.height / 2,
        "",
        {
          fontSize: "24px",
          color: atributos.textColor,
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    this.add.text(atributos.textX, atributos.posY + 15, "Rima com:", {
      fontSize: "24px",
      color: atributos.textColor,
      fontStyle: "bold",
    });

    this.add.text(atributos.interrogacaoX, atributos.posY + 15, "?", {
      fontSize: "24px",
      color: atributos.textColor,
      fontStyle: "bold",
    });

    this.selecionados = [];
    this.createSquares(palavrasSelecionadas);
  }

  createSquares(palavrasSelecionadas) {
    const larguraQuadrado = 150;
    const alturaQuadrado = 80;
    const espacamento = 10;
    const posicaoInicialX = 80;
    const posicaoInicialY = 120;

    palavrasSelecionadas.forEach((item, index) => {
      const posicaoX =
        posicaoInicialX + (index % 5) * (larguraQuadrado + espacamento);
      const posicaoY =
        posicaoInicialY +
        Math.floor(index / 5) * (alturaQuadrado + espacamento);

      // Criando os quadrados
      const quadrado = this.add
        .rectangle(
          posicaoX,
          posicaoY,
          larguraQuadrado,
          alturaQuadrado,
          0x0000ff
        )
        .setInteractive();

      // Crie o texto e centralize-o no quadrado
      this.add
        .text(posicaoX, posicaoY, item.palavra, {
          fontSize: "22px",
          fontFamily: "Arial",
          color: "#ffffff",
        })
        .setOrigin(0.5);

      // Armazene a palavra e o ID no quadrado usando `data`
      quadrado.setData("palavra", item.palavra);
      quadrado.setData("id", item.id);

      // Quando clicar no quadrado
      quadrado.on("pointerdown", () => {
        if (this.selecionados.length < 2) {
          this.selecionados.push(quadrado);
          this.selecionados[0].disableInteractive();
          quadrado.fillColor = 0xffff00; // Amarelo
          this.textRec1.setText(this.selecionados[0].getData("palavra"));
        }

        if (this.selecionados.length === 2) {
          this.selecionados.push("fim"); // interropedor de repetição
          this.selecionados[1].disableInteractive();
          this.textRec2.setText(this.selecionados[1].getData("palavra"));
          const id1 = this.selecionados[0].getData("id");
          const id2 = this.selecionados[1].getData("id");
          speak(
            `${this.selecionados[0].getData(
              "palavra"
            )}, rima com: ${this.selecionados[1].getData("palavra")}??`
          );
          if (id1 === id2) {
            // Par correto
            speak("SIM! Muito bem"); // TODO: Substituir por som de acerto

            this.selecionados[0].fillColor = 0x00ff00; // Verde
            this.selecionados[1].fillColor = 0x00ff00; // Verde

            setTimeout(() => {
              this.textRec1.setText("");
              this.textRec2.setText("");
              score += 1;
              this.selecionados = []; // Reinicie os selecionados
            }, 3000);

            // TODO: criar menu no fim do game
          } else {
            // Par incorreto
            speak("NÃO rima!"); // TODO: Substituir por som de erro
            this.selecionados[0].fillColor = 0xff0000; // Vermelho
            this.selecionados[1].fillColor = 0xff0000; // Vermelho
            setTimeout(() => {
              this.textRec1.setText("");
              this.textRec2.setText("");
              this.selecionados[0].setInteractive();
              this.selecionados[1].setInteractive();
              this.selecionados[0].fillColor = 0x0000ff; // Azul
              this.selecionados[1].fillColor = 0x0000ff; // Azul
              this.selecionados = []; // Reinicie os selecionados
            }, 3000);
          }
        }
      });
    });
  }

  destroyGameObjects() {
    // Destruir especificamente os objetos criados
    if (this.timerText) this.timerText.destroy();
    if (this.retangulo1) this.retangulo1.destroy();
    if (this.retangulo2) this.retangulo2.destroy();
    if (this.textRec1) this.textRec1.destroy();
    if (this.textRec2) this.textRec2.destroy();
    if (this.quadrados) {
      this.quadrados.forEach((quadrado) => {
        if (quadrado && quadrado.destroy) quadrado.destroy();
      });
      this.quadrados = [];
    }
  }

  update(time) {
    if (this.isRunning) {
      let elapsedSeconds = Math.floor((time - this.startTime) / 1000);
      let minutes = Math.floor(elapsedSeconds / 60);
      let seconds = elapsedSeconds % 60;

      let formattedMinutes = ("0" + minutes).slice(-2);
      let formattedSeconds = ("0" + seconds).slice(-2);

      let formattedTime = `${formattedMinutes}:${formattedSeconds}`;
      this.timerText.setText(formattedTime);

      if (score === 10) {
        if (elapsedSeconds < this.bestTime) {
          this.bestTime = elapsedSeconds;
          this.bestTimerText.setText(`Melhor Tempo: ${formattedTime}`);
        }
        this.isRunning = false;
        this.startGame(); // Reinicia o jogo
      }
    }
  }
}

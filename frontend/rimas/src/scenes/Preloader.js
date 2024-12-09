import Phaser from "phaser";

export let selectedVoice;

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }
  preload() {
    this.load.audio("comparando", "./assets/rima-com.mp3");
    // Carregar a voz e armazená-la em uma variável global
    let voices = [];
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices();
      selectedVoice = voices.find(
        (voice) =>
          voice.name ===
          "Microsoft Francisca Online (Natural) - Portuguese (Brazil)"
      );
    };
  }
  create() {
    this.scene.start("game");
  }
}

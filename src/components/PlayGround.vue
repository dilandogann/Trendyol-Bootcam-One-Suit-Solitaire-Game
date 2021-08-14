<template>
  <div>Play Ground</div>
</template>

<script>
import _ from "lodash";
import CardArray from "../CardArray";
import Card from "../Card";

export default {
  name: "PlayGround",
  data() {
    return {
      id: 1,
      cards: [],
      playingCards:[],
      floorCards: [],
    };
  },
  created() {
    this.initializeGame();
    this.shuffleCards();
  },
  methods: {
    initializeGame() {
      this.initializeCards();
    },
    // It creates 8 copy of each playing cards
    initializeCards() {
      for (let i = 0; i < 8; i++) {
        this.createPlayingCard();
      }
    },
    // It creates 13 playing cards
    createPlayingCard() {
      const cards = CardArray.map((cardItem) => {
        return new Card(
          this.id++,
          cardItem.value,
          cardItem.nextValue,
          cardItem.image
        );
      });
      this.cards.push(...cards);
    },
    // It randomly shuffles the cards array
    shuffleCards() {
      const shuffledCards = _.shuffle(this.cards);
      this.cards = shuffledCards;
    },
    // It randomly picks 54 cards for playing cards
    getRandomPlayGroundCards() {
      // Lower and upper bounds
      let lower = 0;
      let upper = 103;

      let randomIndexes = [];

      // Calculating 54 random values in range 0 and 103
      while (this.playingCards.length !== 54) {
        let randomNum = _.random(lower, upper);
        if (randomIndexes.includes(randomNum)) continue;
        this.playingCards.push(this.cards[randomNum]);
        randomIndexes.push(randomNum);
      }
    },
    //Get remaining cards for floorCards
    getRemainingFloorCards() {
      this.floorCards = this.cards.filter((card) => {
        let filtered = this.playingCards.filter(
          (playCard) => playCard.id === card.id
        );
        if (filtered.length === 0) return card;
      });
    },
  },
};
</script>
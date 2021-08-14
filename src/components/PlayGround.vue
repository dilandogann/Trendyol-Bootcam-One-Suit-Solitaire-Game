<template>
  <div>Play Ground</div>
</template>

<script>
import CardArray from "../CardArray";
import Card from "../Card";

export default {
  name: "PlayGround",
    data() {
    return {
      id: 1,
      cards: [],
    };
  },
  created() {
    this.initializeGame();
  },
  methods: {
    initializeGame() {
      this.initializeCards();
    },
    //It creates 8 copy of each playing cards
    initializeCards() {
      for (let i = 0; i < 8; i++) {
        this.createPlayingCard();
      }
    },
    //It creates 13 playing cards
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
  },
};
</script>
<template>
  <v-container style="margin-top: 100px">
    <v-row>
      <v-col cols="1"></v-col>
      <v-col
        v-for="(playingCardSuit, suitIndex) in playingCards"
        :key="suitIndex"
      >
        <v-row v-for="playingCard in playingCardSuit" :key="playingCard.id">
          <playing-card
            :card="playingCard"
            animation="200"
          />
        </v-row>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>
    <div
      class="floorCards cursor"
      v-for="card in floorCards"
      :key="card.id"
      @click="dealFloorCards"
    >
      <playing-card :card="card"> </playing-card>
    </div>
  </v-container>
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
      playingCards: [],
      floorCards: [],
    };
  },
  created() {
    this.initializeGame();
    this.shuffleCards();
    this.getRandomPlayGroundCards();
    this.getRemainingFloorCards();
    this.chunkPlayingCards();
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
  //Creating 6-6-6-6-5-5-5-5-5-5 chunks of playingCards array
  chunkPlayingCards() {
    const overflowingItems = this.playingCards.slice(-4);
    this.playingCards = this.playingCards.slice(
      0,
      this.playingCards.length - 4
    );
    this.playingCards = _.chunk(this.playingCards, 5);
    for (let i = 0; i < overflowingItems.length; i++) {
      this.playingCards[i].push(overflowingItems[i]);
    }
  },
  //It changes last card's of chunks showFront property in order to showing front side
  showFrontSideOfLastCardsInChunks() {
    for (let i = 0; i < this.playingCards.length; i++) {
      const length = this.playingCards[i].length;
      this.playingCards[i][length - 1].showFront = true;
    }
  },
};
</script>
<template>
  <v-container class="main-container">
    <v-row class="main-row">
      <v-col
        v-for="(playingCardChunk, chunkIndex) in playingCards"
        :key="chunkIndex"
      >
        <template v-if="playingCardChunk.length === 0">
          <v-card> </v-card>
        </template>
        <template v-else>
          <v-row
            v-for="(playingCard, cardIndex) in playingCardChunk"
            :key="playingCard.id"
          >
            <playing-card
              :card="playingCard"
              class="playingCard"
              @click.native="handleMove(chunkIndex, cardIndex)"
            />
          </v-row>
        </template>
      </v-col>
    </v-row>
    <div
      class="floorCards cursor"
      v-for="card in floorCards"
      :key="card.id"
      @click="dealFloorCards"
    >
      <playing-card :card="card"> </playing-card>
    </div>
    <div data-app>
      <custom-alert-component :error="error" />
    </div>
  </v-container>
</template>

<script>
import _ from "lodash";
import CardArray from "../CardArray";
import Card from "../Card";
import PlayingCard from "../components/PlayingCard.vue";
import CustomAlertComponent from "../components/CustomAlertComponent.vue";

export default {
  name: "PlayGround",
  components: { PlayingCard, CustomAlertComponent },
  data() {
    return {
      id: 1,
      movedIndex: null,
      correctMove: true,
      error: {
        show: false,
        message: "",
      },
      cards: [],
      playingCards: [],
      floorCards: [],
      selectedCards: [],
    };
  },
  created() {
    this.initializeGame();
    this.shuffleCards();
    this.getRandomPlayGroundCards();
    this.getRemainingFloorCards();
    this.chunkPlayingCards();
    this.showFrontSideOfLastCardsInChunks();
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
    //When user clicks deal one card to each shuffle
    dealFloorCards() {
      this.selectedCards = [];
      for (let i = 0; i < 10; i++) {
        const card = this.floorCards.shift();
        card.showFront = true;
        this.playingCards[i].push(card);
      }
    },
    handleMove(chunkIndex, cardIndex) {
      if (this.selectedCards.length === 0) {
        if (!this.playingCards[chunkIndex][cardIndex].showFront) {
          this.error.message = "You can not move this item";
          this.error.show = true;
        } else {
          this.movedIndex = chunkIndex;
          const chunkLenght = this.playingCards[chunkIndex].length;
          console.log("chunk lenght : ", chunkLenght);
          if (cardIndex === chunkLenght - 1) {
            this.selectedCards.push(this.playingCards[chunkIndex][cardIndex]);
            console.log("Selected last item : ", this.selectedCards);
          } else {
            console.log("multiple");
            for (let i = cardIndex; i < chunkLenght - 1; i++) {
              console.log("i : ", i);
              if (
                this.playingCards[chunkIndex][i].nextValue !==
                this.playingCards[chunkIndex][i + 1].value
              ) {
                console.log(
                  this.playingCards[chunkIndex][i].nextValue,
                  " !== ",
                  this.playingCards[chunkIndex][i + 1].value
                );
                this.movedIndex = null;
                this.selectedCards = [];
                this.error.message = "You can not move this item";
                this.error.show = true;
                this.correctMove = false;
              } else {
                this.movedIndex = chunkIndex;
                this.selectedCards.push(this.playingCards[chunkIndex][i]);
                console.log("Selected cards : ", this.selectedCards);
              }
            }
            if (this.correctMove) {
              this.selectedCards.push(
                this.playingCards[chunkIndex][chunkLenght - 1]
              );
              console.log("Selected cards : ", this.selectedCards);
            }
          }
        }
      } else {
        if (!this.playingCards[chunkIndex][cardIndex].showFront) {
          this.selectedCards = [];
          this.error.message = "You can not move this item";
          this.error.show = true;
        } else if (
          this.playingCards[chunkIndex][cardIndex].nextValue !==
          this.selectedCards[0].value
        ) {
          this.selectedCards = [];
          this.error.message = "You can not move this item";
          this.error.show = true;
        } else {
          for (let i = 0; i < this.selectedCards.length; i++) {
            this.playingCards[this.movedIndex].forEach((card, index) => {
              if (card.id === this.selectedCards[i].id) {
                this.playingCards[this.movedIndex].splice(index, 1);
                this.playingCards[chunkIndex].push(this.selectedCards[i]);
              }
            });
          }
          const movedIndexLength = this.playingCards[this.movedIndex].length;
          this.playingCards[this.movedIndex][
            movedIndexLength - 1
          ].showFront = true;
          this.selectedCards = [];
          this.checkIfThereIsCompletedSuits();
        }
      }
    },
    checkIfThereIsCompletedSuits() {
      let counter = 0;
      for (let i = 0; i < this.playingCards.length; i++) {
        for (let k = 0; k < this.playingCards[i].length; k++) {
          if (this.playingCards[i][k].value === "A") {
            let index = k;
            while (index !== this.playingCards[i].length - 1) {
              if (
                this.playingCards[i][index].nextValue ===
                this.playingCards[i][index + 1].value
              ) {
                counter++;
                index++;
              } else {
                counter = 0;
                break;
              }
            }
            if (counter === 12 && index === this.playingCards[i].length - 1) {
              this.playingCards[i].splice(k, 13);
              const length=this.playingCards[i].length
              this.playingCards[i][length - 1].showFront = true;
            } else {
              counter = 0;
            }
          }
        }
      }
    },
  },
};
</script>
<style>
.main-container {
  margin-top: 100px;
}
.cursor {
  cursor: pointer;
}
.playingCard {
  margin-left: 8px !important;
  margin-bottom: -6.5vw;
}
.floorCards {
  position: absolute;
  right: 30px;
  bottom: 30px;
}
.main-row {
  flex-wrap: inherit;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
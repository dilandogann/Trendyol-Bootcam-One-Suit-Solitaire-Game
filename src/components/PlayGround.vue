<template>
  <v-container>
    <v-row>
      <v-col cols="5">
        <div
          class="floorCards cursor"
          v-for="card in floorCards"
          :key="card.id"
          @click="dealFloorCards"
        >
          <playing-card :card="card"> </playing-card>
        </div>
      </v-col>
      <v-col
        v-for="(isCollected, index) in collectedDecks"
        :key="index"
        style="flex-grow: 0"
      >
        <div class="placeholder">
          <playing-card :card="{ showFront: false }" />
        </div>
      </v-col>
    </v-row>
    <v-row class="main-row">
      <v-col
        v-for="(playingCardChunk, chunkIndex) in playingCards"
        :key="chunkIndex"
      >
        <draggable
          class="list-group"
          :list="playingCardChunk"
          v-bind="dragOptions"
          multi-drag
         selected-class="multi-drag"
          @start="onDragStart"
          :move="onMoveCallback"
          :sort="false"
          group="card"
          @change="checkChange"
        >
          <template v-if="playingCardChunk.length === 0">
            <div
              class="placeholder"
              @click="handleMove(chunkIndex, cardIndex)"
            ></div>
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
        </draggable>
      </v-col>
    </v-row>
    <div data-app>
      <custom-alert-component :error="error" />
    </div>
  </v-container>
</template>

<script>
import draggable from "vuedraggable";
import _ from "lodash";
import CardArray from "../CardArray";
import Card from "../Card";
import PlayingCard from "../components/PlayingCard.vue";
import CustomAlertComponent from "../components/CustomAlertComponent.vue";

export default {
  name: "PlayGround",
  components: { PlayingCard, CustomAlertComponent, draggable },
  data() {
    return {
      id: 1,
      movedIndex: null,
      error: {
        show: false,
        message: "",
      },
      cards: [],
      playingCards: [],
      floorCards: [],
      selectedCards: [],
      collectedDeckCount: 0,
      collectedDecks: [],
      dragOptions: {
        animation: 150,
        group: "description",
        ghostClass: "ghost",
        disabled: false,
      },
      isDragging: false,
    };
  },
  created() {
    this.collectedDecks = new Array(8).fill(false);
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
      this.checkIfThereIsCompletedSuits();
    },
    handleMove(chunkIndex, cardIndex) {
      if (this.selectedCards.length === 0) {
        //If card is close user cant move that card
        if (!this.playingCards[chunkIndex][cardIndex].showFront) {
          this.handleAlertModal("You can not move this item", true);
        } else {
          let correctMove = true;
          const chunkLenght = this.playingCards[chunkIndex].length;
          //There are multiple cards to move
          for (let i = cardIndex; i < chunkLenght; i++) {
            if (
              i === chunkLenght - 1 ||
              this.playingCards[chunkIndex][i].nextValue ===
                this.playingCards[chunkIndex][i + 1].value
            ) {
              this.selectedCards.push(this.playingCards[chunkIndex][i]);
            } else {
              this.selectedCards = [];
              correctMove = false;
              this.handleAlertModal("You can not move these items", true);
              break;
            }
          }
          if (correctMove) {
            //Set the index which chunk cards will be moving from
            this.movedIndex = chunkIndex;
          }
        }
      } else {
        //If the suit is empty or move items without no check
        if (this.playingCards[chunkIndex].length === 0) {
          this.putItemsToSelectedChunk(chunkIndex);
          //If the card which user clicked is close
        } else if (!this.playingCards[chunkIndex][cardIndex].showFront) {
          this.selectedCards = [];
          this.handleAlertModal("Selected card is not open", true);
          // if the next value of the last element of the chunk trying to be moved is not equal to the value of the first element of the selected cards
        } else if (
          this.playingCards[chunkIndex][
            this.playingCards[chunkIndex].length - 1
          ].nextValue !== this.selectedCards[0].value
        ) {
          this.selectedCards = [];
          this.handleAlertModal("Selected place is not avaliable", true);
          //Move items
        } else {
          this.putItemsToSelectedChunk(chunkIndex);
        }
      }
    },
    putItemsToSelectedChunk(chunkIndex) {
      for (let i = 0; i < this.selectedCards.length; i++) {
        this.playingCards[this.movedIndex].forEach((card, index) => {
          if (card.id === this.selectedCards[i].id) {
            this.playingCards[this.movedIndex].splice(index, 1);
            this.playingCards[chunkIndex].push(this.selectedCards[i]);
          }
        });
      }
      const movedIndexLength = this.playingCards[this.movedIndex].length;
      if (movedIndexLength)
        this.playingCards[this.movedIndex][
          movedIndexLength - 1
        ].showFront = true;
      this.selectedCards = [];
      this.checkIfThereIsCompletedSuits();
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
              const length = this.playingCards[i].length;
              //If its not an empty suit
              if (length > 0) {
                this.playingCards[i][length - 1].showFront = true;
              }
              this.collectedDecks[this.collectedDeckCount] = true;
              ++this.collectedDeckCount;
            } else {
              counter = 0;
            }
          }
        }
      }
    },
    handleAlertModal(message, show) {
      this.error.message = message;
      this.error.show = show;
    },
    onDragStart(e) {
      return false;
      this.isDragging = true;
      this.isDragging = false;
      // console.log("start");
      // this.isDragging = true;
      // e.item._selected_items = this.playingCards[this.movedIndex].filter((f) => this.selected[f.id]);
      // console.log(e.item._selected_items);
    },
     onMoveCallback(evt, originalEvent){
       console.log(evt)
    return true
   },
    checkChange(){
      console.log("aaa")
    }
  },
};
</script>
<style>
.playing-cards-container {
  margin-top: 50px;
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
}
.main-row {
  flex-wrap: inherit;
  padding-left: 5px;
  padding-right: 5px;
  margin-top: 50px !important;
}
.placeholder {
  width: 104px;
  height: 143px;
  background: transparent;
  border: 2px solid rgb(0 0 0 / 87%);
  border-radius: 8px;
}
</style>
<template>
  <div>
    <template v-if="card.showFront">
      <v-row>
        <v-col cols="cols">
          <img class="card-image" :src="card.image" />
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-row>
        <v-col cols="cols">
          <img class="card-image" src="./../assets/hearts-back.svg" />
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
export default {
  name: "PlayingCard",
  props: ["card"],
  data() {
    return {
      cols: 12,
    };
  },
};
</script>

<style>
.card-image {
  border-radius: 8px;
}
</style>
<template>
  <div class="green-table">
    <play-ground />
  </div>
</template>

<script>
import PlayGround from "../components/PlayGround.vue";
export default {
  name: "GameFloor",
  components: { PlayGround },
};
</script>

<style>
.green-table {
  display: flex;
  justify-content: space-evenly;
  height: 100vh;
  width: 100vw;
  border-width: initial;
  border-style: none;
  border-color: initial;
  border-image: initial;
  padding: 0px;
  background-image: radial-gradient(
    rgba(57, 172, 57, 0.725),
    rgb(0, 116, 0),
    rgb(0, 100, 0)
  );
}
</style>
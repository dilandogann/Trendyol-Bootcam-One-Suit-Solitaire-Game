<template>
  <div class="text-center">
    <v-dialog v-model="error.show" width="500">
      <v-alert type="error" class="error" dense>
        {{ error.message }}
      </v-alert>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: "CustomAlertComponent",
  props: {
    error: {
      type: Object,
      default() {
        return { show: false, message: "" };
      },
    },
  },
};
</script>
<style scoped>
.error{margin-bottom: 0;}
</style>

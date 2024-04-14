<script setup lang="ts">
import { ref } from "vue";
import Calculator from "./components/Calculator.vue";
import Graph from "./components/Graph.vue";
import LevelSelect from "./components/LevelSelect.vue";
import { Level } from "./calculator/levels";

const currentLevel = ref<Level>();
const graphID = ref("");

function onLevelSelect(level: Level) {
    currentLevel.value = level;
    graphID.value = JSON.stringify(currentLevel.value);
}
</script>

<template>
    <LevelSelect @level-select="onLevelSelect" />
    <Calculator />
    <Graph :key="`graphLevel${graphID}`" :selected-level="currentLevel" />
</template>

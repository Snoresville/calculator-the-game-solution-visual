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
    <div class="app-layout">
        <div class="top-bar">
            <LevelSelect @level-select="onLevelSelect" />
        </div>
        <Calculator />
        <Graph :key="`graphLevel${graphID}`" :selected-level="currentLevel" />
    </div>
</template>

<style>
.top-bar {
    height: 75px;
}

.app-layout {
    display: grid;
    grid-template-areas:
        "topbar topbar"
        "calculator help"
        "solutionGraph solutionGraph";
}
</style>
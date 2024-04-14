<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { LEVELS, Level } from "../calculator/levels";

type LocalStoredData = {
    levelIndex: number;
    levelPack: keyof typeof LEVELS;
};

const emit = defineEmits<{
    levelSelect: [level: Level];
}>();

const calculatorSolutionLevelStorageKey = "CALCULATOR_SOLUTION_LEVEL";
const storedData = localStorage.getItem(calculatorSolutionLevelStorageKey);
const translatedData: LocalStoredData = storedData
    ? JSON.parse(storedData)
    : {
          levelIndex: 1,
          levelPack: "simple_machine",
      };

const levelPack = ref(translatedData.levelPack);
const levelIndex = ref(translatedData.levelIndex);

function saveCurrentLevelToLocalStorage(data: LocalStoredData) {
    localStorage.setItem(
        calculatorSolutionLevelStorageKey,
        JSON.stringify(data)
    );
}

function watchLevelIndexChange() {
    if (!Number.isSafeInteger(levelIndex.value)) {
        return;
    }

    if (
        levelIndex.value < 0 ||
        levelIndex.value > LEVELS[levelPack.value].length + 1
    ) {
        return;
    }
    if (levelIndex.value == 0) {
        levelIndex.value = LEVELS[levelPack.value].length;
    }
    if (levelIndex.value > LEVELS[levelPack.value].length) {
        levelIndex.value = 1;
    }
    saveCurrentLevelToLocalStorage({
        levelIndex: levelIndex.value,
        levelPack: levelPack.value,
    });
    emit("levelSelect", LEVELS[levelPack.value][levelIndex.value - 1]);
}

function watchLevelPackChange() {
    levelIndex.value = 1;
    emit("levelSelect", LEVELS[levelPack.value][levelIndex.value - 1]);
    focus();
}

function keyInput(event: KeyboardEvent) {
    switch (event.key) {
        case "a":
        case "A":
        case "ArrowLeft":
            levelIndex.value -= 1;
            break;
        case "d":
        case "D":
        case "ArrowRight":
            levelIndex.value += 1;
            break;
    }
}

watch(levelIndex, watchLevelIndexChange);
watch(levelPack, watchLevelPackChange);
onMounted(() => {
    emit("levelSelect", LEVELS[levelPack.value][levelIndex.value - 1]);
    document.addEventListener("keydown", keyInput);
});

onUnmounted(() => {
    document.removeEventListener("keydown", keyInput);
});
</script>

<template>
    <h3 class="levelSelect">
        Level
        <input
            class="levelIndex"
            type="number"
            @keydown.stop=""
            v-model="levelIndex"
            placeholder="Insert Level"
        />

        Pack
        <select v-model="levelPack" aria-label="level pack">
            <option v-for="pack in Object.keys(LEVELS)">
                {{ pack }}
            </option>
        </select>
    </h3>
</template>

<style scoped>
.levelSelect {
    position: absolute;
    color: black;
    left: 50%;
    transform: translate(-50%, -50%);
}

.levelIndex {
    width: 50px;
}
</style>

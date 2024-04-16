<script setup lang="ts">

</script>

<template>
    <div class="calculator-main">
        <div>

        </div>
        <div class="calculator-help">
            Press (A/D) or Arrow Keys to cycle between level solutions
        </div>
    </div>
</template>

<style scoped>
.calculator-main {
    display: flex;
    flex-direction: row;

    height: calc(50vh - 75px);
    width: 100vw;
}

.calculator-main div {
    width: 50vw;
    height: 100%;
}

.calculator-help {
    color: black;
    border: 1px solid black;
}
</style>
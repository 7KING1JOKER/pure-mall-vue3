<template>
    <div class="title">
        <h1>欢迎来到pure mall</h1>
        <p>这是一个基于 Vue 3 的商城应用</p>
    </div>
</template>

<script lang="ts" setup>
defineOptions({
    name: 'Home'
});
</script>

<style scoped>
    .title {
        background-color: skyblue;
        text-align: center;
        margin-top: 50px;
    }
</style>
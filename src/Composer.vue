<template>
    <table id="music-table">
    </table>
</template>

<script>
export default {
    data() {
        return {
        };
    },
    methods: {
    },
    created() {
    }
};
</script>

<style scoped>
table {
    margin: 1em auto;
}
.note-cell {
    height: 1em;
    width: 1em;
    border: 1px solid;
    text-align: center;
    vertical-align: top;
    position: relative;
    cursor: pointer;
}
.note-cell:first-child {
    border-left: solid;
}
.note-cell:nth-child(4n) {
    border-right: solid;
}
.note-cell:hover {
    background-color: rgba(0, 0, 0, 0.15);
}
</style>
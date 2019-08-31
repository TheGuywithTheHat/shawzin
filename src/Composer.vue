<template>
    <div class="content">
        <table id="header-table">
            <tr class="row note-row" v-for="(row, y) in cells" :key="row[0].y + 'row'">
                <td class="cell header-cell">
                    {{notes[y]}}
                </td>
            </tr>
        </table>
        <div id="music-container">
            <table id="music-table">
                <tr class="row note-row" v-for="(row, y) in cells" :key="row[0].y + 'row'">
                    <td class="cell note-cell" v-for="(cell, x) in row" :key="cell.y + cell.x * 100 + 'cell'"></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cells: [],
            notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G'],
        };
    },
    methods: {
    },
    created() {
        for(let i = 0; i < 12; i++) {
            this.cells.push(new Array(16).fill(false))
        }
    }
};
</script>

<style scoped>
#header-table {
    margin: 1em;
    float: left;
}
#music-table {
}
#music-container {
    margin: 1em;
    overflow-x: auto;
}
.note-cell {
    min-width: 20px;
    border: 1px solid rgb(168, 168, 168);
    vertical-align: top;
    position: relative;
    cursor: pointer;
}
.note-cell:first-child {
    border-left: 2px solid;
}
.note-cell:nth-child(4n) {
    border-right: 2px solid;
}
.note-cell:hover {
    background-color: rgba(255, 255, 255, 0.15);
}
.row {
    height: 30px;
}
.note-row-sharp {
    height: 20px;
}
</style>
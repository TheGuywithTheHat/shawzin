<template>
    <div class="content">
        <table id="header-table">
            <tr class="row" v-for="(row, y) in cells" :key="y + 'row'">
                <td class="cell header-cell">
                    {{notes[y]}}
                </td>
            </tr>
        </table>
        <div id="music-container">
            <table id="music-table">
                <tr class="row note-row" v-for="(row, y) in cells" :key="y + 'row'">
                    <td class="cell note-cell"
                        :class="{ 'note-on': cells[y][x] }"
                        v-for="(cell, x) in row"
                        :key="y + x * 100 + 'cell'"
                        @click="click(x, y)"></td>
                </tr>
            </table>
        </div>
        <input class="pure-button pure-button-primary" type="button" value="Copy to clipboard" @click="copy()">
    </div>
</template>

<script>
export default {
    data() {
        return {
            cells: [],
            notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G'].reverse(),
        };
    },
    methods: {
        copy() {
            navigator.clipboard.writeText(this.getEncoding());
        },
        getEncoding() {
            let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            let noteToChar = 'BCEJKMRSUhik';
            let encoding = '5';
            for(let x = 0; x < this.cells[0].length; x++) {
                for(let y = 0; y < this.cells.length; y++) {
                    if(this.cells[y][x]) {
                        encoding += noteToChar.charAt(this.cells.length - 1 - y);
                        encoding += alphabet.charAt(Math.floor(x / 64));
                        encoding += alphabet.charAt(Math.floor(x % 64));
                    }
                }
            }
            return encoding;
        },
        click(x, y) {
            this.$set(this.cells[y], x, !this.cells[y][x]);
        },
    },
    created() {
        let initialSize = 32;
        for(let y = 0; y < 12; y++) {
            this.$set(this.cells, y, []);
            for(let x = 0; x < initialSize; x++) {
                this.$set(this.cells[y], x, false);
            }
        }
    }
};
</script>

<style scoped>
#header-table {
    margin: 1em 0.5em 1em 0;
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
    border: 0px solid rgb(128, 128, 128);
    vertical-align: top;
    position: relative;
    cursor: pointer;
}

.content {
    padding: 1em;
}

.note-cell:first-child {
    border-left: 3px solid rgb(211, 211, 211);
}
.note-cell:nth-child(4n) {
    border-right-width: 1px;
}
.note-cell:nth-child(16n) {
    border-right: 3px solid rgb(211, 211, 211);
}
.note-cell:hover {
    background-color: rgba(255, 255, 255, 0.15);
}
.row {
    height: 30px;
}
.note-row {
    border: 1px solid rgb(128, 128, 128);
}
.note-row:hover {
    background-color: rgba(255, 255, 255, 0.1);
}
.note-row-sharp {
    height: 20px;
}
.note-on {
    background-color: white;
}
.note-on:hover {
    background-color: rgb(184, 184, 184);
}
</style>
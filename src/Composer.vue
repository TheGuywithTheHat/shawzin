<template>
    <div id="content">
        <h1>Compozin'</h1>
        <p>
            Current in alpha! Only limited functionality at the moment. If you put multiple notes
            in a column or put in over 100 notes, don't expect the song to play as you composed it.
        </p>
        <p>
            Each measure has 4 beats, each beat can be split into quarters. A measure is 1
            second long.
        </p>
        <form class="pure-form">
            <fieldset>
                <select v-model="selectedScale" @change="setScale">
                    <option v-for="(s, i) in scales" :key="s.id" :value="i">{{s.name}}</option>
                </select>
                <label for="16ths">16ths/beat</label>
                <input type="number" id="16ths" v-model="sixteenths" min="1" max="16">
                <label for="beats">beats/measure</label>
                <input type="number" id="beats" v-model="beats" min="1" max="16">
            </fieldset>
        </form>
        <div id="music-container">
            <table id="header-table">
                <tr class="row" v-for="(note, y) in notes" :key="y + 'row'">
                    <td class="cell header-cell">
                        {{note}}
                    </td>
                </tr>
            </table>
            <div id="music-scroll">
                <table id="music-table">
                    <tr class="row note-row" v-for="(row, y) in cells" :key="y + 'row'">
                        <td class="cell note-cell"
                            :class="{
                                'note-on': cells[y][x],
                                'beat-end': (x + 1) % sixteenths == 0,
                                'measure-end': (x + 1) % (sixteenths * beats) == 0,
                            }"
                            v-for="(cell, x) in row"
                            :key="y + x * 100 + 'cell'"
                            @click="click(x, y)"></td>
                    </tr>
                </table>
            </div>
        </div>
        <form class="pure-form">
            <fieldset>
                <input class="pure-button" type="button" value="Import song" @click="importSong()">
                <input class="pure-button pure-button-primary" type="button" value="Copy to clipboard" @click="copy()">
                <input type="text" id="encoding" v-model="encoding" readonly>
            </fieldset>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
            noteToChar: 'BCEJKMRSUhik',
            sixteenths: 4,
            beats: 4,
            cells: [],
            notes: [],
            scale: null,
            selectedScale: 4,
            scales: [
                {
                    name: 'Pentatonic Minor',
                    id: 1,
                    notes: 'CD#FGA#CD#FGA#CD',
                },
                {
                    name: 'Pentatonic Major',
                    id: 2,
                    notes: 'CDEGACDEGACD',
                },
                {
                    name: 'Chromatic',
                    id: 3,
                    notes: 'CC#DD#EFF#GG#AA#B',
                },
                {
                    name: 'Hexatonic',
                    id: 4,
                    notes: 'CD#FF#GA#CD#FF#GA',
                },
                {
                    name: 'Major',
                    id: 5,
                    notes: 'CDEFGABCDEFG',
                },
                {
                    name: 'Minor',
                    id: 6,
                    notes: 'CDD#FGG#A#CDD#FG',
                },
                {
                    name: 'Hirajoshi',
                    id: 7,
                    notes: 'CC#FF#A#CC#FF#ACC#',
                },
                {
                    name: 'Phrygian',
                    id: 8,
                    notes: 'CC#EFGG#A#CC#EFG',
                },
            ],
        };
    },
    computed: {
        encoding() {
            let encoding = '' + this.scale.id;
            for(let x = 0; x < this.cells[0].length; x++) {
                for(let y = 0; y < this.cells.length; y++) {
                    if(this.cells[y][x]) {
                        encoding += this.noteToChar.charAt(this.cells.length - 1 - y);
                        encoding += this.alphabet.charAt(Math.floor(x / 64));
                        encoding += this.alphabet.charAt(Math.floor(x % 64));
                    }
                }
            }
            return encoding;
        }
    },
    methods: {
        copy() {
            if(navigator.clipboard) {
                navigator.clipboard.writeText(this.getEncoding()); // doesn't work in edge/IE
            } else {
                document.getElementById('encoding').select();
                document.execCommand('copy');
            }
        },
        getEncoding() {
            return this.encoding;
        },
        importSong() {
            let encoding = prompt('Paste encoded song');
            if(encoding !== null) {
                this.decode(encoding);
            }
        },
        decode(str) {
            this.clear();
            let scale = parseInt(str.charAt(0));
            for(let i = 0; i < this.scales.length; i++) {
                if(this.scales[i].id == scale) {
                    this.selectedScale = i;
                    this.setScale();
                    break;
                }
            }
            for(let i = 0; i < (str.length - 1) / 3; i++) {
                let c1 = str.charAt(1 + i * 3);
                let c2 = str.charAt(2 + i * 3);
                let c3 = str.charAt(3 + i * 3);
                let y = this.cells.length - 1 - this.noteToChar.indexOf(c1);
                let x = this.alphabet.indexOf(c2) * 64 + this.alphabet.indexOf(c3);
                this.click(x, y);
            }
        },
        click(x, y) {
            if(x >= this.cells[0].length - 16) {
                let originalLength = this.cells[0].length;
                for(let y = 0; y < this.cells.length; y++) {
                    for(let x = originalLength; x < originalLength + 16; x++) {
                        this.cells[y].push(false)
                    }
                }
            }
            this.$set(this.cells[y], x, !this.cells[y][x]);
        },
        setScale() {
            this.scale = this.scales[this.selectedScale];
            this.notes = this.scale.notes.split(/(?<=.)(?=\w)/).reverse();
        },
        clear() {
            let initialSize = 32;
            for(let y = 0; y < 12; y++) {
                this.$set(this.cells, y, []);
                for(let x = 0; x < initialSize; x++) {
                    this.$set(this.cells[y], x, false);
                }
            } 
        }
    },
    created() {
        this.clear();
        this.setScale();
    }
};
</script>
5
<style scoped>
#header-table {
    margin-right: 0.2em;
    min-width: 1.5em;
    float: left;
}
#music-container {
    margin: 1em 0;
}
#music-scroll {
    overflow-x: auto;
}

.note-cell {
    min-width: 20px;
    border: 0px solid rgb(128, 128, 128);
    vertical-align: top;
    position: relative;
    cursor: pointer;
}

.note-cell:first-child {
    border-left: 3px solid rgb(211, 211, 211);
}
.note-cell.beat-end {
    border-right-width: 1px;
}
.note-cell.measure-end {
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
.pure-form label {
    margin-left: 1em;
}
</style>
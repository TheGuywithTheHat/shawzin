<template>
    <div>
        <h1>Compozin'</h1>
        <form class="min-form">
            <select id="scale" v-model="selectedScale" @change="setScale">
                <option v-for="(s, i) in scales" :key="s.id" :value="i">{{s.name}}</option>
            </select>
            <label for="scale">scale</label>
            <input type="number" id="16ths" v-model="sixteenths" v-on="{ change: timingChanged, keyup: timingChanged }" min="1" max="16">
            <label for="16ths">16ths of a second per beat</label>
            <input type="number" id="beats" v-model="beats" v-on="{ change: timingChanged, keyup: timingChanged }" min="1" max="16">
            <label for="beats">beats per measure</label>
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
                    <tr class="row note-row" v-for="y in notes.length" :key="(y-1) + 'row'">
                        <td :cell-id="(y-1) + ((x-1) << 4)"
                            class="cell note-cell" :class="{
                                'beat-end': x % sixteenths == 0,
                                'measure-end': x % (sixteenths * beats) == 0,
                            }"
                            v-for="x in size" :key="((y-1) + ((x-1) << 4)) + 'cell'"
                            @click="e => click(e)"></td>
                    </tr>
                </table>
            </div>
            <div id="right-filler"></div>
        </div>
        <form>
            <Button text="Import song" @click="importSong()"></Button>
            <Button text="Copy to clipboard" @click="copy()"></Button>
            <div class="skewed outlined-element">
                <input type="text" id="encoding" class="skewed-inner" readonly v-bind:value="songString">
            </div>
        </form>
        <p>
            Current in beta! Only limited functionality at the moment. If you put multiple notes
            in a column or put in over 100 notes, don't expect the song to play as you composed it.
        </p>
    </div>
</template>

<script>
import Vue from 'vue';
import Button from './Button.vue';
export default {
    components: {
        Button,
    },
    data() {
        return {
            alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', 
            noteToChar: 'BCEJKMRSUhik',
            sixteenths: 4,
            beats: 4,
            size: 32, // length of song in beats
            songString: '', // encoded song
            notes: [], // available notes that can be used, based on the scale in use
            scale: null,
            selectedScale: 4,
            scales: [
                {
                    name: 'Pentatonic Minor',
                    id: 1,
                    notes: 'CD#FGA#CD#FGA#CD#',
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
                    notes: 'CD#FF#GA#CD#FF#GA#',
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
                {
                    name: 'Yo',
                    id: 9,
                    notes: 'C#D#F#G#A#C#D#F#G#A#C#D#',
                },
            ],
        };
    },
    computed: { },
    methods: {
        timingChanged() {
            this.decode(this.songString);
        },
        encode() {
            let encoding = '' + this.scale.id;
            let musicTable = document.getElementById('music-table');
            for(let x = 0; x < musicTable.children[0].children.length; x++) {
                for(let y = 0; y < musicTable.children.length; y++) {
                    let cell = musicTable.children[y].children[x];
                    if(cell.classList.contains('note-on')) {
                        encoding += this.noteToChar.charAt(this.notes.length - 1 - y);
                        encoding += this.alphabet.charAt(Math.floor(x / 64));
                        encoding += this.alphabet.charAt(Math.floor(x % 64));
                    }
                }
            }
            this.songString = encoding;
        },
        copy() {
            if(navigator.clipboard) {
                navigator.clipboard.writeText(this.songString); // doesn't work in edge/IE
            } else {
                document.getElementById('encoding').select();
                document.execCommand('copy');
            }
        },
        importSong() {
            let encoding = prompt('Paste encoded song');
            if(encoding !== null) {
                this.decode(encoding);
            }
        },
        async decode(str) {
            this.clear();

            let scale = parseInt(str.charAt(0));
            for(let i = 0; i < this.scales.length; i++) {
                if(this.scales[i].id == scale) {
                    this.selectedScale = i;
                    this.setScale();
                    break;
                }
            }

            // Find out the length of the song
            if (str.length >= 4) {
                // Ceil to the closest multiple of beats * 16th (i.e. force render a whole bar)
                let length = this.alphabet.indexOf(str.charAt(str.length - 2)) * 64 + this.alphabet.indexOf(str.charAt(str.length - 1)) + 1;
                let r = length % (this.beats * this.sixteenths);
                this.size = r == 0 ? length : length + this.beats * this.sixteenths - r;
            }

            this.songString = str;

            await Vue.nextTick();
            for(let i = 0; i < (str.length - 1) / 3; i++) {
                let c1 = str.charAt(1 + i * 3);
                let c2 = str.charAt(2 + i * 3);
                let c3 = str.charAt(3 + i * 3);
                let y = this.notes.length - 1 - this.noteToChar.indexOf(c1);
                let x = this.alphabet.indexOf(c2) * 64 + this.alphabet.indexOf(c3);

                let cell = document.querySelector(`td[cell-id="${y + (x << 4)}"]`);
                if(!cell.classList.contains('note-on')) {
                    cell.classList.toggle('note-on');
                }
            }
        },
        click(e) {
            window.onbeforeunload = () => true;
            let cellId = e.target.getAttribute('cell-id');
            let x = cellId >> 4;
            let y = cellId & 15;
            if(x >= this.size - 16) {
                this.size += this.beats * this.sixteenths;  // Add a whole new bar
            }
            e.target.classList.toggle('note-on');
            this.encode();
        },
        async setScale() {
            this.scale = this.scales[this.selectedScale];
            this.notes = this.scale.notes.split(/(?=\w)/).reverse();
            await Vue.nextTick();
            this.encode();
        },
        clear() {
            let cells = document.querySelectorAll('.note-on');
            for(let i = 0; i < cells.length; i++) {
                cells[i].classList.toggle('note-on');
            }
            this.size = this.beats * this.sixteenths * 2;
            this.songString = '' + this.scale.id;
        }
    },
    async mounted() {
        await this.setScale();
        this.clear();
    }
};
</script>
5
<style scoped>
#header-table {
    margin-right: 0.2em;
    min-width: 1.5em;
}
#music-container {
    margin: 1em 0;
    display: flex;
}
#music-scroll {
    overflow-x: auto;
}
#right-filler {
    flex-grow: 1;
    border-top: 1px solid rgb(128, 128, 128);
    border-bottom: 1px solid rgb(128, 128, 128);
    box-shadow: inset 100px 0 100px -100px rgba(255, 255, 255, 0.2);
}

#encoding {
    border: none;
    padding: 0;
}
.outlined-element {
    border: 1px solid var(--color-accent);
    padding: 9px 19px;
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


.min-form input, .min-form select {
    border: none;
    text-align-last: right;
    font-size: 1.5em;
    color: var(--color-accent);
}
.min-form select {
    cursor: pointer;
}
option {
    background-color: var(--color-bg);
    color: var(--color-primary);
    font-size: initial;
    direction: rtl;
}
</style>
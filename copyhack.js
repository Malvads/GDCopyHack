const memoryjs = require("memoryjs")
const readline = require('readline')

const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})  

class MemoryEditor {
    constructor(){
        this.state = "OFF"
        this.pObject = null
        this.BYTES = {
            "allow_copy": [0x75, 0x52],
            "no_allow_copy":[0x74, 0x52]
        }
        process.stdout.write("\u001b[2J\u001b[0;0H")
        this.OpenProcess()
    }
    async OpenProcess(){
        this.pObject = await memoryjs.openProcess("GeometryDash.exe")
        this.toggle()
    }
    async toggle(){
        reader.question(`Current State [${this.state}] | Toogle Copy Hack (Press Enter) : `,function(answer){
            if(this.state == "OFF"){
                this.state = "ON"
                this.writeMemory(this.BYTES.allow_copy)
            } else {
                this.state = "OFF"
                this.writeMemory(this.BYTES.no_allow_copy)
            }
        }.bind(this))
    }
    writeMemory(bytes){
        memoryjs.writeMemory(this.pObject.handle, this.pObject.modBaseAddr + 0x179CB9, new Uint16Array(new Uint8Array(bytes).buffer)[0] ,memoryjs.SHORT)
        process.stdout.write("\u001b[2J\u001b[0;0H")
        this.toggle()
    }
}

new MemoryEditor()

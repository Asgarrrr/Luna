// ██████ Integrations █████████████████████████████████████████████████████████

// —— Terminal string styling done right
const chalk = require("chalk");

// ██████ Initialization ███████████████████████████████████████████████████████

class Debug {

    constructor() {

        this.enable = false;

    }

    async run(info) {

        console.log(this.time, info);

    }

    format(i) {
        return (i < 10) ? "0" + i : i;
    }

    get time() {

        const today = new Date()
            , h = this.format(today.getHours())
            , m = this.format(today.getMinutes())
            , s = this.format(today.getSeconds());

        return chalk.grey(`[ ${h}:${m}:${s} ]`);

    }

}

module.exports = Debug;
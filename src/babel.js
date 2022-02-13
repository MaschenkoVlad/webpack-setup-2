async function start() {
    return await Promise.resolve('promise')
}

start().then(console.log)

const unused = 42

class Util {
    static id = Date.now()
}

console.log(unused)

console.log(Util.id)

import('lodash').then( _ =>{
    console.log('lodash', _.random(0, 42, true))
})
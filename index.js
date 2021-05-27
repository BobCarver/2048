"use strict"
let theScore = 0,
theHighScore = localStorage.getItem('highScore')|0

hiScore.textContent = theHighScore
score.textContent = 0
const params = {
    left: ['left','top', false],
    right:['left','top', true],
    up:   ['top','left', false],
    down: ['top','left', true]
},
delay = n => new Promise(r=>setTimeout(r,n)),
testIt = r => {
    for ( const node of game.children ) {
        game.removeChild(node)
    }
    r.forEach(([value, top, left]) => {
    const newTile = document.createElement("div")
    newTile.style.top = top
    newTile.style.left =left
    newTile.dataset.value = value
    game.appendChild(newTile)})
},
addTile = () => {
    const avail = new Set([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])
    for( const {style:{top,left}} of game.children ) {
        const n = 4*top.slice(0,-1)/25 + left.slice(0,-1)/25
        avail.delete(n)
    }
    if(avail.size === 0 ) return false
    console.log(avail)
    const i = [...avail][Math.random()*avail.size|0]

    const newTile = document.createElement("div")
    newTile.style.top = `${25*(i/4|0)}%`
    newTile.style.left =`${i%4*25}%`
    newTile.dataset.value = Math.random()<.5?2:4
    game.appendChild(newTile)
    return true
},
doMove = async (direction) => {
    //console.log(direction, JSON.stringify([...game.children].map(t => [t.dataset.value, t.style.top, t.style.left])))
    let [dir, cross, reverse] = params[direction],
    foo = [[],[],[],[]]
    for( const s of game.children ) {
            foo[s.style[cross].slice(0,-1)/25].push(s)
    }
    // e, e.style,e.textContent
    foo.forEach((line, lineNum) => {
        line.sort( (a,b) => a.style[dir].localeCompare(b.style[dir])*(reverse?-1:1))

        let index = -1
        line.forEach((e,i,a) => {
            // increment index if adjacent values are different
            index += (e.dataset.value != a[i-1]?.dataset.value) || a[i-1].style[dir] == a[i-2]?.style[dir]
            const n = reverse ? 3-index : index
            e.style[dir]=`${25*n}%`
        })
    })
    await delay(500)
    foo.forEach( line => {
        line.forEach((p,i,a) => {
            const prev = a[i-1]
            if(p.dataset.value === prev?.dataset.value) {
                game.removeChild(p)
                p.dataset.value = 0 // for prev test
                prev.dataset.value <<= 1
                score.textContent = theScore += prev.dataset.value|0
                if ( theHighScore < theScore) {
                    hiScore.textContent = theHighScore = theScore
                    localStorage.setItem('highScore', theHighScore)
                }
            }
        })
    })
    return addTile()
}

// for( const e of document.querySelectorAll('#game div')){
//     e.dataset.value = 0
// }
const i = Math.random()*16|0,
j = (i+ Math.random()*15 ) % 16
const r = [["4","0%","75%"],["8","0%","50%"],["2","75%","75%"],["4","25%","75%"],["2","50%","75%"]]
// testIt(r)
// doMove('up')
addTile()
addTile()

function f(event) {
    const keyName = event.key;
    if( 0 == keyName.indexOf("Arrow")){
        doMove( keyName.slice(5).toLowerCase())

        //document.addEventListener('keydown', f, {once:true})
    }
}
document.addEventListener('keydown', f)

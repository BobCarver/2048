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
addTile = () => {
    // find available position for new tile
    const avail = new Set([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])
    for( const {style:{top,left}} of game.children )
        avail.delete(4*top.slice(0,-1)/25 + left.slice(0,-1)/25)
    if(avail.size === 0 ) return false
    // pick random location from avail
    const i = [...avail][Math.random()*avail.size|0]
    // create new tile positon accordingly
    const newTile = document.createElement("div")
    newTile.style.top = `${25*(i/4|0)}%`
    newTile.style.left =`${i%4*25}%`
    // random initial vale of 2 or 4
    newTile.dataset.value = Math.random()<.5?2:4
    game.appendChild(newTile) // add tile to game
    return true
},
doMove = async (direction) => {
    //console.log(direction, JSON.stringify([...game.children].map(t => [t.dataset.value, t.style.top, t.style.left])))
    const [dir, cross, reverse] = params[direction],
    foo = Object.values([...game.children].reduce((a,s)=>(a[s.style[cross]].push(s),a),{'0%':[],'25%':[],'50%':[],'75%':[]}))

    // e, e.style,e.textContent
    foo.forEach(line => {
        // order line by tile positions
        line.sort( (a,b) => (a.style[dir][0]-b.style[dir][0])*(reverse?-1:1))

        let index = -1
        // for each line assign new positions
        line.forEach((e,i,a) => {
            // increment index if adjacent values are different
            index += (e.dataset.value != a[i-1]?.dataset.value) || a[i-1].dataset.value == a[i-2]?.dataset.value
            e.style[dir]=`${25*(reverse ? 3-index : index)}%`
        })
    })
    await delay(500) // wait for animation to finish
    foo.forEach( line => {
        line.forEach((p,i,a) => {
            if(p.dataset.value === a[i-1]?.dataset.value) {
                game.removeChild(p)
                p.dataset.value = 0 // for a[i-1] test
                a[i-1].dataset.value <<= 1
                // adjust score and high score
                score.textContent = theScore += a[i-1].dataset.value|0
                if ( theHighScore < theScore) {
                    hiScore.textContent = theHighScore = theScore
                    localStorage.setItem('highScore', theHighScore)
                }
            }
        })
    })
    return addTile()
},
reset = () => {
    while(game.firstChild)
        game.remove(game.firstChild)

    addTile()
    addTile()
},

threshold = 150, //required min distance traveled to be considered swipe
restraint = 100, // maximum distance allowed at the same time in perpendicular direction
allowedTime = 300, // maximum time allowed to travel that distance
{ max, min, round, abs, PI, atan2} = Math

game.addEventListener('touchstart', startEvent => {
    startEvent.preventDefault();
    game.addEventListener('touchend', e =>{
        if( e.timestamp - startEvent.timestamp < allowedTime){
            const
            deltas = ['screenY','screenX'].map(v => e.targetTouches[0][v] - startEvent.targetTouches[0][v]),
            absDeltas = deltas.map(e => Math.abs(e)),
            dir = ['right','up','left', 'down'][round(atan2(...deltas)*2/PI)+1]

            if( min(...absDeltas) < restraint && max(...absDeltas) > threshold ){
                doMove(dir)
            }
        }
        e.preventDefault()
    },{once:true})
})

arrows.addEventListener('click', e=>doMove(e.target.id))

document.addEventListener('keydown', event => {
    if( 0 == event.key.indexOf("Arrow")){
        doMove( event.key.slice(5).toLowerCase())
    }
})



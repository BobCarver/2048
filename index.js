const params = {
    left: ['left','top', false],
    right:['left','top', true],
    up:   ['top','left', false],
    down: ['top','left', true]
},
delay = n => new Promise(r=>setTimeout(r,n)),

doMove = async (direction) => {
    const [dir, cross, reverse] = params[direction],
    avail = new Set([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])
    foo = [[],[],[],[]]
    for( const s of game.children ) {
        if(s.dataset.value > 0)
            foo[s.style[cross].slice(0,-1)/25].push(s)
    }
    // e, e.style,e.textContent
    foo.forEach((line, lineNum) => {
        console.log('pre', line.map(e=>e.dataset.value))

        line.sort( (a,b) => b.style[dir].localeCompare(b.style[dir]))

        let index = -1
        console.log('post', line.map(e=>e.dataset.value))
        line.forEach((e,i,a) => {
            // increment index if adjacent values are different
            index += (e.dataset.value != a[i-1]?.dataset.value) || a[i-1][dir] != a[i-2]?.[dir]
            const n = reverse ? 3-index : index
            console.log({index, n})
            avail.delete(lineNum*4+n)
            e.style[dir]=`${25*n}%`
        })
    })
    await delay(500)
    foo.forEach( line => {
        line.forEach((p,i,a) => {
            const prev = a[i-1]
            if(p.dataset.value === prev?.dataset.value) {
                p.dataset.value = 0
                prev.dataset.value = (prev.dataset.value|0)*2
                score.textContent = theScore += prev.dataset.value|0
                if ( theHighScore < theScore) {
                    hiScore.textContent = theHighScore = theScore
                    localStorage.setItem('highScore', theHighScore)
                }
            }
        })
    })
    // new piece
    const i = [...avail][Math.random()*avail.size|0]
    const n = game.querySelector('[data-value="0"]') // test for end
    n.style.top = `${25*(i/4|0)}%`
    n.style.left =`${i%4*25}%`
    n.dataset.value = Math.random()<.5?2:4
}

// for( const e of document.querySelectorAll('#game div')){
//     e.dataset.value = 0
// }
const i = Math.random()*16|0,
j = (i+ Math.random()*15 ) % 16
theScore = 0
theHighScore = localStorage.getItem('highScore')|0
document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if( 0 == keyName.indexOf("Arrow"))
        doMove(keyName.slice(5).toLowerCase())
})

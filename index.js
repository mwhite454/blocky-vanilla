const STATE = {
    gameBoard: {width: 480, height: 640},
    blocks: [],
    currentBlock: {},
    horizontalSplit: true,
    inProgress: true,
    splits: 0
}


const stage = new Konva.Stage({
  container: 'container',
  width: STATE.gameBoard.width,
  height: STATE.gameBoard.height
});

const layer = new Konva.Layer();

stage.on('mouseout', function(){
    STATE.mousePresent = false;
    clearHoveredBlocks();
    drawState();
    appendReadOut();
})

stage.on('mouseover', function(){
    STATE.mousePresent = true;
    appendReadOut();
})

stage.on('mousemove', function(){
    STATE.mouseLocation = stage.getPointerPosition();
    //findHoveredBlock(stage.getPointerPosition());
    appendReadOut()
})

stage.on('click', function(){
    let mouseLocation = stage.getPointerPosition()
    findHoveredBlock(mouseLocation)
    splitCurrentBlock();
    console.log(`click at ${JSON.stringify(mouseLocation, null, 2)}`)
})

if(STATE.inProgress) {
    newGame()
}


function newGame(){
    let block = {
        id: 0,
        x: 0,
        y:0,
        width: STATE.gameBoard.width,
        height: STATE.gameBoard.height,
        isHovered: false,
        color: '#555',
        counter: null
    }
    STATE.blocks.push(block);
    STATE.currentBlock = block;
    drawState()
}

function drawState (){
    //clearStage() //start clean with each paint
    STATE.blocks.forEach((block, index)=>{
        let rect = new Konva.Rect({
            id: index,
            x: block.x,
            y: block.y,
            width: block.width,
            height: block.height,
            fill: block.isHovered === true ? '#bada55' : block.color,
            stroke: '#222',
            strokeWidth: 1,
            cornerRadius: 5
        })
        layer.add(rect)
        if(block.counter !== null){
            let block_center = findCenter(block)
            let text = new Konva.Text({
                x: block_center.x,
                y: block_center.y,
                text: block.counter,
                fontSize: 10,
                fontFamily: 'Helvetica',
                fill: '#222'
            })
            layer.add(text)
        }
        stage.add(layer)
    })
    appendReadOut()
}

function findCenter (block){
    let center_x = ((block.width - block.x) / 2) + block.x
    let center_y = ((block.height - block.y) / 2) + block.y
    return {x: center_x, y: center_y}
}

function clearStage (){
    layer.clear()
}

function appendReadOut(){
    let readOut = document.getElementById('read-out')
    let state_as_text = JSON.stringify(STATE, null, 3)
    readOut.innerHTML = state_as_text
}

function clearHoveredBlocks(){
    let blocks = STATE.blocks.map(block =>{
        block.isHovered = false;
        return block;
    })
}

function findHoveredBlock(mouseCoordinates){
    let blocks = STATE.blocks.map((block, index) => {
        console.log(block)
        let x_min = block.x;
        let x_max = block.x + block.width;
        let y_min = block.y;
        let y_max = block.y + block.height;
        if (mouseCoordinates.x >= x_min && mouseCoordinates.x <= x_max && mouseCoordinates.y >= y_min && mouseCoordinates.y <= y_max){
            let isHovered = true;
            console.log(`Block id: ${block.id} is hovered: ${isHovered}`);
            console.log(`Current Mouse location: ${JSON.stringify(mouseCoordinates, null, 2)}`)
            block.isHovered = true;
        }
        return block
    })
    STATE.blocks = blocks;
}

function flipSplit(){
    STATE.horizontalSplit = !STATE.horizontalSplit;
    STATE.splits ++;
}

function splitCurrentBlock(){
    let blockToSplit = STATE.blocks.pop(STATE.currentBlock.id)
    //let center = findCenter(blockToSplit);
    let firstChild = Object.assign({}, blockToSplit)
    let secondChild = Object.assign({}, blockToSplit)
    if(STATE.horizontalSplit){
        firstChild.height = blockToSplit.height / 2
        secondChild.height = blockToSplit.height /2
        secondChild.y = blockToSplit.y + secondChild.height;
    } else {
        firstChild.width = blockToSplit.width / 2
        secondChild.width = blockToSplit.width / 2
        secondChild.x = blockToSplit.x + secondChild.width;
    }
    STATE.blocks.push(firstChild, secondChild)
    flipSplit();
    drawState()
}
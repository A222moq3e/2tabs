let dataBox = document.querySelector('.data');
let title = document.querySelector('.data h2');
let position = document.querySelector('.data .position');
let tab;
let opsiteTab;
let timeLoop =0;
// let windowPosition = [window.screenX+500,window.screenY+290]
if(localStorage.getItem('tab2')){
    title.innerHTML = 'You alredy open 2 tabs!, click restart Button'
    localStorage.removeItem('tab1');localStorage.removeItem('tab2');window.location.reload();
}else if(localStorage.getItem('tab1')){
    tab='tab2';
    opsiteTab ='tab1';
    localStorage.setItem(tab,getPostion())
    title.innerHTML = 'second tab'
}else{
    tab='tab1';
    opsiteTab ='tab2';
    localStorage.setItem(tab,getPostion())
    title.innerHTML = 'first tab'
}

setInterval(function(){ 
    localStorage.setItem(tab,getPostion())
    drawLine()
}, 100);

function getPostion(){
    return [window.screenX+200,window.screenY+290]
}

// Canvas
var canvas= document.getElementById("canvas");
canvas.style.width = window.screen.width
canvas.style.height = window.screen.height

var ctx= canvas.getContext("2d");
ctx.fillStyle='#5a5aff';


// window.addEventListener('storage',()=>{

//     ctx.clearRect(0,0, canvas.width, canvas.height)
//     let storageOpsitePosition= (localStorage.getItem(opsiteTab)).split(',')
//     console.log(storageOpsitePosition);
//     position.innerHTML = storageOpsitePosition
//     // Rect
//     ctx.fillRect(storageOpsitePosition[0],storageOpsitePosition[1],50,50);

//     // Start a new Path
//     ctx.beginPath();
//     ctx.strokeStyle = '#ff0000';
//     if(tab=='tab1') ctx.strokeStyle = '#ffffff';
//     // if(tab=='tab1') ctx.strokeStyle = '#ff5500';
//     if(tab=='tab2') ctx.strokeStyle = '#0055ff';
//     ctx.lineWidth = 5;
//     ctx.shadowColor = "#0055ff";
//     ctx.shadowBlur = 15;
//     ctx.shadowOffsetX = 0;
//     ctx.shadowOffsetY = 0;
//     ctx.moveTo(750, 390);
//     // ctx.moveTo(canvas.offsetHeight, canvas.offsetWidth);
//     ctx.lineTo(storageOpsitePosition[0], storageOpsitePosition[1]);
    
//     // ctx.moveTo(storageOpsitePosition[0], storageOpsitePosition[1]);
//     // ctx.lineTo(storageOpsitePosition[0]-20,storageOpsitePosition[1]);
 

//     // Draw the Path
//     ctx.stroke();
// })


function drawLine(){
    timeLoop+=.01
    ctx.clearRect(0,0, canvas.width, canvas.height)
    let storageOpsitePosition= (localStorage.getItem(opsiteTab)).split(',')
    storageOpsitePosition = [parseInt(storageOpsitePosition[0]), parseInt(storageOpsitePosition[1])]
    console.log(storageOpsitePosition);
    position.innerHTML = storageOpsitePosition
    // // Rect
    // ctx.fillStyle = "white";
    // ctx.fillRect(storageOpsitePosition[0]-25,storageOpsitePosition[1]-25,50,50);
    // Circle
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(storageOpsitePosition[0], storageOpsitePosition[1], 40, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Lots of circle Circle
    for(let i =0;i<10;i++){
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(storageOpsitePosition[0], storageOpsitePosition[1], 40 + (i * 80), (timeLoop+i) * Math.PI, (1.9+timeLoop+i) * Math.PI);
        ctx.stroke();
    }
 
    // Start a new Path
    ctx.beginPath();
    // ctx.strokeStyle = '#ff0000';
    if(tab=='tab1') ctx.strokeStyle = '#ffffff';
    // if(tab=='tab1') ctx.strokeStyle = '#ff5500';
    if(tab=='tab2') ctx.strokeStyle = '#0055ff';
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.shadowColor = "#0055ff";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.moveTo(750, 390);
    ctx.lineTo(storageOpsitePosition[0], storageOpsitePosition[1]);
    // Draw the Path
    ctx.stroke();
       // Text
    ctx.font = "bolder 70px serif";
    ctx.fillStyle = "black";
    let sopX = parseInt(storageOpsitePosition[0])-18;
    let sopY =  parseInt(storageOpsitePosition[1])+20;
    console.log('sopX',sopX);
    console.log('sopY',sopY);
    if(tab=='tab1') ctx.fillText("+", sopX,sopY);
    else ctx.fillText("-", sopX,sopY);
    // for (let i = 0; i < 6; i++) {
    //     for (let j = 0; j < 6; j++) {
    //       ctx.fillStyle = `rgb(${Math.floor(255 - 42.5 * i)}, ${Math.floor(
    //         255 - 42.5 * j,
    //       )}, 0)`;
    //       ctx.fillRect(j * 25, i * 25, 25, 25);
    //     }
    //   }
}
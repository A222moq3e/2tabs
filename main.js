let dataBox = document.querySelector('.data');
let title = document.querySelector('.data h2');
let position = document.querySelector('.data .position');
let tab;
let opsiteTab;
let windowPosition = [window.screenX+500,window.screenY+290]
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
}, 100);

function getPostion(){
    // return [window.innerHeight/2,window.innerWidth/2]
    return [window.screenX+500,window.screenY+290]
}

// Canvas
var canvas= document.getElementById("canvas");
var ctx= canvas.getContext("2d");


window.addEventListener('storage',()=>{
    let storageOpsitePosition= (localStorage.getItem(opsiteTab)).split(',')
    console.log(storageOpsitePosition);
    position.innerHTML = storageOpsitePosition
    
        // Start a new Path
    ctx.beginPath();
    ctx.strokeStyle = '#ff0000';
    if(tab=='tab1') ctx.strokeStyle = '#ff5500';
    if(tab=='tab2') ctx.strokeStyle = '#0055ff';
    ctx.moveTo(750, 390);
    // ctx.moveTo(canvas.offsetHeight, canvas.offsetWidth);
    ctx.lineTo(storageOpsitePosition[0], storageOpsitePosition[1]);

    // Draw the Path
    ctx.stroke();
})



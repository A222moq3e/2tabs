let dataBox = document.querySelector('.data');
let title = document.querySelector('.data h2');
let position = document.querySelector('.data .position');
let tab;
let opsiteTab;
// let windowPosition = [window.screenX+500,window.screenY+290]


// Canvas
var canvas= document.getElementById("canvas");
canvas.style.width = window.screen.width;
canvas.style.height = window.screen.height;
var ctx= canvas.getContext("2d");

if(localStorage.getItem('tab2')){
    title.innerHTML = 'You alredy open 2 tabs!, click restart Button'
    localStorage.removeItem('tab1');localStorage.removeItem('tab2');window.location.reload();
}else if(localStorage.getItem('tab1')){
    tab='tab2';
    opsiteTab ='tab1';
    localStorage.setItem(tab,getPostion())
    title.innerHTML = 'Cat2'
    // canvas.style.backgroundImage = "url('./catFight.jpg')"
    
}else{
    tab='tab1';
    opsiteTab ='tab2';
    localStorage.setItem(tab,getPostion())
    title.innerHTML = 'Cat1'
}

setInterval(function(){ 
    localStorage.setItem(tab,getPostion())
    let tab1Pos = parseInt(localStorage.getItem(tab));
    let opsiteTabPos = parseInt(localStorage.getItem(opsiteTab));
    console.log(opsiteTabPos-tab1Pos);
    if(Math.abs(opsiteTabPos-tab1Pos)<500){
        canvas.style.backgroundImage = "url('./catCry.jpeg')"
    }else{
        canvas.style.backgroundImage = "url('./catFight.jpg')"
        
    }
    if(opsiteTabPos>tab1Pos){
        canvas.classList.add('rotate');
    }else{
        canvas.classList.remove('rotate');
    }
    
}, 10);

function getPostion(){
    // console.log(window.screen.height);
    // console.log(window.screen.width);
    // return [(window.screen.height)/2,(window.screen.width)/2]

    return [window.screenX+500,window.screenY+290]
}



window.addEventListener('storage',()=>{
    let storageOpsitePosition= (localStorage.getItem(opsiteTab)).split(',')
    console.log(storageOpsitePosition);
    position.innerHTML = storageOpsitePosition
    
        // Start a new Path
    // ctx.beginPath();
    // ctx.strokeStyle = '#ff0000';
    // if(tab=='tab1') ctx.strokeStyle = '#ff5500';
    // if(tab=='tab2') ctx.strokeStyle = '#0055ff';
    // ctx.moveTo(750, 390);
    // // ctx.moveTo(canvas.offsetHeight, canvas.offsetWidth);
    // ctx.lineTo(storageOpsitePosition[0], storageOpsitePosition[1]);

    // // Draw the Path
    // ctx.stroke();
})



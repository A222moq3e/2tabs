let dataBox = document.querySelector('.data');
let title = document.querySelector('.data h2');
let position = document.querySelector('.data .position');
let tab;
let opsite_tab;
if(localStorage.getItem('tab2')){
    title.innerHTML = 'You alredy open 2 tabs!, click restart Button'
}else if(localStorage.getItem('tab1')){
    tab='tab2';
    opsite_tab ='tab1';
    localStorage.setItem(tab,[window.screenX,window.screenY])
    title.innerHTML = 'second tab'
}else{
    tab='tab1';
    opsite_tab ='tab2';
    localStorage.setItem(tab,[window.screenX,window.screenY])
    title.innerHTML = 'first tab'
}

setInterval(function(){ 
    localStorage.setItem(tab,[window.screenX,window.screenY])
}, 100);


// Canvas
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");


window.addEventListener('storage',()=>{
    let storageOpsitePosition= (localStorage.getItem(opsite_tab)).split(',')
    console.log(storageOpsitePosition);
    position.innerHTML = storageOpsitePosition
    
        // Start a new Path
    ctx.beginPath();
    ctx.strokeStyle = '#ff0000';
    ctx.moveTo(150, 150);
    // ctx.moveTo(canvas.offsetHeight, canvas.offsetWidth);
    ctx.lineTo(storageOpsitePosition[0], storageOpsitePosition[1]);

    // Draw the Path
    ctx.stroke();
})



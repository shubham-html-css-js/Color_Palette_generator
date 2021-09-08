const colorDiv=document.querySelectorAll(".color");
const sliders=document.querySelectorAll('input[type="range"]')
const textHex=document.querySelectorAll('h2');
const popup=document.querySelector('.copy-container')
const adjustBtn=document.querySelectorAll('.adjust');
const lockbtn=document.querySelectorAll('.lock');
const closeAdjust=document.querySelectorAll('.close-adjustment');
const sliderContainers=document.querySelectorAll('.sliders');
const genrtBtn=document.querySelector(".generate");
let initialColors;
let savedPalettes=[];

sliders.forEach(slider=>{
    slider.addEventListener('input',hslControl);
})
textHex.forEach(text=>{
    text.addEventListener('click',()=>{
        copyToClipBoard(text);
    })
})
popup.addEventListener("transitionend",()=>{
    const popupBox=popup.children[0];
    popup.classList.remove("active");
    popupBox.classList.remove("active");
})
genrtBtn.addEventListener("click",()=>{
    randomColor();
})
lockbtn.forEach((lock)=>{
    lock.addEventListener('click',()=>{
    
        //console.log(typeof lockbtn.children[0].classList[1]);
        lock.classList.toggle('active');
        if(lock.classList.contains('active'))
        {
             lock.innerHTML=`<i class="fas fa-lock">`;
        }
        else
        {
            lock.innerHTML=`<i class="fas fa-lock-open">`;
        }
    })
})
adjustBtn.forEach((adj,index)=>{
    adj.addEventListener('click',()=>{
        openAdjustPanel(index);
    })
})
closeAdjust.forEach((closeBtn,index)=>{
    closeBtn.addEventListener('click',()=>{
        closeAdjustPanel(index);
    })
   
})
function generateHex()
{
    const hexColor=chroma.random();
    return hexColor;
}

function randomColor()
{  initialColors=[];
    colorDiv.forEach((div)=>{
        const hexText=div.children[0];
        const randomCol=generateHex();
        console.log(div.querySelector('.lock'));
        if(div.querySelector('.lock').classList.contains('active'))
        {
            initialColors.push(hexText.innerText);
            return;
        }
        initialColors.push(chroma(randomCol).hex());
        div.style.backgroundColor=randomCol;
        hexText.innerText=randomCol;
        checkContrast(randomCol,hexText);

        const color=chroma(randomCol);
        const sliders=div.querySelectorAll('.sliders input');
        const hue=sliders[0];
        const brightness=sliders[1];
        const saturation=sliders[2];
        colorizeSliders(color,hue,brightness,saturation);
    })
    resetInput();
}
function checkContrast(color,text)
{
    const luminance=chroma(color).luminance();
    if(luminance>0.5)
    {
         text.style.color="black"
    }
    else
    {
         text.style.color="white";
    }
}
colorDiv.forEach((div,index)=>{
    div.addEventListener('change',()=>{
         updateTextUI(index);
    });
});
function colorizeSliders(color,hue,brightness,saturation)
{
    let noSat=color.set('hsl.s',0);
    let fullSat=color.set('hsl.s',1);
    const midBright=color.set('hsl.l',0.5);
    const scaleSat=chroma.scale([noSat,color,fullSat]);
    const scaleBright=chroma.scale(["black",midBright,"white"])
    saturation.style.backgroundImage=`linear-gradient(to right,${scaleSat(0)},${scaleSat(1)})`;
    brightness.style.backgroundImage=`linear-gradient(to right,${scaleBright(0)},${scaleBright(0.5)},${scaleBright(1)})`
    hue.style.backgroundImage=`linear-gradient(to right,rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`
}

function hslControl(e)
{
    let sliders=e.target.parentElement.querySelectorAll('input[type="range"]');
    const x=e.target.name;
    const hue=sliders[0];
    const brightness=sliders[1];
    const saturation=sliders[2];
    const bgColor=initialColors[e.target.dataset[x]];
    let color=chroma(bgColor).set('hsl.s',saturation.value).set('hsl.l',brightness.value).set('hsl.h',hue.value);
    colorDiv[e.target.dataset[x]].style.backgroundColor=color;
    colorizeSliders(color,hue,brightness,saturation);
}
function updateTextUI(index)
{
    const activeDiv=colorDiv[index];
    console.log(activeDiv);
    const color=chroma(activeDiv.style.backgroundColor);
    console.log(color);
    const text=activeDiv.querySelector('h2');
    const icons=activeDiv.querySelectorAll('.controls button');
    text.innerText=color.hex();
    checkContrast(activeDiv.style.backgroundColor,text);
    for(icon of icons)
    {
        checkContrast(activeDiv.style.backgroundColor,icon);
    }    
}
function resetInput()
{
    sliders.forEach((slider)=>{
        if(slider.name==="hue")
        {
            const col=initialColors[slider.getAttribute('data-hue')];
            const hueValue=chroma(col).hsl()[0];
            //console.log(hueValue);
            slider.value=Math.floor(hueValue);
        }
        else if(slider.name==="bright")
        {
            const col=initialColors[slider.getAttribute('data-bright')];
            const brightValue=chroma(col).hsl()[2];
            console.log(brightValue);
            slider.value=Math.floor(brightValue*100)/100;
        }
        else if(slider.name==="sat")
        {
            const col=initialColors[slider.getAttribute('data-sat')];
            const satValue=chroma(col).hsl()[1];
            //console.log(brightValue);
            slider.value=Math.floor(satValue*100)/100;
        }
    })
}
function copyToClipBoard(text)
{
    const el=document.createElement('textarea');
    el.value=text.innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    const popupBox=popup.children[0];
    popup.classList.add("active");
    popupBox.classList.add("active");
}
function openAdjustPanel(index)
{  console.log("opened");
  console.log(sliderContainers[index]);
    sliderContainers[index].classList.toggle('active');
}
function closeAdjustPanel(index)
{
    sliderContainers[index].classList.remove('active');
}

const saveBtn=document.querySelector('.save');
const submitSave=document.querySelector('.submit-save');
const closeSave=document.querySelector('.close-save');
const saveContainer=document.querySelector('.save-container');
const saveInput=document.querySelector('.save-container input');
const libraryContainer=document.querySelector('.library-container');
const libraryBtn=document.querySelector('.library');
const closeLibraryBtn=document.querySelector('.library-save');


saveBtn.addEventListener('click',openPalette);
closeSave.addEventListener("click",closePalette);
submitSave.addEventListener('click',savePalettes);
libraryBtn.addEventListener('click',openLibrary);
closeLibraryBtn.addEventListener('click',closeLibrary);
function openPalette()
{
    const popup=saveContainer.children[0];
    popup.classList.add('active');
    saveContainer.classList.add('active');
}
function closePalette()
{
    const popup=saveContainer.children[0];
    popup.classList.remove('active');
    saveContainer.classList.remove('active');
}
function savePalettes()
{
    const popup=saveContainer.children[0];
    popup.classList.remove('active');
    saveContainer.classList.remove('active');
    const name=saveInput.value;
    const colors=[];
    textHex.forEach((text)=>{
        colors.push(text.innerText);
    })
    let paletteNr=savedPalettes.length;
    const paletteObject={name,colors,nr:paletteNr};
    savedPalettes.push(paletteObject);
    saveToLocal(paletteObject);
    saveInput.value="";
    const palette=document.createElement('div');
    palette.classList.add('custom-palette')
    const title=document.createElement('h4');
    title.innerText=paletteObject.name;
    const preview=document.createElement("div");
    preview.classList.add("small-preview");
    paletteObject.colors.forEach(smallColor=>{
        const smallDiv=document.createElement('div');
        smallDiv.style.background=smallColor;
        preview.appendChild(smallDiv);
    });
    const paletteBtn=document.createElement('button');
    paletteBtn.classList.add('pick-palette-btn');
    paletteBtn.classList.add(paletteObject.nr);
    paletteBtn.innerText="Select";
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(paletteBtn);
    libraryContainer.children[0].appendChild(palette);
    const selectBtn=document.querySelectorAll('.pick-palette-btn'); 
    console.log(selectBtn);
    selectBtn.forEach(slBtn=>{
        slBtn.addEventListener('click',selectPalette);
    })

}
function selectPalette(e)
{
    const divisions=e.target.parentElement.children[1].children;
    initialColors= [];
    let index=0
    for(divi of divisions)
    {
         initialColors.push(chroma(divi.style.background).hex());
        colorDiv[index].style.background=initialColors[index];
        textHex[index].innerText=initialColors[index];
        checkContrast(initialColors[index],textHex[index]);
        index++;
    }
    resetInput();
}
function saveToLocal(paletteObject)
{  let localPalettes;
    if(localStorage.getItem("palettes")===null)
    {
         localPalettes=[];
    }
    else
    {
        localPalettes=JSON.parse(localStorage.getItem('palettes'));
    }
    localPalettes.push(paletteObject);
    localStorage.setItem('palettes',JSON.stringify(localPalettes));
}

function openLibrary()
{
    const popup=libraryContainer.children[0];
    libraryContainer.classList.add("active");
    popup.classList.add('active');
}
function closeLibrary()
{
    const popup=libraryContainer.children[0];
    libraryContainer.classList.remove("active");
    popup.classList.remove('active');
}

function getLocal()
{   let paletteObject;
    console.log("obj");
    if(localStorage.getItem('palettes')==null)
    {
        paletteObject=[];
    }
    else
    {
        paletteObject=JSON.parse(localStorage.getItem('palettes'));
    }
    //console.log(paletteObject);
    paletteObject.forEach(obj=>{
        //console.log("enter");
        const palette=document.createElement('div');
    palette.classList.add('custom-palette')
    const title=document.createElement('h4');
    title.innerText=obj.name;
    //console.log(title.innerText);
    const preview=document.createElement("div");
    preview.classList.add("small-preview");
    obj.colors.forEach(smallColor=>{
        console.log(smallColor);
        const smallDiv=document.createElement('div');
        smallDiv.style.background=smallColor;
        preview.appendChild(smallDiv);
    });
    const paletteBtn=document.createElement('button');
    paletteBtn.classList.add('pick-palette-btn');
    paletteBtn.classList.add(obj.nr);
    paletteBtn.innerText="Select";
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(paletteBtn);
    libraryContainer.children[0].appendChild(palette);
    const selectBtn=document.querySelectorAll('.pick-palette-btn'); 
    console.log(selectBtn);
    selectBtn.forEach(slBtn=>{
        slBtn.addEventListener('click',selectPalette);
    })
    })
}
getLocal();
randomColor();
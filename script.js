const fileInput = document.querySelector(".file-input"),
filterOptions  = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue  = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
rotateOptions  = document.querySelectorAll(".rotate button"),
previewImg = document.querySelector(".preview-img img"),
resetFilterBtn = document.querySelector(".reset-filter"),
chooseImgBtn = document.querySelector(".choose-img"),
saveImgBtn = document.querySelector(".save-img");

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilters = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal} , ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    if(rotate !== 0  && rotate%180 !== 0){
        previewImg.style.width = `335px`;
        previewImg.style.height = `490px`;
    }else {
        previewImg.style.width = `490px`;
        previewImg.style.height = `335px`;
    }
};

const loadImage = () => {
    let file = fileInput.files[0]; // Getting User Selected File
    if(!file) return; // Return if user hasn't selected file
    previewImg.src = URL.createObjectURL(file); //passing file url as preview img src
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click(); //clicking reset btn, so the filter value reset if the user select new img
        document.querySelector(".container").classList.remove("disable");
    }); // remove disable class from container when image load
    //console.log(file);
}

filterOptions.forEach(option => {
    option.addEventListener("click", () => { //adding click event listener to all filters
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if(option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if (option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if (option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        }
        else if (option.id === "grayscale") {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

const updateFilter = () => {
    //console.log(filterSlider.value);
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active"); //getting selected filter btn

    if(selectedFilter.id === "brightness"){
        brightness = filterSlider.value;
        //console.log('b='+brightness);
    } else if (selectedFilter.id === "saturation"){
        saturation = filterSlider.value;
        //console.log('s='+saturation);
    } else if (selectedFilter.id === "inversion"){
        inversion = filterSlider.value;
        //console.log('i='+inversion);
    } else if (selectedFilter.id === "grayscale"){
        grayscale = filterSlider.value;
       //console.log('s='+grayscale);
    }

    applyFilters();
};

rotateOptions.forEach(option => {
    option.addEventListener("click", () => { //adding click event listener to all rotate/flip buttons
        if(option.id === "left"){
            rotate -= 90; // If clicked btn is left rotate, decrement rotate value by -90          
        } else if(option.id === "right"){
            rotate += 90; // If clicked btn is right rotate, increment rotate value by +90           
        } else if(option.id === "horizontal"){
            // If flipHorizontal value is 1, set this value to -1 else set 1
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;          
        } else if(option.id === "vertical"){
            // If flipVertical value is 1, set this value to -1 else set 1
            flipVertical = flipVertical === 1 ? -1 : 1;          
        }

        applyFilters();
    });   
});

const resetFilter = () => {
    //reseting all variable values to its default value
    brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
    rotate = 0, flipHorizontal = 1, flipVertical = 1;
    filterOptions[0].click(); //Clicking brightess btn, so the brightness selected by default
    applyFilters(); 
};

const saveImage = () => {
    const canvas = document.createElement("canvas"); // creating canvas element
    const ctx = canvas.getContext("2d"); // canvas.getContext return a drawing context on the canvas
    canvas.width = previewImg.naturalWidth; // setting canvas width to actual image width
    canvas.height = previewImg.naturalHeight; // setting canvas height to actual image height
    
    
    //applying user selected filters to canvas filter
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width/2,canvas.height/2); // translating from the center
    
    if(rotate !== 0 ){
        ctx.rotate(rotate * Math.PI / 180);
    }
    
    ctx.scale(flipHorizontal, flipVertical); //flip canvas, horizontally/vertically
    
    if(rotate !== 0 && rotate%180 !== 0){
        ctx.drawImage(previewImg, -canvas.width/4, -canvas.height/4, canvas.width/2, canvas.height/2);
    }else {
        ctx.drawImage(previewImg, -canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
    }
    
    //document.body.appendChild(canvas);

    const link = document.createElement("a"); // creating <a> element
    link.download = "image.jpg";  // passing <a> tag download value to "image.jpg"
    link.href = canvas.toDataURL(); // passing <a> tag href value to canvas data url
    link.click(); // Clicking <a> tag so the image download
};

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());
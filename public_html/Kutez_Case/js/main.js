const apiUrl = "/Kutez-Case/php/mainPage.php";

// Event Handler for carousel
document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('container');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');

    rightBtn.addEventListener('click', function () {
        const containerWidth = container.offsetWidth;
        container.scrollLeft += containerWidth * 0.1;
    });

    leftBtn.addEventListener('click', function () {
        const containerWidth = container.offsetWidth;
        container.scrollLeft -= containerWidth * 0.1;
    });

    window.addEventListener('resize', () => {
        updateProductWidth();
    });

    showList();
});

function getProductWidth() {
    const width = window.innerWidth;
    if (width >= 1200) return '23%'; // 4 products
    if (width >= 900) return '30%'; // 3 products
    if (width >= 600) return '45%'; // 2 products
    return '90%'; // 1 product
}

function updateProductWidth() {
    const productWidth = getProductWidth();
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        product.style.width = productWidth;
    });
}

function showList(){
    $.ajax({
        type: "GET",
        url : apiUrl,
        contentType: "application/json",
        success: function(response){
            console.log("Ürünlerin fiyatının 0 olma nedeni ya apiyi aldığım yer çökmüştür, ya da benim kullandığım kodun aylık kullanım hakkı bitmiştir!");
            for (let item of response.data) {
                createItem(item);
            }
        }, error: function(response) {
            console.log(response)
        }
    });
}

function createItem(obj){
    const sanitizedName = obj['name'].replace(/\s+/g, '_'); // For accurate ids
    $("#container").append(`
        <section class="product">
            <div class="imgBox">
                <img id="imgSource-${sanitizedName}" src="${obj['images']['yellow']}" alt="">
            </div>
            <div class="title">
                <p>${obj['name']}</p>
            </div>
            <div class="price">
                <p>$${obj['price']} USD</p>
            </div>
            <div class="colorsButton">
                <nav class="colorRadioGroup">
                    <input type="radio" name="rdoBtnGrp-${sanitizedName}" class="yellow_gold" checked>
                    <input type="radio" name="rdoBtnGrp-${sanitizedName}" class="white_gold">
                    <input type="radio" name="rdoBtnGrp-${sanitizedName}" class="rose_gold">
                </nav>
                <div class="colorRadioGroupName">
                    <p id="colorName-${sanitizedName}">Yellow Gold</p>
                </div>
            </div>
            <div class="rating">
                 <p id="rating-${sanitizedName}"></p>
            </div>
        </section>    
    `)

    createRating(obj, `rating-${sanitizedName}`);
    $(`input[name="rdoBtnGrp-${sanitizedName}"]`).on("change", function () {
        const selectedClass = $(this).attr("class"); 
        const imgElement = document.querySelector(`#imgSource-${sanitizedName}`); 
        const pElement = document.querySelector(`#colorName-${sanitizedName}`)

        switch (selectedClass) {
            case "yellow_gold":
                imgElement.src = obj['images']['yellow'];
                pElement.textContent = `Yellow Gold`;
                break;
            case "white_gold":
                imgElement.src = obj['images']['white'];
                pElement.textContent = `White Gold`;
                break;
            case "rose_gold":
                imgElement.src =  obj['images']['rose'];
                pElement.textContent = `Rose Gold`;
                break;
        }
    });
}

function createRating(obj, name){
    const starNumber = 5;
    const flagNumber = 0.5;
    const selectedItem = document.querySelector(`#${name}`);
    const calculatedStar = findNumberForStar(obj['popularityScore'] * 5 / 100);
    let starsHTML = '';
    for(i = 1; i <= starNumber; i+=1){
        if(i <= calculatedStar)
            starsHTML += `<i class="fa fa-star full"></i>`;
        else if (i-flagNumber == calculatedStar)
            starsHTML += `<i class="fa fa-star half"></i>`;
        else
            starsHTML += `<i class="fa fa-star empty"></i>`;
    }
    starsHTML += `  ${calculatedStar}/5`;
    selectedItem.innerHTML = starsHTML;
}

function findNumberForStar(number){
    const decimalPart = number - Math.floor(number);
    if(decimalPart >= 0.5)
        return Math.floor(number) + 0.50;
    else
        return Math.floor(number).toFixed(1);
}
// let emoji = [];
// const loadCharacters = async () => {
//     try {
//         const res = await fetch('https://emojihub.yurace.pro/api/all');
//         emoji = await res.json();
//         displayCharacters(emoji);
//     } catch (err) {
//         console.error(err);
//     }
// };

// const displayCharacters = (characters) => {
//     const htmlString = characters
//         .map((character) => {
//             return `
//             <li class="character">
//                 <h4>${character.name} <span>${character.htmlCode}</span></h4>
//                 <p>Category: ${character.category}</p>
//                 <p>Group: ${character.group}</p>                
//             </li>
//         `;
//         })
//         .join('');
//     emojiList.innerHTML = htmlString;
// };

// loadCharacters();

let emoji = [];
let filteredEmoji = [];
let currentPage = 1;
const emojisPerPage = 9;

const emojiList = document.getElementById("emojiList");
const categorySelect = document.getElementById("category-select");
const prevPageBtn = document.getElementById("prev-page-btn");
const nextPageBtn = document.getElementById("next-page-btn");
const pageNumber = document.getElementById("page-number");

const loadCharacters = async () => {
    try {
        const res = await fetch('https://emojihub.yurace.pro/api/all');
        emoji = await res.json();
        filteredEmoji = emoji;
        displayCharacters();
        populateCategories();
    } catch (err) {
        console.error(err);
    }
};

const displayCharacters = () => {
    const startIndex = (currentPage - 1) * emojisPerPage;
    const endIndex = startIndex + emojisPerPage;
    const currentEmojis = filteredEmoji.slice(startIndex, endIndex);

    const htmlString = currentEmojis
        .map((character) => {
            return `
            <li class="character">
                <h4>${character.name}</h4>
                <p id="category">Category: ${character.category}</p>
                <p id="group">Group: ${character.group}</p>
                <span>${character.htmlCode}</span>
                                
            </li>
        `;
        })
        .join('');
    emojiList.innerHTML = htmlString;

    pageNumber.textContent = `Page ${currentPage}`;
    updatePaginationButtons();
};

const populateCategories = () => {
    const categories = emoji.reduce((uniqueCategories, character) => {
        if (!uniqueCategories.includes(character.category)) {
            uniqueCategories.push(character.category);
        }
        return uniqueCategories;
    }, []);

    categories.forEach((category) => {
        const option = document.createElement("option");
        option.textContent = category;
        option.value = category;
        categorySelect.appendChild(option);
    });
};

const filterByCategory = () => {
    const selectedCategory = categorySelect.value;
    if (selectedCategory === "") {
        filteredEmoji = emoji;
    } else {
        filteredEmoji = emoji.filter((character) => character.category === selectedCategory);
    }
    currentPage = 1;
    displayCharacters();
};

const updatePaginationButtons = () => {
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === Math.ceil(filteredEmoji.length / emojisPerPage);
};

const goToPreviousPage = () => {
    if (currentPage > 1) {
        currentPage--;
        displayCharacters();
    }
};

const goToNextPage = () => {
    if (currentPage < Math.ceil(filteredEmoji.length / emojisPerPage)) {
        currentPage++;
        displayCharacters();
    }
};

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        goToPreviousPage();
    } else if (event.key === "ArrowRight") {
        goToNextPage();
    }
});

categorySelect.addEventListener("change", filterByCategory);
prevPageBtn.addEventListener("click", goToPreviousPage);
nextPageBtn.addEventListener("click", goToNextPage);

loadCharacters();

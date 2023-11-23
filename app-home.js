const itemsPerPage = 40;
let currentPage = 1;

function createGridItem(item) {
    const gridItem = document.createElement('div');
    gridItem.classList.add('item');
    
    const nameRow = document.createElement('div');
    nameRow.className='nameRow';
    nameRow.innerHTML = `<a href = "detail.html"><h2>${item.name}</h2></a><br><p>${item.address_1}</p><p>${item.state_province}</p><p>${item.country}</p>`;
    gridItem.appendChild(nameRow);

    const categoryRow = document.createElement('div');
    categoryRow.className='categoryRow';

    const colorBox = document.createElement('div');
    colorBox.className='colorBox';
    colorBox.textContent = item.brewery_type;
    colorBox.style.backgroundColor = getCategoryColor(item.brewery_type);
    categoryRow.appendChild(colorBox);

    gridItem.appendChild(categoryRow);

    // Add a click event listener to the grid item
    gridItem.addEventListener('click', function () {
        // Store the selected obdb-id in localStorage
        localStorage.setItem('selectedBreweryId', item.id);
            
        // Redirect to the details page
        window.location.href = 'detail.html';
    });

    return gridItem;
}

async function fetchData() {
    try {
        const response = await fetch('https://api.openbrewerydb.org/v1/breweries?per_page=120');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function updateGrid(filter, page) {
    const data = await fetchData();
    const filteredList = filter === 'all' ? data : data.filter(item => item.brewery_type === filter);

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedList = filteredList.slice(startIndex, endIndex);

    const gridContainer = document.getElementById('filteredList');
    gridContainer.innerHTML = '';

    paginatedList.forEach(item => {
        const gridItem = createGridItem(item);
        gridContainer.appendChild(gridItem);
    });

    updatePagination(filteredList.length, page);
}

function updatePagination(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = `#`;
        pageLink.textContent = i;
        if (i === currentPage) {
            pageLink.style.backgroundColor = 'black';
            pageLink.style.color = 'white';
        }
        pageLink.addEventListener('click', function () {
            currentPage = i;
            updateGrid(filterDropdown.value, currentPage);
        });
        paginationContainer.appendChild(pageLink);
    }
}

const filterDropdown = document.getElementById('filterDropdown');
filterDropdown.addEventListener('change', function () {
    currentPage = 1;
    updateGrid(this.value, currentPage);
});

function getCategoryColor(category) {
    switch (category) {
        case 'micro':
            return 'rgba(0, 255, 0, 0.3)';
        case 'nano':
            return 'rgba(255, 0, 0, 0.3)';
        case 'brewpub':
            return 'rgba(0, 0, 255, 0.3)';
        case 'regional':
            return 'rgba(255, 255, 0, 0.3)';
        case 'large':
            return 'rgba(255, 0, 255, 0.3)';
        case 'planning':
            return 'rgba(0, 255, 255, 0.3)';
        case 'contract':
            return 'rgba(100, 100, 100, 0.3)';
        case 'proprietor':
            return 'rgba(100, 100, 0, 0.3)';
        case 'closed':
            return 'rgba(0, 100, 100, 0.3)';
        default:
            return 'rgba(0, 0, 0, 0.3)'; // Default color for unknown categories
    }
}

updateGrid('all', currentPage);
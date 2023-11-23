const idBrewery = localStorage.getItem('selectedBreweryId');

async function getBreweryDetails(id) {
    const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/${id}`);
    const data = await response.json();
    return data;
}

async function createItemDetails() {
    const breweryDetails = await getBreweryDetails(idBrewery);

    const itemContainer = document.getElementById('breweries-info-container');
    itemContainer.innerHTML = ''; // Clear previous content if needed
    itemContainer.classList.add('item-details');

    const selectedBreweryDetails = document.createElement('div');
    selectedBreweryDetails.className = 'selected-brewery-details';

    const mapsLink = `https://www.google.com/maps/place/${breweryDetails.latitude},${breweryDetails.longitude}`;

    selectedBreweryDetails.innerHTML = `
        <h1>Type: ${breweryDetails.name}</h1>
        <p>Stret: ${breweryDetails.street}</p>
        <p>City: ${breweryDetails.city}</p>
        <p>State: ${breweryDetails.state}</p>
        <p>Postal code: ${breweryDetails.postal_code}</p>
        <p>Country: ${breweryDetails.country}</p>
        <p>Website: <a href="${breweryDetails.website_url}">${breweryDetails.website_url}</a></p>
        <p>Phone: ${breweryDetails.phone}</p>
        <p>Open in maps: <a href="${mapsLink}" target="_blank">${breweryDetails.latitude},${breweryDetails.longitude}</a></p>
    `;

    itemContainer.appendChild(selectedBreweryDetails);

    // After creating the item details, save the current pagination state to localStorage
    localStorage.setItem('currentPage', currentPage);

    return itemContainer;
}

document.getElementById('backBtn').addEventListener('click', function () {
    // Navigate back to the stored page
    const storedPage = localStorage.getItem('currentPage');
    if (storedPage) {
        window.location.href = `home.html?page=${storedPage}`;
    } else {
        window.location.href = 'home.html';
    }
});

// Call the function to fetch and display brewery details
createItemDetails();
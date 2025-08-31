//DOMContentLoaded -this event ensures the script runs only after the full HTML document has been loaded and parsed.
document.addEventListener('DOMContentLoaded', () => {
    // Select all buttons on the page that could be used to add items to the cart.
    const addToCartButtons = document.querySelectorAll('.btn');

    // Attach a click event listener to each of these buttons.
    addToCartButtons.forEach(button => {
        // We check the button's text to ensure we only target 'Add to Cart' or similar buttons.
        const buttonText = button.textContent.toLowerCase();
        if (buttonText.includes('cart') || buttonText.includes('order')) {
            
            button.addEventListener('click', (e) => {
                e.preventDefault(); // This stops the link from trying to navigate to a new page.

                // When a button is clicked, find its closest parent '.food-card' element.
                // This card contains all the information about the product.
                const card = e.target.closest('.food-card');
                if (!card) return; // If for some reason the button is not in a card, do nothing.

                // Extract all the necessary product details from the card's HTML elements and data attributes.
                const id = card.dataset.id;
                const name = card.querySelector('h4').textContent;
                const priceText = card.querySelector('.price').textContent;
                const price = parseFloat(priceText.replace('$', '')); // Convert price string (e.g., "$12.99") to a number.
                const imageSrc = card.querySelector('img').src;

                // Create a clean object representing the item to be added to the cart.
                const cartItem = {
                    id,
                    name,
                    price,
                    imageSrc,
                    quantity: 1 // Start with a quantity of 1.
                };

                // Call the function to add the item to the cart in browser storage.
                addItemToCart(cartItem);
            });
        }
    });

    /**
     * Adds an item to the cart stored in localStorage.
     * If the item already exists in the cart, it simply increases the quantity.
     * @param {object} item - The item object to add to the cart.
     */
    function addItemToCart(item) {
        // 1. Get the current cart from localStorage.
        // JSON.parse turns the saved string back into a JavaScript array.
        // If 'bellyFullCart' doesn't exist, it creates a new empty array [].
        let cart = JSON.parse(localStorage.getItem('bellyFullCart')) || [];

        // 2. Check if the item is already in the cart by matching its unique ID.
        const existingItem = cart.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            // If it exists, just increase its quantity.
            existingItem.quantity += 1;
        } else {
            // If it's a new item, add the entire item object to the cart array.
            cart.push(item);
        }

        // 3. Save the updated cart array back to localStorage.
        // JSON.stringify turns the array into a string, which is how it must be stored.
        localStorage.setItem('bellyFullCart', JSON.stringify(cart));

        // 4. Update the visual cart counter in the header.
        updateCartIcon();
        
        // 5. Give the user clear feedback that the action was successful.
        alert(`"${item.name}" has been added to your cart!`);
    }

    /**
     * Updates the number displayed next to the cart icon in the header.
     * It calculates the total number of items, not just the number of unique products.
     */
    function updateCartIcon() {
        let cart = JSON.parse(localStorage.getItem('bellyFullCart')) || [];
        
        // The reduce function sums up the 'quantity' of every item in the cart.
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        const cartCountElement = document.getElementById('cart-item-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            
            // Only show the number bubble if there are items in the cart.
            cartCountElement.style.display = totalItems > 0 ? 'inline-block' : 'none';
        }
    }

    // Call updateCartIcon() as soon as the page loads to ensure the count is correct
    // from the beginning, reflecting any items previously added.
    updateCartIcon();
});

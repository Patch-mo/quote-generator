const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterButton = document.getElementById('twiter');
const newQuoteButton = document.getElementById('new-quote');
const loader = document.getElementById('loader');
let errorCount = 0;

function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

// Get Quote From API

async function getQuote() {
    showLoadingSpinner();
    // We need to use a Proxy URL to make our API call in order to avoid a CORS error
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl =
        'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    try {
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();
        // If author is blanks add 'unknown sage'
        if (data.quoteAuthor === '') {
            authorText.innerText = 'Unknown Sage';
        } else {
            authorText.innerText = data.quoteAuthor;
        }
        // Reduce font size for long quotes
        if (data.quoteText.length > 120) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }

        quoteText.innerText = data.quoteText;
        // Stop Loader, show Quote
        removeLoadingSpinner();
    } catch (error) {
        if (errorCount < 10) {
            errorCount++;
            getQuote();
        } else {
            console.log('too many errors');
            removeLoadingSpinner();
        }
    }
}

//Tweet Quote

function tweetQuote() {
    const quote = quote.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
}

// On Load
getQuote();

// Event Listeners
newQuoteButton.addEventListener('click', getQuote);
twitterButton.addEventListener('click', tweetQuote);

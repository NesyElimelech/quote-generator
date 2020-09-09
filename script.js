//! variables
const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

//? Show loading indication
function loading() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

//? hide loading indication
function complete() {
  if (!loader.hidden) {
    // checks if the loader isn't on hidden mode
    quoteContainer.hidden = false;
    loader.hidden = true;
  }
}

//? Get Quote from API
async function getQuote() {
  loading(); // loading indicator is running until data is fetched
  const apiURL =
    'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json'; // the Quote api url
  const proxyURL = 'https://hidden-woodland-33619.herokuapp.com/'; // my own proxy server url to handle CORS header issues
  try {
    const response = await fetch(proxyURL + apiURL); // combining the proxy url and the api url so it can be shown.
    const data = await response.json(); // fetching the data from the API as a JSON

    // check if the author name is blank, then set it to 'unknown'
    if (data.authorText === '') {
      authorText.innerText = 'Unknown';
    } else {
      authorText.innerText = data.quoteAuthor;
    }
    // reduce font size for long quotes
    if (data.quoteText.length > 120) {
      quoteText.classList.add('long-quote');
    } else {
      quoteText.classList.remove('long-quote');
    }
    quoteText.innerText = data.quoteText;
    //  hide loading indication
    complete();
  } catch (error) {
    // if there is an error, it's keep trying to fetch another quote.
    getQuote();
    console.log('Whoops no quote 😕', error);
  }
}

//? tweet quote
function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`; // twitter API for inserting text to the tweet from outside.
  window.open(twitterUrl, '_blank'); // open new tab with a tweet ready for being tweeted with the quote and the author name
}

//* Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

//* On Load
getQuote();

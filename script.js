const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

function showLoadingIndicator() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function hideLoadingIndicator() {
  if (!loader.hidden) {
    // checks if the loader isn't on hidden mode
    quoteContainer.hidden = false;
    loader.hidden = true;
  }
}

//? Get Quote from an API and display it
async function getQuote() {
  showLoadingIndicator();
  // a proxy server to handle CORS header issues to make our API requests works every time.
  const proxyURL = 'https://hidden-woodland-33619.herokuapp.com/';
  // the Quote API with the data we want to fetch and on what format.
  const apiURL =
    'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
  try {
    const response = await fetch(proxyURL + apiURL);
    const data = await response.json();

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
    hideLoadingIndicator();
  } catch (error) {
    // if there is an error, it's keep trying to fetch another quote up to 10 times.
    for (let i = 0; i <= 10; i++) {
      getQuote();
    }
    console.log('Whoops no quote 😕', error);
  }
}

//? tweet the quote on twitter using the twitter API
function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  window.open(twitterUrl, '_blank');
}

//* Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

//* On page loads
getQuote();

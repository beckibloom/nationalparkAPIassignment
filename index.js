'use strict';

const apiKey = 'GyQFctuiTazPoE2KxV20uhrUhKuTkDzmFJA3dZje'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson, state, maxResults) {
  console.log(responseJson);
  $('#results-list').empty();

  const total = Number(responseJson.total);

  if (total === 0) {
        $('#results-list').append(`<li class="error-message">Uh oh! We don't have any parks for that state. Please check your state code and try again.</li>`);
  }
  else if (total === 496) {
        $('#results-list').append(`<li class="error-message">No state was specified. Results below are for every state.</li>`);
  }
  else if (total < (maxResults + 1)) {
        $('#results-list').append(`<li class="error-message">We don't have ${(maxResults + 1)} parks to show you, but we do have ${total}!</li>`);
  }

  for (let i = 0; i < responseJson.data.length; i++){
    $('#results-list').append(
      `<li><h3><a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a></h3>
      <p>${responseJson.data[i].description}</p>
      </li>`
    )};
  $('#results').removeClass('hidden');
  $('.search-term').text(state);
};

function getParks(state, maxResults=10) {
  const params = {
    stateCode: state,
    limit: maxResults,
    api_key: apiKey
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

//   const options = {
//     headers: new Headers({
//       "X-Api-key": apiKey})
//   };

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, state, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Uh oh! Something went wrong. Here's what we know: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const state = $('#js-state').val();
    const maxResults = ($('#js-max-results').val() - 1);
    console.log(`Form was submitted with state ${state} and max results of ${maxResults}`);
    getParks(state, maxResults);
  });
}

$(watchForm);
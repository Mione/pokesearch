(function () {
  var searchField = document.querySelector('#search-field');
  var searchResults = document.querySelector('.search-results');
  var apiLocation = '/rest/pokemon-details/';
  var apiLocationPokemon = '/rest/pokemon/';
  var pokemonList = document.querySelector('.pokemon-list');

  Object.prototype.forEach = function (callback) {
    for (var i = 0; i < this.length; i++) {
      callback.call(this, array[i], i); // passes back stuff we need
    }
  };
  function init() {
    bindEvents();
  }

  function bindEvents() {
    searchField.addEventListener('keyup', function (ev) { //keypress not recommended..
      toggleLoader();
      if (searchField.value) {
        findPokemon(searchField.value, function (err, data) {
          if (err) {
            console.log('An error has occurred', err);
            return;
          }
          searchResults.classList.remove('hidden');
          displayData(data);
          toggleLoader();
        });
      }
    });

    document.addEventListener('click', function (ev) {
      var target = ev.target;
      if (target && target.classList.contains('more-details')) {
        console.log(target.getAttribute('data-url'));
        target.parentElement.classList.add('loading');
        displayPokemonDetails(target.parentElement, target.getAttribute('data-url'))
      }
    });
  }

  function ajax(url, options) {
    try {
      var xhr = new XMLHttpRequest();
      var data;
      options = options || {};
      if (!url) {
        return;
      }
      xhr.open(options.method || 'GET', url);
      if (options.method === 'POST') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=ISO-8859-1');
        xhr.send(JSON.parse(options.data));
      } else {
        xhr.send();
      }

      xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          options.callback ? options.callback(null, xhr) : console.log('Ajax request succeed: ' + xhr.responseText)
        } else {
          options.callback ? options.callback('Ajax request failed. ' + xhr.responseText) : console.log('Ajax request failed. ' + xhr.responseText)
        }
      };
    } catch (err) {
      console.log('An error has occurred', err);
    }
  }

  function toggleLoader() {

  }

  function displayData(data) {
    var temp = '';
    var data = JSON.parse(data);
    data.forEach(function (element) {
      temp = temp + createPokemon(element);
    }, this);

    pokemonList.innerHTML = temp;
  }

  function findPokemon(name, callback) {
    ajax((apiLocation + name), {
      method: 'GET',
      callback: function (err, xhr) {
        if (err) {
          console.log(err);
          callback(err);
          return;
        }
        callback(null, xhr.responseText);
      }
    });
  }

  function createPokemon(details) {
    // var pokemon = document.createElement('div');
    return `<div class="pokemon"><img src="" alt="no image found" class="hidden">
    <h3>${details.name}</h3>
    <p class="hidden">description</p>
    <button class="more-details" data-url="${details.url}">More details</button></div>`;
  }

  function minifyPokemons(pokemons) {
    pokemons.forEach(function (element, index) {
      element.classList.remove('expanded');
    });
  }

  function displayPokemonDetails(parent, url) {
    var pokemons = document.querySelector('.pokemon');
    var image = parent.querySelector('img');
    var description = parent.querySelector('p');
    var btn = parent.querySelector('button');

    getPokemonDetails(url, function (err, data) {
      if (err) {
        console.log(err);
        return;
      }
      var data = JSON.parse(data);
      //let's copy their api to our own :D
      //this is crap btw so never do this on something meaningful lol
      ajax(apiLocationPokemon + data.name, {
        method: 'POST',
        callback: function (err, xhr) {
          if (err) {
            console.log(err);
            return;
          }
          console.log('successfully updated database');
        },
        data: {
          name: data.name,
          id: data.id,
          height: data.height,
          weight: data.weight,
          sprites: data.sprites,
          stats: data.stats
        }
      });


      minifyPokemons(pokemons);
      btn.classList.add('hidden');
      parent.classList.add('expanded');
      parent.classList.remove('loading');
      description.classList.remove('hidden');
      image.src = data['sprites'].front_default;
      image.classList.remove('hidden');
      description.textContent = 'Height: ' + data.height + '\n Weight: ' + data.weight + '\n.';
    });
  }

  function getPokemonDetails(url, callback) {
    ajax(url, {
      method: 'GET',
      callback: function (err, xhr) {
        if (err) {
          console.log(err);
          callback(err);
          return;
        }
        callback(null, xhr.responseText);
      }
    });
  }
  init();
} ());
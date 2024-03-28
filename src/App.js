import { useEffect, useState } from "react";
import "./App.css";
import Pagination from "./components/Pagination";
import PokemonList from "./components/PokemonList";
import axios from "axios";
import Modal from "./components/Modal";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon"
  );
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();
  const [loading, setLoading] = useState(true);
  const [moreClicked, setMoreClicked] = useState(false);

  useEffect(() => {
    setLoading(true);
    let cancel;
    axios
      .get(currentPageUrl, {
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
      .then((res) => {
        setLoading(false);
        setNextPageUrl(res.data.next);
        setPrevPageUrl(res.data.previous);
        const requests = res.data.results.map((p) => axios.get(p.url));
        axios.all(requests).then((responses) => {
          const pokemonsWithSprites = responses.map((response) => ({
            name: response.data.name,
            sprite: response.data.sprites.other.showdown.front_shiny,
          }));
          setPokemons(pokemonsWithSprites);
        });
      });

    return () => cancel();
  }, [currentPageUrl]);

  function goToNextPage() {
    setCurrentPageUrl(nextPageUrl);
  }

  function goToPrevPage() {
    setCurrentPageUrl(prevPageUrl);
  }

  function handleMoreClicked() {
    setMoreClicked(!moreClicked);
  }

  if (loading) return <div className="loading">Loading...</div>;

  if (moreClicked) {
    document.body.className = "hidden";
  }

  return (
    <div className="App">
      {moreClicked ? <Modal /> : null}
      <PokemonList handleMoreClicked={handleMoreClicked} pokemons={pokemons} />
      <Pagination
        goToNextPage={nextPageUrl ? goToNextPage : null}
        goToPrevPage={prevPageUrl ? goToPrevPage : null}
      />
    </div>
  );
}

export default App;

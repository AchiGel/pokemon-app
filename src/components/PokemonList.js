import More from "./More";

function PokemonList({ pokemons, handleMoreClicked }) {
  return (
    <ul className="pokemons-grid">
      {pokemons.map((p) => (
        <li key={p.name}>
          <h2>{p.name}</h2>
          <img src={p.sprite} alt="null" />
          <More handleMoreClicked={handleMoreClicked} />
        </li>
      ))}
    </ul>
  );
}

export default PokemonList;

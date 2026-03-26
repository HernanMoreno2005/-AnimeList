import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./assets/animesMangas.css";

export function AnimeUrl() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);

  useEffect(() => {
    const getAnime = async () => {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
      const data = await res.json();
      setAnime(data.data);
    };

    getAnime();
  }, [id]);

  if (!anime) {
    return <p>Cargando anime...</p>;
  }

  return (
    <div className="flex justify-center">
    <div className="w-[60%]">
      <h1 className = "text-4xl text-center text-purple-600 font-[fuente]">{anime.title}</h1>
      <div className="flex justify-between mt-5">
      <div>
      <p className= "text-purple-600 font-[fuente]">Score: {anime.score}</p>
      <p className= "text-purple-600 font-[fuente]">Ranked: {anime.rank}</p>
      <p className= "text-purple-600 font-[fuente]">Popularity : {anime.popularity}</p>
      </div>
      <div>
      <p className= "text-purple-600 font-[fuente]">Episodes: {anime.episodes}</p>
      <p className= "text-purple-600 font-[fuente]">Status:  {anime.status}</p>
      <p className= "text-purple-600 font-[fuente]"> Genres: {anime.genres.map(g => g.name).join(", ")}</p>
      <p></p>
      </div>
      </div>
      <div className="flex gap-2">
      {anime.trailer?.embed_url ? (
        <iframe 
        src={anime.trailer.embed_url}
        className="mb-2 w-90 h-80"
        allowFullScreen
        />
      ) :(
        <img src={anime.images.jpg.image_url} alt={anime.title} />
      )
      }
      <div className="flex flex-col items-center">
      <p className="font-[fuenteTextos] text-balance m-5">{anime.synopsis}</p>
      <button className= " font-[fuente] bg-purple-600 text-white w-30  rounded-2xl mt-2 p-2.5 border-4 border-solid border-white cursor-pointer hover:border-black hover:bg-white hover:text-purple-600">Go List</button>
      </div>
    </div>
    </div>
    </div>
  );
}
export function Characters(){
   const { id } = useParams();
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const getCharacters = async () => {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
      const data = await res.json();
      setCharacters(data.data);
    };
    getCharacters();
  }, [id]);
  
  return(
  <div className="w-full flex justify-center">
  <div>
  <h2 className="font-[fuente] text-purple-500 text-4xl text-center"> Important characters </h2>  
  <div id ="containerCharacters" className="grid grid-cols-3  w-6xl">
  {characters.slice(0,9).map(c => (
  <div className="place-items-center" key={c.character.mal_id}>
    <h3 className="font-[fuente] text-purple-600 font-bold">{c.character.name}</h3>
    <img className="w-48 rounded-2xl" src={c.character.images.jpg.image_url } />
    <p className="mb-2 font-[fuenteTextos]">{c.role}</p>
  </div>
))}
  </div>
  </div>
  </div>
  )
}
export function RelatedEntries(){
  const { id } = useParams();
  const [relations, setRelations] = useState([]);

  useEffect(() => {
    const getRelations = async () => {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/relations`);
      const data = await res.json();
      setRelations(data.data);
    };
    getRelations();
  }, [id]);

  return(
    <div id="relations">
      <h2 className="text-4xl text-center text-purple-600 font-[fuente] mb-3"> Related entries</h2>
      <div id="containerSequels" className="flex gap-5 justify-center">
        <div id="prequels">
        <h2 className="text-3xl text-purple-600 font-[fuente] text-center">Prequel</h2>
        {relations.filter(r => r.relation === "Prequel").map(r => (
        <div> 
        {r.entry.map(e =>(
          <RelatedAnimeCard id={e.mal_id} name={e.name}/>
        ))}
        </div>
        ))
        }
        </div>
        <div id="sequels">
        <h2 className="text-3xl text-purple-600 font-[fuente] text-center">Sequel</h2>
        {relations.filter(r => r.relation === "Sequel").map(r => (
        <div> 
        {r.entry.map(e =>(
          <RelatedAnimeCard id={e.mal_id} name={e.name}/>
        ))}
        </div>
        ))
        }
        </div>
      </div>
    </div>
  )
}
function RelatedAnimeCard({ id, name }) {
  const [anime, setAnime] = useState(null);

  useEffect(() => {
    fetch(`https://api.jikan.moe/v4/anime/${id}`)
      .then(res => res.json())
      .then(data => setAnime(data.data));
  }, [id]);

  if (!anime) return <p>Cargando...</p>;

  return (
    <div className="flex flex-col justify-center items-center cursor-pointer">
      <Link to={`/anime/${anime.mal_id}`}>
      <p className="font-[fuenteTextos]">{name}</p>
      <img className="rounded-2xl h-80"src={anime.images.jpg.image_url} />
      </Link>
    </div>
  );
}

export function Reviews(){
  const [noteReviews,setNote] = useState(true);
  return(
  <div id="containerReviews">
    <h2 className="text-4xl text-center text-purple-600 font-[fuente] my-5"> Reviews</h2>
    <div id="categories" className="flex justify-end">
    <p className={`underline-animation cursor-pointer text-end text-purple-600 text-2xl font-[fuente] ${[noteReviews ?  "active" : ""]}`} onClick={() => setNote(true)}>BestScore</p>
    <p className={`underline-animation cursor-pointer text-end text-purple-600 text-2xl font-[fuente] mr-3 ${[noteReviews ?  "" : "active"]}`} onClick={() => setNote(false)}>/WorstScore</p>
    </div>
    <SearchReviews note = {noteReviews} />
  </div>)
}
function SearchReviews ({note}){
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
 useEffect(() => {
    const getReviews= async () => {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/reviews`);
      const data = await res.json();
      setReviews(data.data);
    };
    getReviews();
  }, [id]);

  if(note){
    return(
      <div className="flex justify-center items-center flex-col">
        {
        reviews.sort((a, b) => b.score - a.score).slice(0,5).map(r => (
        <ReviewCard key={r.mal_id} r={r} />
        ))
        }
      </div>
    )
  }
  else{
    return( 
    <div className="flex justify-center items-center flex-col">
    {
        reviews.filter(r =>  r.score <=4).slice(0,5).map(r => (
       <ReviewCard key={r.mal_id} r={r} />
        ))
        }
  </div>
)
 }
}

function ReviewCard({ r }) {
  const [expanded, setExpanded] = useState(false);

  const isLong = r.review.length > 600;

  return (
    <div className="w-5xl flex flex-col bg-gradient-to-b from-[#7F358E] to-[#280F0F] mb-5 rounded-2xl text-white">
      
      <div className="flex justify-around font-[fuenteTextos]">
        <p>{r.user.username}</p>
        <p>Score: {r.score}/10</p>
        <p>{r.date}</p>
      </div>

      <p className="m-3 font-[fuenteTextos]">
        {expanded
          ? r.review
          : r.review.substring(0, 600) + (isLong ? "..." : "")}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-purple-300 mb-3 self-center cursor-pointer"
        >
          {expanded ? "Close" : "Read more"}
        </button>
      )}
    </div>
  );
}
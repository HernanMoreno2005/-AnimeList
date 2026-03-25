import { useParams } from "react-router-dom";
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
        />
      ) :(
        <img src={anime.images.jpg.image_url} alt={anime.title} />
      )
      }
      <div>
      <p className="font-[fuente]">{anime.synopsis}</p>
      <button className= " font-[fuente] bg-purple-600 text-white w-30  rounded-2xl mt-2 ">go list</button>
      </div>
    </div>
    </div>
    </div>
  );
}
export function Characters(){
  return(
  <div>
  <h2 className="font-[fuente] text-purple-500 text-4xl text-center"> characters </h2>  
  
  </div>
  )
}
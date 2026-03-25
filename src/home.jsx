import {useEffect,useState} from "react";
import { Link } from "react-router-dom";
import image from "./assets/rightArrow.png";
export function Header (){
    return(
     <header id="encabezado">
        <div id="secciones">
        <p>AnimelistLogo</p>  <p>Anime</p> <p>Manga</p><p> my list </p>
        </div>
        <button id="login"> Login </button>
     </header>
    )
}


export  function Anime(){
  const[animes,setAnimes] = useState([]);
  const [index,setIndex] = useState(0);
  useEffect(() =>{
   const getData = async() => {
   const res = await fetch("https://api.jikan.moe/v4/top/anime?filter=airing&limit=5");
      const dataAnime = await res.json();
      setAnimes(dataAnime.data);
  }
getData();
},[]);
const nextAnime = () =>{
 setIndex((prev) => (prev + 1) % animes.length);
}
if (animes.length === 0) {
    return <p>Cargando...</p>;
  }
let anime = animes[index];
    return (
        <div id="bestAnime2026">
            <h2 id="BestAnimeTitle">Best Airing Animes 2026</h2>
                <div className="fullContainer">
                <div key ={anime.mal_id} className="container">
                <div className="animeInformation"> 
                <img src={anime.images.jpg.image_url}
                alt={anime.title}
                width="150vh"
                height="260vh"
                />
                <div className="containerScore">
                <h2 className="animeTitle"> {anime.title}</h2>
                <div className="arrowContainer">
                <p className="animeDescription">{anime.synopsis}</p>
                <img src={image}
                width="130px"
                height="130px"
                className="arrow"
                onClick={nextAnime}
                />
                </div>
                <div className="moreInfoContainer">
                <p className="score">Score: {anime.score}/10</p>
                <Link to={`/anime/${anime.mal_id}`}>
                <button> more info</button>
                </Link>
                </div>
                </div>
                </div>
                </div>
                </div>
            )
        </div>
    )
}


 export  function Manga(){
  const[mangas,setMangas] = useState([]);
  const [index,setIndex] = useState(0);
  useEffect(() =>{
   const getData = async() => {
   const res = await fetch("https://api.jikan.moe/v4/top/manga?filter=publishing&limit=5");
      const dataManga = await res.json();
      setMangas(dataManga.data);
  }
getData();
},[]);
const nextManga = () =>{
 setIndex((prev) => (prev + 1) % mangas.length);
}
if (mangas.length === 0) {
    return <p>Cargando...</p>;
  }
let manga = mangas[index];
    return (
        <div id="bestAnime2026">
            <h2 id="BestAnimeTitle">Best Airing Mangas 2026</h2>
                <div className="fullContainer">
                <div key ={manga.mal_id} className="container">
                <div className="animeInformation"> 
                <img src={manga.images.jpg.image_url}
                alt={manga.title}
                width="150vh"
                height="260vh"
                />
                <div className="containerScore">
                <h2 className="animeTitle"> {manga.title}</h2>
                <div className="arrowContainer">
                <p className="animeDescription">{manga.synopsis}</p>
                <img src={image}
                width="130px"
                height="130px"
                className="arrow"
                onClick={nextManga}
                />
                </div>
                <p className="score">Score: {manga.score}/10</p>  
                </div>
                </div>
                </div>
                </div>
            )
        </div>
    )
} 

import {useEffect,useState} from "react";
import { useParams,Link } from "react-router-dom";
import image from "./assets/rightArrow.png";

export function Header (){
  const [showModal, setShowModal] = useState(false)
  const [showModalManga, setShowModalManga] = useState(false);
  return (
    <header id="encabezado" className="border-b-3 border-purple-600 p-3">
      <div id="secciones" className="flex relative items-center">

        <Link to={`/`}>
          <p className="text-purple-600">AnimelistLogo</p>  
        </Link>

        <div
          className="relative"
          onMouseEnter={() => setShowModal(true)}
          onMouseLeave={() => setShowModal(false)}
        >
          <p className="text-purple-600 px-4 py-2 hover:bg-white cursor-pointer">
            Anime
          </p>

          {showModal && (
            <div className="absolute top-full left-0 bg-white flex flex-col w-40 shadow-md z-50">

              <Link
                to={`/search/anime`}
                className="block font-[fuente] font-bold text-purple-600 py-3 px-4 border-b hover:bg-purple-600 hover:text-white"
              >
                Search anime
              </Link>

              <span className="block font-[fuente] font-bold text-purple-600 py-3 px-4 hover:bg-purple-600 hover:text-white">
                Top Anime
              </span>

            </div>
          )}
        </div>

        <div
          className="relative"
          onMouseEnter={() => setShowModalManga(true)}
          onMouseLeave={() => setShowModalManga(false)}
        >
          <p className="text-purple-600 px-4 py-2 hover:bg-white cursor-pointer">
            Manga
          </p>

          {showModalManga && (
            <div className="absolute top-full left-0 bg-white flex flex-col w-40 shadow-md z-50">

              <Link
                to={`/search/manga`}
                className="block font-[fuente] font-bold text-purple-600 py-3 px-4 border-b hover:bg-purple-600 hover:text-white"
              >
                Search Manga
              </Link>

              <span className="block font-[fuente] font-bold text-purple-600 py-3 px-4 hover:bg-purple-600 hover:text-white">
                Top Manga
              </span>

            </div>
          )}
        </div>
        <p className="text-purple-600 px-4">my list</p>

      </div>

      <button id="login">Login</button>
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
                <p className="score">Score: {anime.score}⭐</p>
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
                 <div className="moreInfoContainer">
                <p className="score">Score: {manga.score}⭐</p>
                <Link to={`/manga/${manga.mal_id}`}>
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

import {useEffect,useState} from "react";
import { useParams,Link } from "react-router-dom";
import { supabase } from "../supabaseClient"
import image from "./assets/rightArrow.png";
export function Header (){
  const [showModal, setShowModal] = useState(false)
  const [showModalManga, setShowModalManga] = useState(false);
  const [showUser,setShowUser] = useState(false)
  const [user, setUser] = useState(null)
   useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })


    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])
  return (
    <header id="encabezado" className="flex justify-between border-b-3 border-purple-600 p-3 font-[fuente] max-md:text-[1.5vh]">
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
              <Link
              to={`/top/anime`}
                className="block font-[fuente] font-bold text-purple-600 py-3 px-4 border-b hover:bg-purple-600 hover:text-white">
              Top anime
              </Link>
              

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
             <Link
              to={`/top/manga`}
                className="block font-[fuente] font-bold text-purple-600 py-3 px-4 border-b hover:bg-purple-600 hover:text-white">
              Top Manga
              </Link>
              

            </div>
          )}
        </div>
        <Link to={"/mylist"} className="text-purple-600 px-4 w-20">
        my list
        </Link>

      </div>
      {user ?(
        <div className="flex items-center flex-col"  onMouseEnter={() => setShowUser(true)} onMouseLeave={() => setShowUser(false)}>
        <p className=" cursor-pointer text-purple-600 text-center  hover:bg-white text-2xl py-2 px-4"> {user.user_metadata.user_name}</p>
        {showUser && (
        <div className="absolute w-40 top-15 right-1 bg-white">
        <p className=" cursor-pointer  block font-[fuente] font-bold text-purple-600 py-3 px-4 border-b hover:bg-purple-600 hover:text-white"> Edit profile </p>
        <p onClick={handleLogout} className=" cursor-pointer  block font-[fuente] font-bold text-purple-600 py-3 px-4 border-b hover:bg-purple-600 hover:text-white"> Log out</p>
        </div>
        )}
        
        </div>
      ) :(
      <Link  to={"/login"} id="login" className="w-20 h-8 bg-purple-700 text-white rounded-lg hover:bg-white hover:text-purple-700 transition-all duration-1000 border-2 border-black cursor-pointer text-center">Login
      </Link>)}
    </header>
  )
}
async function handleLogout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.log(error)
  }
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
  <div>
  <h2 className="text-purple-600 font-['Jim_Nightshade'] text-center text-5xl">
    Best Airing Animes 2026
  </h2>

  <div className="w-full flex justify-center mb-2">
    <div className="w-4/5">
      <div className="flex items-center max-md:flex-col">
        
        <img
          src={anime.images.jpg.image_url}
          alt={anime.title}
          className="rounded-lg max-md:mt-3"
        />

        <div className="ml-4">
          <h2 className="text-purple-600 text-2xl font-[fuente] max-md:text-center">
            {anime.title}
          </h2>

          <div className="flex max-md:flex-col max-md:items-center max-md:text-center">
            <p className="font-[fuente] mr-2 mb-0">
              {anime.synopsis}
            </p>
          <div className="max-md:flex max-md:flex-col-reverse max-md:items-center">
            <img
              src={image}
              className="cursor-pointer h-40 max-md:h-20 max-md:object-cover "
              onClick={nextAnime}
            />

          <div className="flex items-center gap-4 mt-3 max-md:flex-col">
            <p className="text-purple-600 text-2xl font-[fuente]">
              Score: {anime.score}⭐
            </p>

            <Link to={`/anime/${anime.mal_id}`}>
              <button className=" cursor-pointer border-2 border-black w-20 h-8 bg-purple-700 text-white rounded-lg hover:bg-white hover:text-purple-700 transition-all duration-1000">
                more info
              </button>
            </Link>
          </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</div>
    )
}

export function Manga() {
  const [mangas, setMangas] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const res = await fetch(
        "https://api.jikan.moe/v4/top/manga?filter=publishing&limit=5"
      );
      const dataManga = await res.json();
      setMangas(dataManga.data);
    };
    getData();
  }, []);

  const nextManga = () => {
    setIndex((prev) => (prev + 1) % mangas.length);
  };

  if (mangas.length === 0) {
    return <p>Cargando...</p>;
  }

  let manga = mangas[index];

  return (
    <div>
      <h2 className="text-purple-600 font-['Jim_Nightshade'] text-center text-5xl max-md:text-3xl">
        Best Airing Mangas 2026
      </h2>

      <div className="w-full flex justify-center mb-2">
        <div className="w-4/5">
          <div className="flex items-center max-md:flex-col">

            <img
              src={manga.images.jpg.image_url}
              alt={manga.title}
              className="rounded-lg max-md:mt-3 max-md:w-40"
            />

            <div className="ml-4 max-md:ml-0 max-md:text-center">
              <h2 className="text-purple-600 text-2xl font-[fuente] max-md:text-center">
                {manga.title}
              </h2>

              <div className="flex max-md:flex-col max-md:items-center">
                <p className="font-[fuente] mr-2 mb-0 max-md:mb-2">
                  {manga.synopsis}
                </p>

                <img
                  src={image}
                  className="cursor-pointer h-40 max-md:h-20 max-md:object-cover"
                  onClick={nextManga}
                />
              </div>

              <div className="flex items-center gap-4 mt-3 max-md:flex-col">
                <p className="text-purple-600 text-2xl font-[fuente]">
                  Score: {manga.score}⭐
                </p>

                <Link to={`/manga/${manga.mal_id}`}>
                  <button className="cursor-pointer border-2 border-black w-20 h-8 bg-purple-700 text-white rounded-lg hover:bg-white hover:text-purple-700 transition-all duration-1000">
                    more info
                  </button>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

 
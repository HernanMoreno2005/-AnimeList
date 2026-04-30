import {useEffect,useState} from "react";
import { useParams,Link } from "react-router-dom";
import { supabase } from "../supabaseClient"
import image from "./assets/rightArrow.png";
import imageMenu from "./assets/menu.png"
import "./assets/index.css";
export function Header (){
  const [showModal, setShowModal] = useState(false)
  const [showModalManga, setShowModalManga] = useState(false);
  return (
    <div>
     <div>
     <MenuPhone/>
     </div> 
    <header id="encabezado" className="flex justify-between border-b-3 items-center border-purple-600 p-3 font-[fuente] max-md:text-[1.5vh] ocultar-en-mobile">
      <div id="secciones" className="flex relative items-center">
      
        <Link to={`/`}>
          <p className="text-purple-600">AnimelistLogo</p>  
        </Link>
        
        <div
          className="relative"
          onMouseEnter={() => setShowModal(true)}
          onMouseLeave={() => setShowModal(false)}
        >
          <button className="text-purple-600 px-4 py-2 hover:bg-white cursor-pointer">
            Anime
          </button>

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
          <button className="text-purple-600 px-4 py-2 hover:bg-white cursor-pointer">
            Manga
          </button>

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
        <Link to={"/mylist"} className="text-purple-600 px-4 py-2 w-20 hover:bg-white">
        my list
        </Link>

      </div>
       <BotonLogin />
    </header>
    </div>
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
    return (
    <div>
      <h2 className="text-purple-600 font-['Jim_Nightshade'] text-center text-5xl">
        Best Airing Animes 2026
      </h2>

      <div className="w-full flex justify-center mb-2">
        <div className="w-4/5">
          <div className="flex items-center max-md:flex-col animate-pulse">
            
            <div className="bg-gray-700 w-48 h-80 rounded max-md:mt-3"></div>

            <div className="ml-4 w-full">
              <div className="bg-gray-700 h-6 w-48 mb-4 rounded max-md:mx-auto"></div>

              <div className="flex max-md:flex-col max-md:items-center">
                <div className="bg-gray-700 h-20 w-full rounded mb-2"></div>

                <div className="bg-gray-700 h-40 w-24 rounded"></div>
              </div>

              <div className="flex items-center gap-4 mt-3 max-md:flex-col">
                <div className="bg-gray-700 h-6 w-24 rounded"></div>
                <div className="bg-gray-700 h-8 w-20 rounded"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
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
            <img
              src={image}
              className="cursor-pointer h-40 max-md:h-20 max-md:object-cover "
              onClick={nextAnime}
            />
          </div>
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
     return (
    <div>
      <h2 className="text-purple-600 font-['Jim_Nightshade'] text-center text-5xl max-md:text-3xl">
        Best Airing Mangas 2026
      </h2>

      <div className="w-full flex justify-center mb-2">
        <div className="w-4/5">
          <div className="flex items-center max-md:flex-col animate-pulse">

            <div className="bg-gray-700 w-48 h-80 rounded max-md:mt-3 max-md:w-40"></div>

            <div className="ml-4 w-full max-md:ml-0">
              <div className="bg-gray-700 h-6 w-48 mb-4 rounded max-md:mx-auto"></div>

              <div className="flex max-md:flex-col max-md:items-center">
                <div className="bg-gray-700 h-20 w-full rounded mb-2"></div>

                <div className="bg-gray-700 h-40 w-24 rounded"></div>
              </div>

              <div className="flex items-center gap-4 mt-3 max-md:flex-col">
                <div className="bg-gray-700 h-6 w-24 rounded"></div>
                <div className="bg-gray-700 h-8 w-20 rounded"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
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

function MenuPhone() {
  const [showModal, setShow] = useState(false);
  const [menuAnime,setMenuAnime] = useState(false);
  const [menuManga,setMenuManga] = useState(false);
  return (
    <div className="mt-15 font-[fuente] viewPhone">
      
     
       
      <img
        src={imageMenu}
        onClick={() => setShow(prev => !prev)}
        className="w-15 absolute right-1 top-1 cursor-pointer"
      />
     

      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setShow(false)}
        />
      )}


      <div
        className={`
          fixed top-0 right-0 h-full w-64 bg-white z-50 border-l-3 border-l-purple-600
          transform transition-transform duration-300
          ${showModal ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-4 flex flex-col gap-4 text-purple-600">
          <div className="flex justify-end">
           <BotonLogin/>
           </div>
           <Link to={"/"} className="text-xl font-bold text-center">
          AnimeLogo
          </Link>

          <button
            onClick={() => {setMenuAnime(!menuAnime)}}
            className="w-full text-left text-lg font-semibold bg-purple-100 hover:bg-purple-200 p-4 rounded-xl"
          >
            Anime
          </button>

          {menuAnime && (
            <div className="flex flex-col gap-2 ml-2">
              <Link to={`/search/anime`} className="bg-purple-50 p-3 rounded-lg text-left inline-block">
                Search Anime
              </Link>
              <Link to={`/top/anime`} className="bg-purple-50 p-3 rounded-lg text-left">
                Top Anime
              </Link>
            </div>
          )}

          <button
            onClick={() => {setMenuManga(!menuManga)}}
            className="w-full text-left text-lg font-semibold bg-purple-100 hover:bg-purple-200 p-4 rounded-xl"
          >
            Manga
          </button>

          {menuManga && (
            <div className="flex flex-col gap-2 ml-2">
              <Link to={`/search/manga`} className="bg-purple-50 p-3 rounded-lg text-left">
                Search Manga
              </Link>
              <Link to={`/top/manga`} className="bg-purple-50 p-3 rounded-lg text-left">
                Top Manga
              </Link>
            </div>
          )}
          <Link to={"/mylist"} className="w-full text-left text-lg font-semibold bg-purple-100 hover:bg-purple-200 p-4 rounded-xl">
            My List
          </Link>

        </div>
      </div>
    </div>
  );
}

function BotonLogin(){
  const [user, setUser] = useState(null)
  const [showUser,setShowUser] = useState(false)
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
  return(
    <div>
{user ? (
        <div className="flex items-center flex-col"  onMouseEnter={() => setShowUser(true)} onMouseLeave={() => setShowUser(false)}>
        <p className=" cursor-pointer text-purple-600 text-center  hover:bg-white text-2xl py-2 px-4"> {user.user_metadata.user_name}</p>
        {showUser && (
        <div className="absolute w-40 top-15 right-1 bg-white z-50">
        <p className=" cursor-pointer  block font-[fuente] font-bold text-purple-600 py-3 px-4 border-b hover:bg-purple-600 hover:text-white"> Edit profile </p>
        <p onClick={handleLogout} className=" cursor-pointer  block font-[fuente] font-bold text-purple-600 py-3 px-4 border-b hover:bg-purple-600 hover:text-white"> Log out</p>
        </div>
        )}
        
        </div>
      ) :(
      <Link  to={"/login"} id="login" className="w-20 px-4 py-2 h-8 bg-purple-700 text-white rounded-lg hover:bg-white hover:text-purple-700 transition-all duration-1000 border-2 border-black cursor-pointer text-center">Login
      </Link>)}
  </div>
  )
}
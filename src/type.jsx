import { useState, useEffect, Fragment,useCallback } from "react"
import { Menu, Transition } from "@headlessui/react";
import { supabase } from '../supabaseClient'
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { generatePath, Link, useParams,useSearchParams} from "react-router-dom"
import flechaIzquierda from "./assets/flechaIzquierda.png";
import flechaDerecha from "./assets/flechaDerecha.png";
import flechaIzquierdaHover from "./assets/flechaIzquierdaHover.png";
import flechaDerechaHover from "./assets/flechaDerechaHover.png";
import Tilt from "react-parallax-tilt";
export function GenresThemes({top}) {
  const [list, setList] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [status,setStatus] = useState("any");
  const [searchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const [order,setOrder] = useState("Members");
  const [user, setUser] = useState(null)
  const [myList, setMyList] = useState([]);
  const [idUse, setId] = useState("id_anime");
  const [myLists, setMyLists] = useState("listAnime");
  const [added,setAdded] = useState("Add to list")
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  let id,name,type;
  let url;
  const handleAddToList = async (type, mal_id, title, user) => {
  await MyList(type, mal_id, title, user);

  const idField = type === "anime" ? "id_anime" : "id_manga";

  const exists = myList.some(item => item[idField] === mal_id);
  if (exists) return;
  setMyList(prev => [...prev, { [idField]: mal_id }]);
};


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
  useEffect(() => {
  if (type === "manga") {
    setMyLists("listManga");
    setId("id_manga");
  } else {
    setMyLists("listAnime");
    setId("id_anime");
  }
}, [type]);
  useEffect(() => {
  const fetchList = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from(myLists)
      .select(idUse)
      .eq("id_user", user.id);

    if (error) {
      console.log(error);
      return;
    }

    setMyList(data || []);
  };

  fetchList();
}, [user, myLists, idUse]);
  if(!top){
    ({ id, name, type } = useParams());
    if(status != "any"){
      url = `https://api.jikan.moe/v4/${type}?status=${status}&genres=${id}&order_by=${order}&sort=desc&limit=25&page=${page}`;
    }
    else{
      url = `https://api.jikan.moe/v4/${type}?genres=${id}&order_by=${order}&sort=desc&limit=25&page=${page}`;
    }
  }
  else{
    ({type} = useParams());
    name = "Top " + type;
    if(status != "any"){
     url= `https://api.jikan.moe/v4/${type}?status=${status}&order_by=${order}&sort=desc&limit=25&page=${page}`;
    }
    else{
     url = `https://api.jikan.moe/v4/${type}?order_by=${order}&sort=desc&limit=25&page=${page}`;
    }
    
  }
   const labels = {
  Members: "Members",
  Score: "Score",
  Episodes: "Episodes",
  Chapters: "Chapters",
};

const label =
  order === "Members"
    ? "Members"
    : order === "Score"
    ? "Score"
    : order === "Episodes"
    ? "Episodes"
    : order === "Chapters"
    ? "Chapters"
    : "Score";
    useEffect(() => {
  setStatus("any");
  setOrder("Members"); 
}, [type]);
 useEffect(() => {
  setList([]);
  setVisible(false);
  setLoading(true); 

  setTimeout(() => {
    setVisible(true);
  }, 50);

  const timeout = setTimeout(() => {
    fetch(url)
      .then(res => res.json())
      .then(res => {
        const unique = Array.from(
          new Map(res.data.map(item => [item.mal_id, item])).values()
        );

        setList(unique);
        setLastPage(res.pagination.last_visible_page);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false); 
      });
  }, 500);

  return () => clearTimeout(timeout);
}, [id, page, order, status, type, url]);

  return (
    <div>
      <div id="titleContainer" className="w-full  flex justify-end text-2xl text-purple-600  font-[fuente] items-center">
      <h1 className=" absolute left-1/2 -translate-x-1/2 text-center font-[fuente] text-4xl text-purple-600 mt-auto max-md:top-3 max-md:left-46">
        {name}
      </h1>
      <div className="flex flex-col items-center">
      <div className="flex gap-2 my-3 max-md:mb-15 max-md:mt-10 ">
      <p>Order by</p>
  <Menu as="div" className=" inline-block text-left">
  <Menu.Button className="inline-flex items-center gap-2 rounded-xl 
  bg-purple-600 px-4 py-2 text-sm font-[fuente] text-white
  shadow-[0_0_10px_rgba(139,92,246,0.5)]
  hover:bg-purple-500 transition focus:outline-none">

  {label}

  <ChevronDownIcon className="w-5 h-5 text-purple-200" />
</Menu.Button>

  <Transition
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="opacity-0 scale-95"
    enterTo="opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="opacity-100 scale-100"
    leaveTo="opacity-0 scale-95"
  >
    <Menu.Items className="absolute right-0 mt-2 w-50 origin-top-right  z-50
    rounded-xl bg-purple-600/90
    border border-white/10
    shadow-[0_0_15px_rgba(139,92,246,0.4)]
    focus:outline-none">

      <div className="p-1">

        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => setOrder("Members")}
              className={`${
                active ? "bg-purple-500 text-white" : "text-white/80"
              } group flex w-full items-center rounded-lg px-3 py-2 text-2x1 transition`}
            >
               Members👥
               
            </button>
          )}
        </Menu.Item>


        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => setOrder("Score")}
              className={`${
                active ? "bg-purple-500 text-white" : "text-white/80"
              } group flex w-full items-center rounded-lg px-3 py-2 text-2x1 transition`}
            >
               Score⭐
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
  {({ active }) => (
    <button
      onClick={() =>
        setOrder(type === "anime" ? "Episodes" : "Chapters")
      }
      className={`${
        active ? "bg-purple-500 text-white" : "text-white/80"
      } group flex w-full items-center rounded-lg px-3 py-2 text-2xl transition`}
    >
      {type === "anime" ? "Episodes 🎬" : "Chapters 📖"}
    </button>
  )}
</Menu.Item>

      </div>
    </Menu.Items>
  </Transition>
</Menu>
      
</div>
<div className=" flex gap-3">
<p> Status: </p>
<p
  onClick={() => {
    setStatus("any");
  }}
  className={`cursor-pointer hand-underline ${status === "any" ? "active" : ""}`}
>
  Any
</p>
<p>/</p>
<p
  onClick={() => {
    setStatus("complete");
  }}
  className={`cursor-pointer hand-underline ${status === "complete" ? "active" : ""}`}
>
  Complete
</p>
<p>/</p>
<p
  onClick={() => {
    const value = type === "anime" ? "airing" : "publishing";
    setStatus(value);
  }}
  className={`cursor-pointer hand-underline ${
    status === (type === "anime" ? "airing" : "publishing")
      ? "active"
      : ""
  }`}
>
  {type === "anime" ? "Airing" : "Publishing"}
</p>
</div>
</div>
      </div>
      <div className="flex justify-center">
       <div key={type}  className="grid grid-cols-5 max-md:flex max-md:flex-col max-md:items-center">

  {loading
    ? Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="m-4 max-md:w-80 animate-pulse">
          <div className="flex flex-col items-center rounded-2xl p-2 border border-white/10 h-130">


            <div className="w-full h-[260px] md:h-[350px] bg-gray-700 rounded-2xl mb-3"></div>

  
            <div className="w-full h-4 bg-gray-700 rounded mb-2"></div>
            <div className="w-3/4 h-4 bg-gray-700 rounded mb-4"></div>

  
            <div className="mt-auto flex gap-2">
              <div className="w-28 h-10 bg-gray-700 rounded-2xl"></div>
              <div className="w-28 h-10 bg-gray-700 rounded-2xl"></div>
            </div>

          </div>
        </div>
      ))
    : list.map((l) => (
        <AnimeCard
          key={l.mal_id}
          l={l}
          type={type}
          myList={myList}
          idUse={idUse}
          user={user}
          handleAddToList={handleAddToList}
          getRankColor={getRankColor}
        />
      ))
  }

</div>
      </div>

      <Pagination lastPage={lastPage} page={page} />
    </div>
  );
}

export function Pagination({ lastPage, page }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);
  const section = Math.trunc((page - 1) / 5);
  const startPage = section * 5 + 1;
  const isMobile = useIsMobile();
  const pages = [];

  for (let i = 0; i < 5; i++) {
    const currentPage = startPage + i;

    if (currentPage > lastPage) break;

    const start = (currentPage - 1) * 25 + 1;
    const finish = currentPage * 25;

    pages.push(
      <button
        key={currentPage}
        onClick={() => setSearchParams({ page: currentPage })}
        className={`px-3 py-2 rounded-2xl border-2 font-[fuente] cursor-pointer max-md:w-13 max-md:px-1 max-md:py-1 whitespace-nowrap ${
          currentPage === page
            ? "bg-purple-600 text-white border-black"
            : "bg-white text-purple-600 border-gray-400 hover:bg-purple-100"
        }`}
      >
        {isMobile ? currentPage : `${start} - ${finish}`}
      </button>
    );
  }

return (
    <div className="flex justify-center gap-2 items-center my-5">

      <button
        disabled={startPage === 1}
        onClick={() => setSearchParams({ page: startPage - 1 })}
        onMouseEnter={() => setHoverLeft(true)}
        onMouseLeave={() => setHoverLeft(false)}
        className={`w-12 h-10 rounded border transition-all duration-300 ease-in-out
          ${hoverLeft ? "bg-purple-600" : "bg-white"}
          disabled:opacity-50 disabled:cursor-default cursor-pointer`}
        style={{
          backgroundImage: `url(${hoverLeft ? flechaIzquierdaHover : flechaIzquierda})`,
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />


      {pages}

      <button
        disabled={startPage + 5 > lastPage}
        onClick={() => setSearchParams({ page: startPage + 5 })}
        onMouseEnter={() => setHoverRight(true)}
        onMouseLeave={() => setHoverRight(false)}
        className={`w-12 h-10 rounded border transition-all duration-300 ease-in-out
          ${hoverRight ? "bg-purple-600" : "bg-white"}
          disabled:opacity-50 disabled:cursor-default cursor-pointer`}
        style={{
          backgroundImage: `url(${hoverRight ? flechaDerechaHover : flechaDerecha})`,
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />

    </div>
  );
}
function getRankColor(rank) {
  if (rank === 1) return "bg-yellow-400 text-black"; 
  if (rank === 2) return "bg-gray-300 text-black";   
  if (rank === 3) return "bg-amber-600 text-white";  

  return "bg-purple-600 text-white"; 
}
import React from "react";


const AnimeCard = React.memo(function AnimeCard({
  l,
  type,
  myList,
  idUse,
  user,
  handleAddToList,
  getRankColor
}) {
  const isAdded = myList.some(item => item[idUse] === l.mal_id);

  return (
   <Tilt
  tiltMaxAngleX={3}
  tiltMaxAngleY={3}
  transitionSpeed={1200}
  className="m-4 max-md:w-80 transition-all duration-500 ease-in-out"
>
  <div className="flex flex-col items-center rounded-2xl p-2 border border-white/10
  shadow-[0_0_10px_rgba(255,255,255,0.05),0_0_30px_rgba(139,92,246,0.4)] h-130 ">

   
    <div className="w-full mb-3">
      <MediaCard
        anime={l}
        type={type}
        onDelete={null} 
      />
    </div>



    <p className="text-center font-[fuenteTexto] mt-3 text-sm px-2">
      {getFirstSentence(l.synopsis)}
    </p>


    <div className="mt-auto mb-2 flex items-center gap-2">
      <Link
        to={`/${type}/${l.mal_id}`}
        className="font-[fuente] bg-white text-purple-600 w-28 md:w-30 rounded-2xl p-2 border-black border-2
        hover:bg-purple-200 transition text-center text-sm"
      >
        More Info
      </Link>

      <button 
        onClick={() => handleAddToList(type, l.mal_id, l.title, user)}
        className="font-[fuente] cursor-pointer bg-white text-purple-600 w-28 md:w-30 rounded-2xl p-2 border-black border-2 hover:bg-purple-200 transition text-sm"
      >
        {
          myList.some(item => item[idUse] === l.mal_id)
            ? "On your list"
            : "Add to list"
        }
      </button>
    </div>

  </div>
</Tilt>
  );
});

export default AnimeCard;
export async function MyList(type, id, name, user) {
  if (!user) {
    alert("login for add the anime in your list")
    return
  }

  if (type === "anime") {

    const { error: errorAnime } = await supabase
      .from("anime")
      .upsert(
        [{ id, name }],
        { onConflict: 'id', ignoreDuplicates: true }
      )

    if (errorAnime) {
      console.log("Error anime:", errorAnime)
      return
    }

    const { error: errorList } = await supabase
      .from("listAnime")
      .upsert(
        [{ id_user: user.id, id_anime: id }],
        { onConflict: 'id_user,id_anime', ignoreDuplicates: true }
      )

    if (errorList) {
      console.log("Error listAnime:", errorList)
    }

  } else {


    const { error: errorManga } = await supabase
      .from("manga")
      .upsert(
        [{ id, name }],
        { onConflict: 'id', ignoreDuplicates: true }
      )

    if (errorManga) {
      console.log("Error manga:", errorManga)
      return
    }


    const { error: errorList } = await supabase
      .from("listManga")
      .upsert(
        [{ id_user: user.id, id_manga: id }],
        { onConflict: 'id_user,id_manga', ignoreDuplicates: true }
      )

    if (errorList) {
      console.log("Error listAnime:", errorList)
    }
  }
}
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
function getFirstSentence(text) {
  if (!text) return "";

  const index = text.indexOf(".");
  
  if (index === -1) return text; 
  
  return text.slice(0, index + 1);
}


export function MediaCard({ anime, type, onDelete }) {
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isActive = isMobile ? expanded : false;

  return (
    <div
      className="relative overflow-hidden rounded-2xl h-[260px] sm:h-[300px] md:h-[350px] group cursor-pointer"
      onClick={() => {
        if (isMobile) setExpanded(!expanded);
      }}
    >


      <img
        src={anime.images.jpg.large_image_url}
        className={`absolute inset-0 w-full h-full transition duration-500
        ${isActive ? "opacity-0" : "blur-xl scale-110"}`}
        alt=""
      />


      <img
        src={anime.images.jpg.large_image_url}
        alt={anime.title}
        className={`absolute inset-0 w-full h-full transition duration-500 border-4 border-white rounded-2xl
        ${
          isMobile
            ? isActive
              ? "object-cover scale-100"
              : "object-contain"
            : "object-contain md:group-hover:opacity-0"
        }`}
      />


      <img
        src={anime.images.jpg.large_image_url}
        alt={anime.title}
        className={`absolute inset-0 w-full h-full transition duration-500
        ${
          isMobile
            ? isActive
              ? "opacity-100 object-cover scale-100"
              : "opacity-0"
            : "opacity-0 object-cover scale-110 md:group-hover:opacity-100 md:group-hover:scale-100"
        }`}
      />


      <div
        className={`absolute inset-0 bg-black/70 flex flex-col justify-end p-3 rounded-2xl transition
        ${
          isMobile
            ? isActive
              ? "opacity-100"
              : "opacity-100" 
            : "opacity-0 md:group-hover:opacity-100"
        }`}
      >
        <h2 className="text-white text-sm md:text-lg font-bold line-clamp-2">
          {anime.title}
        </h2>

        <p className="text-gray-300 text-xs md:text-sm">
          ⭐ {anime.score || "N/A"}
        </p>

        <p className="text-gray-300 text-xs md:text-sm">
          👥 {anime.members?.toLocaleString() || "N/A"}
        </p>

        {type === "anime" ? (
          <p className="text-gray-300 text-xs md:text-sm">
            Episodes: {anime.episodes}
          </p>
        ) : (
          <p className="text-gray-300 text-xs md:text-sm">
            Chapters: {anime.chapters}
          </p>
        )}
      </div>

      <div
        className={`absolute top-2 right-2 z-20 
        ${getRankColor(anime.rank)}
        text-xs md:text-sm font-bold px-2 py-1 rounded-full
        transition
        ${
          isMobile
            ? "opacity-100"
            : "opacity-100 md:group-hover:opacity-0"
        }`}
      >
        #{anime.rank ?? "?"}
      </div>
    </div>
  );
}
import { useState, useEffect, Fragment } from "react"
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
  let id,name,type;
  let url;
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
  setOrder("members"); 
}, [type]);
  useEffect(() => {
    setList([]);
    const timeout = setTimeout(() => {
      fetch(url)
        .then(res => res.json())
        .then(res => {
  const unique = Array.from(
    new Map(res.data.map(item => [item.mal_id, item])).values()
  );

  setList(unique);
  setLastPage(res.pagination.last_visible_page);
});
    }, 500);

    return () => clearTimeout(timeout);
  }, [id, page,order,status,type,url]);

  return (
    <div>
      <div id="titleContainer" className="w-full  flex justify-end text-2xl text-purple-600  font-[fuente] items-center">
      <h1 className=" absolute left-1/2 -translate-x-1/2 text-center font-[fuente] text-4xl text-purple-600 mt-auto">
        {name}
      </h1>
      <div className="flex flex-col items-center">
      <div className="flex gap-2 my-3">
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
        <div className="grid grid-cols-5">
          {list.map(l => (
            
            <Tilt
              key={l.mal_id}
              tiltMaxAngleX={3}
              tiltMaxAngleY={3}
              transitionSpeed={1200}
              className="m-4"
            >
             <div className="relative group h-full rounded-2xl p-[1px] bg-white">


  <div className="absolute inset-0 rounded-2xl group-hover:opacity-100 transition duration-500"></div>


  <div className="relative flex flex-col items-center h-full rounded-2xl p-2 border border-white/10
  shadow-[0_0_10px_rgba(255,255,255,0.05),0_0_30px_rgba(139,92,246,0.4)]">
 <div
  className={`absolute top-2 right-2 z-10 
  ${getRankColor(l.rank)}
  text-sm font-bold 
  px-3 py-1 rounded-full
  shadow-[0_0_10px_rgba(0,0,0,0.3)]
  transition-all duration-300
  group-hover:opacity-0`}
>
  #{l.rank ?? "?"} 🌍
</div>
    <h2 className="font-[fuente] text-2xl text-center max-w-full overflow-x-auto whitespace-nowrap scrollbar-thin overflow-y-hidden p-2">
      {l.title}
    </h2>

    <div className="flex gap-2 flex-wrap mt-3">
      {l.genres?.map(g => (
        <span className="font-[fuenteTexto] " key={g.mal_id}>
          {g.name}
        </span>
      ))}
    </div>

    <img
      src={l.images.jpg.image_url}
      className="h-48 mt-auto mb-3 rounded-lg"
    />

    <div className="flex flex-col items-center">
      <p className="text-2xl font-[fuenteTexto]">
        Score: {l.score ?? "N/A"} ⭐
      </p>
      <p className="text-2xl font-[fuenteTexto]">
       {
          type === "anime"
            ? `Episodes: ${l.episodes ?? "???"} 🎬​`
            : `Chapters: ${l.chapters ?? "???"}  📖​`
       }
      </p>
      <p className="text-2xl font-[fuenteTexto]">
        Members: {l.members.toLocaleString()} 👥
      </p>
    </div>

    <p className="text-center font-[fuenteTexto] max-h-30 overflow-y-auto ">
      {l.synopsis}
    </p>

    <div className="mt-auto mb-3 flex items-center gap-2">
      <Link
        to={`/${type}/${l.mal_id}`}
        className="font-[fuente] bg-white text-purple-600 w-30 rounded-2xl mt-2 p-2.5 border-black border-2
        hover:bg-purple-200 transition text-center"
      >
        More Info
      </Link>

      <button onClick={() => MyList(type,l.mal_id,l.title,user)} className="font-[fuente] cursor-pointer bg-white text-purple-600 w-30 rounded-2xl mt-2 p-2.5 border-black border-2
      hover:bg-purple-200 transition">
        Add MyList
      </button>
    </div>
  </div>
</div>
            </Tilt>

          ))}
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
        className={`px-3 py-2 rounded-2xl border-2 font-[fuente] cursor-pointer ${
          currentPage === page
            ? "bg-purple-600 text-white border-black"
            : "bg-white text-purple-600 border-gray-400 hover:bg-purple-100"
        }`}
      >
        {start} - {finish}
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
async function MyList(type, id, name, user) {
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
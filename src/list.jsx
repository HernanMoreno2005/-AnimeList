import {useEffect,useState} from "react";
import { supabase } from '../supabaseClient'
import Tilt from "react-parallax-tilt";
import image from "./assets/xShuriken.png";
export function List() {
  const [type, setType] = useState("anime")
  const [lists,setLists] = useState("listAnime")
  const [animes, setAnimes] = useState([])
  const [user, setUser] = useState(null)
  const [idUse,setId] = useState("id_anime")
  const [showModal, setShowModal] = useState(false)
  const [deleteData, setDeleteData] = useState(null)
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

  const fetchAnimes = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from(lists)
        .select(idUse)
        .eq("id_user", user.id)

      if (error) {
        console.log(error)
        return
      }

      if (!data || data.length === 0) {
        setAnimes([])
        return
      }

      try {
        const results = await Promise.all(
          data.map(async (item) => {
            try {
              const res = await fetch(
                `https://api.jikan.moe/v4/${type}/${item[idUse]}`
              )
              const json = await res.json()
              return json.data
            } catch {
              return null
            }
          })
        )

        setAnimes(results.filter(Boolean))
      } catch (err) {
        console.log(err)
      }
    }
  useEffect(() => {
    console.log(type)
    fetchAnimes()
  }, [user, type])
  
  return (
    <div>
      <h1 className="text-purple-600 text-center text-2xl">
        MY LIST
      </h1>

      <div className=" flex justify-center mt-3 text-2xl text-purple-600 gap-2 font-[fuente]">
        <p onClick={ () => {setType("anime"),setLists("listAnime"),setId("id_anime")}} className= {` cursor-pointer hand-underline ${type === "anime" ? "active" : ""}`}>
          Anime
        </p>
        <p>//</p>
        <p onClick={() => {setType("manga"),setLists("listManga"),setId("id_manga")}} className= {` cursor-pointer  hand-underline  ${type === "manga" ? "active" : ""}`}>
          Manga
        </p>
      </div>

      <div className="grid grid-cols-5 gap-6 p-6">
        {animes.map((anime) => (
 <Tilt
    key={anime.mal_id}
    tiltMaxAngleX={5}
    tiltMaxAngleY={5}
    transitionSpeed={800}
    className="relative group cursor-pointer overflow-hidden rounded-2xl h-[350px]"
  >
    <img
      src={anime.images.jpg.large_image_url}
      className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
      alt=""
    />


    <img
      src={anime.images.jpg.large_image_url}
      alt={anime.title}
      className="absolute inset-0 w-full h-full object-contain transition duration-300 group-hover:opacity-0 border-4 border-white rounded-2xl"
    />

  
    <img
      src={anime.images.jpg.large_image_url}
      alt={anime.title}
      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-300 scale-110 group-hover:scale-100"
    />


  <div
    className={`absolute top-2 right-2 z-20 
    ${getRankColor(anime.rank)}
    text-sm font-bold 
    px-3 py-1 rounded-full
    shadow-[0_0_10px_rgba(0,0,0,0.3)]
    transition-all duration-300
    opacity-0 group-hover:opacity-100`}
  >
    #{anime.rank ?? "?"} 🌍
  </div>
<img
  src={image}
  className="absolute inset-0 w-8 h-8 top-2 left-2 object-contain opacity-0 group-hover:opacity-100 z-50"
  onClick={() => {
  setDeleteData({ lista: lists, idUser: user.id, id: anime.mal_id, sel: idUse })
  setShowModal(true)
}}

/>   
    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4  rgb-hover rounded-2xl">
    
      <h2 className="text-white text-lg font-bold">
        {anime.title}
      </h2>

      <p className="text-gray-300 text-sm">
        ⭐ {anime.score || "N/A"}
      </p>

      <p className="text-gray-300 text-sm line-clamp-2">
        {anime.genres.map(g => g.name).join(", ")}
      </p>
      <p className="text-gray-300 text-sm">
        {anime.rating}
      </p>
    </div>
  </Tilt>
))}
{showModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]">
    <div className="bg-white p-6 rounded-xl">
      <h2 className="text-2xl font-[fuente] text-purple-600">Do you want delete anime/manga from your list?</h2>
    <div className="flex justify-around"> 
      <button
        className="border-4 p-2 font-[fuente] w-20 rounded-2xl mt-3 cursor-pointer hover:text-purple-600 hover:border-purple-600"
        onClick={ async () => {
          await deleteList(deleteData.lista, deleteData.idUser, deleteData.id, deleteData.sel)
          setShowModal(false)
          fetchAnimes()
        }}
      >
        Yes
      </button>

      <button 
      className="border-4 p-2 font-[fuente] w-20 rounded-2xl mt-3 cursor-pointer hover:text-purple-600 hover:border-purple-600"
      onClick={() => setShowModal(false)}>
        No
      </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  )
}
function getRankColor(rank) {
  if (rank === 1) return "bg-yellow-400 text-black"; 
  if (rank === 2) return "bg-gray-300 text-black";   
  if (rank === 3) return "bg-amber-600 text-white";  

  return "bg-purple-600 text-white"; 
}


function modalDelete(lista,idUser,idAnimeManga,selAnimeManga){
  return(
  <div>
    <h2>do you want delete anime from your list ?</h2>
    <button onClick={() => deleteList (lista,idUser,idAnimeManga,selAnimeManga)}> Yes </button>
    <button> No </button>
  </div>
  )
}

async function deleteList (lista,idUser,idAnimeManga,selAnimeManga) {
const { data, error } = await supabase
  .from(lista)
  .delete()
  .eq("id_user", idUser)
  .eq(selAnimeManga, idAnimeManga)

console.log(lista)
console.log(selAnimeManga)
if (error) {
  console.log("Error al borrar:", error)
} else {
  console.log("Borrado correctamente")
}
}
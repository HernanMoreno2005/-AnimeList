import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import Tilt from "react-parallax-tilt"
import image from "./assets/xShuriken.png"
import {Link} from "react-router-dom"
export function List() {
  const [type, setType] = useState("anime");
  const [lists, setLists] = useState("listAnime");
  const [animes, setAnimes] = useState([]);
  const [user, setUser] = useState(null);
  const [idUse, setId] = useState("id_anime");
  const [showModal, setShowModal] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const fetchAnimes = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from(lists)
      .select(idUse)
      .eq("id_user", user.id);

    if (error) {
      console.log(error);
      return;
    }

    if (!data || data.length === 0) {
      setAnimes([]);
      return;
    }

    try {
      const results = await Promise.all(
        data.map(async (item) => {
          try {
            const res = await fetch(
              `https://api.jikan.moe/v4/${type}/${item[idUse]}`
            );
            const json = await res.json();
            return json.data;
          } catch {
            return null;
          }
        })
      );

      setAnimes(results.filter(Boolean));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAnimes();
  }, [user, type, lists, idUse]);

  if (!user) {
    return (
      <h1 className="text-purple-600 text-center text-3xl md:text-4xl font-[fuente]">
        Login for see your list
      </h1>
    );
  }

  return (
    <div>
      <h1 className="text-purple-600 text-center text-xl md:text-2xl mt-4">
        MY LIST
      </h1>


      <div className="flex justify-center mt-3 text-lg md:text-2xl text-purple-600 gap-2 font-[fuente]">
        <p
          onClick={() => {
            setType("anime");
            setLists("listAnime");
            setId("id_anime");
          }}
          className={`cursor-pointer ${type === "anime" ? "underline" : ""}`}
        >
          Anime
        </p>

        <p>//</p>

        <p
          onClick={() => {
            setType("manga");
            setLists("listManga");
            setId("id_manga");
          }}
          className={`cursor-pointer ${type === "manga" ? "underline" : ""}`}
        >
          Manga
        </p>
      </div>


      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {animes.map((anime) => (
          <Tilt
            key={anime.mal_id}
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            className="relative group overflow-hidden rounded-2xl h-[260px] sm:h-[300px] md:h-[350px]"
          >
 
            <img
              src={anime.images.jpg.large_image_url}
              className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
              alt=""
            />


            <img
              src={anime.images.jpg.large_image_url}
              alt={anime.title}
              className="absolute inset-0 w-full h-full object-contain border-4 border-white rounded-2xl transition
              md:group-hover:opacity-0"
            />

  
            <img
              src={anime.images.jpg.large_image_url}
              alt={anime.title}
              className="absolute inset-0 w-full h-full object-cover transition scale-110
              opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-hover:scale-100"
            />

           
            <div
              className={`absolute top-2 right-2 z-20 
              ${getRankColor(anime.rank)}
              text-xs md:text-sm font-bold px-2 md:px-3 py-1 rounded-full
              shadow-[0_0_10px_rgba(0,0,0,0.3)]
              opacity-100 md:opacity-0 md:group-hover:opacity-100`}
            >
              #{anime.rank ?? "?"}
            </div>

        
            <img
              src={image}
              className="absolute w-7 h-7 md:w-8 md:h-8 top-2 left-2 z-50 cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100"
              onClick={() => {
                setDeleteData({
                  lista: lists,
                  idUser: user.id,
                  id: anime.mal_id,
                  sel: idUse,
                });
                setShowModal(true);
              }}
            />

            <Link to={`/${type}/${anime.mal_id}`}>
           
              <div
                className="absolute inset-0 bg-black/70 flex flex-col justify-end p-3 md:p-4 rounded-2xl
                opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
              >
                <h2 className="text-white text-sm md:text-lg font-bold line-clamp-2">
                  {anime.title}
                </h2>

                <p className="text-gray-300 text-xs md:text-sm">
                  ⭐ {anime.score || "N/A"}
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

                <p className="text-gray-300 text-xs md:text-sm line-clamp-2">
                  {anime.genres.map((g) => g.name).join(", ")}
                </p>
              </div>
            </Link>
          </Tilt>
        ))}

        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] p-4">
            <div className="bg-white p-4 md:p-6 rounded-xl w-full max-w-sm">
              <h2 className="text-lg md:text-2xl font-[fuente] text-purple-600 text-center">
                Delete from list?
              </h2>

              <div className="flex justify-around mt-4">
                <button
                  className="border-2 md:border-4 p-2 w-20 rounded-2xl hover:text-purple-600"
                  onClick={async () => {
                    await deleteList(
                      deleteData.lista,
                      deleteData.idUser,
                      deleteData.id,
                      deleteData.sel
                    );
                    setShowModal(false);
                    fetchAnimes();
                  }}
                >
                  Yes
                </button>

                <button
                  className="border-2 md:border-4 p-2 w-20 rounded-2xl hover:text-purple-600"
                  onClick={() => setShowModal(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function getRankColor(rank) {
  if (rank === 1) return "bg-yellow-400 text-black";
  if (rank === 2) return "bg-gray-300 text-black";
  if (rank === 3) return "bg-amber-600 text-white";
  return "bg-purple-600 text-white";
}

async function deleteList(lista, idUser, idAnimeManga, selAnimeManga) {
  const { error } = await supabase
    .from(lista)
    .delete()
    .eq("id_user", idUser)
    .eq(selAnimeManga, idAnimeManga);

  if (error) {
    console.log("Error al borrar:", error);
  } else {
    console.log("Borrado correctamente");
  }
}
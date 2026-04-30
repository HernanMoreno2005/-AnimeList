import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from '../supabaseClient'
import "./assets/animesMangas.css";
import {MyList} from "./type"

function useFetchJikan(type, id, extra = "") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const cache = useRef({});
  useEffect(() => {
    if (!id) return;

    const key = `${type}-${id}-${extra}`;

    if (cache.current[key]) {
      setData(cache.current[key]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timeout = setTimeout(() => {
      fetch(`https://api.jikan.moe/v4/${type}/${id}${extra}`)
        .then(res => res.json())
        .then(res => {
          cache.current[key] = res.data;
          setData(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 1500);

    return () => clearTimeout(timeout);
  }, [type, id, extra]);

  return { data, loading };
}

function SkeletonBox({ className }) {
  return <div className={`bg-gray-700 animate-pulse rounded ${className}`} />;
}

export function MediaPage({ type }) {
  const { id } = useParams();
  const { data, loading } = useFetchJikan(type, id);
  const [user, setUser] = useState(null)
  const [added,setAdded] = useState(false)
  const idUse = type === "manga" ? "id_manga" : "id_anime";
  const myLists = type === "manga" ? "listManga" : "listAnime";
  
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
  const fetchList = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from(myLists)
      .select(idUse)
      .eq("id_user", user.id)
      .eq( idUse, id)

    if (error) {
      console.log(error);
      return;
    }
    if(data.length != 0){
  setAdded(true)
}
  };

  fetchList();
},[user, id, myLists, idUse])


  return (
    <div className="flex justify-center">
      <div className="w-[60%] max-md:w-[100%]">


        {loading ? (
          <SkeletonBox className="h-10 w-2/3 mx-auto mt-4" />
        ) : (
          <h1 className="text-4xl text-center text-purple-600 font-[fuente]">
            {data.title}
          </h1>
        )}


        <div className="flex justify-between mt-5 text-purple-600 font-[fuente] max-md:flex-col max-md:w-100">

          <div>
            {loading ? (
              <>
                <SkeletonBox className="h-5 w-32 mb-2" />
                <SkeletonBox className="h-5 w-24 mb-2" />
                <SkeletonBox className="h-5 w-28" />
              </>
            ) : (
              <>
                <p>Score: {data.score} ⭐</p>
                <p>Ranked: {data.rank}</p>
                <p>Popularity: {data.popularity}</p>
              </>
            )}
          </div>

          <div>
            {loading ? (
              <>
                <SkeletonBox className="h-5 w-32 mb-2" />
                <SkeletonBox className="h-5 w-32 mb-2" />
                <SkeletonBox className="h-5 w-40" />
              </>
            ) : (
              <>
                {type === "anime" ? (
                  <p>Episodes: {data.episodes ?? "???"}</p>
                ) : (
                  <>
                    <p>Chapters: {data.chapters}</p>
                    <p>Volumes: {data.volumes}</p>
                  </>
                )}
                <p>Status: {data.status}</p>
                <p>Genres: {data.genres.map(g => g.name).join(", ")}</p>
              </>
            )}
          </div>
        </div>


        <div className="flex gap-4 mt-4 max-md:flex-col">
          {loading ? (
            <SkeletonBox className="w-48 h-80" />
          ) : type === "anime" && data.trailer?.embed_url ? (
            <iframe src={data.trailer.embed_url} className="w-96 h-80 max-md:w-full" />
          ) : (
            <img src={data.images.jpg.image_url} className="w-48 h-80" />
          )}

          <div className="w-full max-md:flex max-md:flex-col max-md:items-center">
            {loading ? (
              <>
                <SkeletonBox className="h-4 w-full mb-2" />
                <SkeletonBox className="h-4 w-full mb-2" />
                <SkeletonBox className="h-4 w-3/4 mb-2" />
                <SkeletonBox className="h-10 w-40 mt-4" />
              </>
            ) : (
              <>
                <p className="font-[fuenteTexto]">{data.synopsis}</p>
                <button onClick={() => {MyList(type,data.mal_id,data.title,user),setAdded(true)}} className="bg-purple-600 text-white rounded-2xl mt-2 p-2.5 border-4 border-black hover:bg-white hover:text-purple-600 cursor-pointer">
                  {added ? "On your list" : "Add your list"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export function MediaCharacters({ type }) {
  const { id } = useParams();
  const { data, loading } = useFetchJikan(type, id, "/characters");

  const [activeId, setActiveId] = useState(null);

  const handleClick = (charId) => {
    setActiveId(activeId === charId ? null : charId);
  };

  return (
    <div className="flex justify-center flex-col items-center">
      <h2 className="font-bold font-[fuente] text-center text-3xl text-purple-600 my-5">
        Characters
      </h2>

      <div className="flex overflow-x-auto h-[60vh] md:h-[70vh] w-full snap-x snap-mandatory justify-start md:justify-center gap-4 px-4">

        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-full w-32 md:w-40 shrink-0 snap-start">
                <div className="w-full h-full bg-gray-700 animate-pulse rounded-xl"></div>
              </div>
            ))

          : (data || []).slice(0, 10).map(c => {
              const image = c.character.images?.jpg?.image_url;
              const isActive = activeId === c.character.mal_id;

              return (
                <div
                  key={c.character.mal_id}
                  onClick={() => handleClick(c.character.mal_id)}
                  className={`
                    relative h-full shrink-0 snap-start overflow-hidden rounded-xl transition-all duration-500 ease-in-out group cursor-pointer
                    
                    w-32 md:w-40
                    
                    ${isActive ? "w-[70vw]" : ""}
                    md:hover:w-[25rem]
                  `}
                >

                  {image ? (
                    <img
                      className={`
                        w-full h-full object-cover transition-transform duration-500
                        ${isActive ? "scale-110" : ""}
                        md:group-hover:scale-110
                      `}
                      src={image}
                      alt={c.character.name}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700"></div>
                  )}

                  <div className={`
                    absolute  bg-gradient-to-t top-0 left-0 w-full h-full from-black/80 via-black/30 to-transparent transition
                    ${isActive ? "opacity-100" : "opacity-80"}
                    md:group-hover:opacity-100
                  `}></div>

                  <p className={`
                    font-[fuente] text-white font-bold absolute bottom-12 left-4 w-[90%]
                    transition-all duration-300
                    text-lg md:text-xl
                    ${isActive ? "text-xl" : ""}
                    md:group-hover:text-2xl
                  `}>
                    {c.character.name}
                  </p>

                  <p className="font-[fuenteTexto] absolute bottom-3 left-4 text-white text-sm md:text-lg w-[90%] opacity-80 md:group-hover:opacity-100">
                    {c.role}
                  </p>

                </div>
              );
            })}
      </div>
    </div>
  );
}


export function MediaRelations({ type }) {
  const { id } = useParams();

  const { data: relations = [], loading } = useFetchJikan(type, id, "/relations");

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-3xl text-purple-600 my-5">Related Entries</h2>

        <div className="flex gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="bg-gray-700 animate-pulse h-6 w-32 mb-4 rounded"></div>
              <div className="bg-gray-700 animate-pulse w-48 h-80 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const safeRelations = Array.isArray(relations) ? relations : [];

  const hasPrequel = safeRelations.some(r => r.relation === "Prequel");
  const hasSequel = safeRelations.some(r => r.relation === "Sequel");
  const hasSideStory = safeRelations.some(r => r.relation === "Side Story");

  const filterRelation = rel =>
    safeRelations.filter(r => r.relation === rel);

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="font-bold font-[fuente] text-center text-3xl text-purple-600 my-5">
        Related Entries
      </h2>

      <div className="flex gap-5">
        {hasPrequel || hasSequel ? (
          ["Prequel", "Sequel"].map(rel =>
            filterRelation(rel).length > 0 && (
              <div key={rel}>
                <h2 className="text-center text-3xl text-purple-600 font-[fuente] my-5">
                  {rel}
                </h2>

                <div className="flex gap-5">
                  {filterRelation(rel)
                    .flatMap(r => r.entry)
                    .slice(0, 9)
                    .map(e => (
                      <MediaCard
                        key={e.mal_id}
                        id={e.mal_id}
                        name={e.name}
                        type={type}
                      />
                    ))}
                </div>
              </div>
            )
          )
        ) : (
          <div>
            <h3 className="font-[fuenteTexto] font-bold text-center text-2xl">
              This anime doesnt have prequels or sequels
            </h3>
          </div>
        )}
      </div>

      {hasSideStory &&
        ["Side Story"].map(rel =>
          filterRelation(rel).length > 0 && (
            <div key={rel}>
              <h2 className="text-center text-3xl text-purple-600 font-[fuente] my-5">
                {rel}
              </h2>

              <div className="grid grid-cols-3 gap-5 text-center">
                {filterRelation(rel)
                  .flatMap(r => r.entry)
                  .slice(0, 9)
                  .map(e => (
                    <MediaCard
                      key={e.mal_id}
                      id={e.mal_id}
                      name={e.name}
                      type={type}
                    />
                  ))}
              </div>
            </div>
          )
        )}
    </div>
  );
}


function MediaCard({ id, name, type }) {
  const { data, loading } = useFetchJikan(type, id);

  if (loading || !data || !data.images) {
    return (
      <div className="flex flex-col items-center">
        <SkeletonBox className="w-32 h-5 mb-2" />
        <SkeletonBox className="w-48 h-80" />
      </div>
    );
  }

  return (
    <Link to={`/${type}/${id}`} className="text-purple-600 flex flex-col items-center">
      <p>{name}</p>
      <img
        src={data.images.jpg?.image_url}
        className="w-48 h-80"
        alt={name}
      />
    </Link>
  );
}
function ReviewSkeleton() {
  return (
    <div className="w-5xl bg-gray-800 p-4 mb-5 rounded-2xl animate-pulse">
      <SkeletonBox className="h-5 w-1/3 mb-2" />
      <SkeletonBox className="h-4 w-full mb-2" />
      <SkeletonBox className="h-4 w-full mb-2" />
      <SkeletonBox className="h-4 w-3/4" />
    </div>
  );
}

export function MediaReviews({ type }) {
  const [noteReviews, setNote] = useState(true);
  const [reviews, setReviews] = useState([]);
  return (
    <div id="containerReviews">
      <div id="titleReviews" className="flex items-center max-md:justify-center">
      <h2 className="absolute left-1/2 -translate-x-1/2 text-4xl text-purple-600 font-[fuente] my-5">
      Reviews
      </h2>
      <div id="categories" className="flex ml-auto max-md:mt-20 max-md:ml-0">
  <p
    className={`hand-underline text-2xl font-[fuente] text-purple-600 mr-3 ${
      noteReviews ? "active" : ""
    }`}
    onClick={() => setNote(true)}
  >
    BestScore
  </p>
  <p className="text-2xl font-[fuente] text-purple-600 mr-2"> / </p>
  <p
    className={`hand-underline text-2xl font-[fuente] text-purple-600 ${
      noteReviews ? "" : "active"
    }`}
    onClick={() => setNote(false)}
  >
  WorstScore
  </p>
</div>
      </div>
      <SearchMediaReviews note={noteReviews} type={type} reviews={reviews} setReviews={setReviews} />
    </div>
  );
}
function SearchMediaReviews({ note, type, reviews, setReviews }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getReviews = async () => {
      try {
        setLoading(true);

        const res = await fetch(`https://api.jikan.moe/v4/${type}/${id}/reviews`);
        const data = await res.json();

        setReviews(data.data || []);
      } catch (error) {
        console.error(error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    getReviews();
  }, [id, type]);


  if (loading) {
    return (
      <div className="flex flex-col items-center">
        {Array.from({ length: 3 }).map((_, i) => (
          <ReviewSkeleton key={i} />
        ))}
      </div>
    );
  }


  if (!reviews || reviews.length === 0) {
    return (
      <p className="text-center font-bold text-2xl">
        This anime no have reviews
      </p>
    );
  }

  const sortedReviews = [...reviews];

  const filtered = note
    ? sortedReviews.sort((a, b) => b.score - a.score).slice(0, 5)
    : sortedReviews.filter(r => r.score <= 4).slice(0, 5);

  return (
    <div className="flex justify-center items-center flex-col">
      {filtered.map(r => (
        <ReviewCard key={r.mal_id} r={r} />
      ))}
    </div>
  );
}
function ReviewCard({ r }) {
  const [expanded, setExpanded] = useState(false);

  const isLong = r.review.length > 600;

  return (
    <div className="w-5xl flex flex-col  bg-gradient-to-r from-fuchsia-800 to-purple-800 mb-5 rounded-2xl text-white border-4 border-black max-md:w-full">
      
      <div className="flex justify-around font-[fuenteTexto]">
        <p>{r.user.username}</p>
        <p>Score: {r.score}/10 ⭐</p>
        <p>{r.date}</p>
      </div>

      <p className="m-3 font-[fuenteTexto] text-[1.9vh]">
        {expanded
          ? r.review
          : r.review.substring(0, 600) + (isLong ? "..." : "")}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-purple-300 mb-3  cursor-pointer text-center"
        >
          {expanded ? "Close" : "Read more"}
        </button>
      )}
    </div>
  );
}



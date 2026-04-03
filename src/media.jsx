import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./assets/animesMangas.css";

function useFetchJikan(type, id, extra = "") {
  const [data, setData] = useState(null);
  const cache = useRef({});

  useEffect(() => {
    if (!id) return;

    const key = `${type}-${id}-${extra}`;
    if (cache.current[key]) {
      setData(cache.current[key]);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`https://api.jikan.moe/v4/${type}/${id}${extra}`)
        .then(res => res.json())
        .then(res => {
          cache.current[key] = res.data; 
          setData(res.data);
        });
    }, 500);

    return () => clearTimeout(timeout);
  }, [type, id, extra]);

  return data;
}
export function MediaPage({ type }) {
  const { id } = useParams();
  const data = useFetchJikan(type, id);

  if (!data) return <p>Cargando...</p>;

  return (
    <div className="flex justify-center">
      <div className="w-[60%]">
        <h1 className="text-4xl text-center text-purple-600 font-[fuente]">{data.title}</h1>

        <div className="flex justify-between mt-5 text-purple-600 font-[fuente] items-center">
          <div>
            <p>Score: {data.score} ⭐</p>
            <p>Ranked: {data.rank}</p>
            <p>Popularity: {data.popularity}</p>
          </div>

          <div>
            {type === "anime" ? (
              <>
              {data.episodes != null ?(
                <p>Episodes: {data.episodes}</p>
              )
              : <p>Episodes: ???</p> }
              </>
            ) : (
              <>
                <p>Chapters: {data.chapters}</p>
                <p>Volumes: {data.volumes}</p>
              </>
            )}
            <p>Status: {data.status}</p>
            <p>
              Genres: {data.genres.map(g => g.name).join(", ")}
            </p>
          </div>
        </div>

        <div className="flex  justify-center items-center gap-4 mt-4">
          {type === "anime" && data.trailer?.embed_url ? (
            <iframe
              src={data.trailer.embed_url}
              className="w-96 h-80"
              allowFullScreen
            />
          ) : (
            <img src={data.images.jpg.image_url} className="w-48 h-80 mw-[60%]" />
          )}
          <div>
          <p className="font-[fuenteTexto]">{data.synopsis}</p>
          <button className= " font-[fuente] bg-purple-600 text-white w-30  rounded-2xl mt-2 p-2.5 border-4  border-black cursor-pointer hover:border-gray-400 hover:bg-white hover:text-purple-600">Add MyList</button>
        </div>
        </div>
      </div>
    </div>
  );
}


export function MediaCharacters({ type }) {
  const { id } = useParams();
  const data = useFetchJikan(type, id, "/characters");

  if (!data) return <p>Cargando...</p>;

  return (
    <div className="flex justify-center flex-col items-center">
      <h2 className="font-bold font-[fuente] text-center text-3xl text-purple-600 my-5"> Characters</h2>
      <div className="grid grid-cols-3 gap-4 items-center">
        {data.slice(0, 9).map(c => (
          <div key={c.character.mal_id} className="flex flex-col items-center">
            <p className="font-[fuente] text-purple-600 font-bold">{c.character.name}</p>
            <img className= "w-48 h-80 mw-[60%]" src={c.character.images.jpg.image_url} />
             <p className="mb-2 font-[fuenteTexto]">{c.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


export function MediaRelations({ type }) {
  const { id } = useParams();
  const relations = useFetchJikan(type, id, "/relations") || [];
  const hasPrequel = relations.some(r => r.relation === "Prequel");
  const hasSequel = relations.some(r => r.relation === "Sequel");
  const hasSideStory = relations.some(r => r.relation === "Side Story");

  const filterRelation = rel =>
    relations.filter(r => r.relation === rel);

  return (
    <div className="flex flex-col items-center justify-center">
     <h2 className="font-bold font-[fuente] text-center text-3xl text-purple-600 my-5">Related Entries</h2>
      <div className="flex gap-5">
      {hasPrequel || hasSequel ?(
      ["Prequel", "Sequel"].map(rel => (
        filterRelation(rel).length > 0 && (
          <div key={rel}>
            <h2 className="text-center text-3xl text-balance text-purple-600 font-[fuente] my-5">{rel}</h2>
            <div className="flex gap-5">
            {filterRelation(rel).flatMap(r => r.entry).slice(0, 9).map(e => (
              <MediaCard key={e.mal_id} id={e.mal_id} name={e.name} type={type} />
            ))}
          </div>
          </div>
        )
      ))
    ) :(
    <div>
      <h3 className="font-[fuenteTexto] font-bold text-center text-2xl"> This anime no have a prequel or sequels</h3>
    </div>
  )}
  </div>
   {hasSideStory &&(
      ["Side Story"].map(rel => (
        filterRelation(rel).length > 0 && (
          <div key={rel}>
            <h2 className="text-center text-3xl text-purple-600 font-[fuente] my-5">{rel}</h2>
            <div className="grid grid-cols-3">
            {filterRelation(rel).flatMap(r => r.entry).slice(0, 9).map(e => (
              <MediaCard key={e.mal_id} id={e.mal_id} name={e.name} type={type} />
            ))}
          </div>
          </div>
        )
      ))
   )}
      
    </div>
  );
}


function MediaCard({ id, name, type }) {
  const data = useFetchJikan(type, id);

  if (!data) return <p>Cargando...</p>;

  return (
    <Link to={`/${type}/${id}`} className="font-bold font-[fuente] text-purple-600 flex flex-col items-center mb-5">
      <p>{name}</p>
      <img className="w-48 h-80 mw-[60%]" src={data.images.jpg.image_url}  />
    </Link>
  );
}


export function MediaReviews({ type }) {
  const [noteReviews, setNote] = useState(true);
  const [reviews, setReviews] = useState([]);
  return (
    <div id="containerReviews">
      <div id="titleReviews" className="flex items-center">
      <h2 className="absolute left-1/2 -translate-x-1/2 text-4xl text-purple-600 font-[fuente] my-5">
      Reviews
      </h2>
      <div id="categories" className="flex ml-auto">
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
function SearchMediaReviews({ note, type,reviews,setReviews }) {
  const { id } = useParams();
useEffect(() => {
  const timeout = setTimeout(() => {
    const getReviews = async () => {
      try {
        const res = await fetch(
          `https://api.jikan.moe/v4/${type}/${id}/reviews`
        )

        const data = await res.json()

        setReviews(data.data || [])
      } catch (error) {
        console.error(error)
        setReviews([])
      }
    }

    getReviews()
  }, 400) 

  return () => clearTimeout(timeout)
}, [id, type])

  const sortedReviews = [...reviews];
  if(reviews.length > 0){
    if (note) {
        return (
          <div className="flex justify-center items-center flex-col">
            {sortedReviews
              .sort((a, b) => b.score - a.score)
              .slice(0, 5)
              .map(r => (
                <ReviewCard key={r.mal_id} r={r} />
              ))}
          </div>
        );
      } else {
        return (
          <div className="flex justify-center items-center flex-col">
            {sortedReviews
              .filter(r => r.score <= 4)
              .slice(0, 5)
              .map(r => (
                <ReviewCard key={r.mal_id} r={r} />
              ))}
          </div>
        );
      }
  }
  else{
    return(<p className="text-center font-bold text-2xl">This anime no have a reviews</p>)
  }
}
function ReviewCard({ r }) {
  const [expanded, setExpanded] = useState(false);

  const isLong = r.review.length > 600;

  return (
    <div className="w-5xl flex flex-col  bg-gradient-to-r from-fuchsia-800 to-purple-800 mb-5 rounded-2xl text-white border-4 border-black">
      
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


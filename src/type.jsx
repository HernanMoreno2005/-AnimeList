import { useState, useEffect, use } from "react"
import { Link, useParams,useSearchParams} from "react-router-dom"
import flechaIzquierda from "./assets/flechaIzquierda.png";
import flechaDerecha from "./assets/flechaDerecha.png";
import flechaIzquierdaHover from "./assets/flechaIzquierdaHover.png";
import flechaDerechaHover from "./assets/flechaDerechaHover.png";
export function GenresThemes() {
  const [list, setList] = useState([]);
  const [lastPage, setLastPage] = useState(1);

  const { id, name, type } = useParams();

  const [searchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetch(`https://api.jikan.moe/v4/anime?genres=${id}&order_by=score&sort=desc&limit=25&page=${page}`)
        .then(res => res.json())
        .then(res => {
          setList(res.data);
          setLastPage(res.pagination.last_visible_page);
        });
    }, 500);

    return () => clearTimeout(timeout);
  }, [id, page]);

  return (
    <div>
      <h1 className="text-center font-[fuente] text-4xl text-purple-600 mt-auto mb-3">
        {name}
      </h1>
      <div className="flex justify-center">
        <div className="grid grid-cols-5">
          {list.map(l => (
            <div key={l.mal_id} className="flex flex-col items-center mb-5 border m-4 border-gray-400 h-11/12 rounded-2xl">

              <h2 className="font-[fuente] text-purple-600 text-2xl text-center max-w-full overflow-x-auto whitespace-nowrap scrollbar-thin overflow-y-hidden p-2">
                {l.title}
              </h2>

              <div className="flex gap-2 flex-wrap mt-3">
                {l.genres?.map(g => (
                  <span className="font-[fuenteTexto]" key={g.mal_id}>
                    {g.name}
                  </span>
                ))}
              </div>

              <img src={l.images.jpg.image_url} className="h-48 mt-auto mb-3" />

              <p className="text-2xl font-[fuenteTexto]">
                Score: {l.score ?? "N/A"} ⭐
              </p>

              <p className="text-center font-[fuenteTexto] max-h-30 overflow-y-auto">
                {l.synopsis}
              </p>

              <div className="mt-auto mb-3">
                <Link
                  to={`/${type}/${l.mal_id}`}
                  className="bg-purple-600 text-white rounded-2xl m-5 p-3 border-4 border-black hover:bg-white hover:text-purple-600 hover:border-gray-400 font-[fuente]"
                >
                  More Info
                </Link>

                <button className="font-[fuente] bg-purple-600 text-white w-30 rounded-2xl mt-2 p-2.5 border-4 border-black hover:border-gray-400 hover:bg-white hover:text-purple-600">
                  Add MyList
                </button>
              </div>
            </div>
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
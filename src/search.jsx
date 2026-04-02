import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"

export function Input() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length < 3) {
        setResults([])
        return
      }

      const fetchData = async () => {
        try {
          const res = await fetch(
            `https://api.jikan.moe/v4/anime?q=${query}&limit=20`
          )

          const data = await res.json()

          setResults(data.data || [])
        } catch (error) {
          console.error(error)
          setResults([])
        }
      }

      fetchData()
    }, 400) 

    return () => clearTimeout(timeout)
  }, [query])

  return (
    <div className="flex justify-center flex-col items-center relative">
      
      <h1 className="font-[fuente] text-purple-600 font-bold text-3xl">
        Anime Search
      </h1>

      <input
        placeholder="search anime..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-3xl bg-gray-200 border-solid border-white border-4 rounded-[10px] p-5 mt-5"
      />

      {results.length > 0 && (
        <div className="absolute top-[120px] w-3xl bg-white rounded-xl shadow-lg max-h-[400px] overflow-y-auto">
          
          {results.map((anime) => (
            <Link
              key={anime.mal_id}
              to={`/anime/${anime.mal_id}`}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={anime.images?.jpg?.image_url}
                alt={anime.title}
                className="w-12 h-16 object-cover rounded"
              />
              <p className="font-[fuente] text-purple-600">
                {anime.title}
              </p>
            </Link>
          ))}

        </div>
      )}
    </div>
  )
}
export function Genres({type}) {
  const [genres, setGenres] = useState([])
  const typeGenre = "Genre";
  useEffect(() => {
    fetch("https://api.jikan.moe/v4/genres/anime")
      .then(res => res.json())
      .then(data => {
        if (!data.data) return

        const banned = ["Ecchi", "Erotica", "Hentai"]

        const filtered = data.data.filter(
          g => !banned.includes(g.name)
        )

        setGenres(filtered)
      })
  }, [])

  return (
    <div>
      <h2 className="text-center text-3xl font-[fuente] font-bold mt-5 text-purple-600">
        Genres
      </h2>

      <div className="grid grid-cols-5 gap-1 justify-items-center">
        {genres.map(genre => (
          <Link
            key={genre.mal_id}
            to={`/${type}/Genre/${genre.mal_id}/${genre.name}?page=1`}
            className="font-[fuenteTexto] font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 p-3 w-90 text-center text-white rounded-2xl text-2xl border-4 border-black hover:border-white"
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function Themes() {
  const [themes, setThemes] = useState([])

  useEffect(() => {
    fetch("https://api.jikan.moe/v4/genres/anime?filter=themes")
      .then(res => res.json())
      .then(data => {
        if (!data.data) return
        setThemes(data.data)
      })
  }, [])

  return (
    <div>
      <h2 className="text-center text-3xl font-[fuente] font-bold mt-5 text-purple-600">
        Themes
      </h2>

      <div className="grid grid-cols-5 gap-1 justify-items-center">
        {themes.map(theme => (
          <Link
            key={theme.mal_id}
            to={`/Theme/${theme.mal_id}`}
            className="font-[fuenteTexto] font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 p-3 w-90 text-center text-white rounded-2xl text-2xl border-4 border-black hover:border-white"
          >
            {theme.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
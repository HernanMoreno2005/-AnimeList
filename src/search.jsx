import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

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

      {/* RESULTADOS */}
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
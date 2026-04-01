import { useState, useEffect, use } from "react"
import { Link, useParams} from "react-router-dom"

export function GenresThemes(){
const [list,setList] = useState([]);
const {id} =  useParams();
const {name} = useParams();
const {type} = useParams();
 useEffect(() => {
    const timeout = setTimeout(() => {
      fetch(`https://api.jikan.moe/v4/anime?genres=${id}&order_by=score&sort=desc&limit=25`)
        .then(res => res.json())
        .then(res => {
          setList(res.data)
        })
    }, 500)

    return () => clearTimeout(timeout) 
  }, []) 
    return(
        <div>
        <h1 className="text-center font-[fuente] text-4xl text-purple-600 my-3">{name}</h1>
        <div className="flex justify-center">
        <div className="grid grid-cols-5">
        {list.map(l => (
        
        <div className="flex flex-col items-center mb-5 border m-4 border-gray-400 h-11/12 rounded-2xl "> 
        <h2 className="font-[fuente] text-purple-600 text-2xl text-center max-w-full overflow-x-auto whitespace-nowrap scrollbar-thin overflow-y-hidden font">{l.title}</h2>
        <img src={l.images.jpg.image_url} className="h-48 my-3"></img>
        <p className="text-2xl font-[fuenteTexto] "> Score : {l.score} ⭐</p>
        <p className="text-center font-[fuenteTexto] max-h-30 overflow-y-auto"> {l.synopsis}</p>
        <div className="my-3">
        <Link to={`/${type}/${l.mal_id}`} className="bg-purple-600 text-white rounded-2xl m-5 p-3 border-4 border-black hover:bg-white hover:text-purple-600 hover:border-4 hover:border-gray-400 box-border font-[fuente]"> More Info </Link>  
        <button className= " font-[fuente] bg-purple-600 text-white w-30  rounded-2xl mt-2 p-2.5 border-4 border-solid border-black cursor-pointer hover:border-gray-400 hover:bg-white hover:text-purple-600">Add MyList</button>
        </div>
        </div>
        
        ))}
        </div>
        </div>
        </div>
    )

}
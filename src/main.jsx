import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Header,Anime,Manga} from './app.jsx'
const root = createRoot(document.getElementById("root"));
root.render(
<>
<Header />
<Anime />
<Manga />
</>
)

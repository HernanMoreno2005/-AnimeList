import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header, Anime, Manga } from "./home";
import { MediaPage, MediaCharacters, MediaRelations, MediaReviews } from "./media";
import {Input, Genres,Themes} from "./search"
import {GenresThemes} from "./type"
 function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={
          <>
            <div className="bg-[linear-gradient(180deg,_#fce6f6_57%,_#b683cc_100%)] h-[100vh]">
            <Anime />
            <Manga />
            </div>
          </>
        } />

        <Route path="/anime/:id" element={
          <>
          <div className="bg-[linear-gradient(180deg,_#fce6f6_57%,_#b683cc_100%)]">
          <MediaPage type="anime" />
          <MediaCharacters type="anime" />
          <MediaRelations type="anime" />
          <MediaReviews type="anime" />
          </div>
          </>
        } />
        <Route path="/manga/:id" element={
          <>
          <div className="bg-[linear-gradient(180deg,_#fce6f6_57%,_#b683cc_100%)]">
          <MediaPage type="manga" />
          <MediaCharacters type="manga" />
          <MediaRelations type="manga" />
          <MediaReviews type="manga" />
          </div>
          </>
        }  
      />
      <Route path="/searchAnime" element={
      <div className="bg-[linear-gradient(180deg,_#fce6f6_57%,_#b683cc_100%)]">
      <Input/>
      <Genres type="anime"/>
      <Themes type="anime"/>
      </div>
      }
      />
      <Route path="/:type/Genre/:id/:name" element={
        <>
        <GenresThemes/>
        </>
      }
      />
      <Route path="/:type/Theme/:id/:name" element={
        <>
        <GenresThemes/>
        </>
      }
      />
      </Routes>
    </BrowserRouter>
  ); 
}
export default App;
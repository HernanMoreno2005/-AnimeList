import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header, Anime, Manga } from "./home";
import { AnimeUrl, Characters,RelatedEntries, Reviews } from "./anime";
import { MediaPage, MediaCharacters, MediaRelations, MediaReviews } from "./media";
 function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={
          <>
            <Anime />
            <Manga />
          </>
        } />

        <Route path="/anime/:id" element={
          <>
          <MediaPage type="anime" />
          <MediaCharacters type="anime" />
          <MediaRelations type="anime" />
          <MediaReviews type="anime" />
          </>
        } />
        <Route path="/manga/:id" element={
          <>
          <MediaPage type="manga" />
          <MediaCharacters type="manga" />
          <MediaRelations type="manga" />
          <MediaReviews type="manga" />
          </>
        }  
      />
      </Routes>
    </BrowserRouter>
  ); 
}
export default App;
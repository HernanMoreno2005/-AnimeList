import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header, Anime, Manga } from "./home";
import { AnimeUrl, Characters } from "./anime";

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
          <AnimeUrl/>
          <Characters/>
          </>
        } />
      </Routes>
    </BrowserRouter>
  ); 
}
export default App;
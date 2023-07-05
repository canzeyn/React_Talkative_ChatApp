import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Anasayfa from "./components/Anasayfa";
import LogIn from "./components/LogIn";
import SıgnUp from "./components/SıgnUp";
import ChatInterface from "./components/ChatInterface";
import Header from "./components/Header";
import {Provider} from "react-redux";
import store from "./redux/store";


function App() {
  return (
    <>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Anasayfa />}></Route>
          <Route path="/giris_sayfası" element={<LogIn />}></Route>
          <Route path="/kayıt_olma_sayfası" element={<SıgnUp />}></Route>
          <Route path="/mesajlaşma_arayüz" element={<><Header /><ChatInterface /></> }></Route>
        </Routes>
      </Router>
      </Provider>
    </>
  );
}

export default App;

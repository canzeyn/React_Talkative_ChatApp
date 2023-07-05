import React from "react";
import { Link } from "react-router-dom";

const Anasayfa = () => {
  return (
    <div className="AnaSayfaArkaPlan flex flex-col h-screen justify-center items-center bg-cover " style={{backgroundImage:"linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.pexels.com/photos/1632788/pexels-photo-1632788.jpeg)" }}>
      <div className="flex flex-col items-center">
        <h2 className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-900 shadow-lg shadow-red-500/50 rounded-xl text-5xl">SOHBET ETMEK İÇİN EN İYİ ADRESE</h2>
        <h2 className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-900 shadow-lg shadow-red-500/50 rounded-xl text-3xl mt-3">HOŞ GELDİNİZ</h2>
        <h2 className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-900 shadow-lg shadow-red-500/50 rounded-xl text-6xl mt-3">TALKATİVE</h2>
      </div>

      <div className="mt-5">
        <button className="bg-gradient-to-r from-indigo-500 p-3 rounded-xl text-white hover:bg-indigo-800  hover:shadow-lg hover:shadow-indigo-500/50"><Link to={"/giris_sayfası"}>Sohbete Basla</Link></button>
      </div>
    </div>
  );
};

export default Anasayfa;

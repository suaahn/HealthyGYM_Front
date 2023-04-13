import React from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Home from "./components/Home";
import Bbslist from "./components/Bbslist";
import Bbswrite from "./components/Bbswrite";
import Bbsdetail from "./components/Bbsdetail";
import Login from "./components/login";
import Regi from "./components/regi";
import Bbsanswer from "./components/Bbsanswer";
import Bbsupdate from "./components/Bbsupdate";

import Multicampus from "./asset/multicampus.png";

function App() {
  return (
    <div>
      <header className="py-4">
        <div className="container text-center">
          <img alt="" src={Multicampus} width="300"/>
        </div>
      </header>

      <BrowserRouter>

        <nav className="navbar navbar-expand-md navbar-dark bg-info sticky-top">
          <div className="container">

            <div className="collapse navbar-collapse" id="navbar-content">
              <ul className="navbar-nav mr-auto">

                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/bbslist">게시판</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/pdslist">자료실</Link>
                </li>   


              </ul>
            </div>
          </div>
        </nav>

        <main>
          <div className="py-4">
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />}></Route>

                <Route path="/bbslist" element={<Bbslist />}></Route>
                <Route path="/bbslist/:choice/:search" element={<Bbslist />}></Route>

                <Route path="/bbswrite" element={<Bbswrite />}></Route>

                <Route path="/bbsdetail/:seq" exact element={<Bbsdetail />}></Route>

                {/* <Route path="/answer/:seq" exact element={}></Route> */}

                <Route path="/login" element={<Login />} ></Route>

                <Route path="/regi" element={<Regi />}></Route>

                <Route path="/bbsanswer/:seq" exact element={<Bbsanswer />}></Route>

                <Route path="/bbsupdate/:seq" exact element={<Bbsupdate />}></Route>

              </Routes>

            </div>
          </div>
        </main>          
      
      </BrowserRouter>

      <footer className="py-4 bg-info text-light">
        <div className="container text-center">
          <ul className="nav justify-content-center mb-3">
            <li className="nav-item">
              <a href="/" className="nav-link">Top</a>
            </li>

            <li className="nav-item">
              <a href="/bbslist" className="nav-link">bbs</a>
            </li>
            
          </ul>

          <p>
            <small>multicampus Copyright</small>
          </p>

        </div>
      </footer>
      
    </div>
  );
}

export default App;

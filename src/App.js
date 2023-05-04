import React from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import ToastEditor from "./components/ToastEditor";
import ToastViewer from "./components/ToastViewer";
import Home from "./components/Home";
import BbsList from "./components/bbs/BbsList";
import Bbswrite from "./components/Bbswrite";
import Bbsdetail from "./components/Bbsdetail";
import Login from "./components/auth/Login";
import Regi from "./components/regi";
import Bbsanswer from "./components/Bbsanswer";
import Bbsupdate from "./components/Bbsupdate";
import MyPage from "./components/Mypage/MyPage";
import Header from "./components/Header";
import LoginCallback from "./components/auth/LoginCallback";
import Signup from "./components/auth/Signup";
import Meallist from "./components/Meal/Meallist";
import MealViews from "./components/Meal/MealViews";
import Message from "./components/Message/Message";

import Multicampus from "./asset/multicampus.png";

function App() {
  
  return (
      <div>

        <BrowserRouter>
        <Header />
          
          <nav className="navbar navbar-expand-md navbar-dark bg-info">
            <div className="container">

              <div className="collapse navbar-collapse" id="navbar-content">
                <ul className="navbar-nav mr-auto">

                  <li className="nav-item">
                    <Link className="nav-link" to="/">Home</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="topics/0">게시판</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/pdslist">자료실</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/mypage/profilecard/profile">마이페이지</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/write">write</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/viewer/1">viewer</Link>
                  </li>

                  <li className="nav-item">
                  <Link className="nav-link" to="/mealviews">식단 공유 게시판</Link>
                  </li>

                </ul>
              </div>
            </div>

            <Message />
          </nav>

          <main>
            <div className="py-4">
              <div className="container">
                <Routes>
                  <Route path="/" element={<Home />}></Route>

                  <Route path="topics/:bbstag" element={<BbsList />}></Route>
                  <Route path="/bbslist/:choice/:search" element={<BbsList />}></Route>

                  <Route path="/bbswrite" element={<Bbswrite />}></Route>

                  <Route path="/bbsdetail/:seq" exact element={<Bbsdetail />}></Route>

                  {/* <Route path="/answer/:seq" exact element={}></Route> */}

                  <Route path="/login" element={<Login />} ></Route>

                  <Route path="/regi" element={<Regi />}></Route>

                  <Route path="/bbsanswer/:seq" exact element={<Bbsanswer />}></Route>

                  <Route path="/bbsupdate/:seq" exact element={<Bbsupdate />}></Route>

                  <Route path="/mypage/*" element={<MyPage />}></Route>

                  <Route path="/write" element={<ToastEditor />}></Route>

                  <Route path="/viewer/:bbsseq" exact element={<ToastViewer />}></Route>

                  <Route path="/login/callback/:provider" exact element={<LoginCallback />}></Route>

                  <Route path="/signup" element={<Signup />}></Route>

                  <Route path="/meallist" element={<Meallist />}></Route>

                  <Route path="/mealviews" exact element={<MealViews />}></Route>
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

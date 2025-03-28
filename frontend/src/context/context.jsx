import React, { createContext, useEffect, useState } from 'react';

export const AppContext = createContext(" ");

export const AppProvider = ({ children }) => { 

  const backend_url = 'https://infinite-tactics.onrender.com';

  const [isAuth, setisAuth] = useState(JSON.parse(localStorage.getItem('isAuth')) || false);
  const [name, setname] = useState(localStorage.getItem('name') || "");
  const [email, setemail] = useState(localStorage.getItem('email') || "");
  const [picture, setpicture] = useState(localStorage.getItem('picture') || "");
  const [score, setscore] = useState(localStorage.getItem('score') || "");

  const [loading, setloading] = useState(false);

  useEffect(() => {
    localStorage.setItem("isAuth", JSON.stringify(isAuth));
  }, [isAuth]);
  
  useEffect(() => {
    localStorage.setItem("name", name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem("email", email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem("picture", picture);
  }, [picture]);
  
  useEffect(() => {
    localStorage.setItem("score", score);
  }, [score]);
  
  return (
    <AppContext.Provider value={{ 
      backend_url,
      
      isAuth,
      setisAuth,
      name,
      setname,
      email,
      setemail,
      picture,
      setpicture,
      score,
      setscore,

      loading,
      setloading,
    }}>
      {children}
    </AppContext.Provider>
  );
};
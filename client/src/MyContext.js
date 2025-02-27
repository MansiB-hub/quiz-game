import React, { createContext, useState } from "react";

const MyContext = createContext(null); // Create Context

const MyContextProvider = ({ children }) => {
  const [state, setState] = useState("someValue"); // Example state

  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };

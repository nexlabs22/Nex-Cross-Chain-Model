import React, { createContext, useState, useEffect, useContext } from 'react';


interface PortfolioContextProps {

    testValue: string | null
}

const PortfolioContext = createContext<PortfolioContextProps>({

    testValue: "hahaha"
});

const usePortfolio = () => {
    return useContext(PortfolioContext);
};

const PortfolioProvider = ({ children }: { children: React.ReactNode }) => {
  

    const [test, setTest] = useState<string>("hello world")

    const contextValue = {

      testValue: test
    };
  
    return (
      <PortfolioContext.Provider value={contextValue}>
        {children}
      </PortfolioContext.Provider>
    );
  };

  export {PortfolioProvider, PortfolioContext, usePortfolio}
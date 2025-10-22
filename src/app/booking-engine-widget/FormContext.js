"use client";
import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext({
});

export const FormProvider = ({ children }) => {
  const [isFormOpen, setIsFormOpen] = useState(false); 

  return (
    <FormContext.Provider value={{ isFormOpen, setIsFormOpen }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => useContext(FormContext);

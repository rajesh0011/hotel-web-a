"use client";
import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext({
  isFormOpen: false,
  setIsFormOpen: () => {}, // Default function (empty) before provider is set
  cityDropDown: [],
  properties: [],
});

export const FormProvider = ({ children, cityDropDown = [], properties = []}) => {
  const [isFormOpen, setIsFormOpen] = useState(false); 

  return (
    <FormContext.Provider value={{ isFormOpen, setIsFormOpen, cityDropDown, properties }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => useContext(FormContext);

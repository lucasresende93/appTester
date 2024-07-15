import React, { createContext, useContext } from 'react';
import useBluetooth from './functionsBle';

const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
  const bluetooth = useBluetooth();
  return (
    <BluetoothContext.Provider value={bluetooth}>
      {children}
    </BluetoothContext.Provider>
  );
};


export const useBluetoothContext = () => useContext(BluetoothContext);

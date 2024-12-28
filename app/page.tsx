'use client';

import AddressInput from '../components/AddressInput';
import YardMap from '../components/YardMap';
import { useState } from 'react';

export default function Home() {
  const [address, setAddress] = useState('');

  const handleAddressSubmit = (newAddress: string) => {
    console.log('Submitted Address:', newAddress); // Debugging
    setAddress(newAddress);
  };

  return (
    <div>
      <h1>Yard Map Service</h1>
      <AddressInput onAddressSubmit={handleAddressSubmit} />
      <YardMap address={address} />
    </div>
  );
}



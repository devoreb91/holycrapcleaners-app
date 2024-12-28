'use client';

import { useState } from 'react';

interface AddressInputProps {
  onAddressSubmit: (address: string) => void;
}

const AddressInput: React.FC<AddressInputProps> = ({ onAddressSubmit }) => {
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim() === '') return; // Prevent empty submissions

    // Pass address to parent before clearing
    onAddressSubmit(address);
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter an address"
        style={{
          padding: '10px',
          width: '70%',
          marginRight: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Search
      </button>
    </form>
  );
};

export default AddressInput;

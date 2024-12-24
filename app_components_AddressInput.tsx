import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AddressInputProps {
  onMeasure: (address: string) => void
  loading: boolean
}

export default function AddressInput({ onMeasure, loading }: AddressInputProps) {
  const [address, setAddress] = useState('')

  const handleMeasure = () => {
    if (address.trim()) {
      onMeasure(address.trim())
    }
  }

  return (
    <div className="flex items-center justify-center space-x-4 mb-8 w-full max-w-xl px-4">
      <Input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter your address"
        className="flex-1"
        disabled={loading}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleMeasure()
          }
        }}
      />
      <Button
        onClick={handleMeasure}
        disabled={loading || !address.trim()}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Measuring...
          </>
        ) : (
          'Measure Yard'
        )}
      </Button>
    </div>
  )
}


import { Button, Input } from '@chakra-ui/react'
import { useState } from 'react'

export const Create = (): JSX.Element => {
  const [firstPass, setFirstPass] = useState('')
  const [secondPass, setSecondPass] = useState('')

  return (
    <div className="flex h-full w-full bg-[#131b33] text-white flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold">Welcome!</h1>
      <p>Password:</p>
      <Input
        type="password"
        onChange={(e) => setFirstPass(e.target.value)}
        value={firstPass}
        className="!w-40"
      />
      <p>Confirm password:</p>
      <Input
        type="password"
        value={secondPass}
        onChange={(e) => setSecondPass(e.target.value)}
        className="!w-40"
      />
      {secondPass !== firstPass && <p className="text-red-700">Password mismatch</p>}
      <Button
        isDisabled={secondPass !== firstPass || firstPass === ''}
        colorScheme={'red'}
        className="!w-40"
        onClick={() => window.electron.ipcRenderer.invoke('create-password', firstPass)}
      >
        Create
      </Button>
    </div>
  )
}

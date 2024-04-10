import { Button, Input } from '@chakra-ui/react'
import { useState } from 'react'

export const Login = (): JSX.Element => {
  const [firstPass, setFirstPass] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)

  return (
    <div className="flex h-full w-full bg-[#131b33] text-white flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold">Welcome Back!</h1>
      <p>Password:</p>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          window.electron.ipcRenderer.invoke('verify-password', firstPass).then((data) => {
            setIsInvalid(!data)
          })
        }}
      >
        <Input
          type="password"
          onChange={(e) => setFirstPass(e.target.value)}
          value={firstPass}
          className="!w-40"
        />
        {isInvalid && <p className="text-red-700">Password mismatch</p>}

        <Button isDisabled={firstPass.length === 0} colorScheme={'red'} className="!w-40">
          Login
        </Button>
      </form>
    </div>
  )
}

import { Button, Wrap, WrapItem, useToast } from '@chakra-ui/react'
import React, { useEffect } from 'react'

export const Toast = (): null => {
  const toast = useToast()
  useEffect(() => {
    window.electron.ipcRenderer.on('pending', () => {
      toast({
        title: 'Pending...',
        position: 'top-right',
        isClosable: true,
        status: 'loading',
        duration: 20000
      })
    })
    window.electron.ipcRenderer.on('success', (e, data) => {
      console.log(data)
      toast({
        title: String(data),
        position: 'top-right',
        isClosable: true,
        status: 'success',
        duration: 20000
      })
    })

    window.electron.ipcRenderer.on('reject', (e, data) => {
      toast({
        title: String(data),
        position: 'top-right',
        isClosable: true,
        status: 'error',
        duration: 20000
      })
    })
  }, [])
  return null
}

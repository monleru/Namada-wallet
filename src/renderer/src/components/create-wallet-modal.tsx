import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure
} from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { Select } from '@chakra-ui/react'
import { ContextInterface, MyContext } from '@renderer/App'
import { getWallets } from '@renderer/utils/get-wallets'
import { useContext, useState } from 'react'
export const CreateWalletModal = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const createWallet = async (type: string, wallet: string, password: string) => {
    return await window.electron.ipcRenderer.invoke('create-wallet', type, wallet, password)
  }
  const { wallets, setWallets } = useContext<ContextInterface>(MyContext)
  const [value, setValue] = useState('')
  return (
    <>
      <Button onClick={onOpen}>Create Wallet</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                createWallet('transparent', value, '123321')
                  .then((data) => console.log(data))
                  .then(() =>
                    getWallets().then((data) => {
                      setWallets(data)
                      onClose()
                    })
                  )
                  .catch((e) => console.log(e))
              }}
            >
              <p>Wallet alias:</p>
              <Input value={value} onChange={(e) => setValue(e.target.value)} name="wallet" />
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                onClose()
                return false
              }}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                createWallet('transparent', value, '123321')
                  .then((data) => console.log(data))
                  .then(() =>
                    getWallets().then((data) => {
                      setWallets(data)
                      onClose()
                    })
                  )
                  .catch((e) => console.log(e))
              }}
              variant="ghost"
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

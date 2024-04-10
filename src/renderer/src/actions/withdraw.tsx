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
import { useContext } from 'react'

export const Withdraw = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const createWallet = async (type: string, wallet: string, password: string) => {
    return await window.electron.ipcRenderer.invoke('create-wallet', type, wallet, password)
  }
  const { wallets, setWallets } = useContext<ContextInterface>(MyContext)

  return (
    <>
      <Button colorScheme={'blue'} onClick={onOpen}>
        Withdraw
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Transfer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                createWallet(e.target.type.value, e.target.wallet.value, '123321')
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
              <p>From:</p>
              <Input name="from" />
              <p>To:</p>
              <Input name="to" />
              <p>Amount:</p>
              <Input name="to" />
              <p>Token:</p>
              <Input name="to" />
              <p>Memo:</p>
              <Input name="to" />
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
            <Button variant="ghost">Push</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

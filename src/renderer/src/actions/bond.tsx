import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Select
} from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid'

import { Input } from '@chakra-ui/react'
import { ContextInterface, MyContext } from '@renderer/App'
import { useContext } from 'react'
import { encodeStringToBase64 } from '@renderer/pages/tx/tx'
import { TsSigner } from './tx-signer'

export const Bond = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { currentWallet, wallets, shieldedWallets } = useContext<ContextInterface>(MyContext)

  return (
    <>
      <Button colorScheme={'blue'} onClick={onOpen}>
        Bond
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            const formDataObject: any = {}
            formData.forEach((value, key) => {
              formDataObject[key] = value
            })
            const data = {
              uuid: uuidv4(),
              type: 'bond',
              formDataObject,
              wallet: currentWallet.alias
            }
            console.log(data)
            console.log(JSON.stringify(data))
            window.electron.ipcRenderer
              .invoke('transaction-window', encodeStringToBase64(JSON.stringify(data)))
              .then((data) => console.log(data))
          }}
        >
          <ModalContent>
            <ModalHeader>Bond</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>From:</p>
              <Select name="source">
                {wallets.map((post) => (
                  <option key={post.alias}>{post.alias}</option>
                ))}
                {shieldedWallets.map((post) => (
                  <option key={post.alias}>{post.alias}</option>
                ))}
              </Select>
              <p>To:</p>
              <Input name="validator" />

              <p>Amount:</p>
              <Input name="amount" />

              <TsSigner />
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
              <Button type="submit" onClick={(e) => e} variant="ghost">
                Push
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}

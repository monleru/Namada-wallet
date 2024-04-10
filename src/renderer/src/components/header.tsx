import React, { useContext, useEffect, useState } from 'react'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input
} from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { ChevronDownIcon, SettingsIcon } from '@chakra-ui/icons'
import { ContextInterface, MyContext } from '@renderer/App'
export const Header = (): JSX.Element => {
  const { wallets, shieldedWallets, currentWallet, setCurrentWallet } =
    useContext<ContextInterface>(MyContext)

  return (
    <div className="w-full bg-white h-14 text-black flex items-center justify-between">
      <div className="h-full flex">
        <div className="h-full">
          <Menu>
            <MenuButton
              as={Button}
              height={'100%'}
              borderRadius={0}
              w={200}
              bg={'none'}
              rightIcon={<ChevronDownIcon />}
            >
              Testnet
            </MenuButton>
            <MenuList>
              <MenuItem>Setting</MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div className="h-full">
          <Menu>
            <MenuButton
              as={Button}
              height={'100%'}
              borderRadius={0}
              w={200}
              bg={'none'}
              rightIcon={<ChevronDownIcon />}
            >
              {currentWallet?.alias}
            </MenuButton>
            <MenuList>
              {wallets.map((post) => (
                <MenuItem
                  onClick={() => {
                    setCurrentWallet(wallets.find((data: Wallets) => data.alias === post.alias))
                  }}
                  key={post.alias}
                >
                  {post.alias}
                </MenuItem>
              ))}
              {shieldedWallets.map((post) => (
                <MenuItem
                  onClick={() => {
                    setCurrentWallet(
                      shieldedWallets.find((data: Wallets) => data.alias === post.alias)
                    )
                  }}
                  key={post.alias}
                >
                  {post.alias}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </div>
      </div>
      <div className="mr-3">
        <SettingModal />
      </div>
    </div>
  )
}

export function SettingModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { node, changeNode } = useContext<ContextInterface>(MyContext)
  const [newRpc, setNewRpc] = useState(node)
  return (
    <>
      <Button onClick={onOpen}>
        <SettingsIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change RPC:</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p className="font text-xl">RPC:</p>
            <Input className="mt-2" value={newRpc} onChange={(e) => setNewRpc(e.target.value)} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                changeNode(newRpc)
                onClose()
              }}
              variant="ghost"
            >
              Change
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

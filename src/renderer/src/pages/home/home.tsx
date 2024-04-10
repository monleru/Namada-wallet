import React, { useContext, useEffect, useState } from 'react'
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  CardBody,
  Card,
  useToast
} from '@chakra-ui/react'
import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react'
import { CreateWalletModal } from '@renderer/components/create-wallet-modal'
import { ContextInterface, MyContext } from '@renderer/App'
import { ImportWalletModal } from '@renderer/components/import-wallet-modal'

export function formatTnam(address) {
  if (address.length <= 8) return address // Проверка на случай, если адрес уже имеет меньше 8 символов
  const firstFour = address.slice(0, 4)
  const lastFour = address.slice(-4)
  return `${firstFour}....${lastFour}`
}

export const Home = (): JSX.Element => {
  const { wallets, shieldedWallets } = useContext<ContextInterface>(MyContext)
  const toast = useToast()

  const copy = (data) => {
    toast({
      title: 'Copied',
      position: 'top-right',
      isClosable: true,
      status: 'info',
      duration: 20000
    })
    navigator.clipboard.writeText(data)
  }
  return (
    <div className="bg-[#f1f0ee] h-full flex">
      <div className="w-3/4">
        <div className="w-full p-4">
          <p className="font-bold">Account(s) Overview</p>
          <p className="text-gray-500">Overview of accounts for this blockchain.</p>
        </div>
        <div className="mt-2">
          <Tabs position="relative" variant="unstyled">
            <TabList>
              <Tab>Transparent</Tab>
              <Tab>Sheilded</Tab>
              <Tab>Tokens</Tab>
              <Tab>Governance</Tab>
            </TabList>
            <TabIndicator mt="-1.5px" height="2px" bg="blue.500" borderRadius="1px" />
            <TabPanels>
              <TabPanel>
                <TableContainer>
                  <Table variant="simple" background={'white'} className="rounded">
                    <TableCaption>
                      {/* <ImportWalletModal /> */}
                      <CreateWalletModal />
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Walelt</Th>
                        <Th>tnam</Th>
                        <Th>pubKey</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {wallets.map((data) => (
                        <Tr key={data.alias}>
                          <Td>{data.alias}</Td>
                          <Td className="cursor-pointer" onClick={() => copy(data.tnam)}>
                            {formatTnam(data.tnam)}
                          </Td>
                          <Td className="cursor-pointer" onClick={() => copy(data.publicKey)}>
                            {formatTnam(data.publicKey)}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>
              <TabPanel>
                <TableContainer>
                  <Table variant="simple" background={'white'} className="rounded">
                    <TableCaption>
                      {/* <ImportWalletModal /> */}
                      <CreateWalletModal />
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Walelt</Th>
                        <Th>tnam</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {shieldedWallets.map((data) => (
                        <Tr key={data.alias}>
                          <Td>{data.alias}</Td>
                          <Td className="cursor-pointer" onClick={() => copy(data.znam)}>
                            {formatTnam(data.znam)}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>
              <TabPanel>
                <p>Comming soon...</p>
              </TabPanel>
              <TabPanel>
                <p>Comming soon...</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
      <div className="w-1/3 p-4 flex flex-col items-center">
        <div className="w-full">
          <p className="font-bold">App Status</p>
          <p className="text-gray-500">Important information and events for your Namada wallet.</p>
        </div>
        <Card className="mt-2">
          <CardBody>
            <p>View a summary of all your customers over the last month.</p>
          </CardBody>
        </Card>
        <Card className="mt-2">
          <CardBody>
            <p>View a summary of all your customers over the last month.</p>
          </CardBody>
        </Card>
        <Card className="mt-2">
          <CardBody>
            <p>View a summary of all your customers over the last month.</p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button
} from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { encodeStringToBase64 } from '../tx/tx'
import { ContextInterface, MyContext } from '@renderer/App'
interface Proposals {
  Author: string
  EndEpoch: string
  GraceEpoch: string
  ProposalId: string
  StartEpoch: string
  Type: string
}
import { v4 as uuidv4 } from 'uuid'

export const Governance = (): JSX.Element => {
  const { currentWallet } = useContext<ContextInterface>(MyContext)

  const [proposals, setProposals] = useState<Proposals[]>([])
  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-proposals')
      .then((data) =>
        setProposals(JSON.parse(data).sort((a, b) => Number(b.ProposalId) - Number(a.ProposalId)))
      )
  }, [])
  console.log(proposals)

  return (
    <Accordion>
      {proposals.map((post) => (
        <AccordionItem key={post.ProposalId}>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Proposal {post.ProposalId}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <p>Author: {post.Author}</p>
            <p>Start: {post.StartEpoch}</p>
            <p>End: {post.EndEpoch}</p>
            <p>Grace: {post.GraceEpoch}</p>
            <Box className="gap-2 flex mt-4">
              <Button
                onClick={() => {
                  const data = {
                    uuid: uuidv4(),
                    type: 'vote-proposal',
                    formDataObject: {
                      vote: 'yay',
                      memo: currentWallet.publicKey,
                      'proposal-id': post.ProposalId,
                      address: currentWallet.tnam
                    },
                    wallet: currentWallet.alias
                  }
                  window.electron.ipcRenderer
                    .invoke('transaction-window', encodeStringToBase64(JSON.stringify(data)))
                    .then((data) => console.log(data))
                }}
                colorScheme="green"
              >
                Yay
              </Button>
              <Button
                onClick={() => {
                  const data = {
                    uuid: uuidv4(),
                    type: 'vote-proposal',
                    formDataObject: {
                      vote: 'nay',
                      memo: currentWallet.publicKey,
                      'proposal-id': post.ProposalId,
                      address: currentWallet.tnam
                    },
                    wallet: currentWallet.alias
                  }
                  window.electron.ipcRenderer
                    .invoke('transaction-window', encodeStringToBase64(JSON.stringify(data)))
                    .then((data) => console.log(data))
                }}
                colorScheme="red"
              >
                Nay
              </Button>
              <Button
                onClick={() => {
                  const data = {
                    uuid: uuidv4(),
                    type: 'vote-proposal',
                    formDataObject: {
                      vote: 'abstain',
                      memo: currentWallet.publicKey,
                      'proposal-id': post.ProposalId,
                      address: currentWallet.tnam
                    },
                    wallet: currentWallet.alias
                  }
                  window.electron.ipcRenderer
                    .invoke('transaction-window', encodeStringToBase64(JSON.stringify(data)))
                    .then((data) => console.log(data))
                }}
                colorScheme="blue"
              >
                Abstain
              </Button>
            </Box>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

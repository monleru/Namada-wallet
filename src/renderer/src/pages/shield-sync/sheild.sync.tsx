import { Button, Card, CardBody, Input } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { ContextInterface, MyContext } from '@renderer/App'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
export const ShiedSync = (): JSX.Element => {
  const { node } = useContext<ContextInterface>(MyContext)
  const [block, setBlock] = useState(0)
  const [started, setStarted] = useState(false)
  const [syncBlock, setSyncBlock] = useState(0)
  const [from, setFrom] = useState(0)
  const [range, setRange] = useState(500)
  const [height, setHeight] = useState(0)
  const [done, setDone] = useState(false)
  useEffect(() => {
    window.electron.ipcRenderer.on('shielded-sync', (event, result) => {
      setSyncBlock(result)
      setStarted(true)
    })
    window.electron.ipcRenderer.on('shielded-sync-done', (event) => {
      setDone(true)
      setStarted(false)
    })
    axios
      .get(`${node}/abci_info?id=${Math.random()}`)
      .then((data) => setBlock(data.data.result.response.last_block_height))
  }, [])

  const startSync = () => {
    window.electron.ipcRenderer.invoke('shielded-sync-start', height, from, range)
    setStarted(true)
    setDone(false)
  }

  const stopSync = () => {
    window.electron.ipcRenderer.invoke('shielded-sync-stop')
    setStarted(false)
  }
  return (
    <div className="bg-[#f1f0ee] h-full p-4">
      <div className="w-full">
        <p className="font-bold">Shield Sync Overview</p>
        <p className="text-gray-500">Overview of Shielded Sync status.</p>
      </div>
      <Card className="p-4 mt-2 flex relative">
        <div>
          <p>Chain id: Namada Shielded-expeditions.88f17d1d14</p>
          <p>
            Status:{' '}
            {done ? (
              <span className="font-bold" style={{ color: 'green' }}>
                Done
              </span>
            ) : (
              <span className="font-bold" style={started ? { color: 'blue' } : { color: 'green' }}>
                {started ? 'Pending...' : 'Not Started'}
              </span>
            )}
          </p>
          <p>Current Block: {block}</p>
          <p>Shielded-sync block: {syncBlock}</p>
        </div>
        <div className="flex gap-2 absolute right-2 top-2">
          <Button isDisabled={started} onClick={startSync} colorScheme={'green'}>
            Start
          </Button>
          <Button isDisabled={!started} onClick={stopSync} colorScheme={'red'}>
            Stop
          </Button>
        </div>
        <div className="mt-4">
          <div>
            <p>From Height:</p>
            <Input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              isDisabled={started}
              defaultValue={0}
              type="number"
            />
          </div>
          <div>
            <p>To Height:</p>
            <Input
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              isDisabled={started}
              defaultValue={block}
              type="number"
            />
          </div>
          <div>
            <p>Range:</p>
            <Input
              value={range}
              onChange={(e) => setRange(e.target.value)}
              isDisabled={started}
              defaultValue={500}
              type="number"
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

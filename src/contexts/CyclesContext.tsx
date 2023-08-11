import { ReactNode, createContext, useContext, useState } from 'react'
import { Cycle } from '../pages/Home'

interface CreateCycleForm {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPast: number
  markCurrentCycleAsFinished: () => void
  handleSetAmountSecondsPast: (amountPast: number) => void
  createNewCycle: (data: CreateCycleForm) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CycleContextProviderProps {
  children: ReactNode
}

export function CycleContextProvider({ children }: CycleContextProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPast, setAmountSecondsPast] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

  function handleSetAmountSecondsPast(amountSeconds: number) {
    setAmountSecondsPast(amountSeconds)
  }

  function createNewCycle(data: CreateCycleForm) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycle.id)
    setAmountSecondsPast(0)
  }

  function interruptCurrentCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  // const cyclesProvidesValues = useMemo(() => {
  //   return {
  //     activeCycle,
  //     activeCycleId,
  //     amountSecondsPast,
  //     markCurrentCycleAsFinished,
  //     handleSetAmountSecondsPast,
  //   }
  // }, [
  //   activeCycle,
  //   activeCycleId,
  //   amountSecondsPast,
  //   markCurrentCycleAsFinished,
  // ])

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        amountSecondsPast,
        markCurrentCycleAsFinished,
        handleSetAmountSecondsPast,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}

export function useCycles(): CyclesContextType {
  const context = useContext(CyclesContext)

  if (!context) {
    throw new Error('useCycles deve ser usado com CycleContextProvider')
  }

  return context
}

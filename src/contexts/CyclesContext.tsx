import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useReducer,
} from 'react'
import { Cycle } from '../pages/Home'
import { ActionsTypes, CyclesReducer } from '../reducers/cycles'

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
  const [cyclesState, dispatch] = useReducer(CyclesReducer, {
    cycles: [],
    activeCycleId: null,
  })

  const { activeCycleId, cycles } = cyclesState

  const [amountSecondsPast, setAmountSecondsPast] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCurrentCycleAsFinished() {
    dispatch({
      type: ActionsTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
      payload: {
        activeCycleId,
      },
    })
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

    dispatch({
      type: ActionsTypes.ADD_NEW_CYCLE,
      payload: { newCycle },
    })

    setAmountSecondsPast(0)
  }

  function interruptCurrentCycle() {
    dispatch({
      type: ActionsTypes.INTERRUPT_CURRENT_CYCLE,
      payload: { activeCycleId },
    })
  }

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

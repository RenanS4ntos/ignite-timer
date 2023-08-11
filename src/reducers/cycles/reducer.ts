import { produce } from 'immer'
import { Cycle } from '../../pages/Home'
import { ActionsTypes } from './actions'

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function CyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionsTypes.ADD_NEW_CYCLE:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id
      })
    case ActionsTypes.INTERRUPT_CURRENT_CYCLE:
      return produce(state, (draft) => {
        const currentCycleIndex = state.cycles.findIndex(
          (cycle) => cycle.id === state.activeCycleId,
        )
        if (currentCycleIndex < 0) {
          return state
        } else {
          draft.cycles[currentCycleIndex].interruptedDate = new Date()
        }
        draft.activeCycleId = null
      })
    case ActionsTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
      return produce(state, (draft) => {
        const currentCycleIndex = state.cycles.findIndex(
          (cycle) => cycle.id === state.activeCycleId,
        )
        if (currentCycleIndex < 0) {
          return state
        } else {
          draft.cycles[currentCycleIndex].finishedDate = new Date()
        }
        draft.activeCycleId = null
      })
    default:
      return state
  }
}

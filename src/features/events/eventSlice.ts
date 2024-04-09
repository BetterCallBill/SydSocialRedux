import { createSlice } from '@reduxjs/toolkit'
import { sampleData } from '../../app/api/sampleData'
import { AppEvent } from '../../app/types/event'

/*
State
initialState
createSlice
export
*/

type State = {
    events: AppEvent[]
}

const initialState: State = {
    events: sampleData
}

/*
1. create store
2. create slice 
3. add to store
4. use with useAppSelector
*/
export const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        createEvent: (state, action) => {
            state.events.push(action.payload);
        },
        updateEvent: (state, action) => {
            state.events[state.events.findIndex(evt => evt.id === action.payload.id)] = action.payload;
        },
        deleteEvent: (state, action) => {
            state.events.splice(state.events.findIndex(evt => evt.id === action.payload), 1)
        }
    }
})

export const { createEvent, updateEvent, deleteEvent } = eventSlice.actions;
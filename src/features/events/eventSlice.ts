import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AppEvent } from '../../app/types/event'
import { Timestamp } from 'firebase/firestore'

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
    events: []
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
        setEvents: {
            reducer: (state, action: PayloadAction<AppEvent[]>) => {
                state.events = action.payload;
            },
            prepare: (events: any) => {
                let eventArray: AppEvent[] = [];
                Array.isArray(events) ? eventArray = events : eventArray.push(events)
                const mapped = eventArray.map((e: any) => {
                    return {...e, date: (e.date as Timestamp).toDate().toISOString()}
                });
                return {payload: mapped}
            }
        },
        createEvent: (state, action) => {
            state.events.push(action.payload);
        },
        deleteEvent: (state, action) => {
            state.events.splice(state.events.findIndex(evt => evt.id === action.payload), 1)
        }
    }
})

export const { createEvent, deleteEvent, setEvents } = eventSlice.actions;
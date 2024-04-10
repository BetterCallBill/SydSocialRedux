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
                Array.isArray(events) ? eventArray = events : eventArray.push(events);
                const mapped = eventArray.map((e: any) => {
                    return {...e, date: (e.date as Timestamp).toDate().toISOString()}
                });
                return {payload: mapped}
            }
        }
    }
})

export const { setEvents } = eventSlice.actions;
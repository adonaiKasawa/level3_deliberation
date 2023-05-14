import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import { AppState } from '..';

export interface State {
  exerciceList: [
    {
        id_exercice: number,
        annee_exercice: string,
        debut_exercice : string,
        fin_exercice : string,
        etat_exercice : string,
    }
  ]
}

export interface Action {    
}

const initialState: State = {
    exerciceList: [
        {
            id_exercice: 0,
            annee_exercice: '',
            debut_exercice : '',
            fin_exercice : '',
            etat_exercice : 'FIN',
        }
    ]
}


export const exerciceSlice = createSlice({
    name: 'exercice',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        createExercice: (state, action: PayloadAction<State>) => {
        state.exerciceList = action.payload.exerciceList;
      },
      deletExercice: (state) => {
        state.exerciceList = [{
            id_exercice: 0,
            annee_exercice: '0',
            debut_exercice : '0',
            fin_exercice : '0',
            etat_exercice : '0',
        }]
      },
    },
})
  
export const { createExercice, deletExercice } = exerciceSlice.actions

export const selectExercice = (state: AppState) => state.exercice

export default exerciceSlice.reducer

export const persistConfigExercice = {
    key : 'ExerciceLevel3Deliberation',
    version: 1,
    storage
}
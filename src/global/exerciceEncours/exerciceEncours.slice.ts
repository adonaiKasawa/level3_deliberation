import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import { AppState } from '..';

export interface State {
  id_exercice: number,
  annee_exercice: string,
  debut_exercice: string,
  fin_exercice: string,
  etat_exercice: string,
}

export interface Action {
}

const initialState: State = {
  id_exercice: 0,
  annee_exercice: '',
  debut_exercice: '',
  fin_exercice: '',
  etat_exercice: 'FIN',
}


export const exerciceEncoursSlice = createSlice({
  name: 'exerciceEncours',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    changeExerciceEncours: (state, action: PayloadAction<State>) => {
      state.id_exercice = action.payload.id_exercice;
      state.annee_exercice = action.payload.annee_exercice;
      state.debut_exercice = action.payload.debut_exercice;
      state.fin_exercice = action.payload.fin_exercice;
      state.etat_exercice = action.payload.etat_exercice;
      
    },
  },
})

export const { changeExerciceEncours } = exerciceEncoursSlice.actions

export const selectExerciceEncours = (state: AppState) => state.exerciceEncours

export default exerciceEncoursSlice.reducer

export const persistConfigExerciceEncours = {
  key: 'ExerciceEncoursLevel3Deliberation',
  version: 1,
  storage
}
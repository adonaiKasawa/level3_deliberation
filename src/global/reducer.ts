import { combineReducers } from "redux";
import {persistReducer} from 'redux-persist'
import authReducer, { persistConfigAuth } from "./auth/auth.slice";
import exerciceReducer, { persistConfigExercice } from "./exercice/exercice.slice";
import exerciceEncoursReducer, { persistConfigExerciceEncours } from "./exerciceEncours/exerciceEncours.slice";

export default combineReducers({
    auth : persistReducer(persistConfigAuth, authReducer),
    exercice: persistReducer(persistConfigExercice, exerciceReducer),
    exerciceEncours: persistReducer(persistConfigExerciceEncours, exerciceEncoursReducer),
});
import { store } from "../global";
import { httpRequest } from "./httpRequest"

export interface CreateCoteEtudiantData {
  etudiantId: number,
  tj?: number,
  ex?: number,
  unitPromTitulaire: number;
}
export interface CreateCoteEtudiantDatas {
  etudiantId: number,
  tj?: number,
  ex?: number,
}

export interface CreatDeliberationEtudiantData {
  poucentage: number;
  descision: string;
  poucentageCredit: number;
  etudiantId: number;
}

export interface CotationUniteData {
  etudiantId: number;
  ex?: number;
  tj?: number;
  motif?: string;

}

export interface CotationRatrapageUniteData {
  releveId: number;
  ex?: number;
  tj?: number;
  motif?: string;
}

export async function creatDeliberationEtudiant (cded: CreatDeliberationEtudiantData[], id: number){
  const state = store.getState();
  const exercice = state.exerciceEncours
  console.log(exercice);
  return await httpRequest(`/deliberation/create/deliberationEtudiant/${id}/${exercice.id_exercice}`, 'post', cded);
}
export async function createCoteEtudiant (createCoteEtudiantData: CreateCoteEtudiantDatas[], id: number) {
  const state = store.getState();
  const exercice = state.exerciceEncours
  console.log(exercice);
  return await httpRequest(`/deliberation/create/cotation/${id}/${exercice.id_exercice}`, 'post', createCoteEtudiantData);
}

export async function creatDeliberationPromotion (promotionId: number){
  const state = store.getState();
  const exercice = state.exerciceEncours
  return await httpRequest(`/deliberation/create/deliberationPromotion/${exercice.id_exercice}`, 'post', { promotionId });
}

export async function createCotation (cotationUnite: CotationUniteData[], idUpt: number){
  const state = store.getState();
  const exercice = state.exerciceEncours
  return await httpRequest(`/cours/create/cotation/${idUpt}/${exercice.id_exercice}`, 'post', cotationUnite);
}

export async function createRatrapageCotation(cote:CotationRatrapageUniteData[]) {
  const state = store.getState();
  const exercice = state.exerciceEncours
  return await httpRequest(`/cours/create/ratrapagecotation/${exercice.id_exercice}`, 'post', cote);
}

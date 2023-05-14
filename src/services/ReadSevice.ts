import { store } from "../global";
import { httpRequest } from "./httpRequest";

export const readSection = async () => await httpRequest('/admin/read/section', 'get');
export const readSectionByUser = async () => await httpRequest('/admin/read/sectionByUser', 'get');
export const readDepartement = async () => await httpRequest('/admin/read/departement', 'get');
export const readDepartementById = async (id: number) => await httpRequest(`/admin/read/departement/${id}`, 'get');
export const readPromotion = async () => await httpRequest('/admin/read/promotion', 'get');

export const readUnitPromTitulaireByPromotionId = async (id: number, exercice: any) => await httpRequest(`/deliberation/findUnitPromTitulaireByPromotionId/${id}/${exercice}`, 'get');
export const readReleveByEtudiantId = async (id: number, exercice: any) => await httpRequest(`/deliberation/readReleveByEtudiantId/${id}/${exercice}`, 'get');
export const readEtudiantByPromotionId = async (id: number,exercice: any) => await httpRequest(`/deliberation/read/etudiantByPromotion/${id}/${exercice}`, 'get');
export const readDeliberationPromotionByDepartement = async (id: number,exercice: any) => await httpRequest(`/deliberation/read/deliberationPromotionByDepartement/${id}/${exercice}`, 'get');
export const readDeliberationByPromtion = async (id: number, exercice: any) => await httpRequest(`/deliberation/read/deliberationPromotion/${id}/${exercice}`, 'get');
export const readDeliberationPromotionById = async (id: number,exercice: any) => await httpRequest(`/deliberation/read/readDeliberationPromotionById/${id}/${exercice}`, 'get');
export const readDeliberationByEtudiants = async (id: number,exercice: any) => await httpRequest(`/deliberation/read/readDeliberationEtudiantsByPromotionId/${id}/${exercice}`, 'get');
export const readUniteByTitulaire = async (exercice: any) =>await httpRequest(`/cours/read/uniteByTitulaire/${exercice}`, 'get');
export const readUnitPromTitulaireById = async (id: number,exercice: any) => await httpRequest(`/cours/read/readUnitPromTitulaireById/${id}/${exercice}`, 'get');
export const readExercice = async () => await httpRequest(`/admin/find/exercice/`, 'get');
export const readUniteByIdReleveEchec = async (id: number) => await httpRequest(`/cours/read/readUniteByIdReleveEchec/${id}`, 'get')
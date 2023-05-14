import { httpRequest } from "./httpRequest";

export interface DepartementDataUpdate {
    nom_departement: string;
    sectionId: number
    userId: number | null
}

export interface CreatePromotionDataUpdate {
    nom_promotion?: string;
    vacation?: string;
    departementId?: number;
}

export interface RelevesData {
    releveId: number;
    ex?: number;
    tj?: number;
    motif: string;
}

export interface CotationUniteData {
    etudiantId: number;
    ex?: number;
    tj?: number;
}

export const updateDepartement = async (departementData: DepartementDataUpdate,id:number) => await  httpRequest(`/admin/update/departement/${id}`,'patch',departementData);
export const updatePromotion = async (promotionData: CreatePromotionDataUpdate,id:number) => await  httpRequest(`/admin/update/promotion/${id}`,'patch',promotionData);
export const updateReleves = async (relevesData: RelevesData[]) => {
    const updateReleve = await httpRequest(`/deliberation/updateReleve`,'patch',relevesData);
    const InsertInModificationReleve = await httpRequest(`/deliberation/InsertInModificationReleve`,'patch',relevesData);
    return {updateReleve, InsertInModificationReleve}
}
export const ConfirmAllRecoursForDeliberationId = async (id:number,exercice: any) => await  httpRequest(`/deliberation/update/ConfirmAllRecoursForDeliberationId/${id}/${exercice}`,'patch');

export const changeThePromotionAndHandleCursus = async (id:number) => await  httpRequest(`/deliberation/create/cursus/${id}`,'POST');



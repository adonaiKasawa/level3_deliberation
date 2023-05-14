import { httpRequest } from "./httpRequest";

export const deleteDepatement = async (id: number) => await httpRequest(`/admin/delete/departement/${id}`,'delete');
export const deletePromotion = async (id: number) => await httpRequest(`/admin/delete/promotion/${id}`,'delete');

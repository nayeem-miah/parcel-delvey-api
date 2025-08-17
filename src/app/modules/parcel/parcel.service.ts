import { IParcel } from "./parcel.interface";


const createParcel = async (payload: Partial<IParcel>) => {
    console.log(payload);
}






export const ParcelService = {
    createParcel
}
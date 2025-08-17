
import { IParcel, } from "./parcel.interface";
import { Parcel } from "./parcel.model";


const createParcel = async (payload: Partial<IParcel>) => {

    const parcel = await Parcel.create(payload);

    return {
        parcel
    }

}






export const ParcelService = {
    createParcel
}
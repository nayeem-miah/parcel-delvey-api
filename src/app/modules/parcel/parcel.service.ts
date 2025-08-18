
import { JwtPayload } from "jsonwebtoken";
import { IParcel, IStatusLog, ParcelStatus, } from "./parcel.interface";
import { Parcel } from "./parcel.model";


const createParcel = async (payload: Partial<IParcel>) => {

    const parcel = await Parcel.create(payload);

    return {
        parcel
    }

}

const cancelParcel = async (tracking_id: string, decodeToken: JwtPayload) => {

    //  find parcel by tracking_id
    const parcel = await Parcel.findOne({ tracking_id });

    if (!parcel) {
        throw new Error("parcel not found!")
    }

    //  checking parcel status
    if (parcel.currentStatus !== ParcelStatus.REQUESTED && parcel.currentStatus !== ParcelStatus.APPROVED) {
        throw new Error(`Parcel already ${parcel.currentStatus}, cannot be cancelled!`)
    };


    //  change status
    const initialStatusLog: IStatusLog = {
        status: ParcelStatus.CANCELLED,
        timestamp: new Date(),
        updatedBy: decodeToken.role || "SENDER",
        note: "receiver do not want this parcel so i can cancel this parcel"
    };

    const updateData = {
        currentStatus: ParcelStatus.CANCELLED,
        statusLogs: [initialStatusLog]

    }


    const UpdatedCancelled = await Parcel.findOneAndUpdate(
        { tracking_id },
        updateData,
        { new: true, runValidators: true }
    );

    return {
        UpdatedCancelled
    }
}






export const ParcelService = {
    createParcel,
    cancelParcel,
}

import { JwtPayload } from "jsonwebtoken";
import { IParcel, IStatusLog, ParcelStatus, } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import { Role } from "../user/user.interface";
import { TMeta } from "../../utils/sendResponse";


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
};

const allParcel = async (query: Record<string, string>, decodeToken: JwtPayload) => {

    if (decodeToken.role !== Role.SENDER) {
        throw new Error("parcel role is not sender")
    }

    //  pagination implement
    /** pagination --> ?page=30&limit=10
     * page --- 1
     * limit  --> 10
     * skip = (page-1) * limit ---> 1 st page skip --> 1-1  * 10 --> skip --> 0,
     * skip = (page-1) * limit ---> 2 st page skip --> 2-1  * 10 --> skip --> 10,
     * skip = (page-1) * limit ---> 3 st page skip --> 3-1  * 10 --> skip --> 20,
     */

    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit



    const totalCountParcel = await Parcel.countDocuments({ sender: decodeToken.userId })
    const totalPage = Math.ceil(totalCountParcel / limit)
    // sender parcel find 
    const senderParcel = await Parcel.find(
        { sender: decodeToken.userId }
    )
        .populate('sender', 'name email address')
        .populate('receiver', 'name email address')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)

    const meta: TMeta = {
        page: page,
        limit: limit,
        total: totalCountParcel,
        totalPage: totalPage
    }

    return {
        data: senderParcel,
        meta: meta
    }
}






export const ParcelService = {
    createParcel,
    cancelParcel,
    allParcel
}
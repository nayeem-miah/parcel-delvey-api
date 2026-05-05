import { JwtPayload } from "jsonwebtoken";
import { ParcelStatus } from "./parcel.interface";
import prisma from "../../utils/prisma";
import AppError from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";
import { Role } from "../user/user.interface";
import { cancelLog, updateStatusLogsApproved, updateStatusLogsDelivered, updateStatusLogsDispatched } from "../../utils/statusLog";

const createParcel = async (payload: any) => {
    const parcel = await prisma.parcel.create({
        data: payload
    });
    return parcel;
}

const cancelParcel = async (id: string, decodeToken: JwtPayload, note: string) => {
    const parcel = await prisma.parcel.findUnique({
        where: { id }
    });

    if (!parcel) {
        throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found!");
    }

    if (decodeToken.role === Role.SENDER) {
        if (parcel.currentStatus !== ParcelStatus.REQUESTED && parcel.currentStatus !== ParcelStatus.APPROVED) {
            throw new AppError(StatusCodes.BAD_REQUEST, `Parcel already ${parcel.currentStatus}, cannot be cancelled!`);
        };
    }

    if (decodeToken.role === Role.ADMIN) {
        if (parcel.currentStatus === ParcelStatus.DELIVERED) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Admin cannot cancel delivered parcel!");
        }
        if (parcel.currentStatus === ParcelStatus.CANCELLED) {
            throw new AppError(StatusCodes.BAD_REQUEST, "This parcel is already cancelled!");
        }
    }

    const updatedParcel = await prisma.parcel.update({
        where: { id },
        data: {
            currentStatus: ParcelStatus.CANCELLED,
            statusLogs: {
                push: cancelLog(decodeToken.role, note)
            }
        }
    });

    return updatedParcel;
};

const allParcel = async (query: Record<string, string>, decodeToken: JwtPayload) => {
    if (decodeToken.role !== Role.SENDER) {
        throw new AppError(StatusCodes.FORBIDDEN, "You cannot access this route");
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [parcels, totalCount] = await Promise.all([
        prisma.parcel.findMany({
            where: { senderId: decodeToken.userId },
            include: {
                sender: { select: { name: true, email: true, address: true } },
                receiver: { select: { name: true, email: true, address: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: skip
        }),
        prisma.parcel.count({ where: { senderId: decodeToken.userId } })
    ]);

    const totalPage = Math.ceil(totalCount / limit);

    return {
        data: parcels,
        meta: {
            page,
            limit,
            total: totalCount,
            totalPage
        }
    };
}

const getAllParcelByAdmin = async (query: Record<string, string>, decodeToken: JwtPayload) => {
    if (decodeToken.role !== Role.ADMIN) {
        throw new AppError(StatusCodes.FORBIDDEN, "You cannot access this route");
    }

    const filter = query.filter ? { currentStatus: query.filter as ParcelStatus } : {};

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [parcels, totalCount] = await Promise.all([
        prisma.parcel.findMany({
            where: filter,
            include: {
                sender: { select: { name: true, email: true, address: true } },
                receiver: { select: { name: true, email: true, address: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: skip
        }),
        prisma.parcel.count({ where: filter })
    ]);

    const totalPage = Math.ceil(totalCount / limit);

    return {
        data: parcels,
        meta: {
            page,
            limit,
            total: totalCount,
            totalPage
        }
    };
}

const updateIsBlocked = async (id: string, decodeToken: JwtPayload) => {
    const admin = await prisma.user.findUnique({
        where: { email: decodeToken.email }
    });

    if (!admin || admin.role !== Role.ADMIN) {
        throw new AppError(StatusCodes.FORBIDDEN, "You cannot access this route");
    };

    const parcel = await prisma.parcel.findUnique({
        where: { id }
    });

    if (!parcel) {
        throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found!");
    }

    const updatedParcel = await prisma.parcel.update({
        where: { id },
        data: { isBlocked: !parcel.isBlocked }
    });

    return updatedParcel;
}

const updateCurrentStatus = async (id: string, decodeToken: JwtPayload, note: string) => {
    if (decodeToken.role !== Role.ADMIN) {
        throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to access this route");
    }

    const parcel = await prisma.parcel.findUnique({
        where: { id }
    });

    if (!parcel) throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");

    if (parcel.currentStatus === ParcelStatus.CANCELLED) {
        throw new AppError(StatusCodes.BAD_REQUEST, "This parcel is already cancelled!");
    }

    let newStatus: ParcelStatus;
    let newLog;

    if (parcel.currentStatus === ParcelStatus.REQUESTED) {
        newStatus = ParcelStatus.APPROVED;
        newLog = updateStatusLogsApproved(Role.ADMIN, note);
    } else if (parcel.currentStatus === ParcelStatus.APPROVED) {
        newStatus = ParcelStatus.DISPATCHED;
        newLog = updateStatusLogsDispatched(Role.ADMIN, note);
    } else {
        throw new AppError(StatusCodes.BAD_REQUEST, `Cannot update status from ${parcel.currentStatus}`);
    }

    const updatedParcel = await prisma.parcel.update({
        where: { id },
        data: {
            currentStatus: newStatus,
            statusLogs: {
                push: newLog
            }
        }
    });

    return updatedParcel;
};

const incomingParcel = async (decodedToken: JwtPayload) => {
    const incoming = await prisma.parcel.findMany({
        where: { receiverId: decodedToken.userId },
        include: {
            sender: { select: { name: true, email: true, address: true, phone: true } },
            receiver: { select: { name: true, email: true, address: true, phone: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    const totalCount = await prisma.parcel.count({
        where: { receiverId: decodedToken.userId }
    });

    return {
        incoming,
        meta: {
            total: totalCount,
            limit: 0,
            page: 0,
            totalPage: 0
        }
    };
}

const confirmCurrentStatus = async (id: string, decodedToken: JwtPayload) => {
    if (decodedToken.role !== Role.RECEIVER) {
        throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized for this route");
    }

    const parcel = await prisma.parcel.findFirst({
        where: { id, receiverId: decodedToken.userId }
    });

    if (!parcel) {
        throw new AppError(StatusCodes.NOT_FOUND, "Parcel not found");
    }

    if (parcel.currentStatus !== ParcelStatus.DISPATCHED) {
        throw new AppError(StatusCodes.BAD_REQUEST, `Invalid status: Parcel is currently ${parcel.currentStatus}, expected DISPATCHED.`);
    };

    const updatedParcel = await prisma.parcel.update({
        where: { id },
        data: {
            currentStatus: ParcelStatus.DELIVERED,
            statusLogs: {
                push: updateStatusLogsDelivered
            },
            deliveredAt: new Date()
        }
    });

    return updatedParcel;
}

const deliveryHistory = async (decodedToken: JwtPayload) => {
    const parcels = await prisma.parcel.findMany({
        where: {
            receiverId: decodedToken.userId,
            currentStatus: ParcelStatus.DELIVERED
        },
        include: {
            sender: { select: { name: true, email: true, address: true } },
            receiver: { select: { name: true, email: true, address: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    return parcels;
}

const achievement = async () => {
    const [parcelCount, clientCount] = await Promise.all([
        prisma.parcel.count(),
        prisma.user.count()
    ]);

    return {
        parcelCount,
        clientCount
    };
}

export const ParcelService = {
    createParcel,
    cancelParcel,
    allParcel,
    getAllParcelByAdmin,
    updateIsBlocked,
    updateCurrentStatus,
    incomingParcel,
    confirmCurrentStatus,
    deliveryHistory,
    achievement
}
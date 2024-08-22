'use server'

import { CreateAppointmentParams, UpdateAppointmentParams } from "@/types";
import { formatDateTime, parseStringify } from "../utils";
import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, database, DATABASE_ID, messaging } from "../appwrite.config";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const CreateAppointment = async (appointment: CreateAppointmentParams): Promise<Appointment | undefined> => {
    try {
        const newAppointment = await database.createDocument(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, ID.unique(), appointment);
        revalidatePath('/admin')
        return parseStringify(newAppointment)
    } catch (error) {
        console.error("An error occurred while creating a new appointment:", error);

    }
};

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await database.getDocument(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, appointmentId);
        return parseStringify(appointment)
    } catch (error) {
        console.error(error);

    }
}

export const getRecentAppointment = async () => {
    try {
        const appointments = await database.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        );

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        }
        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if (appointment.status === 'scheduled') {
                acc.scheduledCount += 1;
            } else if (appointment.status === 'pending') {
                acc.pendingCount += 1;
            } else if (appointment.status === 'cancelled') {
                acc.cancelledCount += 1;
            }
            return acc
        }, initialCounts)

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }
        return parseStringify(data)
    } catch (error) {
        console.error(error);

    }
};

export const updateAppointment = async ({ appointmentId, userId, appointment, type }: UpdateAppointmentParams) => {
    try {
        const updateAppointment = await database.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        )

        if (!updateAppointment) {
            throw new Error('Appointment not found')
        }
        // todo sms notification
        const smsMessage = `
        Greetings from CarePulse.
        ${type === 'schedule' ?
                `Your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime}  with Dr. ${appointment.primaryPhysician}`
                : `We regret to inform that your appointment for ${formatDateTime(appointment.schedule!).dateTime} is cancelled. Reason:  ${appointment.cancellationReason}`}`

        revalidatePath('/admin')

        await sendSMSNotification(userId, smsMessage)

        return parseStringify(updateAppointment)


    } catch (error) {
        console.error("An error occurred while scheduling an appointment:", error);

    }
}

export const sendSMSNotification = async (userId: string, content: string) => {
    try {
        const message = await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId]
        )
        return parseStringify(message)
    } catch (error) {
        console.error(error);

    }
}
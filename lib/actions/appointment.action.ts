'use server'

import { CreateAppointmentParams } from "@/types";
import { parseStringify } from "../utils";
import { ID } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, database, DATABASE_ID, PATIENT_COLLECTION_ID } from "../appwrite.config";

export const CreateAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = database.createDocument(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, ID.unique(), appointment);
        return parseStringify(newAppointment)
    } catch (error) {
        console.error(error);
        
    }
};

export const getAppointment = async (appointmentId:string) => {
    try {
        const appointment = await database.getDocument(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, appointmentId);
        return parseStringify(appointment)
    } catch (error) {
        console.error(error);
        
    }
}
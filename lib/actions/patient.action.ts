'use server'
import { CreateUserParams, RegisterUserParams } from "@/types";
import { storage, users, BUCKET_ID, database, DATABASE_ID, PATIENT_COLLECTION_ID, ENDPOINT, PROJECT_ID, } from "../appwrite.config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(ID.unique(), user.email, user.phone, undefined, user.name)
        console.log({ newUser });

        return parseStringify(newUser)

    } catch (error: any) {
        if (error && error?.code === 409) {
            const existingUser = await users.list([
                Query.equal('email', [user.email])
            ])
            return existingUser?.users[0]
        }
    }

};

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId)
        return parseStringify(user)
    } catch (error) {
        console.error(error);

    }
};

export const getPatient = async (userId: string) => {
    try {
        const patients = await database.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal('userId',userId)]
        )
        return parseStringify(patients.documents[0])
    } catch (error) {
        console.error(error);

    }
};

export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
    try {
        let file
        if (identificationDocument) {
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string,
            )

            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
        }
        const newPatient = await database.createDocument(DATABASE_ID!, PATIENT_COLLECTION_ID!, ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?.project=${PROJECT_ID}`,
                ...patient
            }
        )        
        console.dir(newPatient)
        return parseStringify(newPatient)
    } catch (error) {
        console.error("An error occurred while creating a new patient:", error);

    }

}
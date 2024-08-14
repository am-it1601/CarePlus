"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField, { FormFieldType } from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/vaildation"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.action"
import { User } from "@/types"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constents"
import { Label } from "../ui/label"
import Image from "next/image"
import { SelectItem } from "../ui/select"
import FileUploader from "../FileUploader"



const RegisterForm = ({ user }: { user: User }) => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    // 1. Define your form.
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: "",

        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        setIsLoading(true)

        let formData;
        if (values.identificationDocument && values.identificationDocument.length > 0) {
            const blobFile = new Blob([values.identificationDocument[0].name],{
                type: values.identificationDocument[0].type,
            })
             formData = new FormData()
             formData.append('blobFile', blobFile);
             formData.append('fileName', values.identificationDocument[0].name);
        }
        try {
           const patientData = {
            ...values,
            userId: user.$id,
            birthDate: new Date(values.birthDate),
            identificationDocument: formData,
           }
           //@ts-ignore
           const patient = await registerPatient(patientData)
           
           if(patient) router.push(`/patients/${user.$id}/new-appointment`)
        } catch (error) {
            console.error(error);

        }
        setIsLoading(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
                <section className="space-y-4">
                    <h1 className="header">Welcome 👋</h1>
                    <p className="text-dark-700">Let us know more about yourself.</p>
                </section>
                <section className=" space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Personal Information</h2>
                    </div>
                </section>

                {/* name */}

                <CustomFormField control={form.control} name='name' label="Full Name" placeholder="john deo" iconSrc="/assets/icons/user.svg" fieldType={FormFieldType.INPUT} />
                {/* email */}
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField control={form.control} name='email' label="Email" placeholder="johndeo@ciphercru.com" iconSrc="/assets/icons/email.svg" fieldType={FormFieldType.INPUT} />
                    <CustomFormField control={form.control} name='phone' label="Phone number" placeholder="(+91)9998778847" iconSrc="/assets/icons/user.svg" fieldType={FormFieldType.PHONE_INPUT} />

                </div>
                {/* birth date & gender */}
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField control={form.control} name='birthDate' label="Date of Birth" fieldType={FormFieldType.DATE_PICKER} />

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name='gender'
                        label="Gender"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup className='flex h-11 gap-6 xl:justify-between'
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    {GenderOptions.map((option) => (
                                        <div className="radio-group" key={option}>
                                            <RadioGroupItem value={option} id={option} />
                                            <Label htmlFor={option} className="cursor-pointer">
                                                {option}
                                            </Label>
                                        </div>

                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )} />
                </div>
                {/* address & occupation */}
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField control={form.control} name='address' label="Address" placeholder="522, jaipur" fieldType={FormFieldType.INPUT} />
                    <CustomFormField control={form.control} name='occupation' label="Occupation" placeholder="Software Engineer" fieldType={FormFieldType.INPUT} />

                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField control={form.control} name='emergencyContactName' label="Emergency contact name" placeholder="Guardian's name" fieldType={FormFieldType.INPUT} />
                    <CustomFormField control={form.control} name='emergencyContactNumber' label="Emergency contact number" placeholder="(+91)9998778847" fieldType={FormFieldType.PHONE_INPUT} />

                </div>
                <section className=" space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Medical Information</h2>
                    </div>
                </section>
                <CustomFormField control={form.control} name='primaryPhysician' label="Primary Physician" placeholder="Select a physician" fieldType={FormFieldType.SELECT}>
                    {Doctors.map((doctor) => (
                        <SelectItem key={doctor.name} value={doctor.name}>
                            <div className="flex cursor-pointer items-center gap-2">
                                <Image src={doctor.image} alt={doctor.name} width={32} height={32} className="rounded-full border border-dark-500" />
                                <p>
                                    {doctor.name}
                                </p>
                            </div>
                        </SelectItem>
                    ))}
                </CustomFormField>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField control={form.control} name='insuranceProvider' label="Insurance Provider" placeholder="whiteCross WhiteShield" fieldType={FormFieldType.INPUT} />
                    <CustomFormField control={form.control} name='insurancePolicyNumber' label="Insurance policy number" placeholder="AAAAAAA111" fieldType={FormFieldType.INPUT} />

                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField control={form.control} name='allergies' label="Allergies (if any)" placeholder="ex:Penicillin, Pollen" fieldType={FormFieldType.TEXTAREA} />
                    <CustomFormField control={form.control} name='currentMedications' label="Current medications" placeholder="ex: metals-500,dolo-600mg" fieldType={FormFieldType.TEXTAREA} />

                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField control={form.control} name='familyMedicalHistory' label="Family medical history(if relevant)" placeholder="ex:Mother had brain cancer, Father has hypertension" fieldType={FormFieldType.TEXTAREA} />
                    <CustomFormField control={form.control} name='pastMedicalHistory' label="Past medical history" placeholder="ex:Appendectomy in 2015, Asthma diagnosis in childhood" fieldType={FormFieldType.TEXTAREA} />

                </div>

                <section className=" space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Identification and Verification</h2>
                    </div>
                </section>
                <CustomFormField control={form.control} name='identificationType' label="Identification type" placeholder="Birth Certificate" fieldType={FormFieldType.SELECT}>
                    {IdentificationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                            {type}
                        </SelectItem>
                    ))}
                </CustomFormField>

                <CustomFormField control={form.control} name='identificationNumber' label="Identification number" placeholder="122665444" fieldType={FormFieldType.INPUT} />
                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="identificationDocument"
                    label="Scanned Copy of Identification Document"
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader files={field.value} onChange={field.onChange} />
                        </FormControl>
                    )}
                />
                <section className=" space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and Privacy</h2>
                    </div>
                </section>
                <CustomFormField control={form.control}
                    name="treatmentConsent"
                    label="I consent to receive treatment for my health condition."
                    fieldType={FormFieldType.CHECKBOX}
                />
                <CustomFormField control={form.control}
                    name="disclosureConsent"
                    label="I consent to the use and disclosure of my health information for treatment purposes."
                    fieldType={FormFieldType.CHECKBOX}
                />
                <CustomFormField control={form.control}
                    name="privacyConsent"
                    label="I acknowledge that I have reviewed and agree to the privacy policy"
                    fieldType={FormFieldType.CHECKBOX}
                />

                <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
            </form>
        </Form>
    )
};

export default RegisterForm;

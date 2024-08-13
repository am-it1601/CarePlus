"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {  SubmitHandler, useForm, UseFormRegisterReturn } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import CustomFormField, { FormFieldType } from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/vaildation"
import { useRouter } from "next/navigation"



const PatientForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
      // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",

    },
  })
 
  // 2. Define a submit handler.
 async function onSubmit({name,email,phone}: z.infer<typeof UserFormValidation>) {
    setIsLoading(true)

    try {
        // const userData = {name,email,phone}
        // const user = createUser(userData)
        // if (user) router.push(`/patients/${user.$id}/register`)

    } catch (error) {
        console.error(error);
        
    }
  }
  // ...

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1 className="header">Hi there 👋</h1>
            <p className="text-dark-700">Schedule your first appointment</p>
        </section>
        <CustomFormField control={form.control} name='name' label="Full Name" placeholder="john deo" iconSrc="/assets/icons/user.svg"  fieldType={FormFieldType.INPUT} />
        <CustomFormField control={form.control} name='email' label="Email" placeholder="johndeo@ciphercru.com" iconSrc="/assets/icons/email.svg"  fieldType={FormFieldType.INPUT} />
        <CustomFormField control={form.control} name='phone' label="Phone number" placeholder="(+91)  9998778847" iconSrc="/assets/icons/user.svg"  fieldType={FormFieldType.PHONE_INPUT} />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
};

export default PatientForm;

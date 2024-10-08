import { Button } from '@/components/ui/button'
import { Doctors } from '@/constents'
import { getAppointment } from '@/lib/actions/appointment.action'
import { formatDateTime } from '@/lib/utils'
import { SearchParamProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import * as Sentry from '@sentry/nextjs'
import { getUser } from '@/lib/actions/patient.action'
import { Appointment } from '@/types/appwrite.types'

const Success = async ({searchParams, params: { userId } }: SearchParamProps) => {
    const appointmentId = (searchParams?.appointmentId as string) || ''  
    const appointment: Appointment = await getAppointment(appointmentId)
    const doctor = Doctors.find((doc)=> doc.name === appointment?.primaryPhysician)
    const user = await getUser(userId)

    Sentry.metrics.set('user_view_appointment-success', user)
    
    return (
        <div className='flex h-screen max-h-screen px-[5%]'>
            <div className="success-img">
                <Link href='/'>
                    <Image
                        src='/assets/icons/logo-full.svg'
                        alt='log'
                        width={1000}
                        height={1000}
                        className='h-10 w-fit'
                    />
                </Link>

                <section className='flex flex-col items-center'>
                    <Image
                        src='/assets/gifs/success.gif'
                        alt='success'
                        height={300}
                        width={280}
                    />
                    <h2 className='header mb-6 max-w-[600px] text-center'>
                        your <span className="text-green-500">
                            appointment request
                        </span> has been successfully submitted
                    </h2>
                    <p>We&apos; will be int touch shortly to confirm</p>
                </section>
                <section className="request-details">
                    <p>Request appointment details:</p>
                    <div className="flex items-center gap-3">
                        <Image
                            src={doctor?.image!}
                            alt='doctor'
                            width={100}
                            height={100}
                            className='size-6'
                        />
                        <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
                    </div>
                    <div className="flex gap-2">
                        <Image
                            src='/assets/icons/calendar.svg'
                            alt='calendar'
                            height={24}
                            width={24}
                        />
                        <p>
                            {formatDateTime(appointment?.schedule).dateTime}
                        </p>
                    </div>
                </section>
                <Button variant="outline" className="shad-primary-btn" asChild>
                    <Link href={`/patients/${userId}/new-appointment`}>
                        New Appointment
                    </Link>
                </Button>

                <p className="copyright">© 2024 CarePluse</p>
            </div>
        </div>
    )
}

export default Success
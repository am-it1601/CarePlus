import React from 'react'
import { E164Number } from "libphonenumber-js/core";
import { Input } from './ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Control } from 'react-hook-form';
import Image from 'next/image';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

export enum FormFieldType {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneInput",
    CHECKBOX = "checkbox",
    DATE_PICKER = "datePicker",
    SELECT = "select",
    SKELETON = "skeleton",
}

interface CustomProps {
    control: Control<any>;
    name: string;
    label?: string;
    placeholder?: string;
    iconSrc?: string;
    iconAlt?: string;
    disabled?: boolean;
    dateFormat?: string;
    showTimeSelect?: boolean;
    children?: React.ReactNode;
    renderSkeleton?: (field: any) => React.ReactNode;
    fieldType: FormFieldType;
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
    const {fieldType,iconAlt,iconSrc,placeholder} = props
    switch (fieldType) {
        case FormFieldType.INPUT:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    {iconSrc && (
                        <Image src={iconSrc}
                            alt={iconAlt || 'icon'}
                            height={24}
                            width={24}
                            className='ml-2'
                        />
                    )}
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            {...field}
                            className='shad-input border-0'
                        />

                    </FormControl>
                </div>
            )
            case FormFieldType.PHONE_INPUT:
                return (
                    <FormControl>
                    <PhoneInput defaultCountry='IN' placeholder={placeholder} international withCountryCallingCode value={field.value as E164Number | undefined} onChange={field.onChange} className='input-phone' />
                </FormControl>
            )
            case FormFieldType.TEXTAREA:
        case FormFieldType.CHECKBOX:
        case FormFieldType.DATE_PICKER:
        case FormFieldType.SELECT:
        case FormFieldType.SKELETON:
        default:
            break;
    }
    return (
        <Input type='text'
            placeholder='John Deo'
        />
    )
}
const CustomFormField = (props: CustomProps) => {
    const { control, fieldType, name, label } = props;
    return (
        <FormField control={control}
            name={name}
            render={({ field }) => (
                <FormItem className='flex-1'>
                    {fieldType !== FormFieldType.CHECKBOX && label && (
                        <FormLabel>
                            {label}
                        </FormLabel>
                    )}
                    <RenderField field={field} props={props} />
                    <FormMessage className='shad-error' />

                </FormItem>
            )}
        />
    )
}

export default CustomFormField
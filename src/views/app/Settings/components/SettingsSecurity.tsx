import { useState, useRef } from 'react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Form, FormItem } from '@/components/ui/Form'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import isLastChild from '@/utils/isLastChild'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import type { ZodType } from 'zod'
import client from '@/services/graphql/apolloClient'
import { CHANGE_PASSWORD } from '@/graphql/mutations/auth'
import toast from 'react-hot-toast'

type PasswordSchema = {
    currentPassword: string
    newPassword: string
    confirmNewPassword: string
}

const authenticatorList = [
    {
        label: 'Google Authenticator',
        value: 'googleAuthenticator',
        img: '/img/others/google.png',
        desc: 'Using Google Authenticator app generates time-sensitive codes for secure logins.',
    },
    {
        label: 'Okta Verify',
        value: 'oktaVerify',
        img: '/img/others/okta.png',
        desc: 'Receive push notifications from Okta Verify app on your phone for quick login approval.',
    },
    {
        label: 'E Mail verification',
        value: 'emailVerification',
        img: '/img/others/email.png',
        desc: 'Unique codes sent to email for confirming logins.',
    },
]

const validationSchema: ZodType<PasswordSchema> = z
    .object({
        currentPassword: z
            .string()
            .min(1, { message: 'Please enter your current password!' }),
        newPassword: z
            .string()
            .min(1, { message: 'Please enter your new password!' }),
        confirmNewPassword: z
            .string()
            .min(1, { message: 'Please confirm your new password!' }),
    })
    .refine((data) => data.confirmNewPassword === data.newPassword, {
        message: 'Password not match',
        path: ['confirmNewPassword'],
    })

const SettingsSecurity = () => {
    const [selected2FaType, setSelected2FaType] = useState(
        'googleAuthenticator',
    )
    const [confirmationOpen, setConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const formRef = useRef<HTMLFormElement>(null)

    const {
        getValues,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<PasswordSchema>({
        resolver: zodResolver(validationSchema),
    })

    const handlePostSubmit = async () => {
        setIsSubmitting(true)

        await client
            .mutate({
                mutation: CHANGE_PASSWORD,
                variables: {
                    oldPassword: getValues().currentPassword,
                    newPassword: getValues().newPassword,
                },
            })
            .then(() => {
                setConfirmationOpen(false)
                toast.success('Password updated successfully!')
                setIsSubmitting(false)
            })
            .catch((error) => {
                setConfirmationOpen(false)
                toast.error(error.message)
                setIsSubmitting(false)
            })
    }

    const onSubmit = async () => {
        setConfirmationOpen(true)
    }

    return (
        <div>
            <div className="mb-8">
                <h4>Password</h4>
                <p>
                    Remember, your password is your digital key to your account.
                    Keep it safe, keep it secure!
                </p>
            </div>
            <Form
                ref={formRef}
                className="mb-8"
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormItem
                    label="Current password"
                    invalid={Boolean(errors.currentPassword)}
                    errorMessage={errors.currentPassword?.message}
                >
                    <Controller
                        name="currentPassword"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                autoComplete="off"
                                placeholder="•••••••••"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="New password"
                    invalid={Boolean(errors.newPassword)}
                    errorMessage={errors.newPassword?.message}
                >
                    <Controller
                        name="newPassword"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                autoComplete="off"
                                placeholder="•••••••••"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Confirm new password"
                    invalid={Boolean(errors.confirmNewPassword)}
                    errorMessage={errors.confirmNewPassword?.message}
                >
                    <Controller
                        name="confirmNewPassword"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                autoComplete="off"
                                placeholder="•••••••••"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <div className="flex justify-end">
                    <Button variant="solid" type="submit">
                        Update
                    </Button>
                </div>
            </Form>
            <ConfirmDialog
                isOpen={confirmationOpen}
                type="warning"
                title="Update password"
                confirmButtonProps={{
                    loading: isSubmitting,
                    onClick: handlePostSubmit,
                }}
                onClose={() => setConfirmationOpen(false)}
                onRequestClose={() => setConfirmationOpen(false)}
                onCancel={() => setConfirmationOpen(false)}
            >
                <p>Are you sure you want to change your password?</p>
            </ConfirmDialog>
        </div>
    )
}

export default SettingsSecurity
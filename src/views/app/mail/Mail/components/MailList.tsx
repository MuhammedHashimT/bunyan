import { useEffect, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import ScrollBar from '@/components/ui/ScrollBar'
import Loading from '@/components/shared/Loading'
import Table from '@/components/ui/Table'
import Checkbox from '@/components/ui/Checkbox'
import Badge from '@/components/ui/Badge'
import MailDeleteConfimation from './MailDeleteConfimation'
import classNames from '@/utils/classNames'
import { useMailStore } from '../store/mailStore'
import useMail from '../hooks/useMail'
import useMailAction from '../hooks/useMailAction'
import { labelList } from '../constants'
import useQuery from '@/utils/hooks/useQuery'
import useResponsive from '@/utils/hooks/useResponsive'
import isLastChild from '@/utils/isLastChild'
import { useNavigate, useLocation } from 'react-router-dom'
import { TbStarFilled, TbTrash, TbStar, TbFlag } from 'react-icons/tb'
import type { MouseEvent } from 'react'
import { Mail } from '../types'
import ProfileAvatar from './ProfileAvatar'

const htmlReg = /(<([^>]+)>)/gi

const { THead, Th, TBody, Tr, Td } = Table

const MailList = () => {
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState<{
        open: boolean
        selected: string
    }>({
        open: false,
        selected: '',
    })

    const {
        selectedMailId,
        mailList,
        setMail,
        setSelectedMail,
        mailListFetched,
    } = useMailStore()

    const {
        onFlagToggle,
        onCheckboxToggle,
        onStarToggle,
        onResetChecked,
        onMailDelete,
    } = useMailAction()

    const navigate = useNavigate()
    const location = useLocation()
    const query = useQuery()

    const { larger } = useResponsive()

    const { fetchMails, isMailsFetching } = useMail()

    useEffect(() => {
        const category = query.get('category')

        fetchMails(category || 'inbox')

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, location.search])

    const renderSubject = (title: string, content: string) => {
        const text = content.replace(htmlReg, '')
        const titleOffsetNumber = title.length

        return (
            <div className="flex items-center gap-3">
                <span className="font-semibold heading-text text-nowrap">
                    {title}
                </span>
                <span className="text-nowrap">
                    {text.length > 45 - titleOffsetNumber
                        ? text.substring(0, 42 - titleOffsetNumber) + '...'
                        : text}
                </span>
            </div>
        )
    }

    const handleMailClick = (e: MouseEvent<HTMLElement>, mail: Mail) => {
        e.stopPropagation()
        setMail(mail)
        onResetChecked()
        navigate(`${location.pathname}?mail=${mail.id}`, { replace: true })
    }

    const handleCheckboxClick = (e: MouseEvent<HTMLDivElement>, mail: Mail) => {
        e.stopPropagation()
        onCheckboxToggle(mail)
        if (!mail.checked) {
            if (!selectedMailId.includes(mail.id)) {
                setSelectedMail([...selectedMailId, mail.id])
            }
        } else {
            setSelectedMail(selectedMailId.filter((id) => mail.id !== id))
        }
    }

    const handleAction = (
        e: MouseEvent<HTMLButtonElement>,
        callback: (mail: Mail, setMail: boolean) => void,
        mail: Mail,
    ) => {
        e.stopPropagation()
        callback(mail, false)
    }

    const handleClose = () => {
        setDeleteConfirmationOpen({
            open: false,
            selected: '',
        })
    }

    const handleConfirmDelete = () => {
        onMailDelete([deleteConfirmationOpen.selected])
        handleClose()
    }

    return (
        <>
            <div className="lg:absolute top-0 left-0 h-full w-full">
                <ScrollBar
                    autoHide
                    className="overflow-y-auto lg:h-full lg:max-w-full cursor-pointer"
                >
                    <Loading
                        type={mailList.length > 0 ? 'cover' : 'default'}
                        spinnerClass={mailList.length > 0 ? 'hidden' : ''}
                        loading={isMailsFetching}
                    >
                        {larger.lg ? (
                            <Table compact overflow={false}>
                                <THead>
                                    <Tr>
                                        <Th colSpan={2}>From</Th>
                                        <Th>Subject</Th>
                                        <Th>Received</Th>
                                    </Tr>
                                </THead>
                                <TBody>
                                    {mailList.length > 0 ? (
                                        mailList.map((mail) => (
                                            <Tr
                                                key={mail.id}
                                                className="group"
                                                onClick={(e) =>
                                                    handleMailClick(e, mail)
                                                }
                                            >
                                                <Td width="40">
                                                    <div className="h-[32px] w-[32px] flex items-center justify-center">
                                                        <ProfileAvatar
                                                            src={mail.avatar}
                                                            alt={mail.name}
                                                            className={''}
                                                        />
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <span className="font-bold heading-text truncate">
                                                        {mail.name}
                                                    </span>
                                                </Td>
                                                <Td className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {renderSubject(
                                                        mail.title,
                                                        mail.message[0].content,
                                                    )}
                                                </Td>
                                                <Td>{mail.message[0].date}</Td>
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr>
                                            <Td colSpan={4}>
                                                <div className="flex items-center justify-center">
                                                    <div className="text-center">
                                                        <img
                                                            className="mx-auto mb-2 max-w-[150px]"
                                                            src="/img/others/no-mail.png"
                                                            alt="no-mail"
                                                        />
                                                        <h6 className="text-lg font-semibold">
                                                            No Notifications
                                                            Found!
                                                        </h6>
                                                    </div>
                                                </div>
                                            </Td>
                                        </Tr>
                                    )}
                                </TBody>
                            </Table>
                        ) : (
                            <>
                                {mailList.length > 0 ? (
                                    mailList.map((mail, index) => (
                                        <div
                                            key={mail.id}
                                            className={classNames(
                                                'flex justify-between items-center gap-2 px-2 rounded-xl border-gray-200 dark:border-gray-700 py-4 cursor-pointer group',
                                                !isLastChild(mailList, index) &&
                                                    'border-b',
                                            )}
                                            onClick={(e) =>
                                                handleMailClick(e, mail)
                                            }
                                        >
                                            <div className="flex gap-4 min-w-0">
                                                <div className="h-[32px] w-[32px] flex items-center justify-center">
                                                    <ProfileAvatar
                                                        src={mail.avatar}
                                                        alt={mail.name}
                                                    />
                                                    <div
                                                        className={classNames(
                                                            // 'group-hover:block',
                                                            mail.checked
                                                                ? 'block'
                                                                : 'hidden',
                                                        )}
                                                    >
                                                        <div
                                                            className="flex items-center"
                                                            onClick={(e) =>
                                                                handleCheckboxClick(
                                                                    e,
                                                                    mail,
                                                                )
                                                            }
                                                        >
                                                            <Checkbox
                                                                checked={
                                                                    mail.checked
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-bold heading-text truncate">
                                                        {mail.name}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-nowrap truncate">
                                                            {mail.message[0].content.replace(
                                                                htmlReg,
                                                                '',
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="">
                                                <span className="text-nowrap font-semibold">
                                                    {mail.message[0].date}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <div className="text-center">
                                            <img
                                                className="mx-auto mb-2 max-w-[150px]"
                                                src="/img/others/no-mail.png"
                                                alt="no-mail"
                                            />
                                            <h6 className="text-lg font-semibold">
                                                No Notifications Found!
                                            </h6>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </Loading>
                </ScrollBar>
            </div>
            <MailDeleteConfimation
                isOpen={deleteConfirmationOpen.open}
                selectedMailCount={1}
                onClose={handleClose}
                onConfirmDelete={handleConfirmDelete}
            />
        </>
    )
}

export default MailList

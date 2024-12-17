import { useEffect, useState, useRef } from 'react'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Dropdown from '@/components/ui/Dropdown'
import ScrollBar from '@/components/ui/ScrollBar'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import NotificationAvatar from './NotificationAvatar'
import NotificationToggle from './NotificationToggle'
import { HiAnnotation } from 'react-icons/hi'
import isLastChild from '@/utils/isLastChild'
import useResponsive from '@/utils/hooks/useResponsive'
import { useNavigate } from 'react-router-dom'

import type { DropdownRef } from '@/components/ui/Dropdown'
import client from '@/services/graphql/apolloClient'
import { FIND_MY_NOTIFICATIONS } from '@/graphql/queries/notification'

type NotificationList = {
    id: string
    target: string
    description: string
    date: string
    image: string
    type: number
    location: string
    locationLabel: string
    status: string
    readed: boolean
}

const notificationHeight = 'h-[280px]'

const transformData = (data: any[]) => {
    if (!data || data.length === 0) {
        return []
    }
    return data.map((notification: any) => {
        return {
            id: notification.id.toString(),
            target: notification.title || 'Notification',
            description: notification.content.substring(0, 10) + '...',
            date: new Date(notification.createdAt).toLocaleString(),
            image: '/img/avatars/default.jpg', // Default image placeholder
            type: notification.active ? 1 : 0, // Assuming type 1 for active
            location: `/notifications/?mail=${notification.id.toString()}`, // Static location as placeholder
            locationLabel: notification?.createdBy?.username || 'Admin', // Assuming createdBy as admin
            status: notification.active ? 'Pending' : 'Inactive',
            readed: notification.viewedBy !== null,
        }
    })
}

const _Notification = ({ className }: { className?: string }) => {
    const [notificationList, setNotificationList] = useState<
        NotificationList[]
    >([])
    const [unreadNotification, setUnreadNotification] = useState(false)
    const [noResult, setNoResult] = useState(false)
    const [loading, setLoading] = useState(false)

    const { larger } = useResponsive()

    const navigate = useNavigate()

    const getNotificationCount = async () => {
        const resp = [
            {
                count: 2,
            },
        ] as any //await apiGetNotificationCount()
        if (resp.count > 0) {
            setNoResult(false)
            setUnreadNotification(true)
        } else {
            setNoResult(true)
        }
    }

    useEffect(() => {
        getNotificationCount()
    }, [])

    const onNotificationOpen = async () => {
        setLoading(true)
        const resp = await client.query({
            query: FIND_MY_NOTIFICATIONS,
            variables: {
                limit: 5,
                offset: 0,
            },
        })

        if (resp.data.myNotifications?.length === 0) {
            setNoResult(true)
        }

        const transformedData = transformData(resp.data.myNotifications)
        console.log(transformedData)

        setNotificationList(transformedData)

        setLoading(false)
    }

    const onMarkAllAsRead = () => {
        const list = notificationList.map((item: NotificationList) => {
            if (!item.readed) {
                item.readed = true
            }
            return item
        })
        setNotificationList(list)
        setUnreadNotification(false)
    }

    const onMarkAsRead = (id: string) => {
        const list = notificationList.map((item) => {
            if (item.id === id) {
                item.readed = true
            }
            return item
        })
        setNotificationList(list)
        const hasUnread = notificationList.some((item) => !item.readed)

        if (!hasUnread) {
            setUnreadNotification(false)
        }
    }

    const notificationDropdownRef = useRef<DropdownRef>(null)

    const handleViewAllActivity = () => {
        navigate('/notifications')
        if (notificationDropdownRef.current) {
            notificationDropdownRef.current.handleDropdownClose()
        }
    }

    return (
        <Dropdown
            ref={notificationDropdownRef}
            renderTitle={
                <NotificationToggle
                    dot={unreadNotification}
                    className={className}
                />
            }
            menuClass="min-w-[280px] md:min-w-[340px]"
            placement={larger.md ? 'bottom-end' : 'bottom'}
            onOpen={onNotificationOpen}
        >
            <Dropdown.Item variant="header">
                <div className="dark:border-gray-700 px-2 flex items-center justify-between mb-1">
                    <h6>Notifications</h6>
                    <Tooltip title="Mark all as read">
                        <Button
                            variant="plain"
                            shape="circle"
                            size="sm"
                            icon={<HiAnnotation className="text-xl" />}
                            onClick={onMarkAllAsRead}
                        />
                    </Tooltip>
                </div>
            </Dropdown.Item>
            <ScrollBar
                className={classNames('overflow-y-auto', notificationHeight)}
            >
                {notificationList.length > 0 &&
                    notificationList.map((item, index) => (
                        <div key={item.id}>
                            <div
                                className={`relative rounded-xl flex px-4 py-3 cursor-pointer hover:bg-gray-100 active:bg-gray-100 dark:hover:bg-gray-700`}
                                onClick={() => {
                                    onMarkAsRead(item.id)
                                    navigate(item.location)
                                }}
                            >
                                <div>
                                    <NotificationAvatar {...item} />
                                </div>
                                <div className="mx-3">
                                    <div>
                                        {item.target && (
                                            <span className="font-semibold heading-text">
                                                {item.target}{' '}
                                            </span>
                                        )}
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: item.description,
                                            }}
                                            className="rich-text-content"
                                        ></span>
                                    </div>
                                    <span className="text-xs">{item.date}</span>
                                </div>
                                <Badge
                                    className="absolute top-4 ltr:right-4 rtl:left-4 mt-1.5"
                                    innerClass={`${
                                        item.readed
                                            ? 'bg-gray-300 dark:bg-gray-600'
                                            : 'bg-primary'
                                    } `}
                                />
                            </div>
                            {!isLastChild(notificationList, index) ? (
                                <div className="border-b border-gray-200 dark:border-gray-700 my-2" />
                            ) : (
                                ''
                            )}
                        </div>
                    ))}
                {loading && (
                    <div
                        className={classNames(
                            'flex items-center justify-center',
                            notificationHeight,
                        )}
                    >
                        <Spinner size={40} />
                    </div>
                )}
                {noResult && notificationList.length === 0 && (
                    <div
                        className={classNames(
                            'flex items-center justify-center',
                            notificationHeight,
                        )}
                    >
                        <div className="text-center">
                            {/* <img
                                className="mx-auto mb-2 max-w-[150px]"
                                src="/img/others/no-notification.png"
                                alt="no-notification"
                            /> */}
                            <h6 className="font-semibold">No notifications!</h6>
                            {/* <p className="mt-1">Please Try again later</p> */}
                        </div>
                    </div>
                )}
            </ScrollBar>
            <Dropdown.Item variant="header">
                <div className="pt-4">
                    <Button
                        block
                        variant="solid"
                        onClick={handleViewAllActivity}
                    >
                        View All Notifications
                    </Button>
                </div>
            </Dropdown.Item>
        </Dropdown>
    )
}

const Notification = withHeaderItem(_Notification)

export default Notification

import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { useSessionUser } from '@/store/authStore'
import { Link } from 'react-router-dom'
import {
    PiUserDuotone,
    PiSignOutDuotone,
    PiSpeedometerThin,
} from 'react-icons/pi'
import { useAuth } from '@/auth'
import ProfileAvatar from '@/views/app/mail/Mail/components/ProfileAvatar'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

const dropdownItemList: DropdownList[] = [
    {
        label: 'Profile',
        path: '/settings',
        icon: <PiUserDuotone />,
    },
]

const _UserDropdown = () => {
    const {
        username,
        id,
        role: role,
    } = useSessionUser((state) => state.user) || {}

    const { signOut } = useAuth()

    const handleSignOut = () => {
        signOut()
    }

    const roleProps = {
        ...(role ? { src: role } : { icon: <PiUserDuotone /> }),
    }

    return (
        <Dropdown
            className="flex !min-w-[250px]"
            toggleClassName="flex items-center"
            renderTitle={
                <div className="cursor-pointer flex items-center">
                    <ProfileAvatar
                        src={username || ''}
                        alt={`${username || 'Anonymous'}`}
                    />
                </div>
            }
            placement="bottom-end"
        >
            <Dropdown.Item variant="header">
                <div className="py-2 px-3 flex items-center gap-3">
                    <ProfileAvatar
                        src={username || ''}
                        alt={`${username || 'Anonymous'}`}
                    />
                    <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100">
                            {username || 'Anonymous'}
                        </div>
                        <div className="text-xs">
                            {role || 'No username available'}
                        </div>
                    </div>
                </div>
            </Dropdown.Item>
            <Dropdown.Item variant="divider" />
            {dropdownItemList.map((item) => (
                <Dropdown.Item
                    key={item.label}
                    eventKey={item.label}
                    className="px-0"
                >
                    <Link className="flex h-full w-full px-2" to={item.path}>
                        <span className="flex gap-2 items-center w-full">
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </span>
                    </Link>
                </Dropdown.Item>
            ))}
            <Dropdown.Item
                eventKey="Sign Out"
                className="gap-2"
                onClick={handleSignOut}
            >
                <span className="text-xl">
                    <PiSignOutDuotone />
                </span>
                <span>Sign Out</span>
            </Dropdown.Item>
        </Dropdown>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown

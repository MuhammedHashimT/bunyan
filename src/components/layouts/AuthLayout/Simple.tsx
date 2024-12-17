import { cloneElement } from 'react'
import Container from '@/components/shared/Container'
import type { ReactNode, ReactElement } from 'react'
import type { CommonProps } from '@/@types/common'

interface SimpleProps extends CommonProps {
    content?: ReactNode
}

const Simple = ({ children, content, ...rest }: SimpleProps) => {
    return (
        <div className="h-full bg-[url('/img/icons/login-shadow.svg')] dark:bg-gray-800">
            <Container className="flex flex-col flex-auto items-center justify-center min-w-0 h-full ">
                <div className="min-w-[320px] md:min-w-[420px] max-w-[420px] bg-neutral p-10 rounded-[2rem] border shadow-md ">
                    <div>
                        {content}
                        {children
                            ? cloneElement(children as ReactElement, {
                                  contentClassName: 'text-center',
                                  ...rest,
                              })
                            : null}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Simple

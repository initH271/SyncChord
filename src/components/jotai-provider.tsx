'use client'

import {Provider} from 'jotai'
import {ReactNode} from 'react'

export const JotaiProviders = ({children}: { children: ReactNode }) => {
    return (
        <Provider>
            {children}
        </Provider>
    )
}
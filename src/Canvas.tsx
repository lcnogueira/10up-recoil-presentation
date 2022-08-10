// import {createContext, useState} from 'react'
import {atom, useRecoilValue, useSetRecoilState} from 'recoil'
import {Rectangle} from './components/Rectangle/Rectangle'
import {PageContainer} from './PageContainer'
import {Toolbar} from './Toolbar'

// -- ELEMENTS IDs
export const elementsState = atom<number[]>({
    key: 'elements',
    default: [],
})

// -- SELECT ELEMENT FEATURE --
export const selectedElementState = atom<number | null>({
    key: 'selectedElement',
    default: null,
})

function Canvas() {
    const elements = useRecoilValue(elementsState)
    const setSelectedElement = useSetRecoilState(selectedElementState)

    return (
        <PageContainer
            onClick={() => {
                setSelectedElement(null)
            }}
        >
            <Toolbar />
            {elements.map((id) => (
                <Rectangle key={id} id={id} />
            ))}
        </PageContainer>
    )
}

export default Canvas

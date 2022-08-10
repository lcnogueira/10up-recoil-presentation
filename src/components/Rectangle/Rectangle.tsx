// import {useContext} from 'react'
import {atomFamily, useRecoilState} from 'recoil'
// import {ElementsContext, SelectedElementContext} from '../../Canvas'
import {selectedElementState} from '../../Canvas'
import {Drag} from '../Drag'
import {RectangleContainer} from './RectangleContainer'
import {RectangleInner} from './RectangleInner'

export type ElementStyle = {
    position: {top: number; left: number}
    size: {width: number; height: number}
}

export type Element = {style: ElementStyle}

// elementState(1) ->  atom for element 1
// elementState(2) ->  atom for element 2
// elementState(3) ->  atom for element 3
const elementState = atomFamily<Element, number>({
    key: 'element',
    default: {
        style: {
            position: {top: 0, left: 0},
            size: {width: 50, height: 50},
        },
    },
})

// export const Rectangle = ({element, index}: {element: Element; index: number}) => {
export const Rectangle = ({id}: {id: number}) => {
    // const {selectedElement, setSelectedElement} = useContext(SelectedElementContext)
    const [selectedElement, setSelectedElement] = useRecoilState(selectedElementState)

    // const {setElement} = useContext(ElementsContext)
    const [element, setElement] = useRecoilState(elementState(id))

    return (
        <Drag
            position={element.style.position}
            onDrag={(position) => {
                // setElement(index, {
                //     style: {
                //         ...element.style,
                //         position,
                //     },
                // })
                setElement({
                    style: {
                        ...element.style,
                        position,
                    },
                })
            }}
        >
            <div>
                <RectangleContainer
                    position={element.style.position}
                    size={element.style.size}
                    onSelect={() => {
                        // setSelectedElement(index)
                        setSelectedElement(id)
                    }}
                >
                    {/* <RectangleInner selected={index === selectedElement} /> */}
                    <RectangleInner selected={id === selectedElement} />
                </RectangleContainer>
            </div>
        </Drag>
    )
}

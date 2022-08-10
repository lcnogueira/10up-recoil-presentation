import {atomFamily, useRecoilState} from 'recoil'
import {selectedElementState} from '../../Canvas'
import {Drag} from '../Drag'
import {RectangleContainer} from './RectangleContainer'
import {RectangleInner} from './RectangleInner'

export type ElementStyle = {
    position: {top: number; left: number}
    size: {width: number; height: number}
}

export type Element = {style: ElementStyle}

//ATOM FAMILY!
// elementState(1) ->  atom for element 1
// elementState(2) ->  atom for element 2
// elementState(3) ->  atom for element 3
const elementState = atomFamily<Element, number>({
    key: 'element',
    default: {
        style: {
            position: {top: 100, left: 100},
            size: {width: 100, height: 100},
        },
    },
})

export const Rectangle = ({id}: {id: number}) => {
    const [selectedElement, setSelectedElement] = useRecoilState(selectedElementState)
    const [element, setElement] = useRecoilState(elementState(id))

    return (
        <Drag
            position={element.style.position}
            onDrag={(position) => {
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
                        setSelectedElement(id)
                    }}
                >
                    <RectangleInner selected={id === selectedElement} />
                </RectangleContainer>
            </div>
        </Drag>
    )
}

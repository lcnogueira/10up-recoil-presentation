import {Icon, IconButton, VStack} from '@chakra-ui/react'
import {Square} from 'react-feather'
// import {useContext} from 'react'
// import {ElementsContext} from './Canvas'
import {useSetRecoilState} from 'recoil'
import {elementsState} from './Canvas'

export const Toolbar = () => {
    // const {addElement} = useContext(ElementsContext)
    const setElements = useSetRecoilState(elementsState)

    return (
        <VStack
            position="absolute"
            top="20px"
            left="20px"
            backgroundColor="white"
            padding={2}
            boxShadow="md"
            borderRadius="md"
            spacing={2}
        >
            <IconButton
                // onClick={addElement}
                onClick={() => {
                    setElements((elements) => [...elements, elements.length])
                }}
                aria-label="Add rectangle"
                icon={<Icon style={{width: 24, height: 24}} as={Square} />}
            />
        </VStack>
    )
}

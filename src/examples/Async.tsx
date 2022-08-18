import {Container, Heading, Text} from '@chakra-ui/layout'
import {Button} from '@chakra-ui/react'
import {Select} from '@chakra-ui/select'
import {Suspense, useState} from 'react'
import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import {atomFamily, selectorFamily, useRecoilValue, useSetRecoilState} from 'recoil'
import {getWeather} from './fakeAPI'

const userState = selectorFamily({
    key: 'user',
    //by default, if you have an async selector and use it in a component, the component will suspend
    get: (userId: number) => async () => {
        const userData = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then((res) => res.json())

        //fake error
        if (userId === 4) throw new Error('User does not exist')

        return userData
    },
})

//used to force a refetch on the weather state (ODD!!!!!!)
const weatherRequestIdState = atomFamily({
    key: 'weatherRequestId',
    default: 0,
})

const useRefetchWeather = (userId: number) => {
    const setRequestId = useSetRecoilState(weatherRequestIdState(userId))
    return () => setRequestId((id) => id + 1)
}

const weatherState = selectorFamily({
    key: 'weather',
    get:
        (userId: number) =>
        async ({get}) => {
            //force the selector to refresh
            get(weatherRequestIdState(userId))
            //No need to await (altough there's an async function in the selectorFamily)
            const user = get(userState(userId))
            const weather = await getWeather(user.address.city)
            return weather
        },
})

const UserWeather = ({userId}: {userId: number}) => {
    const weather = useRecoilValue(weatherState(userId))
    const user = useRecoilValue(userState(userId))
    const refetch = useRefetchWeather(userId)

    return (
        <>
            <Text>
                <b>Weather for {user.address.city}:</b> {weather}C
            </Text>
            <Button onClick={refetch}>Refresh</Button>
        </>
    )
}

const UserData = ({userId}: {userId: number}) => {
    //no problem in calling the same selectorFamily in different places since the fetch only happens once
    const user = useRecoilValue(userState(userId))

    return (
        <div>
            <Heading as="h2" size="md" mb={1}>
                User data:
            </Heading>
            <Text>
                <b>Name:</b> {user.name}
            </Text>
            <Text>
                <b>Phone:</b> {user.phone}
            </Text>
            <Suspense fallback={<div>loading weather...</div>}>
                <UserWeather userId={userId} />
            </Suspense>
        </div>
    )
}

const ErrorFallback = ({error}: FallbackProps) => {
    return (
        <div>
            <Heading as="h2" size="md" mb={1}>
                Something went wrong
            </Heading>
            <Text>{error.message}</Text>
        </div>
    )
}

export const Async = () => {
    const [userId, setUserId] = useState<undefined | number>(undefined)

    return (
        <Container py={10}>
            <Heading as="h1" mb={4}>
                View Profile
            </Heading>
            <Heading as="h2" size="md" mb={1}>
                Choose a user:
            </Heading>
            <Select
                placeholder="Choose a user"
                mb={4}
                value={userId}
                onChange={(event) => {
                    const value = event.target.value
                    setUserId(value ? parseInt(value) : undefined)
                }}
            >
                <option value="1">User 1</option>
                <option value="2">User 2</option>
                <option value="3">User 3</option>
                <option value="4">User 4</option>
            </Select>
            {userId !== undefined && (
                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    resetKeys={[userId]}
                >
                    <Suspense fallback={<div>Loading...</div>}>
                        <UserData userId={userId} />
                    </Suspense>
                </ErrorBoundary>
            )}
        </Container>
    )
}

import { useEffect, useState } from "react";
import { request } from "../../apis/requestBuilder";

export default function FetchDataComponent(){
    const [someData, setSomeData] = useState([])

    const fetchData = async() => {
        const response = await request.get(`/friend/list`, {
            id: 1
        })
        // const response = await request.get(`/todos/${todoId}`)
        // const response = await request.post(`todos`, {
        //     userId: userId
        // })

        console.log(response)
        console.log(response.data)

        const { data } = response
        setSomeData(data)
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            {someData.map(item => <div key={item.id}>{item.name}</div>)}
        </>
    )
}

// export default function FriendList(){
//     const [someData, setSomeData] = useState(null)

//     const fetchData = async() => {
//         const response = await request.get(`/todos`)
//         // const response = await request.get(`/todos/${todoId}`)
//         // const response = await request.post(`todos`, {
//         //     userId: userId
//         // })



//         const { data } = response

//         setSomeData(data)
//     }

//     useEffect(() => {
//         fetchData();
//     }, [])

//     if (!someData) {
//         return <div></div>
//     }

//     return (
//         <>
//             <span>{someData.username}</span>
//             <span>{someData.id}</span>
//         </>
//     )
// }
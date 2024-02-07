import { collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"
import { UserDetail } from "./userDetails"
import { db } from "../firebase"
import { generateRandomRoomId } from "../backend/extras"
import axios from "axios"
import { GameCanvas } from "./GameCanvas"
const { useState, useRef } = require("react")

export const MainApp = () => {
    const [roomId, setRoomId] = useState(null)
    const [messages, setMessages] = useState({})
    const [result, setResult] = useState(null)
    const [gameData, setGameData] = useState(null)
    const [_docRef, setDocRef] = useState();
    let docRef;
    const inputRef = useRef(null)
    //this is made to send in next component
    const roomsRef = collection(db, "rooms");
    const uid = JSON.parse(localStorage.userDetails).uid;
    const attachHook = () => {

        let unsubscribe = onSnapshot(docRef, (doc) => {
            let data = doc.data()
            //when gameData is not but we receive set 
            if (gameData === null && data.gameId) {
                setGameData(data)
                // unsubscribe()
            }

            //when messages is changed i.e updated
            if (data.messages !== messages) {

                setMessages(data.messages)
                //check if both values have 3 messages i.e total 6 messages
                let messageCount = 0
                console.log("now running loop", messageCount)
                for (let key in data.messages) {

                    console.log("messageCount is increased")
                    messageCount += data.messages[key].length

                }
                //the host will call backend for result if meessage is 6
                if (messageCount === 6 && uid === data.gameStarter) {
                    let toBackend = {
                        type: "Result",
                        gameId: data.gameId,
                        question: data.questions,
                        answers: data.messages
                    }
                    //send to backend
                    axios.post("https://argumentgpt-server.sandiph.workers.dev", toBackend).then((res) => {
                        let result = JSON.parse(res.data)
                        setResult(result)
                    })
                }


            }

        })

    }

    const hostRoom = async () => {
        //get Roomid
        let newRoomId = generateRandomRoomId()
        setRoomId(newRoomId)
        //create document using setDoc
        let data = {
            result: {

            },
            questions: {},
            messages: {
                [uid]: []
            },
            users: [
                uid
            ],
            gameId: "",
            answers: {

            },
            gameStarter: uid
        }
        docRef = doc(roomsRef, newRoomId)
        setDocRef(docRef)
        await setDoc(docRef, data)
        //attach the document listener
        attachHook(docRef)
    }
    const joinRoom = async () => {
        //get the document

        let newRoomId = inputRef.current.value;
        setRoomId(newRoomId)
        docRef = doc(roomsRef, newRoomId)
        setDocRef(docRef)
        //attach the document listener
        attachHook(docRef)

        //add new user in same room 
        const docu = (await getDoc(docRef)).data()
        docu.users.push(uid)
        docu.messages[uid] = []
        let usersArray = docu.users
        updateDoc(docRef, docu) //updating the data

        //get data from backend and set it
        let toBackend = {
            users: usersArray,
            roomId: newRoomId,
            reqType: "GameStart"
        }
        axios.post("https://argumentgpt-server.sandiph.workers.dev", toBackend).then(res => {
            console.log(res.data)
            //now i have the gameId i want to update the firestore's document with docRef to that gameID
            updateDoc(docRef, { "gameId": res.data.gameId, questions: res.data.qa.questions, answers: res.data.qa.answers })

        })
    }

    return (
        gameData ? (<GameCanvas result={result} gamedata={gameData} docRef={_docRef} messages={messages} />) :
            (<div className="flex">

                {roomId && (<p> Connected Room id: {roomId}</p>)}

                <div>
                    UserDetails:
                    <UserDetail />
                </div>

                <div>
                    <button className="border-2 border-red-500" onClick={hostRoom}>Host Game</button>
                </div>
                <div> Join Game :
                    <input ref={inputRef} className=" bg-blue-500" />
                    <button className="border-2 border-red-500" onClick={joinRoom}> Join Game </button>

                </div>
            </div >
            )


    )


}
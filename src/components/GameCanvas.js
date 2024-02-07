import { collection, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
export const GameCanvas = ({ result, docRef, messages, gamedata }) => {
    const uid = JSON.parse(localStorage.userDetails).uid;
    const inputRef = useRef(null)
    const onSubmit = () => {
        let text = inputRef.current.value;
        //update in firestore doc
        sendMessage(text)

    }
    const sendMessage = async (text) => {
        const messagesObj = (await getDoc(docRef)).data().messages; //getting the data
        messagesObj[uid].push(text)    //adding new data
        await updateDoc(docRef, { messages: messagesObj }) //updating the data
    }

    return (
        <div className="main h-full">
            <div className="w-full border-indigo-950 border-2">
                <p> Your Question is  {gamedata.questions}</p>
                Your Answer is <p className="font-bold"> {gamedata.answers[uid]} </p>
                Defend Your Answer:

                <div className="border-2 border-green-500 h-64">

                    {
                        JSON.stringify(messages)
                        // messages sent by own
                    }
                </div>
                <input ref={inputRef} className="h-12 w-64 bg-slate-600" />
                <div>
                    <button onClick={onSubmit} className="bg-green-300"> Submit Answer </button>
                </div>
            </div>

            <div>Results will be here: {result && (JSON.stringify(result))} </div>

        </div>
    );
};



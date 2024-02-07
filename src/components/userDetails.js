import { useState } from "react"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"
export const UserDetail = () => {
    let user = JSON.parse(localStorage.userDetails)
    return (<div className="flex border-2 border-green-800">
        <div className="w-1/3 h-12"> <img className="w-full h-full" src={user.image} /> </div>
        <div className="w-1/3 "> Name: {user.name} </div>
        <div className="w-1/3 "> Coins: {user.coins} </div>
        <button onClick={() => signOut(auth)}>Sign Out</button>

    </div>)

}
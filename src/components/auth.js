import { sendPasswordResetEmail, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { getCoins } from "../backend/coins";

export const Auth = ({ setUser }) => {
    const signInWithGoogle = async () => {
        let result = await signInWithPopup(auth, googleProvider)
        let user = result.user
        let coins = await getCoins(user.uid)
        let userDetails = {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
            coins: coins
        }
        localStorage.userDetails = JSON.stringify(userDetails);
        setUser(userDetails)
    }
    return (
        <button onClick={signInWithGoogle}> Sign in With Google</button>
    )
}
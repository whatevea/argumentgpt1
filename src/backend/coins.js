import { db } from "../firebase";
import { setDoc, doc, runTransaction, getDoc, collection, addDoc } from "firebase/firestore";

// Reference to the "user_coins" collection in Firestore
const userCoinsRef = collection(db, "user_coins");

export async function getCoins(uid) {
    try {
        // Use the user's UID as the document ID
        const userCoinsDocRef = doc(userCoinsRef, uid);

        // Retrieve the user's coins from Firestore
        const userCoinsDoc = await getDoc(userCoinsDocRef);

        if (userCoinsDoc.exists()) {
            console.log("userexist already")
            // Return the amount of coins
            return userCoinsDoc.data().coins;
        } else {
            // If the user does not have a document yet set 0 for future use and , return 0
            setDoc(userCoinsDocRef, { "coins": 0 })
            return 0;
        }
    } catch (error) {
        console.error("Error getting user coins:", error.message);
        throw error;
    }
}
export async function addCoins(uid, amount) {
    try {
        // Use the user's UID as the document ID
        const userCoinsDocRef = doc(userCoinsRef, uid);

        // Update the amount of coins using Firestore transaction
        await runTransaction(db, async (transaction) => {
            const userCoinsDoc = await getDoc(userCoinsDocRef);

            // Get the current amount of coins
            const currentAmount = userCoinsDoc.exists() ? userCoinsDoc.data().coins : 0;

            // Set the document with the new amount
            transaction.set(userCoinsDocRef, { uid, coins: currentAmount + amount }, { merge: true });
        });

    } catch (error) {
        console.error("Error adding user coins:", error.message);
        throw error;
    }
}

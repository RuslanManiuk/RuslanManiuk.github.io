import {collection, addDoc, updateDoc, doc, deleteDoc, serverTimestamp} from "firebase/firestore";
import { db } from "../firebase";

export const addApartment = async (apartmentData) => {
    try {
        const docRef = await addDoc(collection(db, "apartments"), {
            ...apartmentData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding apartment:", error);
        throw error;
    }
};

export const updateApartment = async (apartmentId, apartmentData) => {
    try {
        await updateDoc(doc(db, "apartments", apartmentId), {
            ...apartmentData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating apartment:", error);
        throw error;
    }
};

export const deleteApartment = async (apartmentId) => {
    try {
        await deleteDoc(doc(db, "apartments", apartmentId));
    } catch (error) {
        console.error("Error deleting apartment:", error);
        throw error;
    }
};

export const getApartmentById = async (apartmentId) => {
    try {
        const docRef = doc(db, "apartments", apartmentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting apartment:", error);
        throw error;
    }
};
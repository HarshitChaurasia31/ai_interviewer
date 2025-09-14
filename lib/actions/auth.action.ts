'use server';
import { db } from "@/app/Firebase/admin";

export async function signUp(params: SignUpParams){
    const {uid,name,email}=params;
    try{
        const userRecord = await db.collection("users").doc(uid).get();

        if(userRecord.exists){
            return {
                success :false,
                messeage : "User already exist please sign in."
            }
        }
        await db.collection("users").doc(uid).set({
            name,email
        })
    } catch(e : any){
        console.error("Error creating a user",e);

        if(e.code === 'auth/email-already-exists'){
            return {
                success:false,
                messeage : "Email already in use."
            }
        }
        return {
            success:false,
            message : "Failed to create an account."
        }
    }
}
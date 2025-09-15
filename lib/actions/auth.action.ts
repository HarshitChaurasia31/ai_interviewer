'use server';
import { auth, db } from "@/app/Firebase/admin";
import { cookies } from "next/headers";
import { success } from "zod";

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
        return {
            success : true,
            message : "Account created successfully please sign in"
        }
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

export async function signIn ( params : SignInParams) {
  const {email,idToken} = params;

  try{
    const userRecord = await auth.getUserByEmail(email);

    if(!userRecord){
        return {
            success :false,
            message : "User does not exist. Create an account instead."
        }
    }

    await setSessionCookie(idToken);
  }catch(e){
    console.log(e);

    return {
        success : false,
        message: "Failed to log into an account"
    }
  }
}


export async function setSessionCookie(idToken : string){
    const cookieStore = await cookies();

    const sessionCookie= await auth.createSessionCookie(idToken,{
        expiresIn: 60 * 60 * 24* 7 * 1000,
    })

    cookieStore.set("session",sessionCookie,{
        maxAge : 60 * 60 * 24 *7,
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax"
    })
}

export async function getCurrentUser(): Promise<User | null>{
    const cookiesStore = await cookies();

    const sessionCookie = cookiesStore.get('session')?.value;

    if(!sessionCookie) return null;

    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie,true);

        const userRecord = await db.collection("users")
        .doc(decodedClaims.uid).get();

        if(!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        }as User;
    }catch(e){
        console.log(e)

        return null;
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();

    return !!user; //true or false
}
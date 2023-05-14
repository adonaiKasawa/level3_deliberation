import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { loginUser } from "../global/auth/auth.slice";
import { useAppDispatch } from "../global/hooks";

const auth = () => {
    const router = useRouter();
    console.log(router);
    const dispatch = useAppDispatch()

    useEffect(() =>{
        setTimeout(()=>{
            if (router.query.access_token !== undefined && router.query.refresh_token !== undefined ) {
                dispatch(loginUser({
                    access_token: router.query.access_token,
                    refresh_token: router.query.refresh_token,
                    isAuthenticated: true
                }));
                router.push('/');
            }else{
                console.log('non tokens');
            }
        },3000)
    })

    return <>
        <div className="col-8 offset-2 mt-5">
            <div className="align-center">
                <h1 className="center">Level3</h1>
            </div>
            <div>
                <p>vous allez être connecter dans 5sec</p>
                <p>si vous etes pas rediriger automatimant apres 5sec cliquez 
                    <Link href="http://localhost:3000/login">
                        <a>login</a>
                    </Link>
                </p>
            </div>
        </div>
    </>
}

auth.getLayout = (page: ReactNode) => <>{page}</>
export default auth;
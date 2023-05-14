import { useRouter } from "next/router";
import { selectAuth } from "../global/auth/auth.slice";
import { useAppSelector } from "../global/hooks";
import { readSectionByUser } from "../services";


export default function Index() {
  const Auth = useAppSelector(selectAuth);
  const router = useRouter();
  console.log(Auth);
    
  return (
          <div>
            <h1>
              Readme
            </h1>
          </div>
  )
    
}

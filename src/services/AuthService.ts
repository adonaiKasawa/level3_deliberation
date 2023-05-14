import { httpRequest } from "./httpRequest"

interface credentials{
    credantial : string
    password   : string
}
export const AuthLogin = async (credentials: credentials) => await httpRequest('/auth/local/signin','POST',credentials);

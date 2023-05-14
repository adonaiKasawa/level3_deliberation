import jwtDecode from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import config from "../../components/config";
import { selectAuth } from "../../global/auth/auth.slice";
import { useAppSelector } from "../../global/hooks";
import { readSection, readSectionByUser, readUniteByTitulaire } from "../../services";

interface Props {
  sections:any[]
}
interface DepartementState {
  createdAt: string,
  updatedAt: string,
  deletedAt: null,
  id_departement: number,
  nom_departement: string
}
const Cours = ({sections}: Props) => {

  const Auth = useAppSelector(selectAuth);
  const user = Auth.access_token? jwtDecode(Auth.access_token):null;
  const router = useRouter();
  const [cours, setCours] = useState([]);

  const getCours =  async () => {
    const getcours = await readUniteByTitulaire(user.id_user);
    if (getcours.data !== undefined) {
      console.log(getcours.data);
      setCours(getcours.data)
    }
  }
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getCours();
    }
    return () => {
      isMounted = false;
    }
  }, []);

  return(
    <section className="content">
      <div className="container-fluid">
        <div className="col-sm-6">
          <h1 className="">Cours</h1>
          <hr />
        </div>
        <div className="row">
          {cours?.map((item: any, i: number) =>
            <div className="col-md-4 col-sm-6 col-12" key={i}>
              <Link href={`${config.url}cours/${item.id_unit_prom_titulaire}`}>
                <a className="card-link">
                  <div className="info-box shadow-lg">
                    <span className="info-box-icon bg-info"><i className="far fa-star"/></span>
                    <div className="info-box-content">
                      <span className="info-box-text">{item.unite_ensiegnement.nom}</span>
                      <span className="info-box-number">{item.promotion.nom_promotion} {item.promotion.systeme} {item.promotion.vacation} </span>
                    </div>
                  </div>
                </a>
              </Link>
            </div>)
          }
        </div>
        <div className="row">
        
        </div>
      </div>
    </section>
  )
}
export default Cours;


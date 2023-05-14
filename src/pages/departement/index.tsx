import jwtDecode from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import config from "../../components/config";
import { selectAuth } from "../../global/auth/auth.slice";
import { selectExerciceEncours } from "../../global/exerciceEncours/exerciceEncours.slice";
import { useAppSelector } from "../../global/hooks";
import { readSection, readSectionByUser } from "../../services";

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
const Departement = ({sections}: Props) => {

  const Auth = useAppSelector(selectAuth);
  const user = Auth.access_token? jwtDecode(Auth.access_token):null;
  const router = useRouter();
  const [departements, setDepartements] = useState<DepartementState[]>();
  const exercice = useAppSelector(selectExerciceEncours)
  useEffect(() =>{
    const section =  sections?.find(item => item.user !== null && item.user.id_user === user.id);
    setDepartements(section?.departements);
  })

  return(
    <section className="content">
      <div className="container-fluid">
        <div className="col-sm-6">
          <h1 className="">departements</h1>
          <hr />
        </div>
        <div className="row">
          {departements?.map((item: DepartementState, i: number) =>
            <div className="col-md-4 col-sm-6 col-12" key={i}>
              <Link href={`${config.url}departement/${item.id_departement}?exercice=${exercice.id_exercice}`}>
                <a className="card-link">
                  <div className="info-box shadow-lg">
                    <span className="info-box-icon bg-info"><i className="far fa-star"/></span>
                    <div className="info-box-content">
                      <span className="info-box-text">{item.nom_departement}</span>
                      <span className="info-box-number">...</span>
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
export default Departement;

export const getServerSideProps = async () => {
  const section = await readSection();
  return {
    props: {
      sections: section.data
    }
  }
}
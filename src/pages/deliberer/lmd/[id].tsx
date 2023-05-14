import Link from "next/link";
import { useRouter } from "next/router";
import config from "../../../components/config";
import { selectExerciceEncours } from "../../../global/exerciceEncours/exerciceEncours.slice";
import { useAppSelector } from "../../../global/hooks";
import { readDeliberationByPromtion } from "../../../services";

interface Props{
  deliberation: any[]
}

const deliberationDetails = ({deliberation}: Props) => {
  const router = useRouter();
  console.log(router.query);
  const session = router.query?.session;
  const promotion = deliberation[0]?.etudiant?.promotion?.nom_promotion;
  const vacation = deliberation[0]?.etudiant?.promotion?.vacation;
  const departement = deliberation[0]?.etudiant?.promotion?.departement?.nom_departement;
  const exercice = useAppSelector(selectExerciceEncours);
  let SV = 0;
  let SNV = 0;
 
  deliberation.map((item:any) => {
    if (item.session == session) {
      if (item.descision === 'SV' ) {
        SV += 1;
      }else if (item.descision == 'SNV'){
        SNV += 1;
      }
    }
  })
  return (
    <div>
      <div className="col-12">
        <h1 className="">details de la deliberation   {`( ${promotion} ${departement} ${vacation} )`}</h1>
        <hr />
      </div>
      <div className="row">
        <div className="col-md-4 col-ms-4 col-12">
          <div className="card card-primary">
            <div className="card-header">
                <h3 className="card-title">status de la promotion</h3>
            </div>
            <div className="card-body table-responsive p-0" style={{height: 300}}>
              <table className="table table-head-fixed">
                <tbody>
                  <tr>
                    <th>SEMESTRE VALIDE</th>
                    <td>{SV}</td>
                  </tr>
                  <tr>
                    <th>SEMESTRE NON VALIDE</th>
                    <td>{SNV}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div> 
        </div>
        <div className="col-md-8 col-ms-8 col-12">
          <div className="card card-primary">
            <div className="card-header">
              <h3 className="card-title">liste des etudiants </h3>
            </div>
            <div className="card-body table-responsive p-0" style={{height: 300}}>

              <table className="table table-head-fixed">
                <thead>
                    <tr>
                      <th>ID</th>
                      <th>Etudiant</th>
                      <th>Pourcentage</th>
                      <th>Dession</th>
                      <th>releves</th>
                    </tr>
                </thead>
                <tbody>
                  {deliberation.map((item: any,i:number) => {
                    if (item.session == session) 
                    return (
                      <tr key={i}>
                        <td>{i+1}</td>
                        <td>{item.etudiant.nom_etudiant} 
                        {item.etudiant.postnom_etudiant} {item.etudiant.prenom_etudiant} </td>
                        <td>{item.poucentage}</td>
                        <td>{item.descision}</td>
                        <td>
                          <Link href={`${config.url}releve/lmd/${item.etudiant.id_etudiant}?semestre=${session}&exercice=${exercice.id_exercice}`}>
                            <a>
                              releve
                            </a>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default deliberationDetails

export const getServerSideProps = async (route: any) => {
  const deliberation = await readDeliberationByPromtion(route.query.id, route.query.exercice);

  return {
    props: {
      deliberation: deliberation.data
    }
  }
}

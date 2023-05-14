import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { ReactNode } from "react";
import ReactToPrint from "react-to-print";
import { createCoteEtudiant, CreateCoteEtudiantData, readReleveByEtudiantId, readUnitPromTitulaireByPromotionId, RelevesData, updateReleves } from "../../services";

interface Props {
  releves: any[]
  unites: any[]
  _onUpdate: boolean
}

const ComponentToPrint = React.forwardRef<any | null, Props>(({ releves, unites, _onUpdate }: Props, ref) => {
  const [cpt, setCpt] = useState<any[]>([])
  const router = useRouter();
  const session = router.query?.session;
  const exercice = router.query?.exercice;
  useEffect(() => {
    let isMount = true;
    if (isMount) {
      let coursPt: any[] = []
      unites.map((item: any) => {
        if (item.semestre === session) {
          coursPt.push(item)
        }
      });
      setCpt(coursPt);
    }
    return () => {
      isMount = false;
    }
  }, [])
  const etudiant = releves[0]?.etudiant;
  let TOTALUNITE = cpt.length;
  let TOTALCREDIT = 0;
  let NOMBRSECHECS = 0;
  let NOMBRSECHECSGRAVES = 0;
  let NOMBRSECHECSLEGERES = 0;
  let TOTALPOINTOBTENUE = 0;
  let DECISION = '';
  for (let i = 0; i < unites.length; i++) {
    const element = unites[i];
    TOTALCREDIT += element?.credit;
    element?.releves?.map((r: any, e: number) => {
      if (r?.etudiant.id_etudiant === etudiant?.id_etudiant) {
        let pts = r.tj + r.ex
        if (pts < 10) {
          NOMBRSECHECS += 1;
          if (pts < 8) {
            NOMBRSECHECSGRAVES += 1
          } else {
            NOMBRSECHECSLEGERES += 1
          }
        }
        TOTALPOINTOBTENUE += pts * element?.credit;
      }
    })
  }
  let POURCENTAGE = Math.round(100 * TOTALPOINTOBTENUE / (TOTALCREDIT * 20));
  if (POURCENTAGE < 50) {
    DECISION = 'A';
  } else if (POURCENTAGE >= 50 && POURCENTAGE <= 69 && NOMBRSECHECSGRAVES == 0) {
    DECISION = 'S';
  } else if (POURCENTAGE >= 70 && POURCENTAGE <= 79 && NOMBRSECHECSGRAVES == 0) {
    DECISION = 'D';
  } else if (NOMBRSECHECSGRAVES > 0) {
    DECISION = 'AA'
  } else {
    DECISION = 'GD'
  }

  return <>
    <div className="col-4 offset-4 mt-5" ref={ref}>
      <div className="align-center">
        <a href="#">
          <h1 className="center" onClick={() => { router.back(); }}>Level3</h1>
        </a>
        <h5 className="float-center">Relevé des côtes</h5>
      </div>

      <div className="row mb-5">
        <table border={1}>
          <tbody>
            <tr>
              <th>Etudiant</th>
              <td>{etudiant?.nom_etudiant} {etudiant?.postnom_etudiant} {etudiant?.prenom_etudiant}</td>
            </tr>
            <tr>
              <th>Totale de points à obtenir</th>
              <td>{TOTALCREDIT * TOTALUNITE}</td>
            </tr>
            <tr>
              <th>Total de crédit</th>
              <td>{TOTALCREDIT}</td>
            </tr>
            <tr>
              <th>Nombres d'échecs</th>
              <td>{NOMBRSECHECS}</td>
            </tr>
            <tr>
              <th>Echecs graves</th>
              <td>{NOMBRSECHECSGRAVES}</td>
            </tr>
            <tr>
              <th>Echecs legers</th>
              <td>{NOMBRSECHECSLEGERES}</td>
            </tr>
            <tr>
              <th>Total obtenue</th>
              <td>{TOTALPOINTOBTENUE}</td>
            </tr>
            <tr>
              <th>Pourcentage</th>
              <td>{POURCENTAGE}%</td>
            </tr>
            <tr>
              <th>decision</th>
              <td>{_onUpdate ? <select name="" id="">
                <option value="A">A</option>
                <option value="AA">AA</option>
                <option value="S">S</option>
                <option value="D">D</option>
                <option value="GD">GD</option>
              </select> : DECISION}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="row">
        <table border={1}>
          <thead>
            <tr>
              <th>Unite d'ensiegnement</th>
              <th>crédit</th>
              <th>point</th>
            </tr>
          </thead>
          <tbody>
            {unites && unites?.map((item: any, i: number) => {
              let pts = 0;
              let releveId = 0;
              return <>
                {item?.releves && item?.releves?.map((r: any, e: number) => {
                  if (r?.etudiant.id_etudiant === etudiant?.id_etudiant) {
                    pts = r.tj + r.ex
                    releveId = r.id_releve
                    if (pts <= 9) {
                      return (
                        <tr key={i}>
                          <td>{item?.unite_ensiegnement?.nom}</td>
                          <td>{item?.credit}</td>
                          <td>
                            {_onUpdate ? <>
                              <input
                                type="number"
                                className={`form-control  ${releveId}`}
                                id={item.id_unit_prom_titulaire}
                                name="tj"
                                placeholder={'tj'}
                                max={10} min={0}
                              />
                              <input
                                type="number"
                                className={`form-control  ${releveId}`}
                                id={item.id_unit_prom_titulaire}
                                name="ex"
                                placeholder={'ex'}
                                max={10} min={0}
                              />
                            </> : <span>{pts}</span>
                            }
                          </td>
                        </tr>
                      )
                    }
                  }
                })
                }
              </>

            })
            }
          </tbody>
        </table>
      </div>
    </div>
  </>
})

const releveByEtudiant = ({ releves, unites }: Props) => {
  const etudiantId = releves[0]?.etudiant?.id_etudiant;

  const componentRef = useRef(null);

  const [loading, setLoading] = React.useState(false);
  const [onUpdate, setOnUpdate] = React.useState(false);
  const router = useRouter();

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const reactToPrintTrigger = React.useCallback(() => {
    // Good
    return <button className="btn btn-primary mt-5 col-4 offset-4">Print</button>;
  }, []);

  const AllUpdateCoteByUniteEnseignment = async () => {
    const allInputs = document.getElementsByTagName('input');
    const allUpdate: CreateCoteEtudiantData[] = [];
    const preAllUpdate = [];
    const verifyUpdate: RelevesData[] = [];
    const preVerifyUpdate = []
    let error = false;
    for (let i = 0; i < allInputs.length; i++) {
      const input = allInputs[i];
      const releveId = +input.classList[1];
      if (input.name === "tj") {
        let tj = parseInt(input.value);
        if (tj !== NaN && tj >= 0 && tj <= 10) {
          preAllUpdate.push({
            unitPromTitulaire: parseInt(input.id),
            etudiantId,
            tj,
          })
          preVerifyUpdate.push({
            releveId,
            tj,
            motif: "recours"
          })
        } else {
          input.style.border = "red 1px solid"
          error = true
        }

      } else if (input.name === "ex") {
        let ex = parseInt(input.value);
        if (ex !== NaN && ex >= 0 && ex <= 10) {
          preAllUpdate.push({
            unitPromTitulaire: parseInt(input.id),
            etudiantId,
            ex,
          })

          preVerifyUpdate.push({
            releveId,
            ex,
            motif: "recours"
          })

        } else {
          input.style.border = "red 1px solid"
          error = true
        }
      }
    }
    for (let i = 0; i < preAllUpdate.length; i++) {
      const releve = preAllUpdate[i];
      const find = allUpdate.find(item => item.unitPromTitulaire === releve.unitPromTitulaire);
      if (find) {
        if (find?.ex) {
          find.tj = releve.tj
        } else if (find?.tj) {
          find.ex = releve.ex
        }
      } else {
        allUpdate.push(releve);
      }

    }
    for (let i = 0; i < preVerifyUpdate.length; i++) {
      const releve = preVerifyUpdate[i];
      const find = verifyUpdate.find(item => item.releveId === releve.releveId);
      if (find) {
        if (find?.ex) {
          find.tj = releve.tj
        } else if (find?.tj) {
          find.ex = releve.ex
        }
      } else {
        verifyUpdate.push(releve);
      }
    }
    let CreateCoteEtudiant: any;
    const UpdateReleves = await updateReleves(verifyUpdate)
    if (UpdateReleves?.updateReleve?.data !== undefined && UpdateReleves?.updateReleve.statusText === "OK") {
      allUpdate?.map(async (item: CreateCoteEtudiantData, i: number) => {
        CreateCoteEtudiant = await createCoteEtudiant([{
          etudiantId,
          tj: item?.tj,
          ex: item?.ex
        }], item.unitPromTitulaire);
      });
      alert("la modification se passer avec succé la page vas se récharger")
      router.reload();
    } else {
      alert("Une erruer est survenue lors du traitement de la requete!")
    }

  }

  return (
    <div>
      <ReactToPrint
        content={reactToPrintContent}
        documentTitle="AwesomeFileName"
        trigger={reactToPrintTrigger}
      />
      {onUpdate ?
        <>
          <button onClick={() => AllUpdateCoteByUniteEnseignment()}
            className="btn btn-success mt-1 col-4 offset-4">Confirme la modification</button>
          <button onClick={() => setOnUpdate(false)}
            className="btn btn-danger mt-1 col-4 offset-4">Annuler</button>
        </>
        :
        <button onClick={() => setOnUpdate(true)}
          className="btn btn-primary mt-1 col-4 offset-4" >Voulez-vous modifier</button>
      }
      <ComponentToPrint _onUpdate={onUpdate} releves={releves} unites={unites} ref={componentRef} />
    </div>
  );
};

releveByEtudiant.getLayout = (page: ReactNode) => <>{page}</>
export default releveByEtudiant;

export const getServerSideProps = async (route: any) => {
  const releves = await readReleveByEtudiantId(route.query.id, route.query.exercice);
  const PromotionId = releves.data[0]?.etudiant?.promotion.id_promotion
  const unitPromTitRels = await readUnitPromTitulaireByPromotionId(PromotionId, route.query.exercice)

  return {
    props: {
      releves: releves.data,
      unites: unitPromTitRels?.data
    }
  }
}

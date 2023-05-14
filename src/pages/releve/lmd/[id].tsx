import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { ReactNode } from "react";
import ReactToPrint from "react-to-print";
import { createCoteEtudiant, CreateCoteEtudiantData, readReleveByEtudiantId, readUnitPromTitulaireByPromotionId, RelevesData, updateReleves } from "../../../services";
import moment from 'moment'

interface Props {
  releves: any[]
  unites: any[]
  _onUpdate: boolean
}

const ComponentToPrint = React.forwardRef<any | null, Props>(({ releves, unites, _onUpdate }: Props, ref) => {
  const router = useRouter();
  const semestre = router.query.semestre;
  const etudiant = releves[0]?.etudiant;
  const date = new Date()

  let TOTALUNITE = 0;
  let TOTALCREDIT = 0;
  let NOMBRSECHECS = 0;
  let NOMBRSECHECSGRAVES = 0;
  let NOMBRSECHECSLEGERES = 0;
  let TOTALPOINTOBTENUE = 0;
  let TOTALCREDITGANIER= 0
  let DECISION = '';
  for (let i = 0; i < unites.length; i++) {
    const element = unites[i];
    if (element.semestre == semestre) {
      TOTALCREDIT += element?.credit;
      TOTALUNITE +=1
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
          }else{
            TOTALCREDITGANIER += element?.credit;
          }
          TOTALPOINTOBTENUE += pts * element?.credit;
        }
      })
    }
  }
  let POURCENTAGE = Math.round(100 * TOTALPOINTOBTENUE / (TOTALCREDIT * 20));
  let POURCENTAGECREDIT = Math.round((100 * TOTALCREDITGANIER )/ TOTALCREDIT)
  if (NOMBRSECHECS > 0) {
    DECISION = 'SNV';
  }else{
    DECISION = 'SV'
  }

  return <>
    <div className="col-12" ref={ref}>
      <div className="row">
        <div className="col-12" style={{ borderBottom: '1px solid #000', paddingTop: '10px', paddingBottom: '10px' }}>
          <div className="row">
            <div className="col-2" style={{ textAlign: 'left', }}>
              <img src="/dist/img/isp.png" width={100} height={100} />
            </div>
            <div className="col-9 push-3">
              <div style={{ textAlign: 'center' }}>
                <h3>REPUBLIQUE DEMOCRATIQUE DU CONGO</h3>
                <h4>MINISTERE DE L'ENSEIGNEMENT SUPERIEUR ET UNIVERSITAIRE.</h4>
                <h4><b>INSTITUT SUPERIEUR PEDAGOGIEQUE DE LA GOMBE</b></h4>
                <h4><b>Departement: {etudiant.promotion.departement.nom_departement}</b></h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-6 offset-3 mt-1">
          <div>
            <h3 style={{ textAlign: 'center' }}> BULETIN DES CÔTES</h3>
          </div>

          <div className="row mb-1">
            <table className="table table-striped table-bordered">
              <tbody>
                <tr>
                  <th>Nom</th>
                  <td>{etudiant?.nom_etudiant}</td>
                </tr>
                <tr>
                  <th>Postnom</th>
                  <td>{etudiant?.postnom_etudiant} {etudiant?.prenom_etudiant}</td>
                </tr>
                <tr>
                  <th>Prénom</th>
                  <td>{etudiant?.prenom_etudiant}</td>
                </tr>
                <tr>
                  <th>Promotion</th>
                  <td>{etudiant?.promotion.nom_promotion}</td>
                </tr>
                <tr>
                  <th>Vacation</th>
                  <td>{etudiant?.promotion.vacation}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="row" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <table className="table-bordered">
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
                  console.log(item.semestre);
                  if (item.semestre == semestre) {
                    {
                      item?.releves && item?.releves?.map((r: any, e: number) => {
                        if (r?.etudiant.id_etudiant === etudiant?.id_etudiant) {
                          pts = r.tj + r.ex
                          releveId = r.id_releve
                        }
                      })
                    }
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
                })
                }
              </tbody>
            </table>
          </div>

          <div className="row mt-1">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Totale de points à obtenir</th>
                  <td>{TOTALCREDIT * 20}</td>
                </tr>
                <tr>
                  <th>Total de crédit</th>
                  <td>{TOTALCREDIT}</td>
                </tr>
                <tr>
                  <th>Total de crédit obtenue</th>
                  <td>{TOTALCREDITGANIER}</td>
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
                  <th>Pourcentage de crédit</th>
                  <td>{POURCENTAGECREDIT}%</td>
                </tr>
                <tr>
                  <th>decision</th>
                  <td>{DECISION}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-4" style={{ textAlign: 'left' }}>
              <span style={{ textAlign: 'left' }}>
                Membre du Jury
              </span>
            </div>
            <div className="col-4" style={{ textAlign: 'center' }}>
              <span style={{ textAlign: 'center' }}>Président du Jury</span>
            </div>
            <div className="col-4" style={{ textAlign: 'right' }}>
              <span style={{ textAlign: 'right' }}>
                <>
                  {`Fait à Kinshasa le  ${date.getDate()} / ${date.getMonth()} / ${date.getFullYear()}`} <br />
                </>
                Sécretaire du Jury
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12" style={{ textAlign: 'center', borderTop: '1px solid #000', marginTop: '10px' }}>
          Copyrigth 2022<b>Level3</b> Tout droits resever
        </div>

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
    return <button className="btn btn-primary mt-5 col-4 offset-4">Print</button>

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
          ex: item?.ex,
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
        </> :
        <button onClick={() => setOnUpdate(true)} className="btn btn-primary mt-1 col-4 offset-4">
          Voulez-vous modifier
        </button>}
      <button className="btn btn-primary mt-1 col-4 offset-4" onClick={() => router.back()}>Retour</button>
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

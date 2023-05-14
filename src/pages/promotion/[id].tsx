import Link from "next/link";
import { useEffect, useState } from "react";
import config from "../../components/config";
import { changeThePromotionAndHandleCursus, ConfirmAllRecoursForDeliberationId, creatDeliberationEtudiant, CreatDeliberationEtudiantData, creatDeliberationPromotion, readDeliberationByEtudiants, readDeliberationByPromtion, readDeliberationPromotionById, readEtudiantByPromotionId, readUnitPromTitulaireByPromotionId, RelevesData, updateReleves } from "../../services";
import fr from 'dayjs/locale/fr' // load on demand
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useAppSelector } from "../../global/hooks";
import { selectExerciceEncours } from "../../global/exerciceEncours/exerciceEncours.slice";

dayjs.locale(fr) // use Spanish locale globally
interface Props {
  unitPromTitRels: any[]
  etudiants: any[],
  deliberationPromotion: any[],
  deliberationEtudiant: any[],
  readDeliberationEtudiants: any[]
}

const updateModale = (currenteReleve: any) => {

  const [releves, setReleves] = useState<RelevesData>({
    ex: currenteReleve?.ex,
    releveId: currenteReleve?.id_releve,
    tj: currenteReleve?.tj,
    motif: ""
  })
  const [success, setSuccess] = useState<Boolean>(false);
  const [error, setError] = useState({
    existe: false,
    msg: ''
  });
  const [loading, setLoading] = useState<Boolean>(false);

  const handleSubmit = async () => {
    setSuccess(false);
    if (
      releves.ex !== 0 &&
      releves.tj !== 0 &&
      releves.releveId !== 0
    ) {
      setLoading(true)
      try {
        const UpdateReleves = await updateReleves([releves]);
        console.log(UpdateReleves);
        if (UpdateReleves?.updateReleve?.data !== undefined && UpdateReleves?.updateReleve?.statusText === "OK") {
          setLoading(false);
          setSuccess(true);
          setError({ existe: false, msg: "" });
        } else {
          setLoading(false);
          setError({ existe: true, msg: "Une erruer est survenue lors du traitement de la requete!" });
        }
      } catch (error) {
        setLoading(false)
        setSuccess(false);
        setError({ existe: true, msg: "Une erruer est survenue lors du traitement de la requete!" });
      }
    } else {
      console.log(releves);
      setSuccess(false);
      setError({ existe: true, msg: "Tout les champs sont obligatoire!" })
    }
  }

  return (
    <div className="modal fade" id={`modal-${currenteReleve?.id_releve}`} style={{ display: "none" }} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Matricule de l'etudiant =&gt; {currenteReleve?.etudiant.matricule_etudiant}</h4>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <div>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>tj</th>
                    <th>ex</th>
                    <th>date</th>
                  </tr>
                </thead>
                <tbody>
                  {currenteReleve?.releveModifications && currenteReleve?.releveModifications.map((item: any, i: number) => {
                    return (
                      <tr key={i}>
                        <td>{item.tj}</td>
                        <td>{item.ex}</td>
                        <td>{dayjs(item.createdAt).locale(fr).format('DD/MM/YYYY à HH:mm')}</td>
                      </tr>
                    )
                  })

                  }
                </tbody>
              </table>
            </div>
            <div className="row">
              {loading ?
                <div className="col-4 offset-4">
                  <img src={`${config.url}loading.gif`} alt="loading" className="img-responsive" />
                </div>
                : null}
              {error.existe ?
                <div className="alert alert-danger">
                  <h5><i className="icon fas fa-ban"></i> Alert!</h5>
                  {error.msg}
                </div>
                : success ?
                  <div className="alert alert-success alert-dismissible">
                    <button type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                    <h5><i className="icon fas fa-check"></i>success !</h5>
                  </div>
                  : null
              }
            </div>
            <div className="form-group">
              <label htmlFor="privilege">Motif</label>
              <select className="form-control" value={releves.motif} onChange={(e) => setReleves({ ...releves, motif: e.target.value })}>
                <option value="">motif</option>
                <option value="recours">recours</option>
                <option value="deuxieme session">deuxieme session</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="nom">Examen</label>
              <input value={releves?.ex}
                onChange={e => setReleves({ ...releves, ex: +e.target.value })}
                type="number" className="form-control" id="nom" placeholder="Entrez le nom du département" />
            </div>
            <div className="form-group">
              <label htmlFor="nom">Tj</label>
              <input value={releves?.tj}
                onChange={e => setReleves({ ...releves, tj: +e.target.value })}
                type="number" className="form-control" id="nom" placeholder="Entrez le nom du département" />
            </div>
          </div>
          <div className="modal-footer justify-content-between">
            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            <button onClick={handleSubmit} type="button" className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const PromotionId = ({ unitPromTitRels, etudiants, deliberationPromotion, deliberationEtudiant, readDeliberationEtudiants }: Props) => {
  const promotion = unitPromTitRels[0]?.promotion;
  const [releves, setReleves] = useState(unitPromTitRels[0]?.releves);
  const [onUnite, setOnUnite] = useState(unitPromTitRels[0]?.unite_ensiegnement.nom);
  const [updateAllCote, setUpdateAllCote] = useState(false);
  const [possibiliteToUpdate, setPossibiliteToUpdate] = useState(true)
  const [loading, setLoading] = useState(false);
  const [semestre, setChangeSemestre] = useState<number>(1);
  const [cpt, setCpt] = useState<any[]>([]);
  const router = useRouter();
  const exercice = useAppSelector(selectExerciceEncours);
  const handleChange = (i: number) => {
    setReleves(unitPromTitRels[i]?.releves);
    setOnUnite(unitPromTitRels[i]?.unite_ensiegnement.nom)
  }

  const AllUpdateCoteByUniteEnseignment = async () => {
    const allInputs = document.getElementsByTagName('input');
    const allUpdate: RelevesData[] = []
    const preAllUpdate = [];
    let error = false
    for (let i = 0; i < allInputs.length; i++) {
      const input = allInputs[i];
      input.value
      input.id
      input.name
      if (input.name === "tj") {
        let tj = parseInt(input.value);
        if (tj !== NaN && tj >= 0 && tj <= 10) {
          preAllUpdate.push({
            releveId: parseInt(input.id),
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
            releveId: parseInt(input.id),
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
      const find = allUpdate.find(item => item.releveId === releve.releveId);
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
    console.log(allUpdate);
    try {
      const UpdateReleves = await updateReleves(allUpdate);
      console.log(UpdateReleves);
      if (UpdateReleves?.updateReleve?.data !== undefined && UpdateReleves?.updateReleve.statusText === "OK") {
        alert("la modification se passer avec succé la page vas se récharger")
        router.reload()
      } else {
        setLoading(false);
        alert("Une erruer est survenue lors du traitement de la requete!")
      }
    } catch (error) {
      setLoading(false)
      alert("Une erruer est survenue lors du traitement de la requete!")
    }
  }

  const handleDeleberation = async () => {
    let etudiantDeliberer: CreatDeliberationEtudiantData[] = [];
    etudiants.map((item: any, i: number) => {
      let TOTALAOBTENIR = 0;
      let TOTALCREDIT = 0;
      let NOMBRSECHECS = 0;
      let NOMBRSECHECSGRAVES = 0;
      let NOMBRSECHECSLEGERES = 0;
      let TOTALPOINTOBTENUE = 0;
      let DECISION = '';
      for (let i = 0; i < unitPromTitRels.length; i++) {
        const element = unitPromTitRels[i];
        TOTALCREDIT += element?.credit;
        element?.releves?.map((r: any, e: number) => {
          if (r?.etudiant.id_etudiant === item?.id_etudiant) {
            let pts = r.tj + r.ex;
            if (pts < 10) {
              NOMBRSECHECS += 1;
              if (pts < 8) {
                NOMBRSECHECSGRAVES += 1;
              } else {
                NOMBRSECHECSLEGERES += 1;
              }
            }
            TOTALPOINTOBTENUE += pts * element?.credit;
          }
        })
      }
      TOTALAOBTENIR = TOTALCREDIT * 20
      let POURCENTAGE = Math.round(100 * TOTALPOINTOBTENUE / (TOTALAOBTENIR));
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
      etudiantDeliberer.push({
        poucentage: POURCENTAGE,
        poucentageCredit: 0,
        descision: DECISION,
        etudiantId: item?.id_etudiant
      })
    });
    const CreatDeliberationPromotion = await creatDeliberationPromotion(promotion.id_promotion);
    // console.log(CreatDeliberationPromotion.statusText);

    if (CreatDeliberationPromotion.statusText === 'Created') {
      const CreatDeliberationEtudiant = await creatDeliberationEtudiant(etudiantDeliberer, promotion.id_promotion);
      console.log(CreatDeliberationEtudiant);
      if (CreatDeliberationEtudiant.statusText === 'Created') {
        alert('la deliberation se passé avec succé');
        router.reload();
      } else {
        alert('la deliberation s\'est pas trés bien deroulé')
      }
    } else {
      alert('la deliberation s\'est pas trés bien deroulé')
    }
  }

  const handleDeleberationSecondSession = async () => {
    const listEtudiants: CreatDeliberationEtudiantData[] = [];
    readDeliberationEtudiants.map((item: any, i: number) => {
      let TOTALAOBTENIR = 0;
      let TOTALCREDIT = 0;
      let NOMBRSECHECS = 0;
      let NOMBRSECHECSGRAVES = 0;
      let NOMBRSECHECSLEGERES = 0;
      let TOTALPOINTOBTENUE = 0;
      let DECISION = '';
      if (item.descision === 'AA' || item.descision === 'A') {

        for (let i = 0; i < unitPromTitRels.length; i++) {
          const element = unitPromTitRels[i];
          TOTALCREDIT += element?.credit;
          element?.releves?.map((r: any, e: number) => {
            if (r?.etudiant.id_etudiant === item.etudiant.id_etudiant) {
              let pts = r.tj + r.ex;
              if (pts < 10) {
                NOMBRSECHECS += 1;
                if (pts < 8) {
                  NOMBRSECHECSGRAVES += 1;
                } else {
                  NOMBRSECHECSLEGERES += 1;
                }
              }
              TOTALPOINTOBTENUE += pts * element?.credit;
            }
          })
        }
        TOTALAOBTENIR = TOTALCREDIT * 20
        let POURCENTAGE = Math.round(100 * TOTALPOINTOBTENUE / (TOTALAOBTENIR));
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
        listEtudiants.push({
          poucentage: POURCENTAGE,
          descision: DECISION,
          poucentageCredit: 0,
          etudiantId: item.etudiant.id_etudiant
        })
      }
    });
    const CreatDeliberationPromotion = await creatDeliberationPromotion(promotion.id_promotion);
    if (CreatDeliberationPromotion.statusText === 'Created') {
      const CreatDeliberationEtudiant = await creatDeliberationEtudiant(listEtudiants, promotion.id_promotion);
      console.log(CreatDeliberationEtudiant);
      if (CreatDeliberationEtudiant.statusText === 'Created') {
        alert('la deliberation se passé avec succé');
        router.reload();
      } else {
        alert('la deliberation s\'est pas trés bien deroulé')
      }
    } else {
      alert('la deliberation s\'est pas trés bien deroulé')
    }
  }

  const confirmAllRecoursForDeliberation = async (deliberationId: number, session: number) => {
    if (confirm(`
      En confirment les recours
      tout les modification qui vindront apres 
      seront considere pour la prochaine deliberation.
      êtes-vous sure de vouloire confirmire le recours?
      session: ${session}
    `)) {
      const confirmAllRecoursForDeliberation = await ConfirmAllRecoursForDeliberationId(deliberationId, exercice.id_exercice);
      const data = confirmAllRecoursForDeliberation?.data;
      console.log(data);
      if (data !== undefined && confirmAllRecoursForDeliberation.statusText == 'OK') {
        alert('la confirmation se bien passé!');
      } else {
        alert('une erreur se produite lors du traitement de la rêquete');
      }
      router.reload();
    }
  }

  const checkIfPromotionIsDeliberated = () => {
    const deliberation = deliberationPromotion.length
    if (deliberation > 0) {
      if (deliberation == 1) {
        const id = deliberationPromotion[0].id_deliberation
        const session = deliberationPromotion[0].session
        const status = deliberationPromotion[0].status
        return (
          <>
            {status ?
              <button
                className="btn btn-warning"
                onClick={() => confirmAllRecoursForDeliberation(id, session)}>
                Confirmer tout les recours fait!</button>
              :
              <button className="btn btn-success" onClick={handleDeleberation} >deliber pour la 1<sup>eme</sup> session</button>
            }
          </>
        )
      } else if (deliberation == 2) {
        const id = deliberationPromotion[1].id_deliberation
        const session = deliberationPromotion[1].session
        const status = deliberationPromotion[1].status
        return (
          <>
            {status ?
              <button
                className="btn btn-warning"
                onClick={() => confirmAllRecoursForDeliberation(id, session)}>
                Confirmer tout les recours de la prémiere session!</button>
              : <button className="btn btn-primary" onClick={handleDeleberationSecondSession}>Déliberer pour deuxieme la session!</button>
            }
          </>
        )
      } else if (deliberation == 3) {
        const id = deliberationPromotion[2].id_deliberation
        const session = deliberationPromotion[2].session
        const status = deliberationPromotion[2].status
        return (
          <>
            {status ?
              <button
                className="btn btn-warning"
                onClick={() => {
                  confirmAllRecoursForDeliberation(id, session);
                  changeThePromotionAndHandleCursus(id)
                }}>
                Confirmer tout les recours de la deuxieme session!</button>
              : null
            }
          </>
        )
      }
    } else {
      return <button className="btn btn-primary" onClick={handleDeleberation}>Déliberer pour la mi-session!</button>

    }
  }

  const getLinkReleve = () => {
    // const deliberation = deliberationPromotion.length
    // if (deliberation > 2) {
    //   const status = deliberationPromotion[0].status
    //   return status ? 'releve' : 'releveSecondeSession';
    // } else {
      return 'releve'
    // }
  }

  const handleChangeSemestre = (semestre: number) => {
    let coursPt: any[] = []
    if (semestre !== 3) {
      unitPromTitRels.map((item: any) => {
        if (item.semestre === semestre) {
          coursPt.push(item)
        }
      });
    } else {
      coursPt = unitPromTitRels
    }

    setCpt(coursPt);
    setOnUnite(coursPt[0]?.unite_ensiegnement.nom)
    setChangeSemestre(semestre);
    setReleves(coursPt[0]?.releves);
  }

  useEffect(() => {
    let isMount = true
    if (isMount) {
      const deliberationPromoLength = deliberationPromotion.length > 0 ? deliberationPromotion.length - 1 : null;
      const deliberation = deliberationPromoLength !== null ? deliberationPromotion[deliberationPromoLength] : null;
      if (deliberation !== null && deliberation.session == 1 && deliberation.status == false) {
        handleChangeSemestre(2)
      } else if (deliberation !== null && deliberation.session == 2) {
        if (deliberation.status == false) {
          handleChangeSemestre(3)
        } else {
          handleChangeSemestre(2)
        }
      } else if (deliberation !== null && deliberation.session == 3 && deliberation.status == false) {
        handleChangeSemestre(3);
        setPossibiliteToUpdate(false)
      } else {
        handleChangeSemestre(1)
      }
    }
    return () => {
      isMount = false
    }
  }, [])

  return (
    <div>
      <div className="col-10 offset-1">
        <h6>Departement: {promotion?.departement?.nom_departement}</h6>
        <h6>Promotion: {promotion?.nom_promotion}</h6>
        <h6>Vacation: {promotion?.vacation}</h6>
        {checkIfPromotionIsDeliberated()}
        <hr />
      </div>
      <div className="row mb-2">
        <div className="col-md-6">
          {semestre == 1 ? <button className="btn btn-primary col-md-6"
            onClick={() => handleChangeSemestre(1)}>mi-session</button>
            : <>
              {semestre == 2 ?
                <button className="btn btn-success col-md-6"
                  onClick={() => handleChangeSemestre(2)}>1<sup>ere</sup> session</button>
                :
                <button className="btn btn-success col-md-6"
                  onClick={() => handleChangeSemestre(3)}>2<sup>eme</sup> session</button>
              }
            </>
          }

        </div>
      </div>
      <div className="row">
        <div className="col-md-4 col-ms-4 col-12">
          <div className="card card-primary">
            <div className="card-header">
              <h3 className="card-title">Unites d'ensiegnement</h3>
            </div>
            <div className="card-body table-responsive" style={{ height: 400 }}>
              <ul className="nav nav-pills flex-column">
                {cpt?.map((item: any, i: number) =>
                  <li className="nav-item"
                    onClick={() => handleChange(i)} key={i} >
                    <a href="#" className={`nav-link  ${onUnite == item.unite_ensiegnement.nom ? 'active' : null}`}>
                      {i + 1}. {item.unite_ensiegnement.nom}
                      <span className="float-right">
                        {item.credit}
                      </span>
                    </a>
                  </li>)
                }
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-8 col-ms-8 col-12">
          <div className="card card-primary">
            <div className="card-header">
              <h3 className="card-title">liste de cotation  <b> {onUnite}</b></h3>
            </div>
            <div className="card-body table-responsive p-0" style={{ height: 300 }}>
              <table className="table table-head-fixed p-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Etudiant</th>
                    <th>Ex</th>
                    <th>Tj</th>
                    <th>Bulletin</th>
                  </tr>
                </thead>
                <tbody>
                  {etudiants && etudiants?.map((item: any, i: number) => {
                    let tj = 0;
                    let ex = 0;
                    let id_releve;
                    let isDeliberated = false;
                    let descision = '';
                    let session = 0
                    {
                      releves?.map((r: any) => {
                        if (r.etudiant.id_etudiant === item.id_etudiant) {
                          tj = r.tj;
                          ex = r.ex;
                          id_releve = r.id_releve;
                        }
                      })
                    }
                    if (deliberationEtudiant.length > 0) {
                      {
                        deliberationEtudiant?.map((d: any) => {
                          if (d.etudiant.id_etudiant === item.id_etudiant) {
                            descision = d.descision
                            session = d.session
                          }
                        })
                      }
                      console.log('session', session, semestre);

                      if ((descision == 'A' || descision == 'AA') && session == semestre) {
                        isDeliberated = true
                      }
                      if (isDeliberated) {
                        return (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{item.matricule_etudiant}</td>
                            <td>{updateAllCote ?
                              <div className="form-group">
                                <label htmlFor="nom">Examen</label>
                                <input
                                  type="number" className="form-control"
                                  id={id_releve}
                                  name="ex"
                                  placeholder={`${ex}`}
                                />
                              </div>
                              : ex}
                            </td>
                            <td>{
                              updateAllCote ?
                                <div className="form-group">
                                  <label htmlFor="nom">Examen</label>
                                  <input
                                    type="number" className="form-control"
                                    id={id_releve}
                                    name="tj"
                                    placeholder={`${tj}`}
                                  />
                                </div>
                                : tj}
                            </td>
                            <td>
                              <button
                                className="btn btn-info mr-1"
                                data-toggle="modal"
                                data-target={`#modal-${id_releve}`}
                              >
                                <i className="fas fa-edit" />
                              </button>
                              <Link href={`${config.url}${getLinkReleve()}/${item.id_etudiant}?exercice=${exercice.id_exercice}`}>
                                <a className="btn btn-info mr-1">
                                  Voir
                                </a>
                              </Link>
                            </td>
                          </tr>
                        )
                      } else {
                        return (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{item.matricule_etudiant}</td>
                            <td>{updateAllCote ?
                              <div className="form-group">
                                <label htmlFor="nom">Examen</label>
                                <input
                                  type="number" className="form-control"
                                  id={id_releve}
                                  name="ex"
                                  placeholder={`${ex}`}
                                />
                              </div>
                              : ex}
                            </td>
                            <td>{
                              updateAllCote ?
                                <div className="form-group">
                                  <label htmlFor="nom">Examen</label>
                                  <input
                                    type="number" className="form-control"
                                    id={id_releve}
                                    name="tj"
                                    placeholder={`${tj}`}
                                  />
                                </div>
                                : tj}
                            </td>
                            <td>
                              <button
                                className="btn btn-info mr-1"
                                data-toggle="modal"
                                data-target={`#modal-${id_releve}`}
                              >
                                <i className="fas fa-edit" />
                              </button>
                              <Link href={`${config.url}${getLinkReleve()}/${item.id_etudiant}?exercice=${exercice.id_exercice}`}>
                                <a className="btn btn-info mr-1">
                                  Voir
                                </a>
                              </Link>
                            </td>
                          </tr>
                        )
                      }
                    } else {
                      return (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{item.matricule_etudiant}</td>
                          <td>{updateAllCote ?
                            <div className="form-group">
                              <label htmlFor="nom">Examen</label>
                              <input
                                type="number" className="form-control"
                                id={id_releve}
                                name="ex"
                                placeholder={`${ex}`}
                              />
                            </div>
                            : ex}
                          </td>
                          <td>{
                            updateAllCote ?
                              <div className="form-group">
                                <label htmlFor="nom">Examen</label>
                                <input
                                  type="number" className="form-control"
                                  id={id_releve}
                                  name="tj"
                                  placeholder={`${tj}`}
                                />
                              </div>
                              : tj}
                          </td>
                          <td>
                            <button
                              className="btn btn-info mr-1"
                              data-toggle="modal"
                              data-target={`#modal-${id_releve}`}
                            >
                              <i className="fas fa-edit" />
                            </button>
                            <Link href={`${config.url}${getLinkReleve()}/${item.id_etudiant}?exercice=${exercice.id_exercice}`}>
                              <a className="btn btn-info mr-1">
                                Voir
                              </a>
                            </Link>
                          </td>
                        </tr>
                      )
                    }
                  })}
                </tbody>
              </table>
              {unitPromTitRels?.map((item: any, i: number) =>
                item?.releves?.map((r: any, i: number) => {
                  return (
                    <div key={i}>
                      {updateModale(r)}
                    </div>)
                })
              )}
            </div>
            <div className="card-footer">
              {updateAllCote ?
                loading ? <p>loading... please wait</p> :
                  <button className="btn btn-success" onClick={() => AllUpdateCoteByUniteEnseignment()}>Confirmer la modification</button>
                : <button className="btn btn-primary"
                  onClick={() => setUpdateAllCote(!updateAllCote)}
                >Voulez-vous modifier</button>
              }

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromotionId;

export const getServerSideProps = async (route: any) => {
  const unitPromTitRel = await readUnitPromTitulaireByPromotionId(route.query.id, route.query.exercice);
  const etudiantByPromotion = await readEtudiantByPromotionId(route.query.id, route.query.exercice);
  const deliberationPromotion = await readDeliberationPromotionById(route.query.id, route.query.exercice);
  const deliberationEtudiant = await readDeliberationByPromtion(route.query.id, route.query.exercice);
  const readDeliberationEtudiants = await readDeliberationByEtudiants(route.query.id, route.query.exercice);
  return {
    props: {
      unitPromTitRels: unitPromTitRel.data,
      etudiants: etudiantByPromotion.data,
      deliberationPromotion: deliberationPromotion.data,
      deliberationEtudiant: deliberationEtudiant.data,
      readDeliberationEtudiants: readDeliberationEtudiants.data
    }
  }
}
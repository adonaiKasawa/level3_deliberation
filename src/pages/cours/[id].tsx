import Link from "next/link";
import { useEffect, useState } from "react";
import config from "../../components/config";
import { ConfirmAllRecoursForDeliberationId, CotationUniteData, creatDeliberationEtudiant, CreatDeliberationEtudiantData, creatDeliberationPromotion, createCotation, readDeliberationByEtudiants, readDeliberationByPromtion, readDeliberationPromotionById, readEtudiantByPromotionId, readUnitPromTitulaireById, readUnitPromTitulaireByPromotionId, RelevesData, updateReleves } from "../../services";
import fr from 'dayjs/locale/fr' // load on demand
import dayjs from "dayjs";
import { useRouter } from "next/router";

dayjs.locale(fr) // use Spanish locale globally
interface Props {
  unitPromTitRels: any
  etudiants: any[],
  deliberationPromotion: any[],
  deliberationEtudiant: any[],
  readDeliberationEtudiants: any[]
}

const updateModale = ({
  uptId,
  releves,
  setReleves,
  etudiants,
  UpdateAllState,
  etudiantId,
  existCote,
  id_releve,
  releveModifications
}: any) => {

  // const findReleve = unitPromTitRels?.releves.find((item: any) => item.etudiant.id_etudiant === etudiantId)
  // console.log(unitPromTitRels);
  // console.log(findReleve);
  const etudiant = etudiants?.find((item: any) => item.id_etudiant === etudiantId);

  // const [releves, setReleves] = useState<CotationUniteData>({
  //   ex: findReleve !== undefined ? findReleve?.ex : 0,
  //   tj: findReleve !== undefined ? findReleve?.tj : 0,
  //   etudiantId: etudiantId,
  // })
  console.log(releves);

  const [success, setSuccess] = useState<Boolean>(false);
  const [error, setError] = useState({
    existe: false,
    msg: ''
  });
  const [loading, setLoading] = useState<Boolean>(false);
  const [motif, setMotif] = useState<string>('');

  const handleSubmit = async () => {
    setSuccess(false);
    try {
      const CreateCotation:any = await createCotation([{
        tj: releves.tj,
        ex: releves.ex,
        etudiantId,
        motif
      }], uptId);
      console.log(CreateCotation);
      if (CreateCotation?.data !== undefined && CreateCotation?.statusText === "Created") {
        alert("la catation se passer avec succé la page vas se récharger")
        await UpdateAllState();
        setLoading(false);
      } else {
        setLoading(false);
        alert("Une erruer est survenue lors du traitement de la requete!")
      }
    } catch (error) {
      setLoading(false)
      alert("Une erruer est survenue lors du traitement de la requete!")
    }
  }

  return (
    <div className="modal fade" id={`modal-${etudiantId}`} style={{ display: "none" }} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Etudiant: {etudiant?.nom_etudiant} {etudiant?.postnom_etudiant} {etudiant?.prenom_etudiant}</h4>
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
                  {releveModifications && releveModifications.map((item: any, i: number) => {
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
                  <img src={`${config.url}loading.gif`} width="100" alt="loading" className="img-responsive" />
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
            {existCote ? <div className="form-group">
              <label htmlFor="privilege">Motif</label>
              <select className="form-control"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}>
                <option value="">motif</option>
                <option value="recours">recours</option>
                <option value="deuxieme session">deuxieme session</option>
              </select>
            </div> : null}
            <div className="form-group">
              <label htmlFor="nom">Examen</label>
              <input
                value={releves.ex === undefined ? '' : releves.ex}
                onChange={e => { 10 >= +e.target.value && +e.target.value >= 0 ? setReleves({ ...releves, ex: +e.target.value, etudiantId }) : null }}
                type="number" className="form-control" id="nom" placeholder="Entrez la côte de l'examen" />
            </div>
            <div className="form-group">
              <label htmlFor="nom">Tj</label>
              <input
                value={releves.tj === undefined ? '' : releves.tj}
                onChange={e => { 10 >= +e.target.value && +e.target.value >= 0 ? setReleves({ ...releves, tj: +e.target.value, etudiantId }) : null }}
                type="number" className="form-control" id="nom" placeholder="Entrez la côte du tj" />
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

const CoursId = ({
  unitPromTitRels,
  etudiants,
}: Props) => {
  const promotion = unitPromTitRels?.promotion;
  const [releves, setReleves] = useState(unitPromTitRels?.releves);
  const [onUnite, setOnUnite] = useState(unitPromTitRels?.unite_ensiegnement.nom);
  const [updateAllCote, setUpdateAllCote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allEtudiant, setAllEtudiant] = useState(etudiants);
  const [etudiantId, setEtudiantId] = useState<number>(0);
  const router = useRouter();
  const [relevesByEtudiant, setRelevesByEtudiant] = useState<CotationUniteData>({
    ex: undefined,
    tj: undefined,
    etudiantId: etudiantId,
  });
  const [releveModifications, setReleveModifications] = useState<any[]>([]);
  const id_unit_prom_titulaire = unitPromTitRels?.id_unit_prom_titulaire;
  const [existCote, setExistCote] = useState<boolean>(false);
  const [idreleveByEtudiant, setiIdreleveByEtudiant] = useState<number>(0);
  const exercice = router.query.exercice !== undefined  ? router.query.exercice : '0';
  console.log('etudiants',etudiants);
  
  const AllUpdateCoteByUniteEnseignment = async () => {
    const allInputs = document.getElementsByTagName('input');
    const allUpdate: CotationUniteData[] = []
    const preAllUpdate = [];
    let error = false;
    for (let i = 0; i < allInputs.length; i++) {
      const input = allInputs[i];
      input.value
      input.id
      input.name
      if (input.name === "tj") {
        let tj = parseInt(input.value);
        if (tj !== NaN && tj >= 0 && tj <= 10) {
          preAllUpdate.push({
            etudiantId: parseInt(input.id),
            tj,
          })
        } else {
          input.style.border = "red 1px solid"
          error = true
        }
      } else if (input.name === "ex") {
        let ex = parseInt(input.value);
        if (ex !== NaN && ex >= 0 && ex <= 10) {
          preAllUpdate.push({
            etudiantId: parseInt(input.id),
            ex,
          })
        } else {
          input.style.border = "red 1px solid"
          error = true
        }
      }
    }
    let motif: string | null = 'premiere cotation';
    if (releves.length > 0) {
      motif = prompt('Motif de la modification');
    }
    for (let i = 0; i < preAllUpdate.length; i++) {
      const etudiant = preAllUpdate[i];
      const find = allUpdate.find(item => item.etudiantId === etudiant.etudiantId);
      if (find) {
        if (find?.ex) {
          find.tj = etudiant.tj
        } else if (find?.tj) {
          find.ex = etudiant.ex
        }

        if (motif !== null) {
          find.motif = motif
        }
      } else {
        allUpdate.push(etudiant);
      }
    }
    console.log(allUpdate);
    try {
      const CreateCotation = await createCotation(allUpdate, unitPromTitRels.id_unit_prom_titulaire);
      if (CreateCotation?.data !== undefined && CreateCotation?.statusText === "Created") {
        alert("la catation se passer avec succé")
        await UpdateAllState();
        setUpdateAllCote(!updateAllCote)
        setLoading(false);
      } else {
        setLoading(false);
        alert("Une erruer est survenue lors du traitement de la requete!")
      }
    } catch (error) {
      setLoading(false)
      alert("Une erruer est survenue lors du traitement de la requete!")
    }
  }

  const UpdateAllState = async () => {
    const etudiantByPromotion = await readEtudiantByPromotionId(promotion.id_promotion,exercice);
    if (etudiantByPromotion.data != undefined) {
      setAllEtudiant(etudiantByPromotion.data);
      const getUpt = await readUnitPromTitulaireById(unitPromTitRels.id_unit_prom_titulaire,unitPromTitRels.exercice.id_exercice);
      if (getUpt.data !== undefined) {
        let upt = getUpt.data
        let releve = upt.releves.find((item: any) => item.etudiant.id_etudiant === etudiantId);
        setReleveModifications(releve !== undefined ? releve.releveModifications : []);
        console.log(releve);
        setReleves(upt.releves);
      }
    }
  }

  return (
    <div>
      <div className="col-10 offset-1">
        <h5> Cours : {onUnite}  </h5>
        <h5> Promotion : {promotion?.nom_promotion} {promotion?.departement.nom_departement}</h5>
        <h5> Vacation : {promotion?.vacation}</h5>
        <hr />
      </div>
      <div className="row">
        <div className="col-md-12 col-ms-12 col-12">
          <div className="card card-primary">
            <div className="card-header">
              <h3 className="card-title">Liste des étudiants </h3>
            </div>
            {unitPromTitRels !== null ? <>
              <div className="card-body table-responsive p-0" style={{ height: 300 }}>
                <table className="table table-head-fixed p-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Etudiant</th>
                      <th>Ex</th>
                      <th>Tj</th>
                      <th>Côter</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allEtudiant && allEtudiant?.map((item: any, i: number) => {
                      let tj: number | undefined = undefined;
                      let ex: number | undefined = undefined;
                      let etudiantid = item.id_etudiant
                      let releveId = 0
                      let releve_Modifications: any[] = []
                      let isDeliberated = false;
                      let descision = '';
                      {
                        releves?.map((r: any) => {
                          if (r.etudiant.id_etudiant === item.id_etudiant) {
                            tj = r.tj;
                            ex = r.ex;
                            releveId = r.id_releve
                            releve_Modifications = r.releveModifications
                          }
                        });
                      }
                      return (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{item.nom_etudiant} {item.postnom_etudiant} {item.prenom_etudiant}</td>
                          <td>{updateAllCote ?
                            <div className="form-group">
                              <label htmlFor="nom">Examen</label>
                              <input
                                type="number" className="form-control"
                                id={etudiantid}
                                name="ex"
                                placeholder={`${ex === undefined ? 'vide' : ex}`}
                              />
                            </div>
                            : ex}
                          </td>
                          <td>{
                            updateAllCote ?
                              <div className="form-group">
                                <label htmlFor="nom">Tj</label>
                                <input
                                  type="number" className="form-control"
                                  id={etudiantid}
                                  name="tj"
                                  placeholder={`${tj === undefined ? 'vide' : tj}`}
                                />
                              </div>
                              : tj}
                          </td>
                          <td>{
                            <div className="form-group">
                              <button
                                className="btn btn-primary"
                                data-toggle="modal"
                                data-target={`#modal-${etudiantid}`}
                                onClick={() => {
                                  setEtudiantId(etudiantid);
                                  setRelevesByEtudiant({ ex, tj, etudiantId: etudiantid })
                                  if (tj !== undefined || ex !== undefined) {
                                    setExistCote(true);
                                    setiIdreleveByEtudiant(releveId);
                                    console.log(releve_Modifications);

                                    setReleveModifications(releve_Modifications);
                                  } else {
                                    setExistCote(false)
                                    setiIdreleveByEtudiant(0)
                                  }
                                }}
                              >côter l'etudiant</button>
                            </div>
                          }
                          </td>

                        </tr>
                      )
                    }
                    )}
                  </tbody>
                </table>
                {
                  updateModale({
                    uptId: id_unit_prom_titulaire,
                    releves: relevesByEtudiant,
                    setReleves: setRelevesByEtudiant,
                    etudiants,
                    UpdateAllState,
                    etudiantId,
                    existCote,
                    id_releve: idreleveByEtudiant,
                    releveModifications,
                  })}
              </div>
              <div className="card-footer">
                {/* <button className="btn btn-primary" onClick={() => setUpdateAllCote(!updateAllCote)}>Voulez-vous modifier</button> */}
                {etudiants ? updateAllCote ?
                  loading ? <p>loading... please wait</p> :
                    <button className="btn btn-success" onClick={() => AllUpdateCoteByUniteEnseignment()}>Confirmer la cotation</button>
                  : <button className="btn btn-primary"
                    onClick={() => setUpdateAllCote(!updateAllCote)}
                  >Voulez-vous côter</button>: null
                }
              </div>
            </> : null
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursId;

export const getServerSideProps = async (router: any) => {
  console.log(router);
  
  const unitPromTitRel = await readUnitPromTitulaireById(router.query.id, router.query.exercice);
  let dataUpt = null
  let etudiant = null
  if (unitPromTitRel.data != undefined) {
    dataUpt = unitPromTitRel.data
    console.log(dataUpt);
    const etudiantByPromotion = await readEtudiantByPromotionId(dataUpt.promotion.id_promotion, router.query.exercice);
    if (etudiantByPromotion.data != undefined) {
      etudiant = etudiantByPromotion.data
    }
  }
  return {
    props: {
      unitPromTitRels: dataUpt,
      etudiants: etudiant,
    }
  }
}
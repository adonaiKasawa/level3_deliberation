import Link from "next/link";
import config from "../../../components/config";
import { selectExerciceEncours } from "../../../global/exerciceEncours/exerciceEncours.slice";
import { useAppSelector } from "../../../global/hooks";
import { readDeliberationByPromtion, readDeliberationPromotionByDepartement, readDepartementById } from "../../../services";

interface Props{
  departement: any
  deliberationPromotion: any[]

}

const LmdId = ({ departement, deliberationPromotion }: Props) => {
  const exercice = useAppSelector(selectExerciceEncours)
  return(
    <div>
      <div className="col-sm-10">
          <h1 className="">Departement  {`( ${departement?.nom_departement} )`}</h1>
          <hr />
        </div>
        <div className="col-12">
          <div className="card card-primary card-outline card-outline-tabs">
            <div className="card-header p-0 border-bottom-0">
              <ul className="nav nav-tabs" id="custom-tabs-four-tab" role="tablist">
                <li className="nav-item">
                  <a className="nav-link active" id="custom-tabs-four-home-tab"
                    data-toggle="pill" href="#custom-tabs-four-home" role="tab"
                    aria-controls="custom-tabs-four-home" aria-selected="true">promotion</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" id="custom-tabs-four-profile-tab" data-toggle="pill" href="#custom-tabs-four-profile" role="tab" aria-controls="custom-tabs-four-profile" aria-selected="false">deliberer</a>
                </li>
              </ul>
            </div>
            <div className="card-body">
              <div className="tab-content" id="custom-tabs-four-tabContent">
                <div className="tab-pane fade active show" id="custom-tabs-four-home" role="tabpanel" aria-labelledby="custom-tabs-four-home-tab">
                  <h5>vacation jour</h5>
                  <div className="row">

                    {departement?.promotions?.map((item: any, i: number) => {
                      if (item.vacation === 'jour' && item.systeme === 'LMD') {
                        return (
                          <div className="col-md-4 col-sm-6 col-12" key={i}>
                            <Link href={`${config.url}promotion/lmd/${item.id_promotion}?exercice=${exercice.id_exercice}`}>
                              <a href="#" className="card-link">
                                <div className="info-box shadow-lg">
                                  <span className="info-box-icon bg-success"><i className="far fa-star" /></span>
                                  <div className="info-box-content">
                                    <span className="info-box-text">{item.nom_promotion}</span>
                                    <span className="info-box-number">{item.vacation}</span>
                                  </div>
                                </div>
                              </a>
                            </Link>
                          </div>
                        )
                      }
                    }

                    )}
                  </div>
                  <h5>vacation soir</h5>
                  <div className="row">

                    {departement?.promotions?.map((item: any, i: number) => {
                      if (item.vacation === 'soir'  && item.systeme === 'LMD') {
                        return (
                          <div className="col-md-4 col-sm-6 col-12" key={i}>
                            <Link href={`${config.url}promotion/lmd/${item.id_promotion}?exercice=${exercice.id_exercice}`}>
                              <a className="card-link">
                                <div className="info-box shadow-lg">
                                  <span className="info-box-icon bg-info"><i className="far fa-star" /></span>
                                  <div className="info-box-content">
                                    <span className="info-box-text">{item.nom_promotion}</span>
                                    <span className="info-box-number">{item.vacation}</span>
                                  </div>
                                </div>
                              </a>
                            </Link>
                          </div>
                        )
                      }
                    }

                    )}
                  </div>
                </div>
                <div className="tab-pane fade" id="custom-tabs-four-profile" role="tabpanel" aria-labelledby="custom-tabs-four-profile-tab">
                  <h5>1<sup>ére</sup>session</h5>
                  <hr />
                  <div className="row">
                    {deliberationPromotion.map((item: any, i: number) => {
                      if (item.session === 1)
                        return <div className="col-md-4 col-sm-6 col-12" key={i}>
                          <Link href={`${config.url}deliberer/lmd/${item.promotion.id_promotion}?session=${item.session}&exercice=${exercice.id_exercice}`}>
                            <a href="#" className="card-link">
                              <div className="info-box shadow-lg">
                                <span className="info-box-icon bg-success"><i className="far fa-star" /></span>
                                <div className="info-box-content">
                                  <span className="info-box-text">{item.promotion.nom_promotion}</span>
                                  <span className="info-box-number">{item.promotion.vacation}</span>
                                </div>
                              </div>
                            </a>
                          </Link>
                        </div>
                    })}
                  </div>
                  <h5>2<sup>eme</sup>session</h5>
                  <hr />
                  <div className="row">

                    {deliberationPromotion.map((item: any, i: number) => {
                      if (item.session === 2)
                        return <div className="col-md-4 col-sm-6 col-12" key={i}>
                          <Link href={`${config.url}deliberer/lmd/${item.promotion.id_promotion}?session=${item.session}&exercice=${exercice.id_exercice}`}>
                            <a href="#" className="card-link" key={i}>
                              <div className="info-box shadow-lg">
                                <span className="info-box-icon bg-success"><i className="far fa-star" /></span>
                                <div className="info-box-content">
                                  <span className="info-box-text">{item.promotion.nom_promotion}</span>
                                  <span className="info-box-number">{item.promotion.vacation}</span>
                                </div>
                              </div>
                            </a>
                          </Link>
                        </div>
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
} 

export default LmdId;

export const getServerSideProps = async (route: any) => {
  const departement = await readDepartementById(route.query.id);
  const deliberationPromotion = await readDeliberationPromotionByDepartement(route.query.id,route.query.exercice);
  const deliberationEtudiant = await readDeliberationByPromtion(route.query.id,route.query.exercice);
  return {
    props: {
      departement: departement.data,
      deliberationPromotion: deliberationPromotion.data,
      deliberationEtudiant: deliberationEtudiant.data,
    }
  }
}
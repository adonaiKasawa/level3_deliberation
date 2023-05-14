import jwtDecode from 'jwt-decode';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { logoutUser, selectAuth } from '../../global/auth/auth.slice';
import { createExercice, selectExercice, State } from '../../global/exercice/exercice.slice';
import { changeExerciceEncours, selectExerciceEncours } from '../../global/exerciceEncours/exerciceEncours.slice';
import { useAppDispatch, useAppSelector } from '../../global/hooks';
import { readExercice } from '../../services';
import config from '../config';

const AdminHeader = () => {
  // State
  const Auth = useAppSelector(selectAuth);
  const user = Auth.access_token ? jwtDecode(Auth.access_token) : null;
  const Exercice = useAppSelector(selectExercice)
  const ExerciceListe = Exercice.exerciceList
  const [exerciceEncours, setExerciceEncours] = useState<any>()
  const ExerciceEncours = useAppSelector(selectExerciceEncours);

  // ** Hook
  const router = useRouter();
  const dispatch = useAppDispatch();
  const logout = () => {
    dispatch(logoutUser());
    router.push('http://localhost:3000/login');
  }
  const getExercice = async () => {
    const exercice = await readExercice();
    if (exercice.data !== undefined) {
      const data: any = []
      exercice.data.map((item: any) => {
        data.push({
          id_exercice: item.id_exercice,
          annee_exercice: item.annee_exercice,
          debut_exercice: item.debut_exercice,
          fin_exercice: item.fin_exercice,
          etat_exercice: item.etat_exercice
        })
        if (item.etat_exercice === 'ENCOURS') {
          setExerciceEncours({
            id_exercice: item.id_exercice,
            annee_exercice: item.annee_exercice,
            debut_exercice: item.debut_exercice,
            fin_exercice: item.fin_exercice,
            etat_exercice: item.etat_exercice
          });
          dispatch(changeExerciceEncours({
            id_exercice: item.id_exercice,
            annee_exercice: item.annee_exercice,
            debut_exercice: item.debut_exercice,
            fin_exercice: item.fin_exercice,
            etat_exercice: item.etat_exercice
          }));
        }
      })
      dispatch(createExercice({
        exerciceList: data
      }));
    }
  }
  useEffect(() => {
    let isMount = true
    if (isMount) {
      getExercice();
    }
    return () => {
      isMount = false
    }
  }, [])
  
  return (
    <nav className="main-header navbar navbar-expand navbar-dark">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
            <select className="form-control" value={`${exerciceEncours?.id_exercice}`} onChange={(e) => {
              const find = ExerciceListe.find((item: any) => item.id_exercice === +e.target.value);
              if (find) {
                setExerciceEncours(find)
                dispatch(changeExerciceEncours(find))
              }
            }}>
              {ExerciceListe?.map((item: any, i: number) => {
                if (item.etat_exercice == 'ENCOURS') {
                  return <option value={`${item.id_exercice}`} className="bg-success">{item.annee_exercice}</option>
                }
              })}
              {ExerciceListe?.map((item: any, i: number) => {
                if (item.etat_exercice == 'FIN') {
                  return <option value={`${item.id_exercice}`}>{item.annee_exercice}</option>
                }
              })}
              {/* <option value={`null`}>...</option> */}
            </select>
        </li>
      </ul>

      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a className="nav-link" data-widget="navbar-search" href="#" role="button">
            <i className="fas fa-search" />
          </a>
          <div className="navbar-search-block">
            <form className="form-inline">
              <div className="input-group input-group-sm">
                <input className="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search" />
                <div className="input-group-append">
                  <button className="btn btn-navbar" type="submit">
                    <i className="fas fa-search" />
                  </button>
                  <button className="btn btn-navbar" type="button" data-widget="navbar-search">
                    <i className="fas fa-times" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </li>

        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href="#">
            <i className="far fa-comments" />
            <span className="badge badge-danger navbar-badge">3</span>
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <a href="#" className="dropdown-item">
              <div className="media">
                <img src={`${config.url}dist/img/user1-128x128.jpg`} alt="User Avatar" className="img-size-50 mr-3 img-circle" />
                <div className="media-body">
                  <h3 className="dropdown-item-title">
                    Brad Diesel
                    <span className="float-right text-sm text-danger"><i className="fas fa-star" /></span>
                  </h3>
                  <p className="text-sm">Call me whenever you can...</p>
                  <p className="text-sm text-muted"><i className="far fa-clock mr-1" /> 4 Hours Ago</p>
                </div>
              </div>
            </a>
            <div className="dropdown-divider" />
            <a href="#" className="dropdown-item">
              <div className="media">
                <img src={`${config.url}dist/img/user8-128x128.jpg`} alt="User Avatar" className="img-size-50 img-circle mr-3" />
                <div className="media-body">
                  <h3 className="dropdown-item-title">
                    John Pierce
                    <span className="float-right text-sm text-muted"><i className="fas fa-star" /></span>
                  </h3>
                  <p className="text-sm">I got your message bro</p>
                  <p className="text-sm text-muted"><i className="far fa-clock mr-1" /> 4 Hours Ago</p>
                </div>
              </div>
            </a>
            <div className="dropdown-divider" />
            <a href="#" className="dropdown-item">
              <div className="media">
                <img src={`${config.url}dist/img/user3-128x128.jpg`} alt="User Avatar" className="img-size-50 img-circle mr-3" />
                <div className="media-body">
                  <h3 className="dropdown-item-title">
                    Nora Silvester
                    <span className="float-right text-sm text-warning"><i className="fas fa-star" /></span>
                  </h3>
                  <p className="text-sm">The subject goes here</p>
                  <p className="text-sm text-muted"><i className="far fa-clock mr-1" /> 4 Hours Ago</p>
                </div>
              </div>
            </a>
            <div className="dropdown-divider" />
            <a href="#" className="dropdown-item dropdown-footer">See All Messages</a>
          </div>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href="#">
            <i className="far fa-bell" />
            <span className="badge badge-warning navbar-badge">15</span>
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <span className="dropdown-item dropdown-header">15 Notifications</span>
            <div className="dropdown-divider" />
            <a href="#" className="dropdown-item">
              <i className="fas fa-envelope mr-2" /> 4 new messages
              <span className="float-right text-muted text-sm">3 mins</span>
            </a>
            <div className="dropdown-divider" />
            <a href="#" className="dropdown-item">
              <i className="fas fa-users mr-2" /> 8 friend requests
              <span className="float-right text-muted text-sm">12 hours</span>
            </a>
            <div className="dropdown-divider" />
            <a href="#" className="dropdown-item">
              <i className="fas fa-file mr-2" /> 3 new reports
              <span className="float-right text-muted text-sm">2 days</span>
            </a>
            <div className="dropdown-divider" />
            <a href="#" className="dropdown-item dropdown-footer">See All Notifications</a>
          </div>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href="#">
            <img src={`${config.url}dist/img/user2-160x160.jpg`} className="img-circle elevation-2" width={30} alt="User Image" />
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <span className="dropdown-item dropdown-header">{user?.nom_user} {user?.prenom_user}</span>
            <div className="dropdown-divider" />
            <a href="#" className="dropdown-item">
              <i className="fas fa-user mr-2" /> Mon compte
            </a>
            <div className="dropdown-divider" />
            <a href="#" className="dropdown-item">
              <i className="fas fa-logout mr-2" />Se deconnecter
            </a>
            <div className="dropdown-divider" />

            <div className="dropdown-divider" />
            <a href='#' onClick={logout} className="dropdown-item dropdown-footer">Se deconnecter par tout</a>
          </div>
        </li>
      </ul>
    </nav>
  )
};

export default AdminHeader;
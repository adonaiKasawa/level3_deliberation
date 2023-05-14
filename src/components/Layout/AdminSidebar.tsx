import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { handleURLQueries } from './utils';
import { readSectionByUser } from '../../services';
import navigation, { Navigate } from '../navigation';
import config from '../config';
import { useAppSelector } from '../../global/hooks';
import { selectAuth } from '../../global/auth/auth.slice';
import jwtDecode from 'jwt-decode';
import navigationTtl from '../navigation/navigationTtl';

interface Props {
  section: any
}

const  AdminSidebar = () => {
  // State
  const Auth = useAppSelector(selectAuth);
  const user = Auth.access_token? jwtDecode(Auth.access_token):null;
  
  //** Hooks
  const router = useRouter();
  
  const createNavIteme = () => {
    return(
      <>
        {
          user?.privilege_user !== "titulaire" ? <> { 
          navigation.map((item: Navigate,index: number) => {
            if(item.section){
              return  <li className="nav-header" key={index}>
                        <i className="nav-icon fas fa-th"/>
                        <b> {item.section}</b>
                      </li>
            }else{
              return <li className="nav-item" key={index}>
                      <Link href={item.path ? config.url+item.path :"#"}>
                        <a className={isNavLinkActive(item.path ? item.path :"/") ? "nav-link active": 'nav-link'}>
                          <i className="far fa-circle nav-icon"/>
                          <p>{item.name}</p>
                        </a>
                      </Link>
                    </li>
            }
              
            
          }) }</>: <>
            {
              navigationTtl.map((item: Navigate,index: number) => {
                if(item.section){
                  return  <li className="nav-header" key={index}>
                            <i className="nav-icon fas fa-th"/>
                            <b> {item.section}</b>
                          </li>
                }else{
                  return <li className="nav-item" key={index}>
                          <Link href={item.path ? config.url+item.path :"#"}>
                            <a className={isNavLinkActive(item.path ? item.path :"/") ? "nav-link active": 'nav-link'}>
                              <i className="far fa-circle nav-icon"/>
                              <p>{item.name}</p>
                            </a>
                          </Link>
                        </li>
                }
              })
            }
          </>
        }
      </>   
    )
  }

  const isNavLinkActive = (path: string) => {
    if (router.pathname === path || handleURLQueries(router, path)) {
      return true
    } else {
      return false
    }
  }

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <Link href={config.url}>
        <a className="brand-link">
          <img src={`${config.url}dist/img/AdminLTELogo.png`} alt="AdminLTE Logo" className="brand-image img-circle elevation-3"/>
          <span className="brand-text font-weight-light">Level3</span>
        </a>
      </Link>
     

        <div className="sidebar">
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img src={`${config.url}dist/img/user2-160x160.jpg`} className="img-circle elevation-2" alt="User Image"/>
            </div>
            <div className="info">
              <a href="#" className="d-block">{user?.nom_user} {user?.prenom_user}</a>
            </div>
          </div>

          <div className="form-inline">
            <div className="input-group" data-widget="sidebar-search">
              <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search"/>
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw"/>
                </button>
              </div>
            </div>
          </div>

          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              {/* <li className="nav-item menu-open">
                <a href="#" className={isNavLinkActive("/") ? "nav-link active": 'nav-link'}>
                  <i className="nav-icon fas fa-tachometer-alt"/>
                  <p>
                    Dashboard
                    <i className="right fas fa-angle-left"/>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link href="/">
                      <a className={isNavLinkActive("/") ? "nav-link active": 'nav-link'}>
                        <i className="far fa-circle nav-icon"/>
                        <p>Deliberation</p>
                      </a>
                    </Link>
                  </li>
                </ul>
              </li> */}
             {createNavIteme()}
            </ul>
          </nav>
        </div>
    </aside>
  )

}

export default AdminSidebar;
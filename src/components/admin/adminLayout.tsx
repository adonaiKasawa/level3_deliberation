import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { selectAuth } from "../../global/auth/auth.slice";
import { useAppSelector } from "../../global/hooks";
import AdminFooter from "../Layout/AdminFooter";
import AdminHeader from "../Layout/AdminHeader";
import AdminSidebar from "../Layout/AdminSidebar";

interface Props {
    children: ReactNode
}

const AdminLayout = ({children}: Props) => {

  const Auth = useAppSelector(selectAuth);
  const router = useRouter();
  useEffect(() => {
    if(!Auth.isAuthenticated) router.push('http://localhost:3000/login');
  })
  return (
    <>
      <AdminHeader/>
      <AdminSidebar/>
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid">
              {children}
            </div>
          </div>
        </div>
      <AdminFooter/>
    </>
  )
}

export default AdminLayout;
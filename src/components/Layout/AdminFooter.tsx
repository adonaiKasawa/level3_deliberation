type AdminFooterProps = {
    leftContent: Element,
    rightContent: string,
}
const AdminFooter = () => {
  return <div>
      <footer className="main-footer">
        <strong>Copyright &copy; 2021-2022 <a href="https://Level3.io">Level3.io</a>.</strong>
              All rights reserved.
       <div className="float-right d-none d-sm-inline-block">
          <b>Version</b> 1
        </div>
      </footer>
    <aside className="control-sidebar control-sidebar-dark"/>
  </div>
};

export default AdminFooter;
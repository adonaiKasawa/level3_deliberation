import Document, {Html, Head, Main, NextScript} from 'next/document'
import config from '../components/config'

export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>
                    <link rel="stylesheet" href={`https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback`}/>
                    <link rel="stylesheet" href={`${config.url}plugins/fontawesome-free/css/all.min.css`}/>
                    <link rel="stylesheet" href={`https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css`}/>
                    <link rel="stylesheet" href={`${config.url}plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css`}/>
                    <link rel="stylesheet" href={`${config.url}plugins/icheck-bootstrap/icheck-bootstrap.min.css`}/>
                    <link rel="stylesheet" href={`${config.url}plugins/jqvmap/jqvmap.min.css`}/>
                    <link rel="stylesheet" href={`${config.url}dist/css/adminlte.min.css`}/>
                    <link rel="stylesheet" href={`${config.url}plugins/overlayScrollbars/css/OverlayScrollbars.min.css`}/>
                    <link rel="stylesheet" href={`${config.url}plugins/daterangepicker/daterangepicker.css`}/>
                    <link rel="stylesheet" href={`${config.url}plugins/summernote/summernote-bs4.min.css`}/>
                    <link rel="stylesheet" href={`${config.url}dist/css/level3.css`} />
                </Head>
                <body className="hold-transition dark-mode sidebar-mini layout-fixed layout-navbar-fixed layout-footer-fixed">
                    <div className="wrapper">
                        <Main/>
                        <NextScript/>
                    </div>
                    <script src={`${config.url}dist/lineabovescript.js`}/>
                    <script src={`${config.url}plugins/jquery/jquery.min.js`}/>
                    <script src={`${config.url}plugins/jquery-ui/jquery-ui.min.js`}/>
                    <script src={`${config.url}plugins/bootstrap/js/bootstrap.bundle.min.js`}/>
                    <script src={`${config.url}plugins/chart.js/Chart.min.js`}/>
                    <script src={`${config.url}plugins/sparklines/sparkline.js`}/>
                    <script src={`${config.url}plugins/jqvmap/jquery.vmap.min.js`}/>
                    <script src={`${config.url}plugins/jqvmap/maps/jquery.vmap.usa.js`}/>
                    <script src={`${config.url}plugins/jquery-knob/jquery.knob.min.js`}/>
                    <script src={`${config.url}plugins/moment/moment.min.js`}/>
                    <script src={`${config.url}plugins/daterangepicker/daterangepicker.js`}/>
                    <script src={`${config.url}plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js`}/>
                    <script src={`${config.url}plugins/summernote/summernote-bs4.min.js`}/>
                    <script src={`${config.url}plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js`}/>
                    <script src={`${config.url}dist/js/adminlte.js`}/>
                    <script src={`${config.url}dist/js/demo.js`}/>
                    <script src={`${config.url}dist/lineafterscript.js`}/>
                </body>
            </Html>
        )
    }
}
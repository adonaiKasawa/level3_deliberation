export interface Navigate {
    section?:string
    name?:string
    path?:string
}
const navigationTtl : Navigate[] = [
    {section:"Menu"},
    {
        name:'Cours',
        path:'cours',
       
    },
    {
        name:'Déjà coter',
        path:'coter',
       
    },
    {
        name:'À rattraper',
        path:'rattrapercours',
       
    },

];

export default navigationTtl;

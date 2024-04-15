import PocketBase from "pocketbase";
import {SECRET_EMAIL,SECRET_PASSWORD} from '$env/static/private';
import {formatador, inputTxt} from "$lib/store.js";


// Função para listar todos os registros
export async function load(data){
     const pb = new PocketBase("http://127.0.0.1:8090");
     await pb.admins.authWithPassword(SECRET_EMAIL,SECRET_PASSWORD);

     const filtro = 'data = "'+{data}+' 00:00:00.000Z"'
     const filteredRecords = await pb.collection('reservas').getFullList(200, {
         filter: filtro, sort: '+hora'
     });

     console.log(filteredRecords)

     return {
         filteredRecords
     };
};
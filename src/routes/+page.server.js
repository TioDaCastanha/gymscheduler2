// +page.svelte
import PocketBase from "pocketbase";
import {SECRET_EMAIL,SECRET_PASSWORD} from '$env/static/private';


// Função para listar todos os registros
export async function load({}){
    const pb = await new PocketBase("http://127.0.0.1:8090");
    await pb.admins.authWithPassword(SECRET_EMAIL, SECRET_PASSWORD);
    const records = await pb.collection('reservas').getFullList(200 /* batch size */, {
        sort: '+data',
    });

    return {
        records
    }
};

export const actions = {
    delete: async({request})=>{
        const pb = new PocketBase("http://127.0.0.1:8090");
        await pb.admins.authWithPassword(SECRET_EMAIL, SECRET_PASSWORD);

        const form = await request.formData();
        const id = form.get('id')??'';

        // @ts-ignore
        await pb.collection('reservas').delete(id);

    },

    create: async ({request})=>{
        const pb = new PocketBase("http://127.0.0.1:8090");
        await pb.admins.authWithPassword(SECRET_EMAIL, SECRET_PASSWORD);
        const form = await request.formData();

        const data = form.get('data')??'';
        const hora = form.get('hora')??'';

        const reserva = {
            data,
            hora,
            reservado: true
        };

        await pb.collection('reservas').create(reserva);

    }
}
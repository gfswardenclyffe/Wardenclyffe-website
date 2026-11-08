import {config,respond} from './_shared/common.mjs';
export default async(req)=>req.method==='GET'?respond(config()):respond({error:'Method not allowed'},405);

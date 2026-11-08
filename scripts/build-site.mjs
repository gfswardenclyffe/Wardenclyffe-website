import {cpSync,existsSync,mkdirSync,rmSync} from 'node:fs';
const entries=['index.html','404.html','assets','data','pages','src'];
rmSync('dist',{recursive:true,force:true});mkdirSync('dist',{recursive:true});
for(const name of entries){if(!existsSync(name))throw Error(`Missing site file ${name}`);cpSync(name,`dist/${name}`,{recursive:true});}
console.log('Netlify static site copied to dist/; server functions remain private.');

import { f_generate_image } from "./f_generate_image.module.js"; 


var s_text = Deno.args[0]
var a_n_seed = []
var n_i = 0; 
while(n_i < 100){
    while(a_n_seed.indexOf(n_seed)!=-1){
        var n_seed = parseInt(Math.random()* 100000)
    }
    await f_generate_image(
        s_text,
        parseInt(Math.random() * 10000), 
        `./${s_text}_seed_${n_seed}.png`
        )
    a_n_seed.push(n_seed)
    n_i+=1;
}

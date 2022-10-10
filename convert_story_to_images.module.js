import {s_story} from "./s_story.module.js"

var f_a_s_sentence = function(
    s_story
){
    
    if(s_story.indexOf("”")!=-1){
        console.log(`there where special double quotes found in the text ${s_story}, please make shure all starting and ending quotes are of the same kind (start with ” and end with ”, or start with ' and end with '), otherwise there is no guarantee that the function works`)
        s_story = s_story.replaceAll("”", "\"");
        // Deno.exit(1)
    }

    var a_s_paragraph = s_story.split("\n");
    // var o_end_of_sentance_regex = new RegExp("[\\?\\!.]", "g"); // fuck regex man 
    var a_s_sentence = []

    var a_s_paragraph_filtered = a_s_paragraph.filter(s=>s.trim()!= "");
    
    var a_s_sentence_end_mark = [".", "?", "!"];

    for(var s_paragraph of a_s_paragraph_filtered){
        var n_index_char = 0;
        var n_index_substring_start = 0;
        var o_char_count = {
            "'": 0, 
            "\"": 0
        };
        var b_skip = false;
        while(n_index_char < s_paragraph.length){
            var b_skip = false;

            var s_char = s_paragraph[n_index_char];
            if(!o_char_count[s_char]){
                o_char_count[s_char] = 0;
            }
            o_char_count[s_char]+=1;
            console.log(`o_char_count["\""]`)
            console.log(o_char_count["\""])
            console.log(`o_char_count["'"]`)
            console.log(o_char_count["'"])
            console.log("s_char")
            console.log(s_char)
            if(
                o_char_count["\""] % 2 != 0
                ||
                o_char_count["'"] % 2 != 0
            ){
                b_skip = true;
            }
            if(!b_skip){
                if(a_s_sentence_end_mark.indexOf(s_char) != -1){
                    a_s_sentence.push(s_paragraph.substring(n_index_substring_start, n_index_char+1).trim()); 
                    n_index_substring_start = n_index_char+1;
                }
            }
            n_index_char+=1;
        }
        a_s_sentence.push(s_paragraph.substring(n_index_substring_start, n_index_char+1).trim()); 

    }
    
    // var a_s_sentence = a_s_paragraph.join(" ").split(o_end_of_sentance_regex).map(s=>s.trim());
    // console.log(a_s_sentence)
    
    return a_s_sentence.filter(s=>s.trim()!="")

}

var f_n_seed = function(
    s_prompt
){
    // "Hello" => as bytes  [ 72, 101, 108, 108, 111 ] => as sum 500 , use that sum as the seed
    var a_n_byte = new TextEncoder().encode(s_prompt);
    // console.log(a_n_byte)
    var n_sum = a_n_byte.reduce((n_sum, n)=>n_sum+n)
    // console.log(n_sum)
    return n_sum;
}
class O_command_log{
    constructor(
        n_ts_ms_start,
        n_ts_ms_end,
        n_ts_ms_delta,
        s_command,
        s_stderr,
        s_stdout
    ){
        this.n_ts_ms_start = n_ts_ms_start,
        this.n_ts_ms_end = n_ts_ms_end,
        this.n_ts_ms_delta = n_ts_ms_delta,
        this.s_command = s_command,
        this.s_stderr = s_stderr,
        this.s_stdout = s_stdout
    }
}
class O_command{
    constructor(
        n_ts_ms_start,
        n_ts_ms_end,
        n_ts_ms_delta,
        s_command, 
        o_process, 
        n_code, 
        a_n_byte__stdout,
        a_n_byte__stderr,
        s_stdout,
        s_stderr,
    ){
        this.n_ts_ms_start = n_ts_ms_start
        this.n_ts_ms_end = n_ts_ms_end
        this.n_ts_ms_delta = n_ts_ms_delta
        this.s_command = s_command
        this.o_process = o_process
        this.n_code = n_code
        this.a_n_byte__stdout = a_n_byte__stdout
        this.a_n_byte__stderr = a_n_byte__stderr
        this.s_stdout = s_stdout
        this.s_stderr = s_stderr
    }
}

var f_o_command = async function(
    a_s_arg
){
    var n_ts_ms_start = new Date().getTime();
    var s_command = a_s_arg.join(" ")
    console.log(`running command: ${s_command}`);
    
    const o_process = await Deno.run(
        {
            cmd:a_s_arg,
            stdout: "piped",
            stderr: "piped",
        }
    )
    const { n_code } = await o_process.status();
    const a_n_byte__stdout = await o_process.output();
    const a_n_byte__stderr = await o_process.stderrOutput();
    await o_process.close();

    const s_stderr = new TextDecoder().decode(a_n_byte__stderr);
    const s_stdout = new TextDecoder().decode(a_n_byte__stdout);
    
    var n_ts_ms_end = new Date().getTime();
    var o_command = new O_command(
        n_ts_ms_start,
        n_ts_ms_end,
        n_ts_ms_end-n_ts_ms_start,
        s_command, 
        o_process,
        n_code,
        a_n_byte__stdout, 
        a_n_byte__stderr,
        s_stdout,
        s_stderr
    )

    // console.log(o_command)
    return Promise.resolve(o_command)
}




// var s_story_test =  "\"Don't worry! I have a plan!” whispered Hansel to Gretel. He went to the back of the house and filled his pockets with white pebbles from the garden."
// var a_s_prompt = f_a_s_sentence(s_story_test);
var a_s_sentence = f_a_s_sentence(s_story);

// var a_s_prompt = f_a_s_sentence("this is. a test? yes indeed! 'but': he said, 'cann it work??'. really \"now\" whispered he,\" i have a plan\"! cool yey");
// console.log(a_s_prompt)

var a_o_command_log = []
for(var s_sentence of a_s_sentence){
    var n_seed = f_n_seed(s_sentence);
    var a_s_arg = [
        "python",
        "./optimizedSD/optimized_txt2img.py",
        "--prompt",
        `${s_sentence}`,
        "--H",
        "512",
        "--W",
        "512",
        "--seed",
        n_seed,
        "--n_iter",
        "1",
        "--n_samples",
        "1",
        "--ddim_steps",
        "50"
    ]
    
    var o_command = await f_o_command(a_s_arg);
    
    a_o_command_log.push(
        new O_command_log(
            o_command.n_ts_ms_start,
            o_command.n_ts_ms_end,
            o_command.n_ts_ms_delta,
            o_command.s_command,
            o_command.s_stderr,
            o_command.s_stdout
        )
    );


}

var s_file_name = `a_o_command_log_${new Date().getTime()}.module.js`;

Deno.writeTextFile(
    s_file_name, 
    JSON.stringify(
        a_o_command_log
    )
); 



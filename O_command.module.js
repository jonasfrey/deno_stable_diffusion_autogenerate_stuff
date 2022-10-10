
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
        n_return_code, 
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
        this.n_return_code = n_return_code
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

    console.log(`running command: '${s_command}', in folder: '${Deno.cwd()}'`);
    
    const o_process = await Deno.run(
        {
            cmd:a_s_arg,
            stdout: "piped",
            stderr: "piped",
        }
    )
    // output needs to be read before .status() or .close()!!!!!
    const a_n_byte__stdout = await o_process.output();
    const a_n_byte__stderr = await o_process.stderrOutput();

    const s_stderr = new TextDecoder().decode(a_n_byte__stderr);
    const s_stdout = new TextDecoder().decode(a_n_byte__stdout);

    
    var n_ts_ms_end = new Date().getTime();
    const { code: n_return_code } = await o_process.status();

    if(
        n_return_code != 0 && s_stderr != "" // a few programms will throw an error but do not have an return code other than 0
        ||
        n_return_code != 0 // 
    ){
        var s_error = `
            error happened while running command: ${s_command}
            return code is:
            ${n_return_code}
            stderr is:
            ${s_stderr} 
        `
        throw new Error(s_error)
    }
    await o_process.close();


    var o_command = new O_command(
        n_ts_ms_start,
        n_ts_ms_end,
        n_ts_ms_end-n_ts_ms_start,
        s_command, 
        o_process,
        n_return_code,
        a_n_byte__stdout, 
        a_n_byte__stderr,
        s_stdout,
        s_stderr
    )

    // console.log(o_command)
    return Promise.resolve(o_command)
}


// var f_test = function(){
//     var o_command = f_o_command("touch /xd/1234/asdf/hallo/yess".split(" "));
// }
// f_test();

export {
    O_command, 
    O_command_log, 
    f_o_command
}

// do not need this file; python call below put in router

const { promisify } = require("util");
const execFile = promisify(require("child_process").execFile);

async function pythonResult() {
  const output = await execFile("python3", ["test.py"]);
  console.log(output.stdout); // object with stdout key
  //console.log(output);
  return output;
}

pythonResult();
